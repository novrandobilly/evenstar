import { isMatchSubsession, type Subsession } from "@/data/sessions";
import { MatchSubsessionCard } from "./MatchSubsessionCard";
import { TrainingSubsessionCard } from "./TrainingSubsessionCard";

interface SubsessionListProps {
  subsessions: Subsession[];
}

export function SubsessionList({ subsessions }: SubsessionListProps) {
  return (
    <div className="space-y-2.5">
      {subsessions.map((subsession) =>
        isMatchSubsession(subsession) ? (
          <MatchSubsessionCard key={subsession.id} subsession={subsession} />
        ) : (
          <TrainingSubsessionCard key={subsession.id} subsession={subsession} />
        ),
      )}
    </div>
  );
}
