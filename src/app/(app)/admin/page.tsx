import Link from "next/link";
import {
  Users,
  GraduationCap,
  ClipboardList,
  Clock,
  Eye,
  Search,
  Flag,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLAN_LABELS } from "@/lib/plans";
import type { Plan } from "@/generated/prisma/client";

export default async function AdminOverviewPage() {
  await requireRole("ADMIN");
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    athletes,
    coaches,
    pendingCoaches,
    newThisWeek,
    totalViews,
    totalSearches,
    openReports,
    planGroups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ATHLETE" } }),
    prisma.user.count({ where: { role: "COACH" } }),
    prisma.user.count({ where: { role: "COACH", status: "PENDING" } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.profileView.count(),
    prisma.searchLog.count(),
    prisma.report.count({ where: { status: "open" } }),
    prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
  ]);

  const planCounts = new Map<Plan, number>();
  for (const g of planGroups) planCounts.set(g.plan, g._count._all);
  const paidPlans: Plan[] = ["PREMIUM", "COACH_BASIC", "COACH_PRO", "ENTERPRISE"];

  return (
    <div>
      <PageHeader
        title="Admin overview"
        description="Platform health at a glance."
      >
        {pendingCoaches > 0 && (
          <Button asChild>
            <Link href="/admin/users?status=PENDING">
              {pendingCoaches} coach{pendingCoaches === 1 ? "" : "es"} to review
            </Link>
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={totalUsers} icon={Users} />
        <StatCard label="Athletes" value={athletes} icon={GraduationCap} />
        <StatCard label="Coaches" value={coaches} icon={ClipboardList} />
        <StatCard
          label="New this week"
          value={newThisWeek}
          hint="Last 7 days"
          icon={TrendingUp}
        />
        <StatCard
          label="Pending coaches"
          value={pendingCoaches}
          icon={Clock}
        />
        <StatCard label="Profile views" value={totalViews} icon={Eye} />
        <StatCard label="Searches run" value={totalSearches} icon={Search} />
        <StatCard label="Open reports" value={openReports} icon={Flag} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {paidPlans.map((p) => (
                <li key={p} className="flex items-center justify-between">
                  <span className="text-sm">{PLAN_LABELS[p]}</span>
                  <span className="font-semibold">
                    {planCounts.get(p) ?? 0}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between border-t pt-3 text-muted-foreground">
                <span className="text-sm">Free (athletes)</span>
                <span className="font-semibold">
                  {planCounts.get("FREE") ?? 0}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin/users">Manage users</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/moderation">Moderate content</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/reports">Review reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
