"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import {
  athleteRegisterSchema,
  coachRegisterSchema,
  parentRegisterSchema,
  agentRegisterSchema,
} from "@/lib/validation";
import { verifyTurnstile } from "@/lib/turnstile";

export type ActionState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function registerAthlete(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = athleteRegisterSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "ATHLETE",
      status: "ACTIVE",
      studentProfile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          sport: data.sport,
          position: data.position || null,
          school: data.school,
          graduationYear: data.graduationYear,
        },
      },
    },
  });

  // Auto sign-in; throws NEXT_REDIRECT which must propagate.
  await signIn("credentials", {
    email,
    password: data.password,
    redirectTo: "/athlete/profile",
  });
  return {};
}

export async function registerCoach(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = coachRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "COACH",
      status: "PENDING", // coaches await admin approval
      plan: "COACH_BASIC",
      coachProfile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          school: data.school,
          organization: data.organization || null,
          title: data.title || null,
          sport: data.sport || null,
        },
      },
    },
  });

  await signIn("credentials", {
    email,
    password: data.password,
    redirectTo: "/coach",
  });
  return {};
}

export async function registerParent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parentRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "PARENT",
      status: "ACTIVE",
      parentProfile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          athleteName: data.athleteName || null,
          relationship: data.relationship || null,
        },
      },
    },
  });

  await signIn("credentials", { email, password: data.password, redirectTo: "/dashboard" });
  return {};
}

export async function registerAgent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = agentRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "AGENT",
      status: "ACTIVE",
      agentProfile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          agency: data.agency || null,
          title: data.title || null,
          phone: data.phone || null,
        },
      },
    },
  });

  await signIn("credentials", { email, password: data.password, redirectTo: "/dashboard" });
  return {};
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const captchaOk = await verifyTurnstile(
    formData.get("cf-turnstile-response") as string | null,
  );
  if (!captchaOk) {
    return { error: "Captcha verification failed — please try again." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error; // re-throw NEXT_REDIRECT
  }
  return {};
}
