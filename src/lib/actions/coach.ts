"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { canUseWatchlistsAndNotes } from "@/lib/plans";
import type { ActionState } from "@/lib/actions/auth";
import type { CurrentUser } from "@/lib/session";

async function requireApprovedCoach(): Promise<CurrentUser> {
  const user = await requireRole("COACH");
  if (user.status !== "ACTIVE") {
    throw new Error("Your coach account is pending approval.");
  }
  return user;
}

export async function toggleFavorite(formData: FormData) {
  const user = await requireApprovedCoach();
  const studentId = String(formData.get("studentId"));

  const existing = await prisma.favorite.findUnique({
    where: { coachId_studentId: { coachId: user.id, studentId } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { coachId: user.id, studentId } });
  }
  revalidatePath(`/athletes/${studentId}`);
  revalidatePath("/coach/favorites");
}

export async function createWatchlist(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireApprovedCoach();
  if (!canUseWatchlistsAndNotes(user.plan)) {
    return { error: "Watchlists are a Coach Pro feature." };
  }
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };
  await prisma.watchlist.create({ data: { coachId: user.id, name } });
  revalidatePath("/coach/watchlists");
  return { success: true };
}

export async function deleteWatchlist(formData: FormData) {
  const user = await requireApprovedCoach();
  const id = String(formData.get("id"));
  await prisma.watchlist.deleteMany({ where: { id, coachId: user.id } });
  revalidatePath("/coach/watchlists");
}

export async function addToWatchlist(formData: FormData) {
  const user = await requireApprovedCoach();
  if (!canUseWatchlistsAndNotes(user.plan)) return;
  const watchlistId = String(formData.get("watchlistId"));
  const studentId = String(formData.get("studentId"));

  // ensure the watchlist belongs to this coach
  const wl = await prisma.watchlist.findFirst({
    where: { id: watchlistId, coachId: user.id },
  });
  if (!wl) return;

  await prisma.watchlistItem.upsert({
    where: { watchlistId_studentId: { watchlistId, studentId } },
    create: { watchlistId, studentId },
    update: {},
  });
  revalidatePath(`/athletes/${studentId}`);
  revalidatePath("/coach/watchlists");
}

export async function removeFromWatchlist(formData: FormData) {
  const user = await requireApprovedCoach();
  const watchlistId = String(formData.get("watchlistId"));
  const studentId = String(formData.get("studentId"));
  const wl = await prisma.watchlist.findFirst({
    where: { id: watchlistId, coachId: user.id },
  });
  if (!wl) return;
  await prisma.watchlistItem.deleteMany({ where: { watchlistId, studentId } });
  revalidatePath("/coach/watchlists");
}

export async function saveNote(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireApprovedCoach();
  if (!canUseWatchlistsAndNotes(user.plan)) {
    return { error: "Private notes are a Coach Pro feature." };
  }
  const studentId = String(formData.get("studentId"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Note cannot be empty." };
  await prisma.coachNote.create({
    data: { coachId: user.id, studentId, body },
  });
  revalidatePath(`/athletes/${studentId}`);
  return { success: true };
}

export async function deleteNote(formData: FormData) {
  const user = await requireApprovedCoach();
  const id = String(formData.get("id"));
  const studentId = String(formData.get("studentId"));
  await prisma.coachNote.deleteMany({ where: { id, coachId: user.id } });
  revalidatePath(`/athletes/${studentId}`);
}
