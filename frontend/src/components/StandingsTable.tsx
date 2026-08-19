import React from 'react';
import type { PlayerStats } from '../utils/standings';

interface StandingsTableProps {
  standings: PlayerStats[];
  isFinal?: boolean;
}

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
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs table-fixed">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 pl-3 pr-1 w-8 text-center">#</th>
              <th className="py-3 px-2 w-auto">Player</th>
              <th className="py-3 px-1 w-10 text-center" title="Matches Played">
                MP
              </th>
              <th className="py-3 px-1 w-14 text-center" title="Match Wins - Losses">
                W-L
              </th>
              <th className="py-3 px-1 w-16 text-center" title="Game Points Won - Lost">
                GW-GL
              </th>
              <th className="py-3 pr-3.5 pl-1 w-12 text-right font-black" title="Point Differential">
                +/-
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {standings.map((stat) => {
              const isLeader = stat.rank === 1 && (stat.gamesWon > 0 || stat.matchWins > 0);
              return (
                <tr
                  key={stat.player.id}
                  className={`transition-colors hover:bg-slate-50/60 ${
                    isLeader ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="py-2.5 pl-3 pr-1 text-center">
                    <div className="flex items-center justify-center">
                      {isFinal || isLeader ? getRankBadge(stat.rank) : (
                        <span className="text-xs font-bold text-slate-400">{stat.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 font-bold text-slate-900 truncate">
                    {stat.player.name || 'Unnamed'}
                  </td>
                  <td className="py-2.5 px-1 text-center text-slate-500 font-semibold">
                    {stat.matchesPlayed}
                  </td>
                  <td className="py-2.5 px-1 text-center text-slate-700 font-semibold whitespace-nowrap">
                    <span>{stat.matchWins}</span>
                    <span className="text-slate-400 mx-0.5">-</span>
                    <span className="text-slate-500">{stat.matchLosses}</span>
                  </td>
                  <td className="py-2.5 px-1 text-center text-slate-700 font-semibold whitespace-nowrap">
                    <span>{stat.gamesWon}</span>
                    <span className="text-slate-400 mx-0.5">-</span>
                    <span className="text-slate-400">{stat.gamesLost}</span>
                  </td>
                  <td className="py-2.5 pr-3.5 pl-1 text-right font-bold whitespace-nowrap">
                    <span
                      className={
                        stat.diff > 0
                          ? 'text-emerald-600 font-extrabold'
                          : stat.diff < 0
                          ? 'text-rose-500 font-extrabold'
                          : 'text-slate-400 font-medium'
                      }
                    >
                      {stat.diff > 0 ? `+${stat.diff}` : stat.diff}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
