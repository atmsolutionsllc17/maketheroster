import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { markThreadRead } from "@/lib/actions/messages";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  displayName,
  displaySubtitle,
  userInitials,
  type NamedUser,
} from "@/lib/user-display";
import { formatDistanceToNowStrict } from "@/lib/format";
import { ComposeForm } from "./compose-form";

const userInclude = {
  studentProfile: { select: { firstName: true, lastName: true, photoUrl: true } },
  coachProfile: { select: { firstName: true, lastName: true, school: true } },
} as const;

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const me = await requireUser();

  const other = await prisma.user.findUnique({
    where: { id: userId },
    include: userInclude,
  });
  if (!other) notFound();

  // Mark incoming messages as read.
  await markThreadRead(userId);

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: me.id, receiverId: userId },
        { senderId: userId, receiverId: me.id },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  const otherNamed = other as NamedUser;
  const studentId = other.role === "ATHLETE"
    ? (await prisma.studentProfile.findUnique({
        where: { userId: other.id },
        select: { id: true },
      }))?.id
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Link
          href="/messages"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All messages
        </Link>
      </div>

      <Card className="flex h-[70vh] flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b p-4">
          <Avatar className="size-10 border">
            {otherNamed.studentProfile?.photoUrl && (
              <AvatarImage src={otherNamed.studentProfile.photoUrl} alt="" />
            )}
            <AvatarFallback>{userInitials(otherNamed)}</AvatarFallback>
          </Avatar>
          <div>
            {studentId ? (
              <Link
                href={`/athletes/${studentId}`}
                className="font-semibold hover:underline"
              >
                {displayName(otherNamed)}
              </Link>
            ) : (
              <span className="font-semibold">{displayName(otherNamed)}</span>
            )}
            <p className="text-xs text-muted-foreground">
              {displaySubtitle(otherNamed)}
            </p>
          </div>
        </div>

        {/* Messages */}
        <CardContent className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No messages yet. Say hello 👋
            </p>
          ) : (
            messages.map((m) => {
              const mine = m.senderId === me.id;
              return (
                <div
                  key={m.id}
                  className={cn("flex", mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                      mine
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.body}</p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        mine
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground",
                      )}
                    >
                      {formatDistanceToNowStrict(m.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>

        {/* Composer */}
        <div className="border-t p-4">
          <ComposeForm receiverId={other.id} />
        </div>
      </Card>
    </div>
  );
}
