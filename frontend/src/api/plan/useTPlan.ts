import { useMemo } from "react";
import { useTProfile } from "../auth/useTProfile";
import {
  PLANS,
  isDateWithinMonths,
  type PlanTier,
  type PlanConfig,
  type PlanLimits,
  type PlanFeatures,
} from "./planConfig";
import type { HostUser } from "../../types/auth";

export interface UseTPlanReturn {
  tier: PlanTier;
  isPro: boolean;
  plan: PlanConfig;
  limits: PlanLimits;
  features: PlanFeatures;
  user: HostUser | null;
  isLoading: boolean;
  isSessionWithinRetention: (dateStr: string | undefined) => boolean;
}

export const useTPlan = (): UseTPlanReturn => {
  const { data: user, isLoading } = useTProfile();

  return useMemo(() => {
    // Check if user has active pro tier
    let isPro = user?.tier === "pro";

    // If expiration timestamp exists, verify it hasn't passed
    if (isPro && user?.subscription_expires_at) {
      const expiresDate = new Date(user.subscription_expires_at);
      if (!isNaN(expiresDate.getTime()) && expiresDate < new Date()) {
        isPro = false;
      }
    }

    const tier: PlanTier = isPro ? "pro" : "free";
    const plan = PLANS[tier];

    return {
      tier,
      isPro,
      plan,
      limits: plan.limits,
      features: plan.features,
      user: user || null,
      isLoading,
      isSessionWithinRetention: (dateStr: string | undefined) =>
        isDateWithinMonths(dateStr, plan.limits.historyRetentionMonths),
    };
  }, [user, isLoading]);
};

export default useTPlan;
