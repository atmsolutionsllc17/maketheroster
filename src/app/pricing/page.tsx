import Link from "next/link";
import { Check } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PLAN_TIERS, type PlanTier } from "@/lib/plans";
import { changePlan } from "@/lib/actions/subscription";
import type { Plan, Role } from "@/generated/prisma/client";

export default async function PricingPage() {
  const session = await auth();
  let role: Role | null = null;
  let currentPlan: Plan | null = null;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, plan: true },
    });
    role = user?.role ?? null;
    currentPlan = user?.plan ?? null;
  }

  const showAthlete = !role || role === "ATHLETE";
  const showCoach = !role || role === "COACH";

  const athleteTiers = PLAN_TIERS.filter((t) => t.audience === "athlete");
  const coachTiers = PLAN_TIERS.filter((t) => t.audience === "coach");

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Logo href={session ? "/dashboard" : "/"} />
          <Button variant="ghost" asChild>
            <Link href={session ? "/dashboard" : "/"}>
              {session ? "Dashboard" : "Home"}
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        {showAthlete && (
          <section className="mb-16">
            {!role && (
              <h2 className="mb-6 text-xl font-semibold">For athletes</h2>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              {athleteTiers.map((tier) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  role={role}
                  currentPlan={currentPlan}
                  loggedIn={!!session}
                />
              ))}
            </div>
          </section>
        )}

        {showCoach && (
          <section>
            {!role && <h2 className="mb-6 text-xl font-semibold">For coaches</h2>}
            <div className="grid gap-6 md:grid-cols-3">
              {coachTiers.map((tier) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  role={role}
                  currentPlan={currentPlan}
                  loggedIn={!!session}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function PricingCard({
  tier,
  role,
  currentPlan,
  loggedIn,
}: {
  tier: PlanTier;
  role: Role | null;
  currentPlan: Plan | null;
  loggedIn: boolean;
}) {
  const isCurrent = currentPlan === tier.id;
  const isEnterprise = tier.id === "ENTERPRISE";
  const matchesRole =
    (tier.audience === "athlete" && role === "ATHLETE") ||
    (tier.audience === "coach" && role === "COACH");

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6",
        tier.highlight && "border-primary shadow-sm",
      )}
    >
      {tier.highlight && (
        <Badge className="absolute -top-3 left-6">Most popular</Badge>
      )}
      <h3 className="text-lg font-semibold">{tier.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>
      <div className="mt-4 flex items-baseline gap-1">
        {isEnterprise ? (
          <span className="text-3xl font-bold">Custom</span>
        ) : (
          <>
            <span className="text-4xl font-bold">${tier.price}</span>
            <span className="text-muted-foreground">/mo</span>
          </>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {!loggedIn ? (
          <Button
            className="w-full"
            variant={tier.highlight ? "default" : "outline"}
            asChild
          >
            <Link href="/register">Get started</Link>
          </Button>
        ) : isCurrent ? (
          <Button className="w-full" variant="outline" disabled>
            Current plan
          </Button>
        ) : isEnterprise ? (
          <Button className="w-full" variant="outline" asChild>
            <Link href="/messages">Contact sales</Link>
          </Button>
        ) : matchesRole ? (
          <form action={changePlan}>
            <input type="hidden" name="plan" value={tier.id} />
            <Button
              type="submit"
              className="w-full"
              variant={tier.highlight ? "default" : "outline"}
            >
              {tier.price === 0 ? "Switch to Free" : `Choose ${tier.name}`}
            </Button>
          </form>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            {tier.audience === "athlete" ? "Athletes only" : "Coaches only"}
          </Button>
        )}
      </div>
    </div>
  );
}
