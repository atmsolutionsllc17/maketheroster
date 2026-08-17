import Link from "next/link";
import { Star, BadgeCheck, ArrowRight, MapPin, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { AthleteCard } from "@/components/athlete-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  SearchFilters,
  type SearchValues,
} from "@/app/(app)/coach/search/search-filters";
import type { Prisma } from "@/generated/prisma/client";

type FeaturedAthlete = {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  sport: string;
  position: string | null;
  school: string;
  state: string | null;
  graduationYear: number;
  bio: string | null;
};

function FeaturedSpotlight({ athlete }: { athlete: FeaturedAthlete }) {
  const initials = `${athlete.firstName[0] ?? ""}${athlete.lastName[0] ?? ""}`;
  return (
    <div className="mb-8 overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <Avatar className="size-28 shrink-0 border-2 border-primary/30 shadow-lg sm:size-36">
          {athlete.photoUrl && (
            <AvatarImage src={athlete.photoUrl} alt={athlete.firstName} className="object-cover" />
          )}
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wide">
            <Star className="size-3.5" fill="currentColor" /> Featured Athlete
          </div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {athlete.firstName} {athlete.lastName}
            </h2>
            <BadgeCheck className="size-5 text-primary" />
          </div>
          <p className="mt-1 text-muted-foreground">
            {athlete.sport}
            {athlete.position ? ` · ${athlete.position}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="size-4" /> {athlete.school} · Class of{" "}
              {athlete.graduationYear}
            </span>
            {athlete.state && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" /> {athlete.state}
              </span>
            )}
          </div>
          {athlete.bio && (
            <p className="mt-3 line-clamp-2 max-w-2xl text-sm text-muted-foreground">
              {athlete.bio}
            </p>
          )}
          <Button asChild className="mt-4">
            <Link href={`/athletes/${athlete.id}`}>
              View profile <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Browse Athletes — Make The Roster",
  description: "Discover verified student-athletes across every sport.",
};

export default async function AthletesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
  };

  const values: SearchValues = {
    sport: get("sport"),
    position: get("position"),
    state: get("state"),
    gradYear: get("gradYear"),
    minGpa: get("minGpa"),
    minHeight: get("minHeight"),
    minWeight: get("minWeight"),
  };

  const where: Prisma.StudentProfileWhereInput = {};
  if (values.sport) where.sport = values.sport;
  if (values.position) where.position = values.position;
  if (values.state) where.state = values.state;
  if (values.gradYear) where.graduationYear = Number(values.gradYear);
  if (values.minGpa) where.gpa = { gte: Number(values.minGpa) };
  if (values.minHeight) where.height = { gte: Number(values.minHeight) };
  if (values.minWeight) where.weight = { gte: Number(values.minWeight) };

  const athletes = await prisma.studentProfile.findMany({
    where,
    orderBy: [{ boosted: "desc" }, { verified: "desc" }, { updatedAt: "desc" }],
    take: 60,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photoUrl: true,
      sport: true,
      position: true,
      school: true,
      state: true,
      graduationYear: true,
      height: true,
      weight: true,
      gpa: true,
      verified: true,
    },
  });

  const hasFilters = Object.values(values).some(Boolean);
  const featured = hasFilters
    ? null
    : await prisma.studentProfile.findFirst({
        where: { boosted: true, verified: true },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          photoUrl: true,
          sport: true,
          position: true,
          school: true,
          state: true,
          graduationYear: true,
          bio: true,
        },
      });

  return (
    <div>
      {featured && <FeaturedSpotlight athlete={featured} />}

      <PageHeader
        title="Browse athletes"
        description="Discover verified student-athletes across every sport. Free to search — contacting athletes is a paid-member feature."
      />

      <Card className="mb-8">
        <CardContent className="p-5">
          {/* Advanced filters open to everyone on the public directory */}
          <SearchFilters
            values={values}
            canUseAdvanced
            resetHref="/athletes"
          />
        </CardContent>
      </Card>

      <div className="mb-4 text-sm text-muted-foreground">
        {athletes.length} athlete{athletes.length === 1 ? "" : "s"} found
      </div>

      {athletes.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            No athletes match your filters. Try broadening your search.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {athletes.map((a) => (
            <AthleteCard key={a.id} athlete={a} />
          ))}
        </div>
      )}
    </div>
  );
}
