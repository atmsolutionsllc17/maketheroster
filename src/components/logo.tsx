import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Make The Roster wordmark.
 *
 * Base text color is inherited (pass `text-white` on dark surfaces); the
 * accent word and badge use the brand indigo, so it reads on both the dark
 * landing and the light app. `size` scales the whole lockup.
 */
export function Logo({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string;
  size?: "md" | "lg";
}) {
  const badge = size === "lg" ? "size-10" : "size-8";
  const check = size === "lg" ? "size-6" : "size-5";
  const text = size === "lg" ? "text-2xl" : "text-lg";

  return (
    <Link
      href={href}
      aria-label="Make The Roster — home"
      className={cn("font-display flex items-center gap-2.5 font-bold", className)}
    >
      {/* Badge: a bold checkmark — "you made the roster" */}
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#5b86ff] to-[#2f5fe0] text-white shadow-sm shadow-[#4f7cff]/40 ring-1 ring-inset ring-white/15",
          badge,
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className={check} aria-hidden="true">
          <path
            d="M4.5 12.5l4.8 4.8L19.5 6.8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Wordmark */}
      <span className={cn("leading-none tracking-tight", text)}>
        Make The <span className="text-[#4f7cff]">Roster</span>
      </span>
    </Link>
  );
}
