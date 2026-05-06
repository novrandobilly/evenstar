import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import { formatDate, formatSets, isMatchSubsession } from "@/data/sessions";
import { useSessions } from "@/hooks/useSessions";
import { getTrainingSubsessions } from "../tools/getTrainingSubsessions";
import { getMatchSubsessions } from "../tools/getMatchSubsessions";

export function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions } = useSessions();

  const session = useMemo(() => {
    if (!sessionId) return undefined;
    return sessions.find((s) => s.id === sessionId);
  }, [sessionId, sessions]);

  if (!session) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-club-green">
          <EvenStarText as="h1" variant="display">
            Session Not Found
          </EvenStarText>
          <EvenStarButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
          >
            Back
          </EvenStarButton>
        </div>
        <EvenStarText as="p" variant="body" tone="muted">
          The requested session does not exist.
        </EvenStarText>
      </div>
    );
  }

  const trainingCount = getTrainingSubsessions(session).length;
  const matchCount = getMatchSubsessions(session).length;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 pb-4 border-b-2 border-club-green">
        <div>
          <EvenStarText as="h1" variant="display">
            {session.title}
          </EvenStarText>
          <EvenStarText
            as="p"
            variant="label"
            tone="accent"
            caps
            className="mt-1.5"
          >
            {formatDate(session.date)} · {session.duration}
          </EvenStarText>
        </div>
        <EvenStarButton
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
        >
          Back
        </EvenStarButton>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <EvenStarText
          as="span"
          variant="label"
          tone="accent"
          caps
          className="font-medium"
        >
          Session Breakdown
        </EvenStarText>
        <EvenStarText as="span" variant="label" className="text-ivory-rule">
          ·
        </EvenStarText>
        <EvenStarText as="span" variant="label" tone="muted" caps>
          {trainingCount} training · {matchCount} match
        </EvenStarText>
      </div>

      <div className="space-y-2.5">
        {session.subsessions.map((subsession) => (
          <div
            key={subsession.id}
            className={cn(
              "rounded-lg border border-ivory-rule/80 border-l-4 p-3 bg-ivory/75",
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
                      "font-semibold rounded-sm px-2 py-0.5 border",
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
    </div>
  );
}
