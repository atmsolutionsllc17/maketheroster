import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { AthleteCard } from "@/components/athlete-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  SearchFilters,
  type SearchValues,
} from "@/app/(app)/coach/search/search-filters";
import type { Prisma } from "@/generated/prisma/client";

export const metadata = {
  title: "Browse Athletes — AthleteConnect",
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

  return (
    <div>
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
