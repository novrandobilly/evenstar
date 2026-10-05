import React, { useState } from "react";

interface AddPlayerInputProps {
  onAddPlayer: (name: string) => void;
  isSaving: boolean;
}

export const AddPlayerInput: React.FC<AddPlayerInputProps> = ({
  onAddPlayer,
  isSaving,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSaving) return;
    onAddPlayer(name.trim());
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add player name..."
          disabled={isSaving}
          className="w-full bg-chalk-50 border border-[#ded7c4] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-court-600 focus:bg-white focus:ring-2 focus:ring-court-500/20 transition"
        />
      </div>

      <button
        type="submit"
        disabled={!name.trim() || isSaving}
        className="h-10 px-4 rounded-2xl bg-court-850 hover:bg-court-900 text-volt-300 font-black text-xs shadow-sm shadow-court-900/10 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-1 shrink-0 border border-court-700/50"
      >
        <span>+</span>
        <span>Add</span>
      </button>
    </form>
  );
};

export default AddPlayerInput;
