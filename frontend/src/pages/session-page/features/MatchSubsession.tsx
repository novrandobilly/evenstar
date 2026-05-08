import { MatchSubsessionContent } from "@/components/MatchSubsessionContent";
import { type MatchSubsession as MatchSubsessionData } from "@/data/sessions";

export const MatchSubsession = ({
  subsession,
}: {
  subsession: MatchSubsessionData;
}) => {
  return (
    <div className="rounded-xl bg-surface border border-line px-3 py-2">
      <MatchSubsessionContent subsession={subsession} />
    </div>
  );
};
