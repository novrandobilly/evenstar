import { MatchSubsessionContent } from "@/components/MatchSubsessionContent";
import { type MatchSubsession as MatchSubsessionData } from "@/data/sessions";

export const MatchSubsession = ({
  subsession,
}: {
  subsession: MatchSubsessionData;
}) => {
  return (
    <div className="rounded-lg border border-ivory-rule/80 border-l-4 border-l-club-green-mid p-2.5 bg-ivory/75">
      <MatchSubsessionContent subsession={subsession} />
    </div>
  );
};
