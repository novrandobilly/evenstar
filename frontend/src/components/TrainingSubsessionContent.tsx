import { EvenStarText } from "@/components/EvenStarText";
import { type TrainingSubsession } from "@/data/sessions";

export const TrainingSubsessionContent = ({
  subsession,
}: {
  subsession: TrainingSubsession;
}) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <EvenStarText
          as="p"
          variant="label"
          tone="accent"
          caps
          className="font-semibold"
        >
          {subsession.title ?? "Training"}
        </EvenStarText>
        <EvenStarText
          as="p"
          variant="meta"
          tone="muted"
          className="text-[11px]"
        >
          {subsession.metrics.length} metric(s)
        </EvenStarText>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {subsession.metrics.map((metric) => (
          <span
            key={`${subsession.id}-${metric.label}`}
            className="inline-flex items-center rounded-md border border-gold/35 bg-ivory px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] uppercase text-club-green"
          >
            {metric.label} {metric.percentage}%
          </span>
        ))}
      </div>
    </div>
  );
};
