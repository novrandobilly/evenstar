import { useQuery } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";

export interface DbPlanRecord {
  id: string;
  name: string;
  code: string;
  billing_cycle: "lifetime" | "yearly" | "monthly";
  price: number;
  badge_label: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
}

export const FALLBACK_LIFETIME_PLAN: DbPlanRecord = {
  id: "plan_lifetime01",
  name: "Kickserve Pro Lifetime",
  code: "pro_lifetime",
  billing_cycle: "lifetime",
  price: 499000,
  badge_label: "Lifetime Access",
  features: [
    "Save 100 players in Roster",
    "Up to 32 players per session",
    "Unlimited lifetime session history",
    "Custom Club Logo branding",
  ],
  is_active: true,
  sort_order: 1,
  created: "",
  updated: "",
};

export const formatIdr = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s+/g, " ");
};

export const formatBillingCycle = (cycle: string): string => {
  switch (cycle) {
    case "lifetime":
      return "One-time payment";
    case "yearly":
      return "Billed annually";
    case "monthly":
      return "Billed monthly";
    default:
      return "One-time payment";
  }
};

/**
 * Fetches active subscription/license plans from the database.
 */
export const useTPlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async (): Promise<DbPlanRecord[]> => {
      try {
        const records = await pb.collection("plans").getFullList<DbPlanRecord>({
          filter: "is_active = true",
          sort: "sort_order",
        });
        if (records.length > 0) {
          return records;
        }
        return [FALLBACK_LIFETIME_PLAN];
      } catch (err) {
        console.warn("[useTPlans] Error loading plans from database, using fallback:", err);
        return [FALLBACK_LIFETIME_PLAN];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export default useTPlans;
