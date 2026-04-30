// frontend/src/pages/ActiveSessionPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { TrainingForm } from "@/components/TrainingForm";
import { MatchForm } from "@/components/MatchForm";
import { cn } from "@/lib/utils";
import { useActiveSession } from "@/hooks/useActiveSession";
import { useSessions } from "@/hooks/useSessions";
import { isMatchSubsession, formatSets, type Subsession } from "@/data/sessions";
import type { Session } from "@/data/sessions";

function formatDuration(startedAt: number): string {
  if (!Number.isFinite(startedAt) || startedAt <= 0) return "0m";
  const ms = Date.now() - startedAt;
  if (ms < 0) return "0m";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function SubsessionCard({
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
      <div className="flex-1 min-w-0">
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
                      : "text-gold border-gold/25 bg-gold/8"
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

type ActiveForm = "training" | "match" | null;

export function ActiveSessionPage() {
  const navigate = useNavigate();
  const {
    activeSession,
    startSession,
    updateSession,
    addSubsession,
    removeSubsession,
    clearSession,
  } = useActiveSession();
  const { addSession } = useSessions();
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  // Start a new session on mount only if none is in progress
  useEffect(() => {
    if (!activeSession) {
      startSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render nothing while the session initialises (one tick at most)
  if (!activeSession) return null;

  const toggleForm = (type: "training" | "match") => {
    setActiveForm((prev) => (prev === type ? null : type));
  };

  const handleFinish = () => {
    const session: Session = {
      id: activeSession.id,
      title: activeSession.title,
      date: activeSession.date,
      duration: formatDuration(activeSession.startedAt),
      subsessions: activeSession.subsessions,
    };
    addSession(session);
    clearSession();
    navigate("/");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b-2 border-club-green">
        <div className="flex-1 min-w-0 mr-4">
          <input
            type="text"
            value={activeSession.title}
            onChange={(e) => updateSession({ title: e.target.value })}
            placeholder="Session title"
            className="font-sans text-3xl font-semibold leading-none tracking-tight text-club-green bg-transparent border-none outline-none w-full placeholder:text-club-green/30"
          />
          <div className="flex items-center gap-2 mt-1.5">
            <input
              type="date"
              value={activeSession.date}
              onChange={(e) => updateSession({ date: e.target.value })}
              className="text-[10px] tracking-[0.15em] uppercase text-gold bg-transparent border-none outline-none cursor-pointer"
            />
            <EvenStarText as="span" variant="label" tone="accent" caps className="text-gold/60">
              · in progress
            </EvenStarText>
          </div>
        </div>
        <EvenStarButton variant="outline" size="sm" onClick={() => navigate("/")}>
          Back
        </EvenStarButton>
      </div>

      {/* Subsession list */}
      {activeSession.subsessions.length > 0 && (
        <div className="space-y-2.5 mb-5">
          {activeSession.subsessions.map((subsession) => (
            <SubsessionCard
              key={subsession.id}
              subsession={subsession}
              onRemove={() => removeSubsession(subsession.id)}
            />
          ))}
        </div>
      )}

      {/* Add buttons */}
      <div className="flex gap-3 mb-4">
        <EvenStarButton
          variant={activeForm === "training" ? "solid" : "outline"}
          size="md"
          onClick={() => toggleForm("training")}
          className="flex-1"
        >
          + Training
        </EvenStarButton>
        <EvenStarButton
          variant={activeForm === "match" ? "solid" : "outline"}
          size="md"
          onClick={() => toggleForm("match")}
          className="flex-1"
        >
          + Match
        </EvenStarButton>
      </div>

      {/* Inline form */}
      {activeForm === "training" && (
        <TrainingForm
          sessionId={activeSession.id}
          onAdd={(subsession) => {
            addSubsession(subsession);
            setActiveForm(null);
          }}
          onCancel={() => setActiveForm(null)}
        />
      )}
      {activeForm === "match" && (
        <MatchForm
          sessionId={activeSession.id}
          onAdd={(subsession) => {
            addSubsession(subsession);
            setActiveForm(null);
          }}
          onCancel={() => setActiveForm(null)}
        />
      )}

      {/* Finish session */}
      <div className="mt-6">
        <EvenStarButton
          variant="solid"
          size="md"
          fullWidth
          disabled={activeSession.subsessions.length === 0}
          onClick={handleFinish}
        >
          ✓ Finish Session
        </EvenStarButton>
      </div>
    </div>
  );
}
