import React from 'react';
import type { SessionConfig, Round } from '../types/session';

interface RunningSessionScreenProps {
  session: SessionConfig;
  currentRound: Round;
  onNextRound: () => void;
  onEndSession: () => void;
  onScoreUpdate: (matchId: string, scoreA: number, scoreB: number) => void;
}

export const RunningSessionScreen: React.FC<RunningSessionScreenProps> = ({
  session,
  currentRound,
  onNextRound,
  onEndSession,
  onScoreUpdate,
}) => {
  const isDoubles = session.matchFormat === 'doubles';
  const formatLabel = isDoubles ? 'Doubles (Americano)' : 'Singles';

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

        {/* Round Badge / Header */}
        <div className="flex items-center justify-between mb-4 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Match Rotation
            </span>
            <div className="text-lg font-black tracking-tight">
              Round {currentRound.roundNumber}
            </div>
          </div>
          <div className="text-right text-xs text-slate-300">
            {currentRound.matches.length} {currentRound.matches.length === 1 ? 'Court' : 'Courts'} Active
          </div>
        </div>

        {/* Court Matches */}
        <div className="space-y-3">
          {currentRound.matches.map((match) => (
            <div
              key={match.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-900">
                  Court {match.courtNumber}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {isDoubles ? '2 vs 2' : '1 vs 1'}
                </span>
              </div>

              <div className="space-y-2">
                {/* Team A */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <span className="text-xs font-bold text-slate-800">
                      {match.teamA.map((p) => p.name).join(' & ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onScoreUpdate(match.id, Math.max(0, (match.scoreA || 0) - 1), match.scoreB || 0)
                      }
                      className="h-7 w-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 active:scale-95"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-black text-slate-900">
                      {match.scoreA || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onScoreUpdate(match.id, (match.scoreA || 0) + 1, match.scoreB || 0)
                      }
                      className="h-7 w-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-center text-[10px] font-bold text-slate-300 uppercase">
                  vs
                </div>

                {/* Team B */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <span className="text-xs font-bold text-slate-800">
                      {match.teamB.map((p) => p.name).join(' & ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onScoreUpdate(match.id, match.scoreA || 0, Math.max(0, (match.scoreB || 0) - 1))
                      }
                      className="h-7 w-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 active:scale-95"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-black text-slate-900">
                      {match.scoreB || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onScoreUpdate(match.id, match.scoreA || 0, (match.scoreB || 0) + 1)
                      }
                      className="h-7 w-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resting / Waiting Players */}
        {currentRound.restingPlayers.length > 0 && (
          <div className="mt-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Resting This Round ({currentRound.restingPlayers.length})
              </span>
              <span className="text-[10px] text-amber-600">Next up in queue</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentRound.restingPlayers.map((player) => (
                <span
                  key={player.id}
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs border border-amber-200/40"
                >
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA to Next Round */}
      <div className="pt-4 border-t border-slate-100 mt-4">
        <button
          type="button"
          onClick={onNextRound}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition"
        >
          <span>Next Round Rotation</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
