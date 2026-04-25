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
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function SessionCard({ session }: { session: Session }) {
  const isMatch = session.type === "match";
  const accentColor = isMatch
    ? session.result === "win"
      ? "bg-emerald-400"
      : "bg-rose-400"
    : "bg-lime-400";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-3 active:scale-[0.99] transition-transform cursor-pointer">
      {/* Colored left accent bar */}
      <div
        className={cn(
          "mt-0.5 w-1.5 self-stretch rounded-full shrink-0",
          accentColor,
        )}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className={cn(
                "inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5",
                isMatch
                  ? "bg-orange-50 text-orange-600"
                  : "bg-lime-50 text-lime-700",
              )}
            >
              {isMatch ? "Match" : "Training"}
            </span>
            <h3 className="font-semibold text-slate-900 text-sm leading-snug">
              {session.title}
            </h3>
            {session.opponent && (
              <p className="text-xs text-slate-500 mt-0.5">
                vs. {session.opponent}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            {session.score && (
              <p
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  session.result === "win"
                    ? "text-emerald-600"
                    : "text-rose-500",
                )}
              >
                {session.score}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-0.5">{session.duration}</p>
          </div>
        </div>

        {session.notes && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {session.notes}
          </p>
        )}

        <p className="text-xs text-slate-400 mt-2">
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
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sessions
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {sessions.length} sessions logged
          </p>
        </div>
        <button
          type="button"
          className="bg-lime-400 hover:bg-lime-500 active:bg-lime-600 text-slate-900 font-semibold text-sm px-4 py-2 rounded-full transition-colors"
        >
          + New
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Session list */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <p className="text-center text-slate-400 text-sm py-12">
            No sessions found.
          </p>
        )}
      </div>
    </div>
  );
}
