import React, { useState, useRef } from "react";
import type { SessionConfig, Player, MatchItem } from "../types/session";
import { calculateStandings } from "../utils/standings";
import { StandingsTable } from "./StandingsTable";
import { useModal } from "../context/modal";

const CustomPlayerSelect: React.FC<{
  players: Player[];
  selectedId: string;
  onChange: (id: string) => void;
}> = ({ players, selectedId, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPlayer = players.find((p) => p.id === selectedId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 flex items-center justify-between transition-all"
      >
        <span className={selectedPlayer ? "text-slate-800" : "text-slate-400"}>
          {selectedPlayer ? selectedPlayer.name : "-- Select Player --"}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <ul className="absolute z-20 w-full mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg focus:outline-none text-xs font-bold divide-y divide-slate-50 animate-dropdown-in origin-top">
            <li
              onClick={() => {
                onChange("");
                setIsOpen(false);
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
                  setIsOpen(false);
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
      )}
    </div>
  );
};

interface RunningSessionScreenProps {
  session: SessionConfig;
  onUpdateScore: (matchId: string, scoreA: string, scoreB: string) => void;
  onToggleCompleted: (matchId: string) => void;
  onReorderMatches: (fromIndex: number, toIndex: number) => void;
  onEndSession: () => void;
  onAddCustomMatch: (
    teamA: Player[],
    teamB: Player[],
  ) => { success: boolean; error?: string };
  onEditCustomMatch: (
    matchId: string,
    teamA: Player[],
    teamB: Player[],
  ) => { success: boolean; error?: string };
  onDeleteMatch: (matchId: string) => void;
  onAddPlayerWithName: (name: string) => void;
}

export const RunningSessionScreen: React.FC<RunningSessionScreenProps> = ({
  session,
  onUpdateScore,
  onToggleCompleted,
  onReorderMatches,
  onEndSession,
  onAddCustomMatch,
  onEditCustomMatch,
  onDeleteMatch,
  onAddPlayerWithName,
}) => {
  const { showModal } = useModal();
  const [activeTab, setActiveTab] = useState<"matches" | "standings">(
    "matches",
  );

  // Form Modal state for adding/editing matches
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchItem | null>(null);
  const [formTeamA, setFormTeamA] = useState<string[]>([]);
  const [formTeamB, setFormTeamB] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  // Add Player Modal state
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [playerModalError, setPlayerModalError] = useState<string | null>(null);

  const isDoubles = session.matchFormat === "doubles";
  const formatLabel = isDoubles ? "Doubles (Americano)" : "Singles";
  const completedCount = session.matches.filter((m) => m.isCompleted).length;
  const totalCount = session.matches.length;

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(
    null,
  );

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const standings = calculateStandings(session.players, session.matches);

  const handleOpenAddModal = () => {
    setEditingMatch(null);
    setFormTeamA(isDoubles ? ["", ""] : [""]);
    setFormTeamB(isDoubles ? ["", ""] : [""]);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (match: MatchItem) => {
    setEditingMatch(match);
    setFormTeamA(match.teamA.map((p) => p.id));
    setFormTeamB(match.teamB.map((p) => p.id));
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteMatch = (matchId: string) => {
    showModal({
      title: "Delete Match?",
      description:
        "Are you sure you want to delete this match? This cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        onDeleteMatch(matchId);
      },
    });
  };

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
      setFormError(
        "A player cannot be selected more than once in the same match.",
      );
      return;
    }

    const playersMap = new Map(session.players.map((p) => [p.id, p]));
    const teamAPlayers = idsA
      .map((id) => playersMap.get(id))
      .filter(Boolean) as Player[];
    const teamBPlayers = idsB
      .map((id) => playersMap.get(id))
      .filter(Boolean) as Player[];

    let res;
    if (editingMatch) {
      res = onEditCustomMatch(editingMatch.id, teamAPlayers, teamBPlayers);
    } else {
      res = onAddCustomMatch(teamAPlayers, teamBPlayers);
    }

    if (res && !res.success) {
      setFormError(res.error || "An error occurred.");
    } else {
      setIsFormModalOpen(false);
    }
  };

  const handleAddPlayerSubmit = () => {
    const trimmed = newPlayerName.trim();
    if (!trimmed) {
      setPlayerModalError("Player name cannot be empty.");
      return;
    }
    const nameExists = session.players.some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (nameExists) {
      setPlayerModalError("A player with this name already exists.");
      return;
    }
    onAddPlayerWithName(trimmed);
    setNewPlayerName("");
    setPlayerModalError(null);
    setIsAddPlayerModalOpen(false);
  };

  // --- HTML5 Desktop Drag Handlers ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOverRow = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const isTopHalf = relativeY < rect.height / 2;
    const targetGap = isTopHalf ? index : index + 1;

    if (dropIndicatorIndex !== targetGap) {
      setDropIndicatorIndex(targetGap);
    }
  };

  const handleDrop = (e: React.DragEvent, targetGap: number) => {
    e.preventDefault();
    e.stopPropagation();
    executeDrop(targetGap);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropIndicatorIndex(null);
  };

  // --- Mobile Touch Handlers ---
  const handleTouchStart = (_e: React.TouchEvent, index: number) => {
    setDraggedIndex(index);
    setDropIndicatorIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    const touchY = touch.clientY;

    let bestGap = 0;
    let found = false;

    for (let i = 0; i < session.matches.length; i++) {
      const el = rowRefs.current[i];
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (touchY < midY) {
        bestGap = i;
        found = true;
        break;
      }
    }

    if (!found) bestGap = session.matches.length;
    if (dropIndicatorIndex !== bestGap) setDropIndicatorIndex(bestGap);
  };

  const handleTouchEnd = () => {
    if (draggedIndex !== null && dropIndicatorIndex !== null) {
      executeDrop(dropIndicatorIndex);
    }
    setDraggedIndex(null);
    setDropIndicatorIndex(null);
  };

  const executeDrop = (targetGap: number) => {
    if (draggedIndex !== null && targetGap !== null) {
      let finalIndex = targetGap;
      if (draggedIndex < targetGap) {
        finalIndex = targetGap - 1;
      }
      if (
        draggedIndex !== finalIndex &&
        finalIndex >= 0 &&
        finalIndex < session.matches.length
      ) {
        onReorderMatches(draggedIndex, finalIndex);
      }
    }
    setDraggedIndex(null);
    setDropIndicatorIndex(null);
  };

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-4 py-5 select-none">
      <div>
        {/* Top App Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Live Session · {formatLabel}
            </span>
            <h1 className="text-base font-bold text-slate-900 truncate max-w-55">
              {session.title || "Tennis Session"}
            </h1>
          </div>

          <button
            type="button"
            onClick={onEndSession}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1"
          >
            End
          </button>
        </div>

        {/* Action Buttons at the Top */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 py-2.5 px-4 text-xs font-bold text-slate-700 shadow-sm active:scale-[0.98] transition cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-emerald-600 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Match</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddPlayerModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 py-2.5 px-4 text-xs font-bold text-slate-700 shadow-sm active:scale-[0.98] transition cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-emerald-600 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span>Add Player</span>
          </button>
        </div>

        {/* Tab Navigation: Matches vs Standings */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/80 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("matches")}
            className={`py-2 rounded-xl transition ${
              activeTab === "matches"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Matches ({completedCount}/{totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("standings")}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === "standings"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Standings</span>
            {standings.some((s) => s.gamesWon > 0) && (
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* TAB 1: MATCHES SCHEDULE */}
        {activeTab === "matches" && (
          <div>
            <div className="pb-4">
              {session.matches.map((match, index) => {
                const isBeingDragged = draggedIndex === index;
                const showGapBefore =
                  draggedIndex !== null &&
                  dropIndicatorIndex === index &&
                  draggedIndex !== index &&
                  draggedIndex !== index - 1;

                const showGapAfter =
                  draggedIndex !== null &&
                  index === session.matches.length - 1 &&
                  dropIndicatorIndex === index + 1 &&
                  draggedIndex !== index;

                return (
                  <div
                    key={match.id}
                    ref={(el) => {
                      rowRefs.current[index] = el;
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOverRow(e, index)}
                    onDrop={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const relativeY = e.clientY - rect.top;
                      const targetGap =
                        relativeY < rect.height / 2 ? index : index + 1;
                      handleDrop(e, targetGap);
                    }}
                    className="relative cursor-default rounded-2xl"
                  >
                    {/* Gap Indicator (Top) */}
                    {showGapBefore && (
                      <div className="my-1.5 flex items-center gap-1.5 px-2 pointer-events-none animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200"></span>
                        <div className="h-0.5 flex-1 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                        <span className="h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200"></span>
                      </div>
                    )}

                    {/* Match Row Card */}
                    <div
                      className={`flex items-center justify-between gap-2.5 p-3 my-1.5 rounded-2xl border transition-all ${
                        isBeingDragged ? "opacity-30 scale-[0.98]" : ""
                      } ${
                        match.isCompleted
                          ? "border-emerald-200 bg-emerald-50/30"
                          : "border-slate-200 bg-white shadow-2xs"
                      }`}
                    >
                      {/* Match Number / Status Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompleted(match.id);
                        }}
                        title={
                          match.isCompleted ? "Mark pending" : "Mark completed"
                        }
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md self-start mt-0.5 text-xs font-bold transition ${
                          match.isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {match.isCompleted ? "✓" : index + 1}
                      </button>

                      {/* Players & Scores Stack */}
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        {/* Team A */}
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`text-xs font-bold truncate ${
                              match.isCompleted
                                ? "text-slate-500"
                                : "text-slate-900"
                            }`}
                            title={match.teamA.map((p) => p.name).join(" & ")}
                          >
                            {match.teamA.map((p) => p.name).join(" & ")}
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={match.scoreA}
                            onPointerDown={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              onUpdateScore(
                                match.id,
                                e.target.value,
                                match.scoreB,
                              )
                            }
                            placeholder="0"
                            className="w-8 h-7 shrink-0 text-center text-xs font-black text-slate-900 bg-slate-100 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition"
                          />
                        </div>

                        {/* Team B */}
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`text-xs font-bold truncate ${
                              match.isCompleted
                                ? "text-slate-500"
                                : "text-slate-900"
                            }`}
                            title={match.teamB.map((p) => p.name).join(" & ")}
                          >
                            {match.teamB.map((p) => p.name).join(" & ")}
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={match.scoreB}
                            onPointerDown={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              onUpdateScore(
                                match.id,
                                match.scoreA,
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            className="w-8 h-7 shrink-0 text-center text-xs font-black text-slate-900 bg-slate-100 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition"
                          />
                        </div>
                      </div>

                      {/* Vertical Divider and Actions */}
                      <div className="flex flex-col gap-1.5 items-center justify-center shrink-0 border-l border-slate-100 pl-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(match);
                          }}
                          title="Edit match"
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
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
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <div
                          onTouchStart={(e) => handleTouchStart(e, index)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          title="Drag to reorder match"
                          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 active:text-emerald-600 px-1 py-0.5 touch-none"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Gap Indicator (Bottom of last item) */}
                    {showGapAfter && (
                      <div className="my-1.5 flex items-center gap-1.5 px-2 pointer-events-none animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200"></span>
                        <div className="h-0.5 flex-1 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                        <span className="h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200"></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE STANDINGS */}
        {activeTab === "standings" && (
          <div className="space-y-4 pb-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Sorted by Game Points (GW)</span>
              <span>{completedCount} matches counted</span>
            </div>
            <StandingsTable standings={standings} />
          </div>
        )}
      </div>

      {/* Footer Finish CTA */}
      <div className="pt-4 border-t border-slate-100 mt-2 sticky bottom-0 bg-slate-50 py-3">
        <button
          type="button"
          onClick={onEndSession}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition hover:bg-slate-800"
        >
          <span>Complete & View Summary</span>
          <span>🏆</span>
        </button>
      </div>

      {/* Form Modal for Adding / Editing Matches */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-all duration-300">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-modal-in">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                {editingMatch ? "Edit Match" : "Add Custom Match"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
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
                      (p) =>
                        p.name.trim().length > 0 &&
                        !otherSelectedIds.includes(p.id),
                    );
                    return (
                      <CustomPlayerSelect
                        key={`a-${idx}`}
                        players={availablePlayers}
                        selectedId={formTeamA[idx] || ""}
                        onChange={(id) => {
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
                      (p) =>
                        p.name.trim().length > 0 &&
                        !otherSelectedIds.includes(p.id),
                    );
                    return (
                      <CustomPlayerSelect
                        key={`b-${idx}`}
                        players={availablePlayers}
                        selectedId={formTeamB[idx] || ""}
                        onChange={(id) => {
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
                    handleDeleteMatch(editingMatch.id);
                    setIsFormModalOpen(false);
                  }}
                  className="rounded-2xl bg-rose-50 hover:bg-rose-100 px-4 py-3 text-xs font-bold text-rose-600 active:scale-[0.98] transition"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 active:scale-[0.98] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMatch}
                className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow-md active:scale-[0.98] transition"
              >
                Save Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal for Adding New Player */}
      {isAddPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-all duration-300">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-modal-in">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                Add New Player
              </h3>
              <button
                type="button"
                onClick={() => setIsAddPlayerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
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
                onClick={() => setIsAddPlayerModalOpen(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 active:scale-[0.98] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPlayerSubmit}
                className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow-md active:scale-[0.98] transition"
              >
                Add Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
