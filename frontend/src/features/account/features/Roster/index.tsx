import React, { useState } from "react";
import { useTGetRoster } from "../../../../api/rosters/useTGetRoster";
import { useTSaveRoster } from "../../../../api/rosters/useTSaveRoster";
import { RosterPlayerItem } from "./RosterPlayerItem";
import { AddPlayerInput } from "./AddPlayerInput";
import type { Player } from "../../../../types/session";

export const Roster: React.FC = () => {
  const { data: roster, isLoading } = useTGetRoster();
  const saveRosterMutation = useTSaveRoster();

  const [searchQuery, setSearchQuery] = useState("");

  const players: Player[] = roster?.players || [];

  const handleAddPlayer = (name: string) => {
    // Prevent exact duplicates case-insensitively if already in roster
    const exists = players.some(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    if (exists) {
      alert(`"${name}" is already in your player pool!`);
      return;
    }

    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      name: name.trim(),
    };

    saveRosterMutation.mutate({
      name: roster?.name || "My Players",
      players: [...players, newPlayer],
    });
  };

  const handleUpdatePlayerName = (id: string, newName: string) => {
    const updated = players.map((p) =>
      p.id === id ? { ...p, name: newName } : p,
    );

    saveRosterMutation.mutate({
      name: roster?.name || "My Players",
      players: updated,
    });
  };

  const handleDeletePlayer = (id: string) => {
    const updated = players.filter((p) => p.id !== id);

    saveRosterMutation.mutate({
      name: roster?.name || "My Players",
      players: updated,
    });
  };

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  return (
    <div className="rounded-3xl border border-chalk-300 bg-white p-5 shadow-xs relative overflow-hidden space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Player Roster Pool
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Save regular community members for quick session setup.
          </p>
        </div>
        <span className="text-[10px] font-bold text-court-700 bg-court-100/70 px-2.5 py-0.5 rounded-full border border-court-500/20 shrink-0">
          {players.length} Players
        </span>
      </div>

      {/* Add player input */}
      <AddPlayerInput
        onAddPlayer={handleAddPlayer}
        isSaving={saveRosterMutation.isPending}
      />

      {/* Search Input if roster has more than 5 players */}
      {players.length >= 6 && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved players..."
            className="w-full bg-chalk-50 border border-chalk-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-court-600 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Players List */}
      {isLoading ? (
        <div className="p-4 text-center text-xs font-bold text-slate-400 animate-pulse bg-chalk-50 rounded-2xl border border-chalk-200">
          Loading player roster...
        </div>
      ) : players.length === 0 ? (
        <div className="p-6 text-center bg-chalk-50/60 rounded-2xl border border-dashed border-chalk-300">
          <span className="text-2xl block mb-1">👥</span>
          <p className="text-xs font-bold text-slate-700">
            No saved players yet
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto">
            Add players here so you don't have to retype names every week!
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
          {filteredPlayers.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400 font-medium">
              No players matching "{searchQuery}"
            </div>
          ) : (
            filteredPlayers.map((player, idx) => (
              <RosterPlayerItem
                key={player.id}
                player={player}
                index={idx}
                onUpdateName={handleUpdatePlayerName}
                onDelete={handleDeletePlayer}
                isSaving={saveRosterMutation.isPending}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Roster;
