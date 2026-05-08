import { TrainingSubsessionContent } from "@/components/TrainingSubsessionContent";
import { type TrainingSubsession as TrainingSubsessionData } from "@/data/sessions";

export const TrainingSubsession = ({
  subsession,
}: {
  subsession: TrainingSubsessionData;
}) => {
  return (
    <div className="rounded-xl bg-surface border border-line px-3 py-2">
      <TrainingSubsessionContent subsession={subsession} />
    </div>
  );
};
