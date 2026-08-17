import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  ShieldCheck,
  Play,
  Star,
  Trophy,
  GraduationCap,
  Users,
  Video,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const COVERED_SPORTS = [
  { name: "Soccer", athletes: "3,100+", img: "/sport-soccer.jpg", pos: "50% 55%" },
  { name: "Football", athletes: "4,400+", img: "/sport-football.jpg", pos: "50% 32%" },
  { name: "Basketball", athletes: "3,800+", img: "/sport-basketball.jpg", pos: "50% 22%" },
  { name: "Ice Hockey", athletes: "1,900+", img: "/sport-hockey.jpg", pos: "50% 30%" },
  { name: "Softball", athletes: "2,600+", img: "/sport-softball.jpg", pos: "50% 35%" },
  { name: "Lacrosse", athletes: "1,700+", img: "/sport-lacrosse.jpg", pos: "50% 40%" },
  { name: "Track & Field", athletes: "3,400+", img: "/sport-track.jpg", pos: "50% 45%" },
  { name: "Gymnastics", athletes: "1,400+", img: "/sport-gymnastics.jpg", pos: "50% 32%" },
  { name: "Swimming", athletes: "2,200+", img: "/sport-swimming.jpg", pos: "50% 45%" },
  { name: "Action Sports", athletes: "980+", img: "/sport-action.jpg", pos: "50% 28%" },
];

// Free-licensed Unsplash action photos — one per sport.
const MONTAGE = [
  { src: "/sport-football.jpg", pos: "50% 26%" },
  { src: "/sport-basketball.jpg", pos: "50% 16%" },
  { src: "/sport-hockey.jpg", pos: "50% 34%" },
  { src: "/sport-soccer.jpg", pos: "50% 55%" },
];

export default async function LandingPage() {
  const session = await auth();
  const featured = await prisma.studentProfile.findFirst({
    where: { boosted: true, verified: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photoUrl: true,
      galleryUrls: true,
      sport: true,
      position: true,
      school: true,
      state: true,
      graduationYear: true,
      bio: true,
      _count: { select: { videos: true, profileViews: true } },
    },
  });

  return (
    <div className="relative min-h-full overflow-hidden bg-[#070b16] text-slate-100">
      {/* ============ HERO ============ */}
      <section className="relative isolate overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(48% 55% at 84% 6%, rgba(79,124,255,0.28) 0%, transparent 60%), linear-gradient(180deg,#0a1024,#070b16)",
          }}
        />

        {/* Nav */}
        <header className="relative z-20">
          <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5">
            <Logo className="text-white" />
            <nav className="hidden items-center gap-8 text-sm font-medium text-slate-200/90 lg:flex">
              <Link href="/" className="text-white">Home</Link>
              <Link href="/athletes" className="hover:text-white">Athletes</Link>
              <Link href="/register/coach" className="hover:text-white">Coaches</Link>
              <Link href="/agents" className="hover:text-white">Agents</Link>
              <Link href="/pricing" className="hover:text-white">Pricing</Link>
            </nav>
            <div className="flex items-center gap-2">
              {session ? (
                <PillLink href="/dashboard">Dashboard</PillLink>
              ) : (
                <>
                  <Link href="/login" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/95 transition-colors hover:bg-white/10">Log in</Link>
                  <PillLink href="/register">Sign up</PillLink>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero body */}
        <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-5 pt-6 lg:grid-cols-[minmax(0,470px)_1fr] lg:pt-8">
          {/* Left column */}
          <div className="relative z-10 pb-10">
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-[#f2c14e] uppercase">
              <ShieldCheck className="size-4" />
              Trusted by athletes, coaches &amp; recruiters
            </div>
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              Where Future
              <br /> Athletes Get{" "}
              <span className="text-[#4f7cff]">Discovered</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-slate-400">
              The all-in-one recruiting network where student-athletes showcase
              their talent, academics, and achievements while coaches discover
              and evaluate top prospects.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PillLink href="/register/athlete" size="lg">
                Create athlete profile <ArrowRight className="size-4" />
              </PillLink>
              <Link href="/register/coach" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10">
                Join as a coach
              </Link>
            </div>
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  ["JC", "from-sky-500 to-blue-600"],
                  ["MR", "from-violet-500 to-indigo-600"],
                  ["TA", "from-emerald-500 to-teal-600"],
                  ["KP", "from-amber-500 to-orange-600"],
                ].map(([i, g]) => (
                  <div key={i} className={`grid size-9 place-items-center rounded-full bg-gradient-to-br ${g} text-xs font-bold text-white ring-2 ring-[#070b16]`}>{i}</div>
                ))}
              </div>
              <div className="text-sm">
                <div className="tabular font-bold text-white">15,000+ Athletes</div>
                <div className="text-slate-400">1,200+ Coaches · 500+ Schools</div>
              </div>
            </div>
          </div>

          {/* Right column — full-bleed athlete photo fading into the dark */}
          <div className="relative">
            <div className="relative hidden min-h-[660px] lg:block">
              <div className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-white/10">
                <div className="grid size-full grid-cols-2 grid-rows-2 gap-1">
                  {MONTAGE.map((m) => (
                    <div
                      key={m.src}
                      className="relative bg-cover"
                      style={{ backgroundImage: `url('${m.src}')`, backgroundPosition: m.pos }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070b16]/85 via-[#070b16]/15 to-[#070b16]/10" />
                    </div>
                  ))}
                </div>
                {/* blend the montage into the dark hero */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg,#070b16 0%, rgba(7,11,22,0.6) 22%, transparent 50%), linear-gradient(0deg,#070b16 0%, transparent 22%)",
                  }}
                />
                <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="absolute right-2 bottom-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
                  Photos: Unsplash
                </a>
              </div>

              <div className="absolute left-0 top-4 w-[250px]"><ProfileCard /></div>
              <div className="absolute right-0 top-0 w-[244px]"><SeasonCard /></div>
              <div className="absolute right-1 top-[236px] w-[236px]"><CoachActivityCard /></div>
              <div className="absolute left-1 top-[320px] w-[214px]"><AcademicsCard /></div>
              <div className="absolute bottom-6 left-[24%] w-[256px]"><HighlightCard /></div>
              <div className="absolute bottom-[96px] right-2 w-[212px]"><AchievementsCard /></div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden pb-6">
              <div className="relative mb-4 h-64 overflow-hidden rounded-2xl ring-1 ring-white/10">
                <div className="grid size-full grid-cols-2 grid-rows-2 gap-1">
                  {MONTAGE.map((m) => (
                    <div
                      key={m.src}
                      className="bg-cover"
                      style={{ backgroundImage: `url('${m.src}')`, backgroundPosition: m.pos }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileCard />
                <SeasonCard />
                <AcademicsCard />
                <HighlightCard />
                <AchievementsCard />
                <CoachActivityCard />
              </div>
            </div>
          </div>
        </div>

        {/* Feature bar */}
        <div className="mx-auto w-full max-w-7xl px-5 pb-8">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: ShieldCheck, title: "Verified Profiles", body: "Build trust with verified athlete profiles" },
              { icon: Video, title: "Highlight Videos", body: "Showcase your best moments on the field" },
              { icon: BarChart3, title: "Performance Stats", body: "Detailed stats that coaches value" },
              { icon: GraduationCap, title: "Academic Records", body: "Highlight your academic achievements" },
              { icon: Star, title: "Coach Recommendations", body: "Earn recommendations that strengthen your profile" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 px-4 py-5">
                <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-[#4f7cff]/15 text-[#8ab0ff]">
                  <f.icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED ATHLETE ============ */}
      {featured && (
        <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-[#8ab0ff] uppercase">
              Featured athlete
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Meet a rising prospect.
            </h2>
          </div>

          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] lg:grid-cols-2">
            <div
              className="relative min-h-[320px] bg-cover bg-center lg:min-h-full"
              style={{
                backgroundImage: `url('${featured.photoUrl ?? featured.galleryUrls[0] ?? ""}')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b16]/70 via-transparent to-transparent lg:bg-gradient-to-r" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#f2c14e] px-3 py-1 text-xs font-bold text-[#1a1400] uppercase">
                <Star className="size-3.5" fill="currentColor" /> Featured
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-3xl font-bold tracking-tight text-white">
                    {featured.firstName} {featured.lastName}
                  </h3>
                  <BadgeCheck className="size-6 text-[#4f7cff]" />
                </div>
                <p className="mt-1 text-lg text-slate-300">
                  {featured.sport}
                  {featured.position ? ` · ${featured.position}` : ""}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {featured.school} · Class of {featured.graduationYear}
                  {featured.state ? ` · ${featured.state}` : ""}
                </p>
              </div>

              {featured.bio && (
                <p className="line-clamp-4 text-sm leading-relaxed text-slate-400">
                  {featured.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <div className="tabular text-2xl font-bold text-white">
                    {featured._count.videos}
                  </div>
                  <div className="text-slate-400">Highlight videos</div>
                </div>
                <div>
                  <div className="tabular text-2xl font-bold text-white">
                    {featured._count.profileViews}
                  </div>
                  <div className="text-slate-400">Profile views</div>
                </div>
              </div>

              <div className="mt-2">
                <PillLink href={`/athletes/${featured.id}`} size="lg">
                  View full profile <ArrowRight className="size-4" />
                </PillLink>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ SPORTS WE COVER ============ */}
      <section className="mx-auto w-full max-w-7xl px-5 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-[#8ab0ff] uppercase">Sports we cover</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Built for every sport, every position.</h2>
          <p className="mt-3 text-slate-400">15+ sports and counting — from the gridiron to the ice.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {COVERED_SPORTS.map((s) => (
            <div key={s.name} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <div
                className="absolute inset-0 bg-cover transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${s.img}')`, backgroundPosition: s.pos }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-lg font-bold text-white">{s.name}</p>
                <p className="tabular text-sm text-slate-200">{s.athletes} athletes</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SPLIT VALUE PROPS ============ */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 pb-24 lg:grid-cols-2">
        <ValueBlock eyebrow="For athletes" title="Your recruiting profile, done right." points={["Unlimited highlight videos on Premium", "Season stats, awards & achievements", "See who's viewing you with analytics"]} cta={{ href: "/register/athlete", label: "Build your profile" }} />
        <ValueBlock eyebrow="For coaches" title="Find the exact athlete you need." points={["Filter by sport, position, state, GPA & more", "Watchlists & a full recruitment pipeline", "Contact prospects directly — no middlemen"]} cta={{ href: "/register/coach", label: "Start recruiting" }} />
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-24">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#16265180] to-[#0b1226] px-8 py-16 text-center">
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Ready to get recruited?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">Create your free profile in minutes. Upgrade anytime.</p>
          <div className="mt-8 flex justify-center">
            <PillLink href="/register" size="lg">Create your profile <ArrowRight className="size-4" /></PillLink>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row">
          <Logo className="text-white" />
          <p>© {new Date().getFullYear()} Make The Roster. Built for the game.</p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- floating cards (dark glass) ---------- */

function ProfileCard() {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white">JW</div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">Jordan Williams</p>
          <p className="text-xs text-slate-400">QB · Class of 2026</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#8ab0ff]"><BadgeCheck className="size-3.5" /> Verified Athlete</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs">
        <div className="flex text-[#f2c14e]">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="size-3" fill="currentColor" />))}</div>
        <span className="tabular ml-1 font-semibold text-white">4.8</span>
        <span className="text-slate-500">(24)</span>
      </div>
    </Card>
  );
}

function SeasonCard() {
  return (
    <Card>
      <CardLabel icon={BarChart3}>Season Performance</CardLabel>
      <dl className="mt-3 space-y-1.5 text-sm">
        <StatRow k="Passing Yards" v="3,245" />
        <StatRow k="Total TDs" v="31" />
        <StatRow k="Completion %" v="68%" />
        <StatRow k="Yards Per Game" v="270.4" />
      </dl>
    </Card>
  );
}

function CoachActivityCard() {
  return (
    <Card>
      <CardLabel icon={Users}>Coach Activity</CardLabel>
      <p className="mt-2 text-xs text-slate-400">Profile viewed by</p>
      <p className="tabular text-2xl font-bold text-white">12 Coaches</p>
      <p className="text-xs text-slate-400">in the last 7 days</p>
      <div className="mt-3 flex -space-x-2">
        {["OSU", "GT", "UK", "SC"].map((s) => (
          <div key={s} className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/10 text-[9px] font-bold text-slate-200 ring-2 ring-[#0a1024]">{s}</div>
        ))}
      </div>
    </Card>
  );
}

function AcademicsCard() {
  return (
    <Card>
      <CardLabel icon={GraduationCap}>Academic Excellence</CardLabel>
      <dl className="mt-3 space-y-1.5 text-sm">
        <StatRow k="GPA" v="3.9" />
        <StatRow k="SAT" v="1350" />
        <StatRow k="Honor Roll" v="4 sem" />
      </dl>
      <p className="mt-3 flex items-center gap-1 text-xs font-medium text-[#8ab0ff]">View academic details <ArrowRight className="size-3" /></p>
    </Card>
  );
}

function HighlightCard() {
  return (
    <Card>
      <CardLabel icon={Play}>Highlight Reel</CardLabel>
      <div className="relative mt-3 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-700 to-slate-900">
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid size-9 place-items-center rounded-full bg-[#4f7cff] text-white"><Play className="size-3.5" fill="currentColor" /></div>
        </div>
        <span className="absolute right-2 bottom-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">2:45</span>
      </div>
      <p className="mt-2 text-xs font-medium text-white">2024 Season Highlights</p>
      <p className="text-xs text-slate-400">Views: 2,487</p>
    </Card>
  );
}

function AchievementsCard() {
  return (
    <Card>
      <CardLabel icon={Trophy}>Achievements</CardLabel>
      <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
        {["All-Region Team", "Team Captain", "Offensive MVP", "State Champion"].map((a) => (
          <li key={a} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#4f7cff]" />{a}</li>
        ))}
      </ul>
    </Card>
  );
}

/* ---------- pieces ---------- */

function PillLink({ href, children, size = "md" }: { href: string; children: React.ReactNode; size?: "md" | "lg" }) {
  const pad = size === "lg" ? "px-6 py-3.5 text-sm" : "px-4 py-2 text-sm";
  return (
    <Link href={href} className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6bf6] font-semibold text-white shadow-lg shadow-[#2f6bf6]/30 transition-transform hover:-translate-y-0.5 ${pad}`}>{children}</Link>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#0b1120]/75 p-4 shadow-xl shadow-black/40 backdrop-blur-xl ${className}`}>{children}</div>
  );
}

function CardLabel({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-white"><Icon className="size-4 text-[#8ab0ff]" />{children}</div>
  );
}

function StatRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-1"><dt className="text-slate-400">{k}</dt><dd className="tabular font-semibold text-white">{v}</dd></div>
  );
}

function ValueBlock({ eyebrow, title, points, cta }: { eyebrow: string; title: string; points: string[]; cta: { href: string; label: string } }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <p className="text-sm font-semibold tracking-wide text-[#8ab0ff] uppercase">{eyebrow}</p>
      <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      <ul className="mt-5 space-y-2.5">
        {points.map((p) => (<li key={p} className="flex items-start gap-2.5 text-slate-300"><BadgeCheck className="mt-0.5 size-4.5 shrink-0 text-[#4f7cff]" />{p}</li>))}
      </ul>
      <div className="mt-7"><Link href={cta.href} className="inline-flex items-center gap-2 text-sm font-semibold text-[#8ab0ff] hover:text-white">{cta.label} <ArrowRight className="size-4" /></Link></div>
    </div>
  );
}
