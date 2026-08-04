import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { AthleteCard } from "@/components/athlete-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toggleFavorite } from "@/lib/actions/coach";

export default async function FavoritesPage() {
  const coach = await requireRole("COACH");
  const favorites = await prisma.favorite.findMany({
    where: { coachId: coach.id },
    orderBy: { createdAt: "desc" },
    include: {
      student: {
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
      },
    },
  });

  return (
    <div>
      <PageHeader
        title="Favorites"
        description="Athletes you've starred for quick access."
      />
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Star className="mx-auto mb-3 size-6 text-muted-foreground" />
            <p className="text-muted-foreground">No favorites yet.</p>
            <Button className="mt-4" asChild>
              <Link href="/coach/search">Search athletes</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <AthleteCard
              key={f.id}
              athlete={f.student}
              action={
                <form action={toggleFavorite}>
                  <input type="hidden" name="studentId" value={f.student.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Star className="size-4" fill="currentColor" /> Remove
                  </Button>
                </form>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
