import Link from "next/link";
import { Check, X, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { setVideoModeration } from "@/lib/actions/admin";

export default async function ModerationPage() {
  await requireRole("ADMIN");

  const videos = await prisma.video.findMany({
    orderBy: [{ moderation: "asc" }, { createdAt: "desc" }],
    take: 100,
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Content moderation"
        description="Review athlete highlight videos."
      />
      {videos.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            No videos to review.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {videos.map((v) => (
            <Card key={v.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{v.title}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        v.moderation === "APPROVED" &&
                          "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                        v.moderation === "PENDING" &&
                          "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                        v.moderation === "REJECTED" &&
                          "bg-destructive/15 text-destructive",
                      )}
                    >
                      {v.moderation}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <Link
                      href={`/athletes/${v.student.id}`}
                      className="hover:underline"
                    >
                      {v.student.firstName} {v.student.lastName}
                    </Link>{" "}
                    ·{" "}
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      view <ExternalLink className="size-3" />
                    </a>
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={setVideoModeration}>
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="moderation" value="APPROVED" />
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      disabled={v.moderation === "APPROVED"}
                    >
                      <Check className="size-3.5" /> Approve
                    </Button>
                  </form>
                  <form action={setVideoModeration}>
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="moderation" value="REJECTED" />
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      disabled={v.moderation === "REJECTED"}
                    >
                      <X className="size-3.5" /> Reject
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
