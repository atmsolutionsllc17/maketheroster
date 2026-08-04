import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  GraduationCap,
  MapPin,
  Ruler,
  Weight,
  FileText,
  Trophy,
  MessageSquare,
  Lock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatHeight } from "@/lib/constants";
import { getEmbedUrl, isDirectVideo } from "@/lib/video";
import { canUseWatchlistsAndNotes, isPaidMember } from "@/lib/plans";
import { CoachActions } from "./coach-actions";

export default async function AthleteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const viewer = await getCurrentUser(); // may be null — profiles are public

  const profile = await prisma.studentProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true } },
      videos: {
        where: { moderation: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
      statistics: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!profile) notFound();

  const isOwner = viewer?.id === profile.userId;
  const isCoach = viewer?.role === "COACH";
  const canContact = !!viewer && !isOwner && isPaidMember(viewer.plan);

  // Record a view (coaches only, not owner, deduped within 6h).
  if (viewer && isCoach && !isOwner && viewer.status === "ACTIVE") {
    const since = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const recent = await prisma.profileView.findFirst({
      where: { studentId: profile.id, viewerId: viewer.id, createdAt: { gte: since } },
    });
    if (!recent) {
      await prisma.profileView.create({
        data: { studentId: profile.id, viewerId: viewer.id },
      });
    }
  }

  // Coach-specific sidebar data
  let coachData: {
    isFavorited: boolean;
    watchlists: { id: string; name: string }[];
    notes: { id: string; body: string; createdAt: Date }[];
  } | null = null;

  if (viewer && isCoach && !isOwner) {
    const [fav, watchlists, notes] = await Promise.all([
      prisma.favorite.findUnique({
        where: { coachId_studentId: { coachId: viewer.id, studentId: profile.id } },
      }),
      prisma.watchlist.findMany({
        where: { coachId: viewer.id },
        select: { id: true, name: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.coachNote.findMany({
        where: { coachId: viewer.id, studentId: profile.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, body: true, createdAt: true },
      }),
    ]);
    coachData = { isFavorited: !!fav, watchlists, notes };
  }

  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-24 border">
            {profile.photoUrl && (
              <AvatarImage src={profile.photoUrl} alt={profile.firstName} />
            )}
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.verified && (
                <Badge className="chip-gold gap-1 border">
                  <BadgeCheck className="size-3.5" /> Verified
                </Badge>
              )}
            </div>
            <p className="mt-1 text-lg text-muted-foreground">
              {profile.sport}
              {profile.position ? ` · ${profile.position}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="size-4" /> {profile.school} · Class of{" "}
                {profile.graduationYear}
              </span>
              {(profile.location || profile.state) && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-4" />
                  {[profile.location, profile.state].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Fact icon={Ruler} label="Height" value={formatHeight(profile.height)} />
          <Fact
            icon={Weight}
            label="Weight"
            value={profile.weight ? `${profile.weight} lbs` : "—"}
          />
          <Fact
            icon={GraduationCap}
            label="GPA"
            value={profile.gpa ? profile.gpa.toFixed(2) : "—"}
          />
          <Fact
            icon={Trophy}
            label="SAT / ACT"
            value={
              profile.satScore
                ? `${profile.satScore} SAT`
                : profile.actScore
                  ? `${profile.actScore} ACT`
                  : "—"
            }
          />
        </div>

        {profile.bio && (
          <Section title="About">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {profile.bio}
            </p>
          </Section>
        )}

        {(profile.awards || profile.achievements) && (
          <Section title="Awards & Achievements">
            {profile.awards && (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {profile.awards}
              </p>
            )}
            {profile.achievements && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {profile.achievements}
              </p>
            )}
          </Section>
        )}

        {/* Videos */}
        <Section title={`Highlight videos (${profile.videos.length})`}>
          {profile.videos.length === 0 ? (
            <EmptyLine>No highlight videos yet.</EmptyLine>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.videos.map((v) => {
                const embed = getEmbedUrl(v.url);
                return (
                  <div key={v.id} className="overflow-hidden rounded-lg border">
                    {isDirectVideo(v.url) ? (
                      <video
                        src={v.url}
                        poster={v.thumbnail ?? undefined}
                        controls
                        preload="metadata"
                        className="aspect-video size-full bg-black object-cover"
                      />
                    ) : embed ? (
                      <div className="aspect-video">
                        <iframe
                          src={embed}
                          title={v.title}
                          className="size-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex aspect-video items-center justify-center bg-muted text-sm text-primary hover:underline"
                      >
                        Watch video ↗
                      </a>
                    )}
                    <div className="p-3 text-sm font-medium">{v.title}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* Stats */}
        <Section title="Statistics">
          {profile.statistics.length === 0 ? (
            <EmptyLine>No stats logged yet.</EmptyLine>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stat</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Season</TableHead>
                  <TableHead>Sport</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profile.statistics.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.statName}</TableCell>
                    <TableCell>{s.value}</TableCell>
                    <TableCell>{s.season ?? "—"}</TableCell>
                    <TableCell>{s.sport}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Section>

        {/* Documents — visible to coaches and owner */}
        {(isCoach || isOwner) && profile.documents.length > 0 && (
          <Section title="Documents">
            <ul className="space-y-2">
              {profile.documents.map((d) => (
                <li key={d.id}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <FileText className="size-4" /> {d.title}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      {/* Sidebar */}
      <aside>
        {isOwner ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">This is your public profile</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Anyone can view this page. Keep it complete to rank higher in
              search and get discovered.
            </CardContent>
          </Card>
        ) : viewer && isCoach && coachData ? (
          <CoachActions
            studentId={profile.id}
            messageHref={`/messages/${profile.userId}`}
            isFavorited={coachData.isFavorited}
            watchlists={coachData.watchlists}
            notes={coachData.notes}
            canUsePro={canUseWatchlistsAndNotes(viewer.plan)}
          />
        ) : canContact ? (
          <Card>
            <CardContent className="space-y-3 p-5">
              <Button asChild className="w-full">
                <Link href={`/messages/${profile.userId}`}>
                  <MessageSquare className="size-4" /> Contact athlete
                </Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Paid member — reach out directly.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="space-y-3 p-6 text-center">
              <div className="mx-auto grid size-10 place-items-center rounded-full bg-muted">
                <Lock className="size-4 text-muted-foreground" />
              </div>
              <p className="font-medium">Contact info is for paid members</p>
              <p className="text-sm text-muted-foreground">
                {viewer
                  ? "Upgrade your plan to message this athlete directly."
                  : "Sign up and upgrade to contact athletes directly."}
              </p>
              <Button asChild className="w-full">
                <Link href={viewer ? "/pricing" : "/register"}>
                  {viewer ? "View plans" : "Get started"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className="tabular mt-1 font-semibold">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
