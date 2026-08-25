import React from "react";
import type { MatchItem } from "../../../../../types/session";
import { useSession } from "../../../../../context/SessionContext";

interface MatchesScheduleProps {
  onOpenEditModal: (match: MatchItem) => void;
  desktopDrag: {
    handleDragStart: (e: React.DragEvent, index: number) => void;
    handleDragEnd: () => void;
    handleDragOverRow: (e: React.DragEvent, index: number) => void;
    handleDrop: (e: React.DragEvent, targetGap: number) => void;
  };
  mobileDrag: {
    handleTouchStart: (e: React.TouchEvent, index: number) => void;
    handleTouchMove: (e: React.TouchEvent) => void;
    handleTouchEnd: () => void;
  };
  draggedIndex: number | null;
  dropIndicatorIndex: number | null;
  rowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const MatchesSchedule: React.FC<MatchesScheduleProps> = ({
  onOpenEditModal,
  desktopDrag,
  mobileDrag,
  draggedIndex,
  dropIndicatorIndex,
  rowRefs,
}) => {
  const { session, updateMatchScore, toggleMatchCompleted } = useSession();

  return (
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
            onDragStart={(e) => desktopDrag.handleDragStart(e, index)}
            onDragEnd={desktopDrag.handleDragEnd}
            onDragOver={(e) => desktopDrag.handleDragOverRow(e, index)}
            onDrop={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relativeY = e.clientY - rect.top;
              const targetGap =
                relativeY < rect.height / 2 ? index : index + 1;
              desktopDrag.handleDrop(e, targetGap);
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
                  toggleMatchCompleted(match.id);
                }}
                title={
                  match.isCompleted ? "Mark pending" : "Mark completed"
                }
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md self-start mt-0.5 text-xs font-bold transition cursor-pointer ${
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
                      match.isCompleted ? "text-slate-500" : "text-slate-900"
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
                      updateMatchScore(match.id, e.target.value, match.scoreB)
                    }
                    placeholder="0"
                    className="w-8 h-7 shrink-0 text-center text-xs font-black text-slate-900 bg-slate-100 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                {/* Team B */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-xs font-bold truncate ${
                      match.isCompleted ? "text-slate-500" : "text-slate-900"
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
                      updateMatchScore(match.id, match.scoreA, e.target.value)
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
                    onOpenEditModal(match);
                  }}
                  title="Edit match"
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
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
                  onTouchStart={(e) => mobileDrag.handleTouchStart(e, index)}
                  onTouchMove={mobileDrag.handleTouchMove}
                  onTouchEnd={mobileDrag.handleTouchEnd}
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
  );
};
