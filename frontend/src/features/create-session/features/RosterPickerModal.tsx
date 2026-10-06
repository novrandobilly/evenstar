import React, { useState } from "react";
import type { Player } from "../../../types/session";
import { useTGetRoster } from "../../../api/rosters/useTGetRoster";

interface RosterPickerModalProps {
  isOpen: boolean;
  currentPlayers: Player[];
  onClose: () => void;
  onApplySelected: (selectedPlayers: Player[]) => void;
}

interface RosterModalContentProps {
  pool: Player[];
  isLoading: boolean;
  currentPlayers: Player[];
  onClose: () => void;
  onApplySelected: (selectedPlayers: Player[]) => void;
}

const getInitialSelected = (pool: Player[], currentPlayers: Player[]): Set<string> => {
  const initial = new Set<string>();
  currentPlayers.forEach((cp) => {
    if (!cp.name.trim()) return;
    const match = pool.find(
      (p) => p.name.trim().toLowerCase() === cp.name.trim().toLowerCase()
    );
    if (match) {
      initial.add(match.id);
    }
  });
  return initial;
};

const RosterModalContent: React.FC<RosterModalContentProps> = ({
  pool,
  isLoading,
  currentPlayers,
  onClose,
  onApplySelected,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() =>
    getInitialSelected(pool, currentPlayers)
  );
  const [searchQuery, setSearchQuery] = useState("");

  const togglePlayer = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(pool.map((p) => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleApply = () => {
    // Preserve selection order based on pool order
    const selected = pool.filter((p) => selectedIds.has(p.id));
    onApplySelected(selected);
    onClose();
  };

  const filteredPool = pool.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3.5 border border-[#ded7c4] animate-modal-in flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-chalk-100">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Pick from Saved Roster
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Select players attending today's session.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-sm font-bold px-1.5 py-0.5 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Quick Selection Controls */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-[10px] font-bold text-court-850 hover:underline cursor-pointer"
          >
            Select All
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={handleDeselectAll}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Clear
          </button>
        </div>

        <span
          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
            hasSelection
              ? "bg-court-100 text-court-800 border-court-500/20"
              : "bg-chalk-100 text-slate-500 border-chalk-200"
          }`}
        >
          {selectedCount} Selected
        </span>
      </div>

      {/* Search */}
      {pool.length > 5 && (
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter players by name..."
          className="w-full bg-chalk-50 border border-[#ded7c4] rounded-xl px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-court-600"
        />
      )}

      {/* Player Checklist */}
      <div className="flex-1 overflow-y-auto space-y-1.5 min-h-[160px] pr-0.5">
        {isLoading ? (
          <div className="p-4 text-center text-xs font-bold text-slate-400 animate-pulse">
            Loading player pool...
          </div>
        ) : pool.length === 0 ? (
          <div className="p-6 text-center bg-chalk-50/70 rounded-2xl border border-dashed border-[#ded7c4]">
            <span className="text-2xl block mb-1">👥</span>
            <p className="text-xs font-bold text-slate-700">No saved players</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Add players in your Host Dashboard first or type names directly.
            </p>
          </div>
        ) : filteredPool.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No players matching "{searchQuery}"
          </div>
        ) : (
          filteredPool.map((player) => {
            const isSelected = selectedIds.has(player.id);
            return (
              <label
                key={player.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? "border-court-600/50 bg-court-50/70 text-slate-900"
                    : "border-[#ded7c4] bg-chalk-50/50 hover:bg-white text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => togglePlayer(player.id)}
                    className="h-4 w-4 rounded text-court-700 accent-court-700 focus:ring-court-500"
                  />
                  <span className="text-xs font-bold">{player.name}</span>
                </div>

                {isSelected && (
                  <span className="text-court-700 font-bold text-xs">✓</span>
                )}
              </label>
            );
          })
        )}
      </div>

      {/* Actions Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-chalk-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-2xl bg-chalk-100 py-3 text-xs font-bold text-slate-700 hover:bg-chalk-200 transition cursor-pointer border border-[#ded7c4]"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!hasSelection}
          onClick={handleApply}
          className="flex-[2] rounded-2xl bg-court-850 hover:bg-court-900 py-3 text-xs font-black text-volt-300 shadow-md shadow-court-900/15 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer border border-court-700/50"
        >
          Apply {selectedCount > 0 ? `(${selectedCount})` : ""} to Roster
        </button>
      </div>
    </div>
  );
};

export const RosterPickerModal: React.FC<RosterPickerModalProps> = ({
  isOpen,
  currentPlayers,
  onClose,
  onApplySelected,
}) => {
  const { data: roster, isLoading } = useTGetRoster();
  const pool: Player[] = roster?.players || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-court-950/70 p-4 backdrop-blur-xs animate-fade-in transition-all">
      <RosterModalContent
        key={isOpen ? "open" : "closed"}
        pool={pool}
        isLoading={isLoading}
        currentPlayers={currentPlayers}
        onClose={onClose}
        onApplySelected={onApplySelected}
      />
    </div>
  );
};

export default RosterPickerModal;
