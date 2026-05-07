import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import { formatSets, type MatchSubsession } from "@/data/sessions";

export const MatchSubsessionContent = ({
  subsession,
}: {
  subsession: MatchSubsession;
}) => {
  return (
    <div className="flex-1 min-w-0">
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
        {subsession.event === "Doubles" && subsession.opponent.yourPartner
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
    </div>
  );
};
