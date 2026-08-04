"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { Plan } from "@/generated/prisma/client";

const ATHLETE_PLANS: Plan[] = ["FREE", "PREMIUM"];
const COACH_PLANS: Plan[] = ["COACH_BASIC", "COACH_PRO", "ENTERPRISE"];

/**
 * Stubbed subscription change — flips the plan field and records a
 * Subscription row. No real billing (wired to Stripe in a later phase).
 */
export async function changePlan(formData: FormData) {
  const user = await requireUser();
  const plan = String(formData.get("plan")) as Plan;

  const allowed = user.role === "ATHLETE" ? ATHLETE_PLANS : COACH_PLANS;
  if (!allowed.includes(plan)) {
    throw new Error("That plan isn't available for your account type.");
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { plan } }),
    // mark athlete premium as boosted for search ranking
    ...(user.role === "ATHLETE"
      ? [
          prisma.studentProfile.updateMany({
            where: { userId: user.id },
            data: { boosted: plan === "PREMIUM" },
          }),
        ]
      : []),
    prisma.subscription.updateMany({
      where: { userId: user.id, status: "active" },
      data: { status: "canceled", endDate: new Date() },
    }),
    prisma.subscription.create({
      data: { userId: user.id, plan, status: "active" },
    }),
  ]);

  revalidatePath("/pricing");
  revalidatePath("/dashboard");
}
