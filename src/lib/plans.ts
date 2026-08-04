import type { Plan } from "@/generated/prisma/client";

export const FREE_VIDEO_LIMIT = 3;

export type PlanTier = {
  id: Plan;
  name: string;
  audience: "athlete" | "coach";
  price: number; // monthly USD
  tagline: string;
  features: string[];
  highlight?: boolean;
};

export const PLAN_TIERS: PlanTier[] = [
  {
    id: "FREE",
    name: "Free",
    audience: "athlete",
    price: 0,
    tagline: "Get discovered with the basics.",
    features: [
      "Basic athlete profile",
      `Up to ${FREE_VIDEO_LIMIT} highlight videos`,
      "Basic stats",
      "Receive coach messages",
    ],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    audience: "athlete",
    price: 15,
    highlight: true,
    tagline: "Stand out and get recruited faster.",
    features: [
      "Unlimited highlight videos",
      "Profile analytics & visibility reports",
      "Profile boosting in search",
      "AI recruiting recommendations",
      "Priority coach visibility",
    ],
  },
  {
    id: "COACH_BASIC",
    name: "Coach Basic",
    audience: "coach",
    price: 49,
    tagline: "Search and evaluate talent.",
    features: [
      "Search the athlete database",
      "View full athlete profiles",
      "Contact athletes directly",
      "Save favorites",
    ],
  },
  {
    id: "COACH_PRO",
    name: "Coach Pro",
    audience: "coach",
    price: 99,
    highlight: true,
    tagline: "A full recruiting pipeline.",
    features: [
      "Everything in Basic",
      "Advanced search filters",
      "Watchlists & recruitment pipeline",
      "Private coach notes",
      "Unlimited outreach",
    ],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    audience: "coach",
    price: 0, // custom
    tagline: "For athletic departments & schools.",
    features: [
      "Everything in Pro",
      "Multiple coach seats",
      "Department-wide analytics",
      "Priority support",
    ],
  },
];

export const PLAN_LABELS: Record<Plan, string> = {
  FREE: "Free",
  PREMIUM: "Premium",
  COACH_BASIC: "Coach Basic",
  COACH_PRO: "Coach Pro",
  ENTERPRISE: "Enterprise",
};

// ---- Feature gates ----
/** Any paying plan (not the free tier). Gates contact info. */
export function isPaidMember(plan: Plan) {
  return plan !== "FREE";
}
export function isPremiumAthlete(plan: Plan) {
  return plan === "PREMIUM" || plan === "ENTERPRISE";
}
export function canUploadUnlimitedVideos(plan: Plan) {
  return isPremiumAthlete(plan);
}
export function hasAnalytics(plan: Plan) {
  return isPremiumAthlete(plan);
}
export function canUseAdvancedFilters(plan: Plan) {
  return plan === "COACH_PRO" || plan === "ENTERPRISE";
}
export function canUseWatchlistsAndNotes(plan: Plan) {
  return plan === "COACH_PRO" || plan === "ENTERPRISE";
}
