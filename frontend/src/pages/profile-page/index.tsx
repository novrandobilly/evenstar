import { EvenStarText } from "@/components/EvenStarText";
import { ProfileHero } from "./features/ProfileHero";
import { ProfileStats } from "./features/ProfileStats";
import { ProfileRecentForm } from "./features/ProfileRecentForm";
import { ProfileDetails } from "./features/ProfileDetails";

export function ProfilePage() {
  return (
    <div>
      <EvenStarText as="h1" variant="display" className="mb-6">
        Profile
      </EvenStarText>

      {/* Hero + Stats in a warm panel */}
      <div className="rounded-3xl border border-line overflow-hidden mb-4">
        <div
          className="p-5 pb-4"
          style={{ background: "var(--gradient-hero)" }}
        >
          <ProfileHero />
        </div>
        <div className="border-t border-white/20 p-5" style={{ background: "oklch(95.5% 0.016 72)" }}>
          <ProfileStats />
        </div>
      </div>

      {/* Recent form */}
      <div className="rounded-3xl bg-raised border border-line p-5 mb-4">
        <ProfileRecentForm />
      </div>

      {/* Details */}
      <div className="rounded-3xl bg-raised border border-line p-5">
        <ProfileDetails />
      </div>
    </div>
  );
}
