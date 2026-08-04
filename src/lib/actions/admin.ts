"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import type { ModerationStatus } from "@/generated/prisma/client";

async function requireAdmin() {
  return requireRole("ADMIN");
}

export async function setUserStatus(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId"));
  const status = String(formData.get("status")) as
    | "ACTIVE"
    | "SUSPENDED"
    | "PENDING";
  await prisma.user.update({ where: { id: userId }, data: { status } });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function setAthleteVerified(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId"));
  const verified = formData.get("verified") === "true";
  await prisma.studentProfile.updateMany({
    where: { userId },
    data: { verified },
  });
  revalidatePath("/admin/users");
}

export async function setCoachVerified(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId"));
  const verified = formData.get("verified") === "true";
  await prisma.coachProfile.updateMany({
    where: { userId },
    data: { verified },
  });
  revalidatePath("/admin/users");
}

export async function setVideoModeration(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const moderation = String(formData.get("moderation")) as ModerationStatus;
  await prisma.video.update({ where: { id }, data: { moderation } });
  revalidatePath("/admin/moderation");
}

export async function resolveReport(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.report.update({ where: { id }, data: { status: "resolved" } });
  revalidatePath("/admin/reports");
  revalidatePath("/admin");
}
