import React, { useState } from "react";
import type { Player } from "../../../../types/session";

interface RosterPlayerItemProps {
  player: Player;
  index: number;
  onUpdateName: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  isSaving: boolean;
}

export const RosterPlayerItem: React.FC<RosterPlayerItemProps> = ({
  player,
  index,
  onUpdateName,
  onDelete,
  isSaving,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(player.name);

  const handleSave = () => {
    if (editName.trim().length > 0 && editName.trim() !== player.name) {
      onUpdateName(player.id, editName.trim());
    } else {
      setEditName(player.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditName(player.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2.5 rounded-2xl border border-[#ded7c4] bg-chalk-50/70 p-2.5 hover:bg-white hover:border-court-500/40 transition group">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-court-100 text-court-800 text-[10px] font-black shrink-0 border border-court-500/20">
          {index + 1}
        </span>

        {isEditing ? (
          <input
            type="text"
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            disabled={isSaving}
            className="w-full bg-white rounded-lg px-2 py-1 text-xs font-bold text-slate-900 border border-court-600 focus:outline-none"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="text-xs font-bold text-slate-900 truncate flex-1 cursor-pointer hover:text-court-800"
            title="Click to rename"
          >
            {player.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {isEditing ? (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-7 px-2 rounded-lg bg-court-850 hover:bg-court-900 text-volt-300 text-[10px] font-black cursor-pointer transition active:scale-95"
          >
            Save
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-chalk-200 flex items-center justify-center text-[11px] transition cursor-pointer"
              title="Edit player name"
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={() => onDelete(player.id)}
              disabled={isSaving}
              className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center text-xs transition cursor-pointer"
              title="Remove from roster"
            >
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RosterPlayerItem;
