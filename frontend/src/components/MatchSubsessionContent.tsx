import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import { formatSets, type MatchSubsession } from "@/data/sessions";

export const MatchSubsessionContent = ({
  subsession,
}: {
  subsession: MatchSubsession;
}) => {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "shrink-0 inline-flex items-center justify-center rounded-full w-8 h-8 text-[11px] font-bold border",
          subsession.result === "win"
            ? "bg-win/15 text-win border-win/30"
            : subsession.result === "loss"
              ? "bg-loss/15 text-loss border-loss/30"
              : "bg-draw/15 text-draw border-draw/30",
        )}
      >
        {subsession.result === "win" ? "W" : subsession.result === "loss" ? "L" : "D"}
      </span>
      <div className="flex-1 min-w-0">
        <EvenStarText
          as="p"
          variant="meta"
          tone="muted"
          className="text-[11px] truncate mb-0.5"
        >
          {subsession.event} · vs {subsession.opponent.opponentNames.join(" / ")}
          {subsession.event === "Doubles" && subsession.opponent.yourPartner
            ? ` (w/ ${subsession.opponent.yourPartner})`
            : ""}
        </EvenStarText>
        <EvenStarText
          as="p"
          variant="title"
          numeric
          className="text-sm font-bold font-mono"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {formatSets(subsession.sets)}
        </EvenStarText>
      </div>
    </div>
  );
};
