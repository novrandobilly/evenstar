import React, { useState, useEffect } from "react";
import type { SessionConfig, Player, MatchItem } from "../../../../../types/session";
import { CustomPlayerSelect } from "./CustomPlayerSelect";

interface MatchFormModalProps {
  isOpen: boolean;
  editingMatch: MatchItem | null;
  session: SessionConfig;
  onClose: () => void;
  onAddCustomMatch: (teamA: Player[], teamB: Player[]) => { success: boolean; error?: string };
  onEditCustomMatch: (matchId: string, teamA: Player[], teamB: Player[]) => { success: boolean; error?: string };
  onDeleteMatch: (matchId: string) => void;
}

export const MatchFormModal: React.FC<MatchFormModalProps> = ({
  isOpen,
  editingMatch,
  session,
  onClose,
  onAddCustomMatch,
  onEditCustomMatch,
  onDeleteMatch,
}) => {
  const isDoubles = session.matchFormat === "doubles";
  const [formTeamA, setFormTeamA] = useState<string[]>([]);
  const [formTeamB, setFormTeamB] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingMatch) {
        setFormTeamA(editingMatch.teamA.map((p) => p.id));
        setFormTeamB(editingMatch.teamB.map((p) => p.id));
      } else {
        setFormTeamA(isDoubles ? ["", ""] : [""]);
        setFormTeamB(isDoubles ? ["", ""] : [""]);
      }
      setFormError(null);
    }
  }, [isOpen, editingMatch, isDoubles]);

  if (!isOpen) return null;

  const handleSaveMatch = () => {
    const sizeA = isDoubles ? 2 : 1;
    const sizeB = isDoubles ? 2 : 1;

    const idsA = formTeamA.filter(Boolean);
    const idsB = formTeamB.filter(Boolean);

    if (idsA.length !== sizeA || idsB.length !== sizeB) {
      setFormError("Please select all players for both teams.");
      return;
    }

    const allSelectedIds = [...idsA, ...idsB];
    const uniqueSelected = new Set(allSelectedIds);
    if (uniqueSelected.size !== allSelectedIds.length) {
      setFormError("A player cannot be selected more than once in the same match.");
      return;
    }

    const playersMap = new Map(session.players.map((p) => [p.id, p]));
    const teamAPlayers = idsA.map((id) => playersMap.get(id)).filter(Boolean) as Player[];
    const teamBPlayers = idsB.map((id) => playersMap.get(id)).filter(Boolean) as Player[];

    let res;
    if (editingMatch) {
      res = onEditCustomMatch(editingMatch.id, teamAPlayers, teamBPlayers);
    } else {
      res = onAddCustomMatch(teamAPlayers, teamBPlayers);
    }

    if (res && !res.success) {
      setFormError(res.error || "An error occurred.");
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-all duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-modal-in">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-sm font-extrabold text-slate-900">
            {editingMatch ? "Edit Match" : "Add Custom Match"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {formError && (
          <div className="text-[11px] font-bold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            {formError}
          </div>
        )}

        <div className="space-y-4">
          {/* TEAM A */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Team A
            </label>
            <div className="space-y-2">
              {Array.from({ length: isDoubles ? 2 : 1 }).map((_, idx) => {
                const otherSelectedIds = [
                  ...formTeamA.filter((_, i) => i !== idx),
                  ...formTeamB,
                ];
                const availablePlayers = session.players.filter(
                  (p) => p.name.trim().length > 0 && !otherSelectedIds.includes(p.id)
                );
                return (
                  <CustomPlayerSelect
                    key={`a-${idx}`}
                    players={availablePlayers}
                    selectedId={formTeamA[idx] || ""}
                    onChange={(id: string) => {
                      const updated = [...formTeamA];
                      updated[idx] = id;
                      setFormTeamA(updated);
                      setFormError(null);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* TEAM B */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Team B
            </label>
            <div className="space-y-2">
              {Array.from({ length: isDoubles ? 2 : 1 }).map((_, idx) => {
                const otherSelectedIds = [
                  ...formTeamA,
                  ...formTeamB.filter((_, i) => i !== idx),
                ];
                const availablePlayers = session.players.filter(
                  (p) => p.name.trim().length > 0 && !otherSelectedIds.includes(p.id)
                );
                return (
                  <CustomPlayerSelect
                    key={`b-${idx}`}
                    players={availablePlayers}
                    selectedId={formTeamB[idx] || ""}
                    onChange={(id: string) => {
                      const updated = [...formTeamB];
                      updated[idx] = id;
                      setFormTeamB(updated);
                      setFormError(null);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {editingMatch && (
            <button
              type="button"
              onClick={() => {
                onDeleteMatch(editingMatch.id);
                onClose();
              }}
              className="rounded-2xl bg-rose-50 hover:bg-rose-100 px-4 py-3 text-xs font-bold text-rose-600 active:scale-[0.98] transition cursor-pointer"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 active:scale-[0.98] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveMatch}
            className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow-md active:scale-[0.98] transition cursor-pointer"
          >
            Save Match
          </button>
        </div>
      </div>
    </div>
  );
};
