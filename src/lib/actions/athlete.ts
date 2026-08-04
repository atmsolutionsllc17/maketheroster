"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import {
  athleteProfileSchema,
  videoSchema,
  statSchema,
  documentSchema,
} from "@/lib/validation";
import { canUploadUnlimitedVideos, FREE_VIDEO_LIMIT } from "@/lib/plans";
import type { ActionState } from "@/lib/actions/auth";

function numOrNull(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

async function getStudentProfile() {
  const user = await requireRole("ATHLETE");
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
  });
  if (!profile) throw new Error("Profile not found");
  return { user, profile };
}

export async function updateAthleteProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { profile } = await getStudentProfile();
  const parsed = athleteProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  await prisma.studentProfile.update({
    where: { id: profile.id },
    data: {
      firstName: d.firstName,
      lastName: d.lastName,
      photoUrl: d.photoUrl || null,
      location: d.location || null,
      state: d.state || null,
      height: numOrNull(d.height),
      weight: numOrNull(d.weight),
      gpa: numOrNull(d.gpa),
      satScore: numOrNull(d.satScore),
      actScore: numOrNull(d.actScore),
      intendedMajor: d.intendedMajor || null,
      sport: d.sport,
      position: d.position || null,
      school: d.school,
      graduationYear: d.graduationYear,
      bio: d.bio || null,
      awards: d.awards || null,
      achievements: d.achievements || null,
    },
  });

  revalidatePath("/athlete/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function addVideo(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user, profile } = await getStudentProfile();
  const parsed = videoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (!canUploadUnlimitedVideos(user.plan)) {
    const count = await prisma.video.count({ where: { studentId: profile.id } });
    if (count >= FREE_VIDEO_LIMIT) {
      return {
        error: `Free accounts are limited to ${FREE_VIDEO_LIMIT} videos. Upgrade to Premium for unlimited.`,
      };
    }
  }

  // Cloudinary uploads carry a publicId; those go through moderation (PENDING)
  // and are flipped to APPROVED/REJECTED by the moderation webhook. External
  // URLs (no publicId) keep the existing default (APPROVED).
  const publicId = (formData.get("publicId") as string | null) || null;

  await prisma.video.create({
    data: {
      studentId: profile.id,
      title: parsed.data.title,
      url: parsed.data.url,
      thumbnail: parsed.data.thumbnail || null,
      publicId,
      moderation: publicId ? "PENDING" : "APPROVED",
    },
  });
  revalidatePath("/athlete/profile");
  return { success: true };
}

export async function deleteVideo(formData: FormData) {
  const { profile } = await getStudentProfile();
  const id = String(formData.get("id"));
  await prisma.video.deleteMany({ where: { id, studentId: profile.id } });
  revalidatePath("/athlete/profile");
}

export async function addStat(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { profile } = await getStudentProfile();
  const parsed = statSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  await prisma.statistic.create({
    data: {
      studentId: profile.id,
      sport: parsed.data.sport,
      season: parsed.data.season || null,
      statName: parsed.data.statName,
      value: parsed.data.value,
    },
  });
  revalidatePath("/athlete/profile");
  return { success: true };
}

export async function deleteStat(formData: FormData) {
  const { profile } = await getStudentProfile();
  const id = String(formData.get("id"));
  await prisma.statistic.deleteMany({ where: { id, studentId: profile.id } });
  revalidatePath("/athlete/profile");
}

export async function addDocument(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { profile } = await getStudentProfile();
  const parsed = documentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  await prisma.document.create({
    data: {
      studentId: profile.id,
      type: parsed.data.type,
      title: parsed.data.title,
      url: parsed.data.url,
    },
  });
  revalidatePath("/athlete/profile");
  return { success: true };
}

export async function deleteDocument(formData: FormData) {
  const { profile } = await getStudentProfile();
  const id = String(formData.get("id"));
  await prisma.document.deleteMany({ where: { id, studentId: profile.id } });
  revalidatePath("/athlete/profile");
}
