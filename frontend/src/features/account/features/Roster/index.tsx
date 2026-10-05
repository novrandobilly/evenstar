import React, { useState } from "react";
import { useTGetRoster } from "../../../../api/rosters/useTGetRoster";
import { useTSaveRoster } from "../../../../api/rosters/useTSaveRoster";
import { useToast } from "../../../../context/ToastContext";
import { RosterPlayerItem } from "./RosterPlayerItem";
import { AddPlayerInput } from "./AddPlayerInput";
import type { Player } from "../../../../types/session";
import { MAX_ROSTER_PLAYERS } from "../../../../types/roster";

export const Roster: React.FC = () => {
  const { data: roster, isLoading } = useTGetRoster();
  const saveRosterMutation = useTSaveRoster();
  const { showToast } = useToast();

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const players: Player[] = roster?.players || [];
  const isMaxReached = players.length >= MAX_ROSTER_PLAYERS;

  const handleAddPlayer = (name: string) => {
    if (isMaxReached) {
      showToast({
        message: `Maximum roster limit of ${MAX_ROSTER_PLAYERS} players reached.`,
        type: "error",
      });
      return;
    }

    // Prevent exact duplicates case-insensitively if already in roster
    const exists = players.some(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) {
      showToast({
        message: `"${name}" is already in your player pool!`,
        type: "error",
      });
      return;
    }

    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      name: name.trim(),
    };

    saveRosterMutation.mutate({
      name: roster?.name || "My Players",
      players: [...players, newPlayer],
      successMessage: `Added "${name.trim()}" to roster!`,
    });
  };

  const handleUpdatePlayerName = (id: string, newName: string) => {
    const updated = players.map((p) =>
      p.id === id ? { ...p, name: newName } : p
    );

    saveRosterMutation.mutate({
      name: roster?.name || "My Players",
      players: updated,
      successMessage: "Player updated.",
    });
  };

  const handleDeletePlayer = (id: string) => {
    const updated = players.filter((p) => p.id !== id);

    saveRosterMutation.mutate({
      name: roster?.name || "My Players",
      players: updated,
      successMessage: "Player removed from roster pool.",
    });
  };

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="rounded-3xl border border-chalk-300 bg-white shadow-xs overflow-hidden transition-all">
      {/* 🎾 Accordion Header Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4.5 flex items-center justify-between text-left hover:bg-chalk-50/70 transition cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
          <div className="h-9 w-9 rounded-2xl bg-court-100 text-court-850 flex items-center justify-center font-black text-sm shrink-0 border border-court-500/20">
            👥
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 truncate">
                Player Roster Pool
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {isExpanded
                ? "Manage your regular community members"
                : `${players.length} of ${MAX_ROSTER_PLAYERS} members saved`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
              isMaxReached
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : "bg-court-100/80 text-court-800 border-court-500/20"
            }`}
          >
            {players.length}/{MAX_ROSTER_PLAYERS}
          </span>

          <div
            className={`h-7 w-7 rounded-xl bg-chalk-100 flex items-center justify-center text-slate-500 transition-transform duration-300 border border-chalk-300 ${
              isExpanded ? "rotate-180 text-slate-800 bg-chalk-200" : ""
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>

      {/* 🎾 Accordion Collapsible Body with Smooth CSS Grid Transition */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100 border-t border-chalk-200"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4.5 pt-3 space-y-3.5">
            {/* Add player input */}
            <div>
              <AddPlayerInput
                onAddPlayer={handleAddPlayer}
                isSaving={saveRosterMutation.isPending}
                isMaxReached={isMaxReached}
              />
              {isMaxReached && (
                <p className="text-[10px] font-bold text-amber-700 mt-1.5 px-1">
                  ⚠️ Player pool limit of {MAX_ROSTER_PLAYERS} players reached.
                </p>
              )}
            </div>

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
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
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
                  Add players here to easily pick them when creating sessions!
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5">
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
        </div>
      </div>
    </div>
  );
};

export default Roster;
