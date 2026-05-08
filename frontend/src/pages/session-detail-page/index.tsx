import { useNavigate } from "react-router-dom";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { getMatchSubsessions } from "@/tools/getMatchSubsessions";
import { getTrainingSubsessions } from "@/tools/getTrainingSubsessions";
import { useSessionById } from "./hooks/useSessionById";
import { SessionDetailHeader } from "./features/SessionDetailHeader";
import { SessionBreakdownSummary } from "./features/SessionBreakdownSummary";
import { SubsessionList } from "./features/SubsessionList";

export function SessionDetailPage() {
  const navigate = useNavigate();
  const session = useSessionById();

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-5xl">🎾</span>
        <div>
          <EvenStarText as="h1" variant="headline" className="mb-1.5">
            Session not found
          </EvenStarText>
          <EvenStarText as="p" variant="body" tone="muted">
            This session may have been removed.
          </EvenStarText>
        </div>
        <EvenStarButton variant="outline" size="md" onClick={() => navigate("/")}>
          ← Back to Sessions
        </EvenStarButton>
      </div>
    );
  }

  return (
    <div>
      <SessionDetailHeader
        title={session.title}
        date={session.date}
        duration={session.duration}
        onBack={() => navigate("/")}
      />
      <SessionBreakdownSummary
        trainingCount={getTrainingSubsessions(session).length}
        matchCount={getMatchSubsessions(session).length}
      />
      <SubsessionList subsessions={session.subsessions} />
    </div>
  );
}
