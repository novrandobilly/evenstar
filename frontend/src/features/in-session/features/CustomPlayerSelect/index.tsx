import React, { useState } from "react";
import type { Player } from "../../../../types/session";
import { DropdownList } from "./features/DropdownList";

interface CustomPlayerSelectProps {
  players: Player[];
  selectedId: string;
  onChange: (id: string) => void;
}

export const CustomPlayerSelect: React.FC<CustomPlayerSelectProps> = ({
  players,
  selectedId,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPlayer = players.find((p) => p.id === selectedId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 flex items-center justify-between transition-all"
      >
        <span className={selectedPlayer ? "text-slate-800" : "text-slate-400"}>
          {selectedPlayer ? selectedPlayer.name : "-- Select Player --"}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <DropdownList
          players={players}
          selectedId={selectedId}
          onChange={onChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
