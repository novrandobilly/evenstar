import React from 'react';

interface HomeScreenProps {
  onCreateSession: () => void;
  hasSavedSession: boolean;
  onResumeSession?: () => void;
  savedSessionTitle?: string;
  savedPlayerCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onCreateSession,
  hasSavedSession,
  onResumeSession,
  savedSessionTitle,
  savedPlayerCount,
}) => {
  return (
    <div className="flex flex-1 flex-col justify-between px-6 py-10 max-w-md mx-auto w-full">
      {/* Top clean brand */}
      <div className="pt-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-md shadow-emerald-600/20 mb-6">
          🎾
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Kickserve
        </h1>
        <p className="mt-2 text-sm text-slate-400 font-normal leading-relaxed">
          Minimalist tennis host assistant. Fair rotation, matchmaking & session manager.
        </p>
      </div>

      {/* Center Actions */}
      <div className="space-y-3 my-auto py-8">
        {hasSavedSession && onResumeSession && (
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <span>Active Session</span>
              <span>{savedPlayerCount} Players</span>
            </div>
            <div className="text-sm font-bold text-slate-900 truncate mb-3">
              {savedSessionTitle || 'Tennis Session'}
            </div>
            <button
              type="button"
              onClick={onResumeSession}
              className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-900 active:scale-[0.99] transition hover:bg-slate-200"
            >
              Resume Session
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onCreateSession}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition hover:bg-slate-800"
        >
          <span>Create Session</span>
          <span>→</span>
        </button>
      </div>

      {/* Footer minimal info */}
      <div className="text-center">
        <span className="text-[11px] font-medium text-slate-300">
          PWA Mobile First
        </span>
      </div>
    </div>
  );
};
