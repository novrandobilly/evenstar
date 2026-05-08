import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import { formatSets, type MatchSubsession } from "@/data/sessions";

interface MatchSubsessionCardProps {
  subsession: MatchSubsession;
}

export function MatchSubsessionCard({ subsession }: MatchSubsessionCardProps) {
  const opponentLine =
    subsession.event === "Doubles" && subsession.opponent.yourPartner
      ? `You / ${subsession.opponent.yourPartner} vs ${subsession.opponent.opponentNames.join(" / ")}`
      : `You vs ${subsession.opponent.opponentNames.join(" / ")}`;

  const resultConfig = {
    win:  { label: "W", bg: "bg-win/10 border-win/25 text-win" },
    loss: { label: "L", bg: "bg-loss/10 border-loss/25 text-loss" },
    draw: { label: "D", bg: "bg-draw/10 border-draw/25 text-draw" },
  }[subsession.result];

  return (
    <div className="rounded-2xl bg-raised border border-line p-4">
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full w-10 h-10 text-sm font-bold border shrink-0",
            resultConfig.bg,
          )}
        >
          {resultConfig.label}
        </span>
        <div className="flex-1 min-w-0">
          <EvenStarText as="p" variant="label" caps className="text-[10px] text-ink-3 tracking-[0.1em] mb-0.5">
            {subsession.event ?? "Match"}
          </EvenStarText>
          <EvenStarText as="p" variant="meta" tone="muted" className="text-[11px] truncate">
            {opponentLine}
          </EvenStarText>
        </div>
        <span
          className="font-mono text-2xl font-medium tabular-nums text-ink shrink-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {formatSets(subsession.sets)}
        </span>
      </div>
    </div>
  );
}
