import Link from "next/link";
import { BadgeCheck, Check, Ban, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { PLAN_LABELS } from "@/lib/plans";
import {
  setUserStatus,
  setAthleteVerified,
  setCoachVerified,
} from "@/lib/actions/admin";
import type { Prisma, Role, UserStatus } from "@/generated/prisma/client";

const FILTERS: { label: string; role?: Role; status?: UserStatus }[] = [
  { label: "All" },
  { label: "Pending coaches", role: "COACH", status: "PENDING" },
  { label: "Athletes", role: "ATHLETE" },
  { label: "Coaches", role: "COACH" },
  { label: "Suspended", status: "SUSPENDED" },
];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string }>;
}) {
  await requireRole("ADMIN");
  const sp = await searchParams;

  const where: Prisma.UserWhereInput = {};
  if (sp.role) where.role = sp.role as Role;
  if (sp.status) where.status = sp.status as UserStatus;

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      studentProfile: { select: { firstName: true, lastName: true, verified: true } },
      coachProfile: { select: { firstName: true, lastName: true, verified: true, school: true } },
    },
  });

  return (
    <div>
      <PageHeader title="Users" description="Approve, suspend, and verify accounts." />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const params = new URLSearchParams();
          if (f.role) params.set("role", f.role);
          if (f.status) params.set("status", f.status);
          const href = params.toString()
            ? `/admin/users?${params.toString()}`
            : "/admin/users";
          const active =
            (f.role ?? "") === (sp.role ?? "") &&
            (f.status ?? "") === (sp.status ?? "");
          return (
            <Button
              key={f.label}
              variant={active ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={href}>{f.label}</Link>
            </Button>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const profile = u.studentProfile ?? u.coachProfile;
                  const name = profile
                    ? `${profile.firstName} ${profile.lastName}`
                    : u.email;
                  const verified = profile?.verified ?? false;
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-medium">
                          {name}
                          {verified && (
                            <BadgeCheck className="size-4 text-primary" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {u.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{u.role}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={u.status} />
                      </TableCell>
                      <TableCell className="text-sm">
                        {PLAN_LABELS[u.plan]}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(u.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {u.role === "COACH" && u.status === "PENDING" && (
                            <StatusButton
                              userId={u.id}
                              status="ACTIVE"
                              label="Approve"
                              icon={<Check className="size-3.5" />}
                            />
                          )}
                          {u.status !== "SUSPENDED" && u.role !== "ADMIN" && (
                            <StatusButton
                              userId={u.id}
                              status="SUSPENDED"
                              label="Suspend"
                              variant="outline"
                              icon={<Ban className="size-3.5" />}
                            />
                          )}
                          {u.status === "SUSPENDED" && (
                            <StatusButton
                              userId={u.id}
                              status="ACTIVE"
                              label="Reactivate"
                              variant="outline"
                              icon={<RotateCcw className="size-3.5" />}
                            />
                          )}
                          {u.role !== "ADMIN" && (
                            <VerifyButton
                              userId={u.id}
                              role={u.role}
                              verified={verified}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No users match this filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        status === "ACTIVE" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        status === "PENDING" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        status === "SUSPENDED" && "bg-destructive/15 text-destructive",
      )}
    >
      {status}
    </span>
  );
}

function StatusButton({
  userId,
  status,
  label,
  icon,
  variant = "default",
}: {
  userId: string;
  status: string;
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "outline";
}) {
  return (
    <form action={setUserStatus}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="status" value={status} />
      <Button type="submit" size="sm" variant={variant}>
        {icon}
        {label}
      </Button>
    </form>
  );
}

function VerifyButton({
  userId,
  role,
  verified,
}: {
  userId: string;
  role: Role;
  verified: boolean;
}) {
  const action = role === "ATHLETE" ? setAthleteVerified : setCoachVerified;
  return (
    <form action={action}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="verified" value={verified ? "false" : "true"} />
      <Button type="submit" size="sm" variant="outline">
        <BadgeCheck className="size-3.5" />
        {verified ? "Unverify" : "Verify"}
      </Button>
    </form>
  );
}
