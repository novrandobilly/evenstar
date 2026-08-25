import React, { useState } from "react";
import type { SessionConfig, Player } from "../../../../../../types/session";
import { AddMatchModal } from "./features/AddMatchModal";
import { AddPlayerModal } from "./features/AddPlayerModal";

interface TopActionButtonsProps {
  session: SessionConfig;
  onAddCustomMatch: (teamA: Player[], teamB: Player[]) => { success: boolean; error?: string };
  onAddPlayerWithName: (name: string) => void;
}

export const TopActionButtons: React.FC<TopActionButtonsProps> = ({
  session,
  onAddCustomMatch,
  onAddPlayerWithName,
}) => {
  const [isAddMatchModalOpen, setIsAddMatchModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => setIsAddMatchModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 py-2.5 px-4 text-xs font-bold text-slate-700 shadow-sm active:scale-[0.98] transition cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-emerald-600 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Match</span>
        </button>
        <button
          type="button"
          onClick={() => setIsAddPlayerModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 py-2.5 px-4 text-xs font-bold text-slate-700 shadow-sm active:scale-[0.98] transition cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-emerald-600 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          <span>Add Player</span>
        </button>
      </div>

      <AddMatchModal
        isOpen={isAddMatchModalOpen}
        session={session}
        onClose={() => setIsAddMatchModalOpen(false)}
        onAddCustomMatch={onAddCustomMatch}
      />

      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        session={session}
        onClose={() => setIsAddPlayerModalOpen(false)}
        onAddPlayerWithName={onAddPlayerWithName}
      />
    </>
  );
};
