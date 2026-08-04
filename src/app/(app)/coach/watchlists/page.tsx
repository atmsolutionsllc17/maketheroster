import Link from "next/link";
import { ListChecks, Trash2, Lock, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { canUseWatchlistsAndNotes } from "@/lib/plans";
import {
  deleteWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/coach";
import { CreateWatchlistForm } from "./create-form";

export default async function WatchlistsPage() {
  const coach = await requireRole("COACH");

  if (!canUseWatchlistsAndNotes(coach.plan)) {
    return (
      <div>
        <PageHeader title="Watchlists" />
        <Card>
          <CardContent className="p-10 text-center">
            <Lock className="mx-auto mb-3 size-6 text-muted-foreground" />
            <p className="font-medium">Watchlists are a Coach Pro feature</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Build a recruitment pipeline and organize prospects.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/pricing">Upgrade to Coach Pro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const watchlists = await prisma.watchlist.findMany({
    where: { coachId: coach.id },
    orderBy: { createdAt: "asc" },
    include: {
      items: {
        orderBy: { addedAt: "desc" },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photoUrl: true,
              sport: true,
              position: true,
              graduationYear: true,
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <PageHeader
        title="Watchlists"
        description="Organize prospects into your recruitment pipeline."
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">New watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateWatchlistForm />
        </CardContent>
      </Card>

      {watchlists.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <ListChecks className="mx-auto mb-3 size-6 text-muted-foreground" />
            <p className="text-muted-foreground">
              No watchlists yet. Create one above, then add athletes from their
              profiles.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {watchlists.map((wl) => (
            <Card key={wl.id}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">
                  {wl.name}{" "}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    ({wl.items.length})
                  </span>
                </CardTitle>
                <form action={deleteWatchlist}>
                  <input type="hidden" name="id" value={wl.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </form>
              </CardHeader>
              <CardContent>
                {wl.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Empty — add athletes from their profile pages.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {wl.items.map((item) => {
                      const s = item.student;
                      const initials = `${s.firstName[0] ?? ""}${s.lastName[0] ?? ""}`;
                      return (
                        <li
                          key={item.id}
                          className="flex items-center gap-3 py-3"
                        >
                          <Avatar className="size-9 border">
                            {s.photoUrl && (
                              <AvatarImage src={s.photoUrl} alt={s.firstName} />
                            )}
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/athletes/${s.id}`}
                              className="font-medium hover:underline"
                            >
                              {s.firstName} {s.lastName}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {s.sport}
                              {s.position ? ` · ${s.position}` : ""} ·{" "}
                              {s.graduationYear}
                            </p>
                          </div>
                          <form action={removeFromWatchlist}>
                            <input
                              type="hidden"
                              name="watchlistId"
                              value={wl.id}
                            />
                            <input
                              type="hidden"
                              name="studentId"
                              value={s.id}
                            />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="size-4" />
                            </Button>
                          </form>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
