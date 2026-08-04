import { Logo } from "@/components/logo";
import { NavLinks, type NavItem } from "@/components/nav-links";
import { UserMenu } from "@/components/user-menu";
import { requireUser } from "@/lib/session";
import { PLAN_LABELS } from "@/lib/plans";
import type { Role } from "@/generated/prisma/client";

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  ATHLETE: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/athlete/profile", label: "My Profile" },
    { href: "/athletes", label: "Browse" },
    { href: "/messages", label: "Messages" },
    { href: "/pricing", label: "Upgrade" },
  ],
  COACH: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/coach/search", label: "Search" },
    { href: "/coach/watchlists", label: "Watchlists" },
    { href: "/coach/favorites", label: "Favorites" },
    { href: "/messages", label: "Messages" },
  ],
  ADMIN: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/moderation", label: "Moderation" },
    { href: "/admin/reports", label: "Reports" },
  ],
  PARENT: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/athletes", label: "Browse Athletes" },
    { href: "/messages", label: "Messages" },
  ],
  AGENT: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/athletes", label: "Browse Athletes" },
    { href: "/messages", label: "Messages" },
  ],
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const items = NAV_BY_ROLE[user.role];

  const p =
    user.studentProfile ??
    user.coachProfile ??
    user.parentProfile ??
    user.agentProfile;
  const name = p ? `${p.firstName} ${p.lastName}` : user.email;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4">
          <Logo href="/dashboard" />
          <div className="hidden md:block">
            <NavLinks items={items} />
          </div>
          <div className="ml-auto">
            <UserMenu
              name={name}
              email={user.email}
              photoUrl={user.studentProfile?.photoUrl}
              planLabel={PLAN_LABELS[user.plan]}
            />
          </div>
        </div>
        {/* Mobile nav */}
        <div className="border-t px-4 py-2 md:hidden">
          <NavLinks items={items} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
