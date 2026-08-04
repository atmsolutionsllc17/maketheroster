import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase, Users, LineChart, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata = {
  title: "For Agents — AthleteConnect",
  description: "Agent and advisor tools for managing prospects on AthleteConnect.",
};

export default function AgentsPage() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#070b16] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(45% 45% at 80% 4%, rgba(79,124,255,0.22) 0%, transparent 60%), linear-gradient(180deg,#0a1024,#070b16)",
        }}
      />

      <header className="relative z-10">
        <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5">
          <Logo className="text-white" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f2c14e]/30 bg-[#f2c14e]/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#f4cf7a] uppercase">
          <Briefcase className="size-4" /> Coming soon
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Built for agents &amp; advisors
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
          Manage your roster of prospects, track recruiting activity, and connect
          athletes with the right programs. Agent tools are on the way.
        </p>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
          {[
            { icon: Users, title: "Client roster", body: "Organize every athlete you represent in one place." },
            { icon: LineChart, title: "Recruiting insights", body: "See coach interest and profile momentum at a glance." },
            { icon: ShieldCheck, title: "Verified introductions", body: "Connect clients to programs through trusted channels." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
              <div className="mb-3 grid size-10 place-items-center rounded-lg bg-[#4f7cff]/15 text-[#8ab0ff]">
                <f.icon className="size-5" />
              </div>
              <p className="font-semibold text-white">{f.title}</p>
              <p className="mt-1 text-sm text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/register/coach"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6bf6] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2f6bf6]/30 transition-transform hover:-translate-y-0.5"
          >
            Explore coach tools <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Back to home
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row">
          <Logo className="text-white" />
          <p>© {new Date().getFullYear()} AthleteConnect. Built for the game.</p>
        </div>
      </footer>
    </div>
  );
}
