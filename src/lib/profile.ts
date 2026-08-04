import type { StudentProfile } from "@/generated/prisma/client";

/** Rough profile completeness score (0-100) to nudge athletes. */
export function profileCompleteness(
  p: StudentProfile,
  videoCount: number,
  statCount: number,
): number {
  const checks: boolean[] = [
    !!p.photoUrl,
    !!p.location,
    !!p.state,
    !!p.height,
    !!p.weight,
    !!p.gpa,
    !!(p.satScore || p.actScore),
    !!p.intendedMajor,
    !!p.position,
    !!p.bio,
    !!p.awards,
    videoCount > 0,
    statCount > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}
