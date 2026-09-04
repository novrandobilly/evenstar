import React from "react";
import type { PlayerStats } from "../../../../../utils/standings";
import { StandingsTable } from "./StandingsTable";

interface LiveStandingsProps {
  completedCount: number;
  standings: PlayerStats[];
}

export const LiveStandings: React.FC<LiveStandingsProps> = ({
  completedCount,
  standings,
}) => {
  return (
    <div className="space-y-3 pb-4">
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-[11px] font-bold text-slate-500">
          Ranked by Game Points (GW)
        </span>
        <span className="text-[10px] font-black uppercase text-court-700 bg-court-100/70 px-2 py-0.5 rounded-full border border-court-500/20">
          {completedCount} matches played
        </span>
      </div>
      <StandingsTable standings={standings} />
    </div>
  );
};
