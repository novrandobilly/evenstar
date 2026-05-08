import { useNavigate } from "react-router-dom";
import { EvenStarText } from "@/components/EvenStarText";
import {
  formatDate,
  isMatchSubsession,
  summarizeRecord,
  type Session,
} from "@/data/sessions";
import { getMatchSubsessions } from "../../../tools/getMatchSubsessions";
import { MatchSubsession } from "./MatchSubsession";
import { TrainingSubsession } from "./TrainingSubsession";
import { useMatchAndTrainingCount } from "../hooks/useMatchAndTrainingCount";

export const SessionCard = ({ session }: { session: Session }) => {
  const navigate = useNavigate();
  const { matchCount, typeLabel } = useMatchAndTrainingCount(session);
  const dateParts = formatDate(session.date).split(" ");
  const day = dateParts[0];
  const monthYear = dateParts.slice(1).join(" ");

  return (
    <button
      type="button"
      onClick={() => navigate(`/sessions/${session.id}`)}
      className="group w-full cursor-pointer rounded-2xl border border-line bg-raised text-left transition-all hover:border-ace/40 hover:shadow-sm"
    >
      <div className="flex gap-0">
        {/* Date stamp column */}
        <div className="shrink-0 flex flex-col items-center justify-start pt-4 pb-4 px-4 border-r border-line mr-0">
          <span className="font-display italic text-2xl font-bold text-ace leading-none tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
            {day}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-3 mt-0.5 whitespace-nowrap">
            {monthYear}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 px-4 py-4">
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <EvenStarText
              as="h3"
              variant="headline"
              className="leading-snug"
            >
              {session.title}
            </EvenStarText>
            <div className="flex items-center gap-1.5 shrink-0">
              <EvenStarText as="span" variant="meta" tone="muted" numeric className="text-[11px]">
                {session.duration}
              </EvenStarText>
              <svg
                className="w-3.5 h-3.5 text-ink-3 group-hover:text-ace transition-colors shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-ace/10 text-ace px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] border border-ace/20">
              {typeLabel}
            </span>
            {matchCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-raised px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-ink-2 border border-line">
                {summarizeRecord(getMatchSubsessions(session))}
              </span>
            )}
          </div>

          {/* Subsessions */}
          {session.subsessions.length > 0 && (
            <div className="space-y-2 border-t border-line pt-3 mt-3">
              {session.subsessions.map((subsession) =>
                isMatchSubsession(subsession) ? (
                  <MatchSubsession key={subsession.id} subsession={subsession} />
                ) : (
                  <TrainingSubsession key={subsession.id} subsession={subsession} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
