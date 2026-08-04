import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { auth } from "@/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="dark relative flex min-h-full flex-col overflow-hidden bg-[#070b16] text-slate-100">
      {/* Stadium-night atmosphere (matches the landing hero) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 45% at 82% -6%, rgba(79,124,255,0.26) 0%, transparent 60%)," +
            "radial-gradient(45% 35% at 10% 6%, rgba(242,193,78,0.09) 0%, transparent 60%)," +
            "linear-gradient(180deg, #0a1024 0%, #070b16 60%, #060910 100%)",
        }}
      />

      <header className="relative z-10">
        <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between px-5">
          <Logo className="text-white" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
