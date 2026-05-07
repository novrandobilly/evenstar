import { cn } from "@/lib/utils";
import { isMatchSubsession, type Subsession } from "@/data/sessions";
import { MatchSubsessionContent } from "@/components/MatchSubsessionContent";
import { TrainingSubsessionContent } from "@/components/TrainingSubsessionContent";

export function SubsessionCard({
  subsession,
  onRemove,
}: {
  subsession: Subsession;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-ivory-rule/80 border-l-4 p-3 bg-ivory/75 flex gap-2",
        isMatchSubsession(subsession)
          ? "border-l-club-green-mid"
          : "border-l-gold"
      )}
    >
      {isMatchSubsession(subsession) ? (
        <MatchSubsessionContent subsession={subsession} />
      ) : (
        <TrainingSubsessionContent subsession={subsession} />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove subsession"
        className="shrink-0 self-start text-club-green-muted/40 hover:text-loss transition-colors mt-0.5 text-sm"
      >
        ✕
      </button>
    </div>
  );
}
