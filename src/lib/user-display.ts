export type NamedUser = {
  email: string;
  role: string;
  studentProfile?: { firstName: string; lastName: string; photoUrl?: string | null } | null;
  coachProfile?: { firstName: string; lastName: string; school?: string | null } | null;
};

export function displayName(u: NamedUser): string {
  if (u.studentProfile) {
    return `${u.studentProfile.firstName} ${u.studentProfile.lastName}`;
  }
  if (u.coachProfile) {
    return `${u.coachProfile.firstName} ${u.coachProfile.lastName}`;
  }
  return u.email;
}

export function displaySubtitle(u: NamedUser): string {
  if (u.coachProfile) {
    return `Coach${u.coachProfile.school ? ` · ${u.coachProfile.school}` : ""}`;
  }
  if (u.studentProfile) return "Athlete";
  return "";
}

export function userInitials(u: NamedUser): string {
  const p = u.studentProfile ?? u.coachProfile;
  if (p) return `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase();
  return u.email.slice(0, 2).toUpperCase();
}
