import React from "react";
import type { PlayerStats } from "../../../utils/standings";
import { StandingsTable } from "../../in-session/features/RunningSession/features/StandingsTable";

interface LiveStandingsViewProps {
  standings: PlayerStats[];
  isCompleted: boolean;
  completedCount: number;
}

export const LiveStandingsView: React.FC<LiveStandingsViewProps> = ({
  standings,
  isCompleted,
  completedCount,
}) => {
  if (!standings || standings.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p className="text-sm font-bold">No player standings available yet.</p>
      </div>
    );
  }

  const firstPlace = standings[0];
  const secondPlace = standings[1];
  const thirdPlace = standings[2];
  const hasScoresRecorded = standings.some((s) => s.gamesWon > 0 || s.matchWins > 0);

  return (
    <div className="space-y-4 pb-4">
      {/* Top 3 Podium (Shown when session is completed or games have been played) */}
      {hasScoresRecorded && firstPlace && (
        <div className="rounded-3xl border border-[#ded7c4] bg-white p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-court-800 block text-center mb-2">
            {isCompleted ? "Tournament Champions" : "Current Leaders"}
          </span>
          <div className="grid grid-cols-3 gap-2 items-end pt-2 pb-1">
            {/* 2nd Place (Left) */}
            <div className="flex flex-col items-center text-center">
              {secondPlace ? (
                <>
                  <span className="text-2xl mb-1">🥈</span>
                  <span className="text-xs font-black text-slate-900 truncate w-full px-1">
                    {secondPlace.player.name}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-500">
                    {secondPlace.diff > 0 ? `+${secondPlace.diff}` : secondPlace.diff}
                  </span>
                  <div className="w-full h-12 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl mt-2 flex items-center justify-center font-mono font-black text-slate-500 text-sm border-t-2 border-slate-300">
                    2
                  </div>
                </>
              ) : (
                <div className="w-full h-12 bg-chalk-100 rounded-t-2xl mt-2" />
              )}
            </div>

            {/* 1st Place (Center - Elevated) */}
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl mb-1 animate-bounce">🥇</span>
              <span className="text-xs font-black text-slate-900 truncate w-full px-1">
                {firstPlace.player.name}
              </span>
              <span className="font-mono text-xs font-black text-court-700">
                {firstPlace.diff > 0 ? `+${firstPlace.diff}` : firstPlace.diff}
              </span>
              <div className="w-full h-18 bg-gradient-to-t from-amber-300/40 via-amber-200/30 to-amber-100/30 border-t-2 border-amber-400 rounded-t-2xl mt-2 flex items-center justify-center font-mono font-black text-amber-800 text-base shadow-xs">
                1
              </div>
            </div>

            {/* 3rd Place (Right) */}
            <div className="flex flex-col items-center text-center">
              {thirdPlace ? (
                <>
                  <span className="text-2xl mb-1">🥉</span>
                  <span className="text-xs font-black text-slate-900 truncate w-full px-1">
                    {thirdPlace.player.name}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-500">
                    {thirdPlace.diff > 0 ? `+${thirdPlace.diff}` : thirdPlace.diff}
                  </span>
                  <div className="w-full h-9 bg-gradient-to-t from-amber-200/40 to-amber-100/20 rounded-t-2xl mt-2 flex items-center justify-center font-mono font-black text-amber-900 text-sm border-t-2 border-amber-300">
                    3
                  </div>
                </>
              ) : (
                <div className="w-full h-9 bg-chalk-100 rounded-t-2xl mt-2" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standings Header Meta */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-[11px] font-bold text-slate-500">
          Ranked by Game Points (GW)
        </span>
        <span className="text-[10px] font-black uppercase text-court-700 bg-court-100/70 px-2 py-0.5 rounded-full border border-court-500/20">
          {completedCount} matches counted
        </span>
      </div>

      {/* Full Leaderboard Table */}
      <StandingsTable standings={standings} isFinal={isCompleted} />

      {/* Live sync note */}
      <p className="text-[11px] text-center font-bold text-slate-400 pt-1">
        Leaderboard refreshes automatically as scores are submitted.
      </p>
    </div>
  );
};

export default LiveStandingsView;
