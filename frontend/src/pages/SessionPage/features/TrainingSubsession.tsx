import { TrainingSubsessionContent } from "@/components/TrainingSubsessionContent";
import { type TrainingSubsession as TrainingSubsessionData } from "@/data/sessions";

export const TrainingSubsession = ({
  subsession,
}: {
  subsession: TrainingSubsessionData;
}) => {
  return (
    <div className="rounded-lg border border-ivory-rule/80 border-l-4 border-l-gold p-2.5 bg-ivory/75">
      <TrainingSubsessionContent subsession={subsession} />
    </div>
  );
};
