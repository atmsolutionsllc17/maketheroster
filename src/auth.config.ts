import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma / Node-only deps).
 * Used by middleware for coarse route protection and shared by the full config.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // real providers are added in auth.ts (Node runtime)
  callbacks: {
    // Persist role/status/plan onto the JWT at sign-in.
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.status = user.status;
        token.plan = user.plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as typeof session.user.role;
        session.user.status = token.status as typeof session.user.status;
        session.user.plan = token.plan as typeof session.user.plan;
      }
      return session;
    },
    // Coarse route gating for middleware.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const protectedPrefixes = [
        "/dashboard",
        "/athlete/", // athlete's own area; /athletes (public directory) is open
        "/coach",
        "/admin",
        "/onboarding",
        "/messages",
        "/settings",
      ];
      const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

      if (isProtected && !isLoggedIn) return false;

      // Role-scoped areas. Use trailing slashes so that shared routes like
      // /athletes/[id] (public profiles) don't collide with /athlete/*.
      if (isLoggedIn) {
        const role = auth!.user.role;
        if (pathname.startsWith("/admin") && role !== "ADMIN") return false;
        if (pathname.startsWith("/coach/") && role !== "COACH") return false;
        if (pathname.startsWith("/athlete/") && role !== "ATHLETE") return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
