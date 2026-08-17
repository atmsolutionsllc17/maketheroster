import Link from "next/link";
import {
  GraduationCap,
  ClipboardList,
  Users,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ROLES = [
  {
    href: "/register/athlete",
    icon: GraduationCap,
    title: "I'm an athlete",
    desc: "Build a profile and get recruited.",
  },
  {
    href: "/register/coach",
    icon: ClipboardList,
    title: "I'm a coach",
    desc: "Search and evaluate talent.",
  },
  {
    href: "/register/parent",
    icon: Users,
    title: "I'm a parent",
    desc: "Follow and support your athlete.",
  },
  {
    href: "/register/agent",
    icon: Briefcase,
    title: "I'm an agent",
    desc: "Manage and represent prospects.",
  },
];

export default function RegisterChoicePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Join Make The Roster</h1>
        <p className="mt-2 text-muted-foreground">
          How will you be using the platform?
        </p>
      </div>

      <div className="space-y-4">
        {ROLES.map((r) => (
          <Link key={r.href} href={r.href} className="block">
            <Card className="border-white/10 bg-white/[0.04] backdrop-blur-xl transition-colors hover:border-[#5b8cff]/60">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <div className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <r.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center justify-between">
                    {r.title}
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>{r.desc}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
