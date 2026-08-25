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
export const COLUMN_FLEX = {
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
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[11px] font-black text-amber-700">
          🥇
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-black text-slate-700">
          🥈
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-[11px] font-black text-amber-800">
          🥉
        </span>
      );
    }
    return (
      <span className="flex h-5 w-5 items-center justify-center text-xs font-bold text-slate-400">
        {rank}
      </span>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
      <div className="w-full text-left text-xs">
        {/* Table Header Row */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50/80 px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <div className={`${COLUMN_FLEX.rank} flex justify-center`}>#</div>
          <div className={`${COLUMN_FLEX.player} truncate px-1`}>Player</div>
          <div
            className={`${COLUMN_FLEX.mp} flex justify-center text-center`}
            title="Matches Played"
          >
            MP
          </div>
          <div
            className={`${COLUMN_FLEX.wl} flex justify-center text-center`}
            title="Match Wins - Losses"
          >
            W-L
          </div>
          <div
            className={`${COLUMN_FLEX.gwgl} flex justify-center text-center`}
            title="Game Points Won - Lost"
          >
            GW-GL
          </div>
          <div
            className={`${COLUMN_FLEX.diff} flex justify-end text-right font-black pr-1`}
            title="Point Differential"
          >
            +/-
          </div>
        </div>

        {/* Table Body Rows */}
        <div className="divide-y divide-slate-100 font-medium text-slate-700">
          {standings.map((stat) => {
            const isLeader =
              stat.rank === 1 && (stat.gamesWon > 0 || stat.matchWins > 0);
            return (
              <div
                key={stat.player.id}
                className={`flex items-center px-3 py-2.5 transition-colors hover:bg-slate-50/60 ${
                  isLeader ? "bg-amber-50/30" : ""
                }`}
              >
                {/* Rank */}
                <div
                  className={`${COLUMN_FLEX.rank} flex justify-center items-center`}
                >
                  {isFinal || isLeader ? (
                    getRankBadge(stat.rank)
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      {stat.rank}
                    </span>
                  )}
                </div>

                {/* Player Name */}
                <div
                  className={`${COLUMN_FLEX.player} truncate font-bold text-slate-900 px-1`}
                >
                  {stat.player.name || "Unnamed"}
                </div>

                {/* MP */}
                <div
                  className={`${COLUMN_FLEX.mp} flex justify-center text-center text-slate-500 font-semibold`}
                >
                  {stat.matchesPlayed}
                </div>

                {/* W-L */}
                <div
                  className={`${COLUMN_FLEX.wl} flex justify-center text-center text-slate-700 font-semibold whitespace-nowrap`}
                >
                  <span>{stat.matchWins}</span>
                  <span className="text-slate-400 mx-0.5">-</span>
                  <span className="text-slate-500">{stat.matchLosses}</span>
                </div>

                {/* GW-GL */}
                <div
                  className={`${COLUMN_FLEX.gwgl} flex justify-center text-center text-slate-700 font-semibold whitespace-nowrap`}
                >
                  <span>{stat.gamesWon}</span>
                  <span className="text-slate-400 mx-0.5">-</span>
                  <span className="text-slate-400">{stat.gamesLost}</span>
                </div>

                {/* Differential (+/-) */}
                <div
                  className={`${COLUMN_FLEX.diff} flex justify-end text-right font-bold whitespace-nowrap pr-1`}
                >
                  <span
                    className={
                      stat.diff > 0
                        ? "text-emerald-600 font-extrabold"
                        : stat.diff < 0
                          ? "text-rose-500 font-extrabold"
                          : "text-slate-400 font-medium"
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
