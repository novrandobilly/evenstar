import { EvenStarText } from "@/components/EvenStarText";
import { type TrainingSubsession } from "@/data/sessions";

export const TrainingSubsessionContent = ({
  subsession,
}: {
  subsession: TrainingSubsession;
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 inline-flex items-center justify-center rounded-full w-8 h-8 bg-vine/10 text-vine border border-vine/25">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="w-3.5 h-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </span>
      <div className="flex-1 min-w-0">
        <EvenStarText
          as="p"
          variant="title"
          className="text-sm font-bold mb-1"
        >
          {subsession.title ?? "Training"}
        </EvenStarText>
        <div className="flex flex-wrap gap-1.5">
          {subsession.metrics.map((metric) => (
            <span
              key={`${subsession.id}-${metric.label}`}
              className="inline-flex items-center rounded-md bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-2"
            >
              {metric.label} {metric.percentage}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
