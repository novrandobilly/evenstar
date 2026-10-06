export type PlanTier = "free" | "pro";

export interface PlanLimits {
  /** Maximum number of players allowed in the saved roster pool (0 = locked) */
  maxRosterPlayers: number;
  /** Maximum number of active players allowed in a single session/tournament */
  maxSessionPlayers: number;
  /** Number of months of historical sessions viewable without blur (Infinity for unlimited) */
  historyRetentionMonths: number;
}

export interface PlanFeatures {
  /** Can save and manage recurring player roster pool */
  canSaveRoster: boolean;
  /** Can upload custom club logo (up to 1MB) for branding */
  canUploadClubLogo: boolean;
  /** Can view all-time session history unblurred */
  unlimitedHistory: boolean;
}

export interface PlanConfig {
  tier: PlanTier;
  name: string;
  badgeLabel: string;
  limits: PlanLimits;
  features: PlanFeatures;
}

export const PLANS: Record<PlanTier, PlanConfig> = {
  free: {
    tier: "free",
    name: "Free Version",
    badgeLabel: "Free Version",
    limits: {
      maxRosterPlayers: 0,
      maxSessionPlayers: 12,
      historyRetentionMonths: 3,
    },
    features: {
      canSaveRoster: false,
      canUploadClubLogo: false,
      unlimitedHistory: false,
    },
  },
  pro: {
    tier: "pro",
    name: "Pro Version",
    badgeLabel: "Pro Host",
    limits: {
      maxRosterPlayers: 100,
      maxSessionPlayers: 32,
      historyRetentionMonths: Infinity,
    },
    features: {
      canSaveRoster: true,
      canUploadClubLogo: true,
      unlimitedHistory: true,
    },
  },
};

/**
 * Checks whether an ISO date string falls within the retention window (e.g. 3 months).
 */
export const isDateWithinMonths = (
  dateStr: string | undefined,
  months: number
): boolean => {
  if (!dateStr) return true;
  if (!isFinite(months)) return true;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return true;

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return date >= cutoff;
};
