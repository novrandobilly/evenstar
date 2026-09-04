import React, { useState } from "react";
import type { SessionConfig } from "../../../../../../../types/session";

interface AddPlayerModalProps {
  isOpen: boolean;
  session: SessionConfig;
  onClose: () => void;
  onAddPlayerWithName: (name: string) => void;
}

const AddPlayerDialogContent: React.FC<{
  session: SessionConfig;
  onClose: () => void;
  onAddPlayerWithName: (name: string) => void;
}> = ({ session, onClose, onAddPlayerWithName }) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [playerModalError, setPlayerModalError] = useState<string | null>(null);

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
    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-modal-in border border-[#ded7c4]">
      <div className="flex items-center justify-between border-b border-chalk-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">👤</span>
          <h3 className="text-sm font-black text-slate-900">Add New Player</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {playerModalError && (
        <div className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
          {playerModalError}
        </div>
      )}

      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-court-700 block mb-1.5">
          Player Name
        </label>
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => {
            setNewPlayerName(e.target.value);
            setPlayerModalError(null);
          }}
          placeholder="e.g. Roger, Rafa, Serena"
          className="w-full bg-chalk-50 border border-[#ded7c4] rounded-2xl px-3.5 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-court-600 focus:ring-2 focus:ring-court-500/20 transition"
        />
      </div>

      <div className="flex gap-2 pt-2 border-t border-chalk-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-2xl bg-chalk-100 py-3 text-xs font-bold text-slate-700 hover:bg-chalk-200 active:scale-[0.98] transition cursor-pointer border border-[#ded7c4]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAddPlayerSubmit}
          className="flex-1 rounded-2xl bg-court-850 hover:bg-court-900 py-3 text-xs font-black text-volt-300 shadow-md active:scale-[0.98] transition cursor-pointer border border-court-700/40"
        >
          Add Player
        </button>
      </div>
    </div>
  );
};

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  isOpen,
  session,
  onClose,
  onAddPlayerWithName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-court-950/70 p-4 backdrop-blur-xs transition-all duration-300">
      <AddPlayerDialogContent
        session={session}
        onClose={onClose}
        onAddPlayerWithName={onAddPlayerWithName}
      />
    </div>
  );
};
