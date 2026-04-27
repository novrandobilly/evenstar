import { useState } from "react";
import { cn } from "@/lib/utils";

type SessionType = "training" | "match";
type Filter = "all" | SessionType;

interface Session {
  id: string;
  type: SessionType;
  title: string;
  date: string;
  duration: string;
  notes?: string;
  score?: string;
  result?: "win" | "loss";
  opponent?: string;
}

const sessions: Session[] = [
  {
    id: "1",
    type: "match",
    title: "Singles Match",
    date: "2025-04-24",
    duration: "1h 40m",
    opponent: "Marcus Hill",
    score: "6-3, 4-6, 7-5",
    result: "win",
  },
  {
    id: "2",
    type: "training",
    title: "Baseline Drills",
    date: "2025-04-22",
    duration: "1h 30m",
    notes: "Focused on cross-court backhands and topspin approach shots.",
  },
  {
    id: "3",
    type: "training",
    title: "Serve & Volley",
    date: "2025-04-20",
    duration: "1h 15m",
    notes:
      "First-serve percentage improved to 68%. Needs more work on kick serve placement.",
  },
  {
    id: "4",
    type: "match",
    title: "Club League Match",
    date: "2025-04-17",
    duration: "2h 05m",
    opponent: "Sara Kovac",
    score: "3-6, 5-7",
    result: "loss",
  },
  {
    id: "5",
    type: "training",
    title: "Fitness & Footwork",
    date: "2025-04-14",
    duration: "45m",
    notes:
      "Ladder drills, split-step timing, and short-court sprinting circuits.",
  },
  {
    id: "6",
    type: "match",
    title: "Doubles Match",
    date: "2025-04-10",
    duration: "1h 20m",
    opponent: "Chen / Park",
    score: "6-4, 6-2",
    result: "win",
  },
  {
    id: "7",
    type: "training",
    title: "Mental Toughness",
    date: "2025-04-07",
    duration: "1h",
    notes:
      "Practiced tiebreak situations and pressure points with coach. Strong finish.",
  },
];

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Training", value: "training" },
  { label: "Match", value: "match" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr)
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

function SessionCard({ session }: { session: Session }) {
  const isMatch = session.type === "match";
  const accentBar = isMatch
    ? session.result === "win"
      ? "bg-phosphor-green"
      : "bg-phosphor-red"
    : "bg-amber-glow";

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded active:scale-[0.995] transition-transform cursor-pointer overflow-hidden flex">
      {/* Status accent bar */}
      <div className={cn("w-0.75 shrink-0", accentBar)} />

      <div className="flex-1 min-w-0 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-[0.15em] text-amber-glow">
                {isMatch ? "MATCH" : "TRAIN"}
              </span>
              {session.result && (
                <span
                  className={cn(
                    "text-[10px] font-mono tracking-[0.15em]",
                    session.result === "win"
                      ? "text-phosphor-green"
                      : "text-phosphor-red",
                  )}
                >
                  · {session.result.toUpperCase()}
                </span>
              )}
            </div>
            <h3 className="font-medium text-terminal-fg text-sm leading-snug">
              {session.title}
            </h3>
            {session.opponent && (
              <p className="text-xs font-mono text-terminal-secondary mt-0.5">
                vs {session.opponent}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            {session.score && (
              <p
                className={cn(
                  "text-sm font-mono font-medium tabular-nums",
                  session.result === "win"
                    ? "text-phosphor-green"
                    : "text-phosphor-red",
                )}
              >
                {session.score}
              </p>
            )}
            <p className="text-xs font-mono text-terminal-muted mt-0.5">
              {session.duration}
            </p>
          </div>
        </div>

        {session.notes && (
          <p className="text-xs text-terminal-secondary mt-3 line-clamp-2 leading-relaxed border-t border-terminal-border pt-2.5">
            {session.notes}
          </p>
        )}

        <p className="text-[10px] font-mono tracking-widest text-terminal-muted mt-2.5">
          {formatDate(session.date)}
        </p>
      </div>
    </div>
  );
}

export function SessionPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = sessions.filter(
    (s) => filter === "all" || s.type === filter,
  );

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-terminal-muted mb-1">
            SESSION LOG
          </p>
          <h1 className="text-2xl font-semibold text-terminal-fg tracking-tight">
            Sessions
          </h1>
        </div>
        <button
          type="button"
          className="border border-amber-glow text-amber-glow font-mono text-xs tracking-widest px-4 py-2 hover:bg-amber-glow/10 active:bg-amber-glow/20 transition-colors"
        >
          + NEW
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 mb-5 border-b border-terminal-border">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-4 py-2 font-mono text-xs tracking-[0.15em] transition-colors border-b-2 -mb-px",
              filter === f.value
                ? "text-amber-glow border-amber-glow"
                : "text-terminal-muted border-transparent hover:text-terminal-secondary",
            )}
          >
            {f.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Session list */}
      <div className="flex flex-col gap-2">
        {filtered.length > 0 ? (
          filtered.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <p className="text-center font-mono text-terminal-muted text-xs py-12 tracking-widest">
            NO SESSIONS FOUND
          </p>
        )}
      </div>
    </div>
  );
}
