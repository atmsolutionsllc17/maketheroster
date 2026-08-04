import type { Role, UserStatus, Plan } from "@/generated/prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    status: UserStatus;
    plan: Plan;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
      status: UserStatus;
      plan: Plan;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    role: Role;
    status: UserStatus;
    plan: Plan;
  }
}
