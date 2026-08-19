import React, { useState, useRef } from "react";
import type { SessionConfig } from "../types/session";

interface RunningSessionScreenProps {
  session: SessionConfig;
  onUpdateScore: (matchId: string, scoreA: string, scoreB: string) => void;
  onToggleCompleted: (matchId: string) => void;
  onReorderMatches: (fromIndex: number, toIndex: number) => void;
  onEndSession: () => void;
}

export const RunningSessionScreen: React.FC<RunningSessionScreenProps> = ({
  session,
  onUpdateScore,
  onToggleCompleted,
  onReorderMatches,
  onEndSession,
}) => {
  const isDoubles = session.matchFormat === "doubles";
  const formatLabel = isDoubles ? "Doubles (Americano)" : "Singles";
  const completedCount = session.matches.filter((m) => m.isCompleted).length;
  const totalCount = session.matches.length;

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(
    null,
  );

  // References to row DOM elements to compute touch positions fast
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const formatTeam = (team: { name: string }[]) => {
    return team.map((p) => p.name).join(" / ");
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

  // --- Mobile Instant Touch Handlers (0ms delay) ---
  const handleTouchStart = (_e: React.TouchEvent, index: number) => {
    // Start drag immediately on touch of the handle
    setDraggedIndex(index);
    setDropIndicatorIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;

    // Prevent screen scroll while dragging the handle
    if (e.cancelable) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    const touchY = touch.clientY;

    // Find the closest gap based on row bounding boxes
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

    if (!found) {
      bestGap = session.matches.length;
    }

    if (dropIndicatorIndex !== bestGap) {
      setDropIndicatorIndex(bestGap);
    }
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
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
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

        {/* Schedule Header / Progress */}
        <div className="flex items-center justify-between mb-4 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Match Schedule
            </span>
            <div className="text-base font-bold tracking-tight">
              {totalCount} Total Matches
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400">
              {completedCount} / {totalCount} Done
            </span>
          </div>
        </div>

        {/* Match List */}
        <div className="pb-4">
          {session.matches.map((match, index) => {
            const teamAName = formatTeam(match.teamA);
            const teamBName = formatTeam(match.teamB);
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
                className="relative cursor-default"
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
                  className={`flex items-center justify-between gap-2 p-3 my-1.5 rounded-2xl border transition-all ${
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
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${
                      match.isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {match.isCompleted ? "✓" : index + 1}
                  </button>

                  {/* Team A */}
                  <div className="flex-1 text-right min-w-0">
                    <span
                      className={`text-xs font-bold truncate block ${
                        match.isCompleted ? "text-slate-600" : "text-slate-900"
                      }`}
                      title={teamAName}
                    >
                      {teamAName}
                    </span>
                  </div>

                  {/* Score A Input */}
                  <input
                    type="text"
                    inputMode="numeric"
                    value={match.scoreA}
                    onPointerDown={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      onUpdateScore(match.id, e.target.value, match.scoreB)
                    }
                    placeholder="0"
                    className="w-8 h-8 shrink-0 text-center text-xs font-black text-slate-900 bg-slate-100 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition"
                  />

                  {/* VS Divider */}
                  <span className="text-[10px] font-bold text-slate-300 uppercase shrink-0">
                    vs
                  </span>

                  {/* Score B Input */}
                  <input
                    type="text"
                    inputMode="numeric"
                    value={match.scoreB}
                    onPointerDown={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      onUpdateScore(match.id, match.scoreA, e.target.value)
                    }
                    placeholder="0"
                    className="w-8 h-8 shrink-0 text-center text-xs font-black text-slate-900 bg-slate-100 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition"
                  />

                  {/* Team B */}
                  <div className="flex-1 text-left min-w-0">
                    <span
                      className={`text-xs font-bold truncate block ${
                        match.isCompleted ? "text-slate-600" : "text-slate-900"
                      }`}
                      title={teamBName}
                    >
                      {teamBName}
                    </span>
                  </div>

                  {/* Drag Handle Icon with 0ms Instant Mobile Touch Support */}
                  <div
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    title="Drag to reorder match"
                    className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 active:text-emerald-600 px-1 py-1 touch-none"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                    </svg>
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

      {/* Footer Finish CTA */}
      <div className="pt-4 border-t border-slate-100 mt-2 sticky bottom-0 bg-slate-50 py-3">
        <button
          type="button"
          onClick={onEndSession}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition hover:bg-slate-800"
        >
          <span>Complete & Exit Session</span>
        </button>
      </div>
    </div>
  );
};
