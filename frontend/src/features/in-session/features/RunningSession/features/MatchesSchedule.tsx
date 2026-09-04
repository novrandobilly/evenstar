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
    <div className="pb-4 space-y-2.5">
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
            className="relative cursor-default rounded-3xl"
          >
            {/* Gap Indicator (Top) */}
            {showGapBefore && (
              <div className="my-2 flex items-center gap-1.5 px-3 pointer-events-none animate-pulse">
                <span className="h-2.5 w-2.5 rounded-full bg-volt-500 ring-2 ring-court-600 shadow-sm"></span>
                <div className="h-1 flex-1 rounded-full bg-volt-400 shadow-sm"></div>
                <span className="h-2.5 w-2.5 rounded-full bg-volt-500 ring-2 ring-court-600 shadow-sm"></span>
              </div>
            )}

            {/* Match Row Card */}
            <div
              className={`flex items-center justify-between gap-3 p-3.5 rounded-3xl border transition-all ${
                isBeingDragged ? "opacity-30 scale-[0.98]" : ""
              } ${
                match.isCompleted
                  ? "border-court-500/30 bg-court-50/50 shadow-2xs"
                  : "border-[#ded7c4] bg-white shadow-xs hover:border-court-500/40"
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
                  match.isCompleted ? "Mark in progress" : "Mark completed"
                }
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl self-start mt-0.5 text-xs font-black transition cursor-pointer active:scale-90 ${
                  match.isCompleted
                    ? "bg-court-850 text-volt-300 shadow-sm"
                    : "bg-chalk-100 text-slate-700 hover:bg-court-100 hover:text-court-850 border border-[#ded7c4]"
                }`}
              >
                {match.isCompleted ? "✓" : index + 1}
              </button>

              {/* Players & Scores Stack */}
              <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                {/* Team A */}
                <div className="flex items-center justify-between gap-2.5">
                  <span
                    className={`text-xs font-extrabold truncate ${
                      match.isCompleted ? "text-slate-600" : "text-slate-900"
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
                    className="w-10 h-8 shrink-0 text-center font-mono text-sm font-black text-slate-900 bg-chalk-100 rounded-xl border border-[#ded7c4] focus:outline-none focus:bg-white focus:border-court-600 focus:ring-2 focus:ring-court-500/20 transition"
                  />
                </div>

                {/* Team B */}
                <div className="flex items-center justify-between gap-2.5">
                  <span
                    className={`text-xs font-extrabold truncate ${
                      match.isCompleted ? "text-slate-600" : "text-slate-900"
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
                    className="w-10 h-8 shrink-0 text-center font-mono text-sm font-black text-slate-900 bg-chalk-100 rounded-xl border border-[#ded7c4] focus:outline-none focus:bg-white focus:border-court-600 focus:ring-2 focus:ring-court-500/20 transition"
                  />
                </div>
              </div>

              {/* Vertical Divider and Actions */}
              <div className="flex flex-col gap-2 items-center justify-center shrink-0 border-l border-chalk-200 pl-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEditModal(match);
                  }}
                  title="Edit match lineup"
                  className="p-1.5 text-slate-400 hover:text-court-800 hover:bg-court-100/60 rounded-xl transition cursor-pointer"
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
                  className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-court-700 active:text-court-800 px-1 py-0.5 touch-none"
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
              <div className="my-2 flex items-center gap-1.5 px-3 pointer-events-none animate-pulse">
                <span className="h-2.5 w-2.5 rounded-full bg-volt-500 ring-2 ring-court-600 shadow-sm"></span>
                <div className="h-1 flex-1 rounded-full bg-volt-400 shadow-sm"></div>
                <span className="h-2.5 w-2.5 rounded-full bg-volt-500 ring-2 ring-court-600 shadow-sm"></span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
