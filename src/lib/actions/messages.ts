"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { messageSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/actions/auth";

export async function sendMessage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = messageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Message cannot be empty." };
  }
  const { receiverId, body } = parsed.data;

  if (receiverId === user.id) {
    return { error: "You can't message yourself." };
  }
  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) return { error: "Recipient not found." };

  // Coaches must be approved to initiate contact.
  if (user.role === "COACH" && user.status !== "ACTIVE") {
    return { error: "Your coach account is pending approval." };
  }

  await prisma.message.create({
    data: { senderId: user.id, receiverId, body },
  });
  revalidatePath("/messages");
  revalidatePath(`/messages/${receiverId}`);
  return { success: true };
}

export async function markThreadRead(otherUserId: string) {
  const user = await requireUser();
  await prisma.message.updateMany({
    where: { senderId: otherUserId, receiverId: user.id, read: false },
    data: { read: true },
  });
}
