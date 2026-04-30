import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import {
  filters,
  formatDate,
  formatSets,
  getMatchSubsessions,
  getTrainingSubsessions,
  hasMatches,
  hasTraining,
  isMatchSubsession,
  summarizeRecord,
  type Filter,
  type Session,
} from "@/data/sessions";
import { useSessions } from "@/hooks/useSessions";

function SessionCard({ session }: { session: Session }) {
  const navigate = useNavigate();
  const trainingCount = getTrainingSubsessions(session).length;
  const matchCount = getMatchSubsessions(session).length;
  const mixed = trainingCount > 0 && matchCount > 0;
  const typeLabel = mixed
    ? "Training + Match"
    : trainingCount > 0
      ? "Training"
      : "Match";

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
        {session.subsessions.map((subsession) => (
          <div
            key={subsession.id}
            className={cn(
              "rounded-lg border border-ivory-rule/80 border-l-4 p-2.5 bg-ivory/75",
              isMatchSubsession(subsession)
                ? "border-l-club-green-mid"
                : "border-l-gold",
            )}
          >
            {isMatchSubsession(subsession) ? (
              <>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <EvenStarText
                    as="p"
                    variant="label"
                    tone="muted"
                    caps
                    className="truncate font-semibold"
                  >
                    {subsession.event ?? "Match"}
                  </EvenStarText>
                  <EvenStarText
                    as="p"
                    variant="label"
                    caps
                    className={cn(
                      "font-semibold rounded-sm px-2 py-0.5 border shrink-0",
                      subsession.result === "win"
                        ? "text-win border-win/25 bg-win/8"
                        : subsession.result === "loss"
                          ? "text-loss border-loss/25 bg-loss/8"
                          : "text-gold border-gold/25 bg-gold/8",
                    )}
                  >
                    {subsession.result}
                  </EvenStarText>
                </div>
                <EvenStarText
                  as="p"
                  variant="meta"
                  tone="muted"
                  className="text-[11px] mb-0.5"
                >
                  You
                  {subsession.event === "Doubles" &&
                  subsession.opponent.yourPartner
                    ? ` / ${subsession.opponent.yourPartner}`
                    : ""}{" "}
                  vs {subsession.opponent.opponentNames.join(" / ")}
                </EvenStarText>
                <EvenStarText
                  as="p"
                  variant="title"
                  tone="primary"
                  numeric
                  className="text-sm font-semibold tracking-wide"
                >
                  {formatSets(subsession.sets)}
                </EvenStarText>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <EvenStarText
                    as="p"
                    variant="label"
                    tone="accent"
                    caps
                    className="font-semibold"
                  >
                    {subsession.title ?? "Training"}
                  </EvenStarText>
                  <EvenStarText
                    as="p"
                    variant="meta"
                    tone="muted"
                    className="text-[11px]"
                  >
                    {subsession.metrics.length} metric(s)
                  </EvenStarText>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subsession.metrics.map((metric) => (
                    <span
                      key={`${subsession.id}-${metric.label}`}
                      className="inline-flex items-center rounded-md border border-gold/35 bg-ivory px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] uppercase text-club-green"
                    >
                      {metric.label} {metric.percentage}%
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </button>
  );
}

export function SessionPage() {
  const navigate = useNavigate();
  const { sessions } = useSessions();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = sessions.filter((session) => {
    if (filter === "all") return true;
    if (filter === "training") return hasTraining(session);
    return hasMatches(session);
  });

  return (
    <div>
      <div className="flex items-end justify-between mb-6 pb-4 border-b-2 border-club-green">
        <div>
          <EvenStarText as="h1" variant="display">
            Sessions
          </EvenStarText>
          <EvenStarText
            as="p"
            variant="label"
            tone="accent"
            caps
            className="mt-1.5"
          >
            {sessions.length} entries
          </EvenStarText>
        </div>
        <EvenStarButton
          variant="solid"
          size="md"
          onClick={() => navigate("/sessions/new")}
        >
          + Add
        </EvenStarButton>
      </div>

      <div className="flex gap-5 mb-5">
        {filters.map((f) => (
          <EvenStarButton
            key={f.value}
            onClick={() => setFilter(f.value)}
            variant="tab"
            size="sm"
            active={filter === f.value}
            className="px-0"
          >
            {f.label}
          </EvenStarButton>
        ))}
      </div>

      <div>
        {filtered.length > 0 ? (
          filtered.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <EvenStarText
            as="p"
            variant="label"
            tone="accent"
            caps
            className="text-center text-gold/60 py-12"
          >
            No entries found
          </EvenStarText>
        )}
      </div>
    </div>
  );
}
