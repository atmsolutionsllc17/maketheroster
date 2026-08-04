import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-display flex items-center gap-2 font-bold",
        className,
      )}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
        <Zap className="size-4.5" strokeWidth={2.5} />
      </span>
      <span className="text-lg tracking-tight">
        Athlete<span className="text-primary">Connect</span>
      </span>
    </Link>
  );
}
