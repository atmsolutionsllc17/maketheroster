import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  displayName,
  displaySubtitle,
  userInitials,
  type NamedUser,
} from "@/lib/user-display";
import { formatDistanceToNowStrict } from "@/lib/format";

const userInclude = {
  studentProfile: { select: { firstName: true, lastName: true, photoUrl: true } },
  coachProfile: { select: { firstName: true, lastName: true, school: true } },
} as const;

export default async function MessagesPage() {
  const user = await requireUser();

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      sender: { include: userInclude },
      receiver: { include: userInclude },
    },
  });

  // Group into threads by counterpart.
  type Thread = {
    otherId: string;
    other: NamedUser;
    lastBody: string;
    lastAt: Date;
    unread: number;
  };
  const threads = new Map<string, Thread>();
  for (const m of messages) {
    const isIncoming = m.receiverId === user.id;
    const otherId = isIncoming ? m.senderId : m.receiverId;
    const other = (isIncoming ? m.sender : m.receiver) as NamedUser;
    const existing = threads.get(otherId);
    if (!existing) {
      threads.set(otherId, {
        otherId,
        other,
        lastBody: m.body,
        lastAt: m.createdAt,
        unread: isIncoming && !m.read ? 1 : 0,
      });
    } else if (isIncoming && !m.read) {
      existing.unread += 1;
    }
  }
  const threadList = [...threads.values()].sort(
    (a, b) => b.lastAt.getTime() - a.lastAt.getTime(),
  );

  return (
    <div>
      <PageHeader title="Messages" description="Your conversations." />
      {threadList.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <MessageSquare className="mx-auto mb-3 size-6 text-muted-foreground" />
            <p className="text-muted-foreground">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {threadList.map((t) => (
                <li key={t.otherId}>
                  <Link
                    href={`/messages/${t.otherId}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-muted/50"
                  >
                    <Avatar className="size-10 border">
                      {t.other.studentProfile?.photoUrl && (
                        <AvatarImage
                          src={t.other.studentProfile.photoUrl}
                          alt=""
                        />
                      )}
                      <AvatarFallback>{userInitials(t.other)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">
                          {displayName(t.other)}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDistanceToNowStrict(t.lastAt)}
                        </span>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {displaySubtitle(t.other)} — {t.lastBody}
                      </p>
                    </div>
                    {t.unread > 0 && <Badge>{t.unread}</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
