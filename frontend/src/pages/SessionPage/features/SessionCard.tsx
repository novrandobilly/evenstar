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

  return (
    <button
      type="button"
      onClick={() => navigate(`/sessions/${session.id}`)}
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-ivory-rule/90 bg-linear-to-b from-ivory to-ivory-dark/40 px-4 py-3 mt-3 first:mt-0 text-left shadow-[0_1px_0_rgba(29,61,42,0.08)] transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(29,61,42,0.08)]"
    >
      {/* Header Row: Type label, Duration/Date/Chevron */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <EvenStarText
          as="span"
          variant="label"
          tone="accent"
          caps
          className="font-semibold rounded-sm border border-gold/35 bg-gold-faint/60 px-2 py-0.5 shrink-0"
        >
          {typeLabel}
        </EvenStarText>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <EvenStarText
              as="p"
              variant="meta"
              tone="muted"
              numeric
              className="text-[11px]"
            >
              {session.duration}
            </EvenStarText>
            <EvenStarText
              as="p"
              variant="label"
              tone="accent"
              caps
              className="text-[10px] text-gold/75 tracking-widest"
            >
              {formatDate(session.date)}
            </EvenStarText>
          </div>
          {/* Chevron indicator */}
          <svg
            className="w-4 h-4 text-club-green/60 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Session Title */}
      <EvenStarText
        as="h3"
        variant="title"
        className="text-[13px] leading-snug font-semibold text-club-green/85 mb-3"
      >
        {session.title}
      </EvenStarText>
      {matchCount > 0 && (
        <div className="mb-3">
          <EvenStarText
            as="span"
            variant="label"
            tone="muted"
            caps
            className="font-semibold rounded-sm border border-ivory-rule bg-ivory/70 px-2 py-0.5 inline-block"
          >
            {summarizeRecord(getMatchSubsessions(session))}
          </EvenStarText>
        </div>
      )}

      {/* Subsessions: Full width */}
      <div className="space-y-2">
        {session.subsessions.map((subsession) =>
          isMatchSubsession(subsession) ? (
            <MatchSubsession key={subsession.id} subsession={subsession} />
          ) : (
            <TrainingSubsession key={subsession.id} subsession={subsession} />
          ),
        )}
      </div>
    </button>
  );
};
