import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EvenStarButton } from "@/components/EvenStarButton";
import { useSessions } from "@/hooks/useSessions";
import { formatDuration } from "@/tools/formatDuration";
import type { Session } from "@/data/sessions";
import { useActiveSession } from "./hooks/useActiveSession";
import { SessionHeader } from "./features/SessionHeader";
import { SubsessionCard } from "./features/SubsessionCard";
import { AddSubsessionControls } from "./features/AddSubsessionControls";

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

  useEffect(() => {
    if (!activeSession) {
      startSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeSession) return null;

  const handleFinish = () => {
    const session: Session = {
      id: activeSession.id,
      title: activeSession.title,
      date: activeSession.date,
      duration:
        activeSession.duration || formatDuration(activeSession.startedAt),
      subsessions: activeSession.subsessions,
    };
    addSession(session);
    clearSession();
    navigate("/");
  };

  return (
    <div>
      <SessionHeader
        activeSession={activeSession}
        updateSession={updateSession}
        onBack={() => navigate("/")}
      />

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

      <AddSubsessionControls
        sessionId={activeSession.id}
        onAdd={addSubsession}
      />

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
