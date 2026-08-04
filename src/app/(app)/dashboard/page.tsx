import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Video as VideoIcon,
  MessageSquare,
  Trophy,
  Star,
  ListChecks,
  Search,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { profileCompleteness } from "@/lib/profile";
import { formatDistanceToNowStrict } from "@/lib/format";

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "COACH") return <CoachDashboard userId={user.id} status={user.status} />;
  if (user.role === "PARENT") return <SimpleDashboard userId={user.id} kind="PARENT" />;
  if (user.role === "AGENT") return <SimpleDashboard userId={user.id} kind="AGENT" />;
  return <AthleteDashboard userId={user.id} />;
}

async function SimpleDashboard({
  userId,
  kind,
}: {
  userId: string;
  kind: "PARENT" | "AGENT";
}) {
  const [profile, unread] = await Promise.all([
    kind === "PARENT"
      ? prisma.parentProfile.findUnique({ where: { userId } })
      : prisma.agentProfile.findUnique({ where: { userId } }),
    prisma.message.count({ where: { receiverId: userId, read: false } }),
  ]);

  const copy =
    kind === "PARENT"
      ? {
          desc: "Follow your athlete's recruiting journey.",
          cardTitle: "Connect with your athlete",
          cardBody:
            "Ask your athlete to share their profile link. Full parent tools — following views, messages, and updates — are on the way.",
        }
      : {
          desc: "Represent and manage your prospects.",
          cardTitle: "Agent tools are coming soon",
          cardBody:
            "Roster management, recruiting insights, and verified introductions are in development. In the meantime, explore athlete profiles across the network.",
        };

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile?.firstName ?? ""}`.trim()}
        description={copy.desc}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Unread messages" value={unread} icon={MessageSquare} />
        <StatCard label="Account" value={kind === "PARENT" ? "Parent" : "Agent"} icon={Star} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{copy.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{copy.cardBody}</p>
          <Button asChild>
            <Link href="/messages">Go to messages</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

async function AthleteDashboard({ userId }: { userId: string }) {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      _count: { select: { videos: true, statistics: true, profileViews: true } },
    },
  });
  if (!profile) redirect("/athlete/profile");

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [viewsThisWeek, unread, recentViews] = await Promise.all([
    prisma.profileView.count({
      where: { studentId: profile.id, createdAt: { gte: weekAgo } },
    }),
    prisma.message.count({ where: { receiverId: userId, read: false } }),
    prisma.profileView.findMany({
      where: { studentId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        viewer: { include: { coachProfile: true } },
      },
    }),
  ]);

  const completeness = profileCompleteness(
    profile,
    profile._count.videos,
    profile._count.statistics,
  );

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile.firstName}`}
        description="Here's how your recruiting profile is performing."
      >
        <Button asChild>
          <Link href="/athlete/profile">Edit profile</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total profile views"
          value={profile._count.profileViews}
          icon={Eye}
        />
        <StatCard
          label="Views this week"
          value={viewsThisWeek}
          hint="Last 7 days"
          icon={TrendingUp}
        />
        <StatCard label="Highlight videos" value={profile._count.videos} icon={VideoIcon} />
        <StatCard label="Unread messages" value={unread} icon={MessageSquare} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent profile viewers</CardTitle>
            <Badge variant="secondary">{recentViews.length}</Badge>
          </CardHeader>
          <CardContent>
            {recentViews.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No views yet. Complete your profile to get discovered.
              </p>
            ) : (
              <ul className="divide-y">
                {recentViews.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="font-medium">
                        {v.viewer?.coachProfile
                          ? `${v.viewer.coachProfile.firstName} ${v.viewer.coachProfile.lastName}`
                          : "A coach"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {v.viewer?.coachProfile?.school ?? "Viewed your profile"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNowStrict(v.createdAt)} ago
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-3xl font-bold">{completeness}%</span>
              <span className="text-sm text-muted-foreground">complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {completeness < 100
                ? "Add more details, videos, and stats to rank higher in coach searches."
                : "Your profile is complete. Nice work!"}
            </p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/athlete/profile">Improve profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function CoachDashboard({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) {
  const [favorites, watchlists, searches, coach] = await Promise.all([
    prisma.favorite.count({ where: { coachId: userId } }),
    prisma.watchlist.count({ where: { coachId: userId } }),
    prisma.searchLog.count({ where: { coachId: userId } }),
    prisma.coachProfile.findUnique({ where: { userId } }),
  ]);

  return (
    <div>
      <PageHeader
        title={`Welcome, Coach ${coach?.lastName ?? ""}`.trim()}
        description="Discover and evaluate talent."
      >
        <Button asChild>
          <Link href="/coach/search">
            <Search className="size-4" /> Search athletes
          </Link>
        </Button>
      </PageHeader>

      {status === "PENDING" && (
        <Card className="mb-6 border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-5">
            <p className="font-medium text-amber-600 dark:text-amber-400">
              Your coach account is pending approval.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              An admin will review your account shortly. You&apos;ll get full
              search access once approved.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Saved favorites" value={favorites} icon={Star} />
        <StatCard label="Watchlists" value={watchlists} icon={ListChecks} />
        <StatCard label="Searches run" value={searches} icon={Trophy} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Find athletes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Filter the database by sport, position, state, grad year, GPA,
              height, and weight.
            </p>
            <Button asChild>
              <Link href="/coach/search">Open advanced search</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Organize prospects into watchlists and keep private notes.
            </p>
            <Button variant="outline" asChild>
              <Link href="/coach/watchlists">View watchlists</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
