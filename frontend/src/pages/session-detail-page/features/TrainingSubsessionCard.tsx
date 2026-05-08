import { EvenStarText } from "@/components/EvenStarText";
import type { TrainingSubsession } from "@/data/sessions";

interface TrainingSubsessionCardProps {
  subsession: TrainingSubsession;
}

export function TrainingSubsessionCard({
  subsession,
}: TrainingSubsessionCardProps) {
  return (
    <div className="rounded-2xl bg-raised border border-line p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-vine/10 text-vine border border-vine/25 shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </span>
        <EvenStarText as="p" variant="headline" className="font-bold">
          {subsession.title ?? "Training"}
        </EvenStarText>
      </div>
      <div className="flex flex-wrap gap-2">
        {subsession.metrics.map((metric) => (
          <span
            key={`${subsession.id}-${metric.label}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-2"
          >
            {metric.label}
            <span className="text-ace font-bold">{metric.percentage}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
