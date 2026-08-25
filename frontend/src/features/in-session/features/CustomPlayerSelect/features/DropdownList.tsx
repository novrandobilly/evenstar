import React from "react";
import type { Player } from "../../../../../types/session";

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
      <ul className="absolute z-20 w-full mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg focus:outline-none text-xs font-bold divide-y divide-slate-50 animate-dropdown-in origin-top">
        <li
          onClick={() => {
            onChange("");
            onClose();
          }}
          className="px-3 py-2 hover:bg-slate-50 text-slate-400 cursor-pointer"
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
            className={`px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition ${
              p.id === selectedId
                ? "bg-emerald-50/50 text-emerald-600"
                : "text-slate-700"
            }`}
          >
            {p.name}
          </li>
        ))}
      </ul>
    </>
  );
};
