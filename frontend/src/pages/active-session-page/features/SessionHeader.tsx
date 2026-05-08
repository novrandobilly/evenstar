import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import type { ActiveSessionDraft } from "../hooks/useActiveSession";

export function SessionHeader({
  activeSession,
  updateSession,
  onBack,
}: {
  activeSession: ActiveSessionDraft;
  updateSession: (
    fields: Partial<Pick<ActiveSessionDraft, "title" | "date" | "duration">>
  ) => void;
  onBack: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <label htmlFor="session-title" className="sr-only">Session title</label>
          <input
            id="session-title"
            type="text"
            value={activeSession.title}
            onChange={(e) => updateSession({ title: e.target.value })}
            placeholder="Session title"
            className="font-display italic text-[2.25rem] font-bold leading-none tracking-normal text-ink bg-transparent outline-none w-full placeholder:text-ink-3 border-b-2 border-dashed border-line pb-1 focus:border-ace transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          />
        </div>
        <EvenStarButton variant="ghost" size="sm" onClick={onBack} className="text-ink-3 hover:text-ace mt-1">
          ← Back
        </EvenStarButton>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 hover:border-edge transition-colors focus-within:border-ace">
          <span className="text-xs leading-none">📅</span>
          <label htmlFor="session-date" className="sr-only">Session date</label>
          <input
            id="session-date"
            type="date"
            value={activeSession.date}
            onChange={(e) => updateSession({ date: e.target.value })}
            className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-2 bg-transparent border-none outline-none cursor-pointer"
          />
        </div>
        <span className="text-ink-3 font-bold">·</span>
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 hover:border-edge transition-colors focus-within:border-ace">
          <span className="text-xs leading-none">⏱</span>
          <label htmlFor="session-duration" className="sr-only">Session duration</label>
          <input
            id="session-duration"
            type="text"
            value={activeSession.duration}
            onChange={(e) => updateSession({ duration: e.target.value })}
            placeholder="e.g. 1h 30m"
            className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-2 bg-transparent border-none outline-none w-20 placeholder:text-ink-3"
          />
        </div>
        <span className="text-ink-3 font-bold">·</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ace/15 px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-ace animate-pulse inline-block" />
          <EvenStarText as="span" variant="meta" tone="accent" className="text-[10px] font-bold uppercase tracking-[0.1em]">
            In progress
          </EvenStarText>
        </span>
      </div>
    </div>
  );
}
