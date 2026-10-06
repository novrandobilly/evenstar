import React from "react";
import type { MatchItem } from "../../../types/session";

interface LiveMatchesViewProps {
  matches: MatchItem[];
  lastUpdatedMatchId: string | null;
}

export const LiveMatchesView: React.FC<LiveMatchesViewProps> = ({
  matches,
  lastUpdatedMatchId,
}) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p className="text-sm font-bold">No matches scheduled yet.</p>
      </div>
    );
  }

  // Find index of the first uncompleted match (currently on court / next up)
  const activeMatchIndex = matches.findIndex((m) => !m.isCompleted);

  return (
    <div className="pb-4 space-y-2.5">
      {matches.map((match, index) => {
        const isCompleted = match.isCompleted;
        const isActive = index === activeMatchIndex;
        const isJustUpdated = lastUpdatedMatchId === match.id;

        const scoreANum = parseInt(match.scoreA, 10);
        const scoreBNum = parseInt(match.scoreB, 10);
        const hasScores = !isNaN(scoreANum) && !isNaN(scoreBNum);
        const teamAWon = isCompleted && hasScores && scoreANum > scoreBNum;
        const teamBWon = isCompleted && hasScores && scoreBNum > scoreANum;

        return (
          <div
            key={match.id}
            className={`relative rounded-3xl border p-3.5 transition-all duration-300 ${
              isJustUpdated
                ? "ring-2 ring-volt-400 bg-volt-50 shadow-md scale-[1.01]"
                : isCompleted
                  ? "border-court-500/25 bg-court-50/40 shadow-2xs"
                  : isActive
                    ? "border-court-600 bg-white shadow-sm ring-1 ring-court-500/30"
                    : "border-chalk-300 bg-white shadow-2xs"
            }`}
          >
            {/* Live Update Pulse Badge */}
            {isJustUpdated && (
              <div className="absolute -top-2.5 right-4 z-10 flex items-center gap-1 rounded-full bg-court-850 px-2.5 py-0.5 text-[10px] font-black text-volt-300 shadow-md border border-court-700/50 animate-bounce">
                <span>⚡</span>
                <span>Just Updated!</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              {/* Match Number / Status Badge */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-black self-start mt-0.5 ${
                  isCompleted
                    ? "bg-court-850 text-volt-300 shadow-2xs"
                    : isActive
                      ? "bg-court-700 text-white shadow-xs animate-pulse"
                      : "bg-chalk-100 text-slate-700 border border-chalk-300"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              {/* Match Details & Score Stack */}
              <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                {/* Active Match Status Tag */}
                {isActive && !isCompleted && (
                  <div className="flex items-center gap-1.5 -mb-1">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-court-600 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-court-700">
                      Court Action · Playing Now
                    </span>
                  </div>
                )}

                {/* Team A */}
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`text-xs truncate ${
                        teamAWon
                          ? "font-black text-slate-900"
                          : isCompleted
                            ? "font-bold text-slate-600"
                            : "font-black text-slate-900"
                      }`}
                      title={match.teamA.map((p) => p.name).join(" & ")}
                    >
                      {match.teamA.map((p) => p.name).join(" & ")}
                    </span>
                    {teamAWon && (
                      <span className="text-[10px] text-amber-500 font-bold shrink-0">
                        👑
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-10 h-8 shrink-0 flex items-center justify-center font-mono text-sm font-black rounded-xl border ${
                      teamAWon
                        ? "bg-court-850 text-volt-300 border-court-700 shadow-2xs"
                        : match.scoreA
                          ? "bg-chalk-100 text-slate-900 border-chalk-300"
                          : "bg-chalk-50 text-slate-400 border-dashed border-chalk-300"
                    }`}
                  >
                    {match.scoreA !== "" ? match.scoreA : "-"}
                  </div>
                </div>

                {/* Team B */}
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`text-xs truncate ${
                        teamBWon
                          ? "font-black text-slate-900"
                          : isCompleted
                            ? "font-bold text-slate-600"
                            : "font-black text-slate-900"
                      }`}
                      title={match.teamB.map((p) => p.name).join(" & ")}
                    >
                      {match.teamB.map((p) => p.name).join(" & ")}
                    </span>
                    {teamBWon && (
                      <span className="text-[10px] text-amber-500 font-bold shrink-0">
                        👑
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-10 h-8 shrink-0 flex items-center justify-center font-mono text-sm font-black rounded-xl border ${
                      teamBWon
                        ? "bg-court-850 text-volt-300 border-court-700 shadow-2xs"
                        : match.scoreB
                          ? "bg-chalk-100 text-slate-900 border-chalk-300"
                          : "bg-chalk-50 text-slate-400 border-dashed border-chalk-300"
                    }`}
                  >
                    {match.scoreB !== "" ? match.scoreB : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveMatchesView;
