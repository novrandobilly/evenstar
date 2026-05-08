import { EvenStarText } from "@/components/EvenStarText";

const stats = [
  { label: "Sessions", value: "47" },
  { label: "Matches", value: "23" },
  { label: "Win Rate", value: "65%" },
  { label: "Hours", value: "84h" },
];

export function ProfileStats() {
  return (
    <div className="grid grid-cols-4 gap-0 divide-x divide-line">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="px-2 py-1 text-center first:pl-0 last:pr-0"
        >
          <span
            className="font-mono block text-2xl font-medium text-ink leading-none tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {stat.value}
          </span>
          <EvenStarText as="p" variant="meta" tone="muted" className="text-[10px] mt-1 uppercase tracking-[0.08em]">
            {stat.label}
          </EvenStarText>
        </div>
      ))}
    </div>
  );
}
