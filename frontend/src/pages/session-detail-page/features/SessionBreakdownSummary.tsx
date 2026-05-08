interface SessionBreakdownSummaryProps {
  trainingCount: number;
  matchCount: number;
}

export function SessionBreakdownSummary({
  trainingCount,
  matchCount,
}: SessionBreakdownSummaryProps) {
  return (
    <div className="mb-5 flex items-center gap-2">
      {trainingCount > 0 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-vine/10 border border-vine/25 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-vine">
          <span className="w-1.5 h-1.5 rounded-full bg-vine inline-block" />
          {trainingCount} {trainingCount === 1 ? "Training" : "Training"}
        </span>
      )}
      {matchCount > 0 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ace/10 border border-ace/25 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ace">
          <span className="w-1.5 h-1.5 rounded-full bg-ace inline-block" />
          {matchCount} {matchCount === 1 ? "Match" : "Matches"}
        </span>
      )}
    </div>
  );
}
