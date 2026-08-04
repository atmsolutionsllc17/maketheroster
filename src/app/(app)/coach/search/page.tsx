import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { AthleteCard } from "@/components/athlete-card";
import { SportScene } from "@/components/sport-scene";
import { Card, CardContent } from "@/components/ui/card";
import { canUseAdvancedFilters } from "@/lib/plans";
import { SearchFilters, type SearchValues } from "./search-filters";
import type { Prisma } from "@/generated/prisma/client";

export default async function CoachSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const coach = await requireRole("COACH");
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

  const advanced = canUseAdvancedFilters(coach.plan);

  if (coach.status !== "ACTIVE") {
    return (
      <div>
        <PageHeader title="Search athletes" />
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-6">
            <p className="font-medium text-amber-600 dark:text-amber-400">
              Search unlocks once your coach account is approved.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Our team reviews new coach accounts to keep athletes safe. Check
              back soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const where: Prisma.StudentProfileWhereInput = {};
  if (values.sport) where.sport = values.sport;
  if (values.position) where.position = values.position;
  if (values.state) where.state = values.state;
  if (values.gradYear) where.graduationYear = Number(values.gradYear);

  if (advanced) {
    if (values.minGpa) where.gpa = { gte: Number(values.minGpa) };
    if (values.minHeight) where.height = { gte: Number(values.minHeight) };
    if (values.minWeight) where.weight = { gte: Number(values.minWeight) };
  }

  const hasFilters = Object.values(values).some(Boolean);

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

  if (hasFilters) {
    await prisma.searchLog.create({
      data: {
        coachId: coach.id,
        query: JSON.stringify(values),
        results: athletes.length,
      },
    });
  }

  return (
    <div>
      {values.sport ? (
        <div className="relative mb-6 overflow-hidden rounded-2xl border">
          <SportScene
            sport={values.sport}
            className="absolute inset-0 size-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="relative p-6 sm:p-8">
            <p className="text-sm font-medium text-white/80">Scouting</p>
            <p className="font-display text-2xl font-bold text-white sm:text-3xl">
              {values.sport}
              {values.position ? (
                <span className="text-white/70"> · {values.position}</span>
              ) : null}
            </p>
          </div>
        </div>
      ) : (
        <PageHeader
          title="Search athletes"
          description="Filter the database to find the right prospects."
        />
      )}

      <Card className="mb-8">
        <CardContent className="p-5">
          <SearchFilters values={values} canUseAdvanced={advanced} />
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
