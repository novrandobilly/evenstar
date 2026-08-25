import React, { useState, useEffect } from "react";
import type { SessionConfig } from "../../../../../../../types/session";

interface AddPlayerModalProps {
  isOpen: boolean;
  session: SessionConfig;
  onClose: () => void;
  onAddPlayerWithName: (name: string) => void;
}

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  isOpen,
  session,
  onClose,
  onAddPlayerWithName,
}) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [playerModalError, setPlayerModalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewPlayerName("");
      setPlayerModalError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddPlayerSubmit = () => {
    const trimmed = newPlayerName.trim();
    if (!trimmed) {
      setPlayerModalError("Player name cannot be empty.");
      return;
    }
    const nameExists = session.players.some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (nameExists) {
      setPlayerModalError("A player with this name already exists.");
      return;
    }
    onAddPlayerWithName(trimmed);
    setNewPlayerName("");
    setPlayerModalError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-all duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-modal-in">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-sm font-extrabold text-slate-900">Add New Player</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {playerModalError && (
          <div className="text-[11px] font-bold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            {playerModalError}
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Player Name
          </label>
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => {
              setNewPlayerName(e.target.value);
              setPlayerModalError(null);
            }}
            placeholder="Enter player name"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 active:scale-[0.98] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddPlayerSubmit}
            className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow-md active:scale-[0.98] transition cursor-pointer"
          >
            Add Player
          </button>
        </div>
      </div>
    </div>
  );
};
