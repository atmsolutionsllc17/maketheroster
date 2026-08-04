import { Check, Flag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { resolveReport } from "@/lib/actions/admin";

export default async function ReportsPage() {
  await requireRole("ADMIN");

  const reports = await prisma.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
    include: {
      reporter: {
        select: {
          email: true,
          coachProfile: { select: { firstName: true, lastName: true } },
          studentProfile: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Flagged content and users to review."
      />
      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            <Flag className="mx-auto mb-3 size-6" />
            No reports. All clear.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => {
            const p = r.reporter.coachProfile ?? r.reporter.studentProfile;
            const reporterName = p
              ? `${p.firstName} ${p.lastName}`
              : r.reporter.email;
            return (
              <Card key={r.id}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                        {r.targetType}
                      </span>
                      {r.status === "open" ? (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                          open
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          resolved
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm">{r.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Reported by {reporterName} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  {r.status === "open" && (
                    <form action={resolveReport}>
                      <input type="hidden" name="id" value={r.id} />
                      <Button type="submit" size="sm" variant="outline">
                        <Check className="size-3.5" /> Resolve
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
