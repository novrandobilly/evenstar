import React, { useState } from "react";
import type { SessionConfig, Player, MatchItem } from "../../../../../types/session";
import { CustomPlayerSelect } from "./CustomPlayerSelect";

interface EditMatchModalProps {
  isOpen: boolean;
  editingMatch: MatchItem | null;
  session: SessionConfig;
  onClose: () => void;
  onEditCustomMatch: (matchId: string, teamA: Player[], teamB: Player[]) => { success: boolean; error?: string };
  onDeleteMatch: (matchId: string) => void;
}

const EditMatchDialogContent: React.FC<{
  editingMatch: MatchItem;
  session: SessionConfig;
  onClose: () => void;
  onEditCustomMatch: (matchId: string, teamA: Player[], teamB: Player[]) => { success: boolean; error?: string };
  onDeleteMatch: (matchId: string) => void;
}> = ({
  editingMatch,
  session,
  onClose,
  onEditCustomMatch,
  onDeleteMatch,
}) => {
  const isDoubles = session.matchFormat === "doubles";
  const [formTeamA, setFormTeamA] = useState<string[]>(() =>
    editingMatch.teamA.map((p) => p.id)
  );
  const [formTeamB, setFormTeamB] = useState<string[]>(() =>
    editingMatch.teamB.map((p) => p.id)
  );
  const [formError, setFormError] = useState<string | null>(null);

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

    const res = onEditCustomMatch(editingMatch.id, teamAPlayers, teamBPlayers);

    if (res && !res.success) {
      setFormError(res.error || "An error occurred.");
    } else {
      onClose();
    }
  };

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-modal-in border border-[#ded7c4]">
      <div className="flex items-center justify-between border-b border-chalk-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🎾</span>
          <h3 className="text-sm font-black text-slate-900">Edit Match Lineup</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {formError && (
        <div className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
          {formError}
        </div>
      )}

      <div className="space-y-4">
        {/* TEAM A */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-court-700 block mb-1.5">
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
          <label className="text-[10px] font-black uppercase tracking-widest text-court-700 block mb-1.5">
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

      <div className="flex gap-2 pt-2 border-t border-chalk-200">
        <button
          type="button"
          onClick={() => {
            onDeleteMatch(editingMatch.id);
            onClose();
          }}
          className="rounded-2xl bg-rose-50 hover:bg-rose-100 px-3.5 py-3 text-xs font-bold text-rose-700 active:scale-[0.98] transition cursor-pointer border border-rose-200"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-2xl bg-chalk-100 py-3 text-xs font-bold text-slate-700 hover:bg-chalk-200 active:scale-[0.98] transition cursor-pointer border border-[#ded7c4]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveMatch}
          className="flex-1 rounded-2xl bg-court-850 hover:bg-court-900 py-3 text-xs font-black text-volt-300 shadow-md active:scale-[0.98] transition cursor-pointer border border-court-700/40"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export const EditMatchModal: React.FC<EditMatchModalProps> = ({
  isOpen,
  editingMatch,
  session,
  onClose,
  onEditCustomMatch,
  onDeleteMatch,
}) => {
  if (!isOpen || !editingMatch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-court-950/70 p-4 backdrop-blur-xs transition-all duration-300">
      <EditMatchDialogContent
        key={editingMatch.id}
        editingMatch={editingMatch}
        session={session}
        onClose={onClose}
        onEditCustomMatch={onEditCustomMatch}
        onDeleteMatch={onDeleteMatch}
      />
    </div>
  );
};
