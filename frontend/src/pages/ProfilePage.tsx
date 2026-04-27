import { cn } from "@/lib/utils";

const stats = [
  { label: "Sessions", value: "47" },
  { label: "Matches", value: "23" },
  { label: "Win Rate", value: "65%" },
  { label: "Hours", value: "84h" },
];

const recentForm: ("W" | "L")[] = ["W", "L", "W", "W", "L"];

const details = [
  { label: "Club", value: "Riverside Tennis Club" },
  { label: "Playing Since", value: "2018" },
  { label: "Preferred Surface", value: "Hard Court" },
  { label: "Dominant Hand", value: "Right" },
  { label: "Coach", value: "D. Holloway" },
];

export function ProfilePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-terminal-muted mb-1">
            ATHLETE RECORD
          </p>
          <h1 className="text-2xl font-semibold text-terminal-fg tracking-tight">
            Profile
          </h1>
        </div>
      </div>

      {/* Profile hero card */}
      <div className="bg-terminal-surface border border-terminal-border rounded mb-3">
        <div className="p-5 flex items-center gap-4">
          {/* Avatar — square, amber outline */}
          <div className="w-14 h-14 border-2 border-amber-glow flex items-center justify-center font-mono font-medium text-lg text-amber-glow shrink-0">
            AC
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-terminal-fg leading-tight">
              Alex Chen
            </h2>
            <p className="text-xs font-mono text-terminal-muted mt-0.5 tracking-[0.08em]">
              NTRP 4.0 · RIVERSIDE TC
            </p>
          </div>
          <button
            type="button"
            className="text-xs font-mono tracking-widest text-terminal-muted border border-terminal-border px-3 py-1.5 hover:text-terminal-secondary hover:border-terminal-secondary transition-colors"
          >
            EDIT
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 border-t border-terminal-border">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "py-4 text-center",
                i < stats.length - 1 ? "border-r border-terminal-border" : "",
              )}
            >
              <p className="text-xl font-mono font-medium text-terminal-fg tabular-nums">
                {stat.value}
              </p>
              <p className="text-[10px] font-mono tracking-[0.12em] text-terminal-muted mt-1">
                {stat.label.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Form */}
      <div className="bg-terminal-surface border border-terminal-border rounded mb-3 p-5">
        <p className="text-[10px] font-mono tracking-[0.2em] text-terminal-muted mb-3">
          RECENT FORM
        </p>
        <div className="flex items-center gap-2">
          {recentForm.map((result, i) => (
            <div
              key={i}
              className={cn(
                "w-9 h-9 flex items-center justify-center text-xs font-mono font-medium border",
                result === "W"
                  ? "border-phosphor-green text-phosphor-green bg-phosphor-green/10"
                  : "border-phosphor-red text-phosphor-red bg-phosphor-red/10",
              )}
            >
              {result}
            </div>
          ))}
          <span className="text-[10px] font-mono text-terminal-muted ml-2 tracking-widest">
            ← RECENT
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="bg-terminal-surface border border-terminal-border rounded p-5">
        <p className="text-[10px] font-mono tracking-[0.2em] text-terminal-muted mb-4">
          DETAILS
        </p>
        <dl className="space-y-0">
          {details.map((item) => (
            <div
              key={item.label}
              className="flex justify-between gap-4 border-b border-terminal-border py-3 last:border-0 last:pb-0"
            >
              <dt className="text-xs font-mono text-terminal-muted tracking-[0.08em]">
                {item.label.toUpperCase()}
              </dt>
              <dd className="text-xs font-mono text-terminal-fg text-right">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
