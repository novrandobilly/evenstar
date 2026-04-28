import { cn } from "@/lib/utils";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";

const stats = [
  { label: "Sessions", value: "47" },
  { label: "Matches", value: "23" },
  { label: "Win Rate", value: "65%" },
  { label: "Hours", value: "84h" },
];

const recentForm: ("W" | "L")[] = ["W", "L", "W", "W", "L"];

const details = [
  { label: "Club", value: "Riverside Tennis Club" },
  { label: "Playing Since", value: "2018" },
  { label: "Preferred Surface", value: "Hard Court" },
  { label: "Dominant Hand", value: "Right" },
  { label: "Coach", value: "D. Holloway" },
];

export function ProfilePage() {
  return (
    <div>
      {/* Page header */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b-2 border-club-green">
        <EvenStarText as="h1" variant="display">
          Profile
        </EvenStarText>
        <EvenStarText
          as="p"
          variant="label"
          tone="accent"
          caps
          className="mb-0.5"
        >
          Member Record
        </EvenStarText>
      </div>

      {/* Profile hero */}
      <div className="mb-5">
        <div className="flex items-center gap-4 mb-5">
          {/* Monogram in a circle — club crest feel */}
          <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center shrink-0 bg-club-green-faint">
            <EvenStarText as="span" variant="headline" className="leading-none">
              AC
            </EvenStarText>
          </div>
          <div className="flex-1 min-w-0">
            <EvenStarText as="h2" variant="headline">
              Alex Chen
            </EvenStarText>
            <EvenStarText
              as="p"
              variant="label"
              tone="accent"
              caps
              className="mt-0.5 tracking-[0.2em]"
            >
              NTRP 4.0 · Riverside TC
            </EvenStarText>
          </div>
          <EvenStarButton variant="outline" size="sm">
            Edit
          </EvenStarButton>
        </div>

        {/* Stats — ruled columns */}
        <div className="grid grid-cols-4 border-t border-b border-ivory-rule">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "py-4 text-center",
                i < stats.length - 1 ? "border-r border-ivory-rule" : "",
              )}
            >
              <EvenStarText
                as="p"
                variant="headline"
                numeric
                className="text-2xl"
              >
                {stat.value}
              </EvenStarText>
              <EvenStarText
                as="p"
                variant="label"
                tone="accent"
                caps
                className="text-[9px] mt-1"
              >
                {stat.label}
              </EvenStarText>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Form */}
      <div className="mb-5">
        <EvenStarText
          as="p"
          variant="label"
          tone="accent"
          caps
          className="mb-3"
        >
          Recent Form
        </EvenStarText>
        <div className="flex items-center gap-2">
          {recentForm.map((result, i) => (
            <div
              key={i}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium border",
                result === "W"
                  ? "border-win text-win bg-club-green-faint"
                  : "border-loss text-loss bg-ivory-dark",
              )}
            >
              {result}
            </div>
          ))}
          <EvenStarText
            as="span"
            variant="label"
            tone="accent"
            caps
            className="ml-1 text-gold/60 tracking-widest"
          >
            ← recent
          </EvenStarText>
        </div>
      </div>

      {/* Details — ledger rows */}
      <div>
        <EvenStarText
          as="p"
          variant="label"
          tone="accent"
          caps
          className="mb-3"
        >
          Details
        </EvenStarText>
        <dl>
          {details.map((item) => (
            <div
              key={item.label}
              className="flex justify-between gap-4 border-b border-ivory-rule py-3 last:border-0"
            >
              <EvenStarText
                as="dt"
                variant="meta"
                tone="muted"
                caps
                className="tracking-widest"
              >
                {item.label}
              </EvenStarText>
              <EvenStarText as="dd" variant="body" className="text-right">
                {item.value}
              </EvenStarText>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
