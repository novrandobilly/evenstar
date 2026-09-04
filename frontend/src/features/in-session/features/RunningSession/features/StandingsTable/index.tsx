import React from "react";
import type { PlayerStats } from "../../../../../../utils/standings";

interface StandingsTableProps {
  standings: PlayerStats[];
  isFinal?: boolean;
}

/**
 * Easily customizable column flex proportions:
 * Change the flex values below to tune column widths as desired!
 */
const COLUMN_FLEX = {
  rank: "flex-[0.8]", // # Rank column
  player: "flex-[3.5]", // Player name
  mp: "flex-[1.2]", // Matches Played
  wl: "flex-[1.8]", // Match Wins - Losses
  gwgl: "flex-[2.0]", // Game Points Won - Lost
  diff: "flex-[1.5]", // Point Differential (+/-)
};

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  isFinal = false,
}) => {
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[11px] font-black text-amber-800 shadow-xs ring-1 ring-amber-300">
          🥇
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-black text-slate-700 shadow-xs ring-1 ring-slate-300">
          🥈
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-[11px] font-black text-amber-900 shadow-xs ring-1 ring-amber-200">
          🥉
        </span>
      );
    }
    return (
      <span className="flex h-5 w-5 items-center justify-center font-mono text-xs font-bold text-slate-400">
        {rank}
      </span>
    );
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#ded7c4] bg-white shadow-xs">
      <div className="w-full text-left text-xs">
        {/* Table Header Row */}
        <div className="flex items-center border-b border-court-850 bg-court-900 px-3.5 py-3 text-[10px] font-black uppercase tracking-widest text-court-100">
          <div className={`${COLUMN_FLEX.rank} flex justify-center`}>#</div>
          <div className={`${COLUMN_FLEX.player} truncate px-1`}>Player</div>
          <div
            className={`${COLUMN_FLEX.mp} flex justify-center text-center font-mono`}
            title="Matches Played"
          >
            MP
          </div>
          <div
            className={`${COLUMN_FLEX.wl} flex justify-center text-center font-mono`}
            title="Match Wins - Losses"
          >
            W-L
          </div>
          <div
            className={`${COLUMN_FLEX.gwgl} flex justify-center text-center font-mono`}
            title="Game Points Won - Lost"
          >
            GW-GL
          </div>
          <div
            className={`${COLUMN_FLEX.diff} flex justify-end text-right font-black font-mono pr-1 text-volt-300`}
            title="Point Differential"
          >
            +/-
          </div>
        </div>

        {/* Table Body Rows */}
        <div className="divide-y divide-chalk-200 font-medium text-slate-700">
          {standings.map((stat) => {
            const isLeader =
              stat.rank === 1 && (stat.gamesWon > 0 || stat.matchWins > 0);
            return (
              <div
                key={stat.player.id}
                className={`flex items-center px-3.5 py-3 transition-colors hover:bg-chalk-50/80 ${
                  isLeader ? "bg-amber-50/50" : ""
                }`}
              >
                {/* Rank */}
                <div
                  className={`${COLUMN_FLEX.rank} flex justify-center items-center`}
                >
                  {isFinal || isLeader ? (
                    getRankBadge(stat.rank)
                  ) : (
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {stat.rank}
                    </span>
                  )}
                </div>

                {/* Player Name */}
                <div
                  className={`${COLUMN_FLEX.player} truncate font-extrabold text-slate-900 px-1`}
                >
                  {stat.player.name || "Unnamed"}
                </div>

                {/* MP */}
                <div
                  className={`${COLUMN_FLEX.mp} flex justify-center text-center font-mono text-slate-500 font-bold`}
                >
                  {stat.matchesPlayed}
                </div>

                {/* W-L */}
                <div
                  className={`${COLUMN_FLEX.wl} flex justify-center text-center font-mono text-slate-800 font-bold whitespace-nowrap`}
                >
                  <span>{stat.matchWins}</span>
                  <span className="text-slate-300 mx-0.5">-</span>
                  <span className="text-slate-500">{stat.matchLosses}</span>
                </div>

                {/* GW-GL */}
                <div
                  className={`${COLUMN_FLEX.gwgl} flex justify-center text-center font-mono text-slate-800 font-bold whitespace-nowrap`}
                >
                  <span>{stat.gamesWon}</span>
                  <span className="text-slate-300 mx-0.5">-</span>
                  <span className="text-slate-400">{stat.gamesLost}</span>
                </div>

                {/* Differential (+/-) */}
                <div
                  className={`${COLUMN_FLEX.diff} flex justify-end text-right font-mono font-black whitespace-nowrap pr-1`}
                >
                  <span
                    className={
                      stat.diff > 0
                        ? "text-court-700 font-black"
                        : stat.diff < 0
                          ? "text-clay-600 font-black"
                          : "text-slate-400 font-semibold"
                    }
                  >
                    {stat.diff > 0 ? `+${stat.diff}` : stat.diff}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
