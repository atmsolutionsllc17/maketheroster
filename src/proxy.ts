import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// NextAuth's `auth` wrapper runs the `authorized` callback for route gating.
// In Next 16 the middleware convention was renamed to `proxy`.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Run on everything except Next internals, the auth API, and static assets.
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
