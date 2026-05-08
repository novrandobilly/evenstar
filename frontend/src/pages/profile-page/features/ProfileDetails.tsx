import { EvenStarText } from "@/components/EvenStarText";

const details = [
  { label: "Club", value: "Riverside Tennis Club" },
  { label: "Playing Since", value: "2018" },
  { label: "Preferred Surface", value: "Hard Court" },
  { label: "Dominant Hand", value: "Right" },
  { label: "Coach", value: "D. Holloway" },
];

export function ProfileDetails() {
  return (
    <div>
      <EvenStarText as="p" variant="label" tone="muted" caps className="mb-3 text-[11px] font-bold tracking-[0.1em]">
        Details
      </EvenStarText>
      <dl>
        {details.map((item) => (
          <div
            key={item.label}
            className="flex justify-between gap-4 border-b border-line py-3 last:border-0"
          >
            <EvenStarText as="dt" variant="meta" tone="muted" className="text-[12px] uppercase tracking-[0.08em]">
              {item.label}
            </EvenStarText>
            <EvenStarText as="dd" variant="body" className="text-right">
              {item.value}
            </EvenStarText>
          </div>
        ))}
      </dl>
    </div>
  );
}
