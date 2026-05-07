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
    <div className="flex items-end justify-between mb-6 pb-4 border-b-2 border-club-green">
      <div className="flex-1 min-w-0 mr-4">
        <div className="relative group flex items-center gap-2">
          <input
            type="text"
            value={activeSession.title}
            onChange={(e) => updateSession({ title: e.target.value })}
            placeholder="Session title"
            className="font-sans text-3xl font-semibold leading-none tracking-tight text-club-green bg-transparent outline-none w-full placeholder:text-club-green/30 border-b-2 border-dashed border-club-green/20 pb-1 focus:border-gold transition-colors"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
            className="w-4 h-4 shrink-0 text-gold/50 group-focus-within:text-gold transition-colors"
          >
            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L2.628 10.898a.75.75 0 0 0-.196.352l-.832 3.327a.75.75 0 0 0 .921.921l3.327-.832a.75.75 0 0 0 .352-.196l8.385-8.385a1.75 1.75 0 0 0 0-2.475l-.097-.097ZM4.578 12.508l-1.917.479.479-1.917 7.5-7.5 1.438 1.438-7.5 7.5Z" />
          </svg>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-full border border-ivory-rule bg-white px-3 py-1.5 hover:border-gold transition-colors focus-within:border-gold cursor-pointer">
            <span className="text-xs leading-none">📅</span>
            <input
              type="date"
              value={activeSession.date}
              onChange={(e) => updateSession({ date: e.target.value })}
              className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gold bg-transparent border-none outline-none cursor-pointer"
            />
          </div>
          <span className="text-club-green-muted/40 font-bold">·</span>
          <div className="flex items-center gap-1.5 rounded-full border border-ivory-rule bg-white px-3 py-1.5 hover:border-gold transition-colors focus-within:border-gold cursor-pointer">
            <span className="text-xs leading-none">⏱</span>
            <input
              type="text"
              value={activeSession.duration}
              onChange={(e) => updateSession({ duration: e.target.value })}
              placeholder="e.g. 1h 30m"
              className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gold bg-transparent border-none outline-none w-20 placeholder:text-club-green-muted/40"
            />
          </div>
          <span className="text-club-green-muted/40 font-bold">·</span>
          <EvenStarText
            as="span"
            variant="label"
            tone="accent"
            caps
            className="text-gold/60"
          >
            in progress
          </EvenStarText>
        </div>
      </div>
      <EvenStarButton variant="outline" size="sm" onClick={onBack}>
        Back
      </EvenStarButton>
    </div>
  );
}
