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
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Sorted by Game Points (GW)</span>
        <span>{completedCount} matches counted</span>
      </div>
      <StandingsTable standings={standings} />
    </div>
  );
};
