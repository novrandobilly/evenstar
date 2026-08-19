import React, { useState } from 'react';
import type { SessionConfig } from '../types/session';

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
  const isDoubles = session.matchFormat === 'doubles';
  const formatLabel = isDoubles ? 'Doubles (Americano)' : 'Singles';
  const completedCount = session.matches.filter((m) => m.isCompleted).length;
  const totalCount = session.matches.length;

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const formatTeam = (team: { name: string }[]) => {
    return team.map((p) => p.name).join(' / ');
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set transparent drag ghost or data
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorderMatches(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-4 py-5">
      <div>
        {/* Top App Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Live Session · {formatLabel}
            </span>
            <h1 className="text-base font-bold text-slate-900 truncate max-w-[220px]">
              {session.title || 'Tennis Session'}
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

        {/* Match List (Full natural page layout with draggable handle on each row) */}
        <div className="space-y-2 pb-4">
          {session.matches.map((match, index) => {
            const teamAName = formatTeam(match.teamA);
            const teamBName = formatTeam(match.teamB);
            const isBeingDragged = draggedIndex === index;
            const isTargeted = dragOverIndex === index;

            return (
              <div
                key={match.id}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center justify-between gap-2 p-3 rounded-2xl border transition-all ${
                  isBeingDragged ? 'opacity-40 scale-[0.98]' : ''
                } ${
                  isTargeted ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''
                } ${
                  match.isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-white shadow-2xs'
                }`}
              >
                {/* Match Number / Status Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleCompleted(match.id)}
                  title={match.isCompleted ? 'Mark pending' : 'Mark completed'}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${
                    match.isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {match.isCompleted ? '✓' : index + 1}
                </button>

                {/* Team A */}
                <div className="flex-1 text-right min-w-0">
                  <span
                    className={`text-xs font-bold truncate block ${
                      match.isCompleted ? 'text-slate-600' : 'text-slate-900'
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
                  onChange={(e) => onUpdateScore(match.id, e.target.value, match.scoreB)}
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
                  onChange={(e) => onUpdateScore(match.id, match.scoreA, e.target.value)}
                  placeholder="0"
                  className="w-8 h-8 shrink-0 text-center text-xs font-black text-slate-900 bg-slate-100 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition"
                />

                {/* Team B */}
                <div className="flex-1 text-left min-w-0">
                  <span
                    className={`text-xs font-bold truncate block ${
                      match.isCompleted ? 'text-slate-600' : 'text-slate-900'
                    }`}
                    title={teamBName}
                  >
                    {teamBName}
                  </span>
                </div>

                {/* Drag Handle (Right side) */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  title="Drag to reorder match"
                  className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 select-none px-1 py-1"
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
