import { cn } from "@/lib/utils";
import { EvenStarText } from "@/components/EvenStarText";

const recentForm: ("W" | "L")[] = ["W", "L", "W", "W", "L"];

export function ProfileRecentForm() {
  return (
    <div>
      <EvenStarText as="p" variant="label" tone="muted" caps className="mb-3 text-[11px] font-bold tracking-[0.1em]">
        Recent Form
      </EvenStarText>
      <div className="flex items-center gap-2">
        {recentForm.map((result, i) => (
          <div
            key={i}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border",
              result === "W"
                ? "border-win/25 text-win bg-win/8"
                : "border-loss/25 text-loss bg-loss/8",
            )}
          >
            {result}
          </div>
        ))}
        <EvenStarText as="span" variant="meta" tone="faint" className="ml-2 text-[10px] uppercase tracking-[0.08em]">
          most recent →
        </EvenStarText>
      </div>
    </div>
  );
}
