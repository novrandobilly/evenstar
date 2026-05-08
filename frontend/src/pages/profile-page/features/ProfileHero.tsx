import { EvenStarButton } from "@/components/EvenStarButton";

export function ProfileHero() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl border-2 border-white/40 flex items-center justify-center shrink-0 bg-white/20">
        <span
          className="font-display italic text-xl font-bold leading-none"
          style={{ fontFamily: "var(--font-display)", color: "oklch(99.5% 0.005 75)" }}
        >
          AC
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h2
          className="font-display italic text-xl font-bold mb-1 leading-tight"
          style={{ fontFamily: "var(--font-display)", color: "oklch(99.5% 0.005 75)" }}
        >
          Alex Chen
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center rounded-full bg-white/20 border border-white/30 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]">
            NTRP 4.0
          </span>
          <span className="text-[11px]" style={{ color: "oklch(99.5% 0.005 75)" }}>
            Riverside TC
          </span>
        </div>
      </div>
      <EvenStarButton
        variant="outline"
        size="sm"
        className="border-white/40 text-white hover:bg-white/15 hover:text-white hover:border-white/60"
      >
        Edit
      </EvenStarButton>
    </div>
  );
}
