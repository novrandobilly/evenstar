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
    <div className="rounded-2xl bg-panel border border-line px-3 py-3 flex gap-2">
      <div className="flex-1 min-w-0">
        {isMatchSubsession(subsession) ? (
          <MatchSubsessionContent subsession={subsession} />
        ) : (
          <TrainingSubsessionContent subsession={subsession} />
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove subsession"
        className="shrink-0 self-start -mt-0.5 -mr-0.5 w-11 h-11 rounded-full flex items-center justify-center text-ink-3 hover:text-loss hover:bg-loss/10 transition-colors"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
          <path strokeLinecap="round" d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>
    </div>
  );
}
