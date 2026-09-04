import React from "react";
import type { Player } from "../../../../../../../types/session";

interface DropdownListProps {
  players: Player[];
  selectedId: string;
  onChange: (id: string) => void;
  onClose: () => void;
}

export const DropdownList: React.FC<DropdownListProps> = ({
  players,
  selectedId,
  onChange,
  onClose,
}) => {
  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={onClose}
      />
      <ul className="absolute z-20 w-full mt-1.5 max-h-48 overflow-y-auto bg-white border border-[#ded7c4] rounded-2xl shadow-xl focus:outline-none text-xs font-bold divide-y divide-chalk-100 animate-dropdown-in origin-top">
        <li
          onClick={() => {
            onChange("");
            onClose();
          }}
          className="px-3.5 py-2.5 hover:bg-chalk-100 text-slate-400 cursor-pointer font-medium"
        >
          -- Select Player --
        </li>
        {players.map((p) => (
          <li
            key={p.id}
            onClick={() => {
              onChange(p.id);
              onClose();
            }}
            className={`px-3.5 py-2.5 hover:bg-court-50 hover:text-court-800 cursor-pointer transition ${
              p.id === selectedId
                ? "bg-court-100/80 text-court-850 font-black"
                : "text-slate-800"
            }`}
          >
            {p.name}
          </li>
        ))}
      </ul>
    </>
  );
};
