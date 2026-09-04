import React, { useState } from "react";
import type { Player } from "../../../../../../types/session";
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
        className="w-full bg-chalk-50 border border-[#ded7c4] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 text-left focus:outline-none focus:border-court-600 focus:ring-2 focus:ring-court-500/20 flex items-center justify-between transition cursor-pointer"
      >
        <span className={selectedPlayer ? "text-slate-900 font-extrabold" : "text-slate-400 font-medium"}>
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
            strokeWidth="2.5"
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
