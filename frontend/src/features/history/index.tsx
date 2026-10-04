import React from "react";
import { useNavigate } from "react-router-dom";
import { useTGetSessions } from "../../api/sessions/useTGetSessions";
import BottomNavigation from "../../components/BottomNavigation";

export const HistoryListFeature: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useTGetSessions();

  const savedSessions = sessions || [];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full font-sans select-none relative">
      <div className="px-5 pt-6 pb-4 space-y-5 flex-1">
        {/* Simple Text Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="w-8" />
          <h1 className="text-sm font-black uppercase tracking-widest text-slate-800">
            Session History
          </h1>
          <div className="w-8" />
        </div>

        {/* Sessions List */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1 block">
            All Sessions
          </span>

          {isLoading ? (
            <div className="p-6 text-center text-xs font-bold text-slate-400 animate-pulse bg-white rounded-2xl border border-chalk-200">
              Loading session records...
            </div>
          ) : savedSessions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#ded7c4] shadow-2xs">
              <span className="text-3xl block mb-2">🎾</span>
              <p className="text-xs font-bold text-slate-800">No session history yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Completed matches and standings will be archived here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedSessions.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => navigate(`/history/${s.id}`)}
                  className="w-full text-left rounded-2xl border border-chalk-300 bg-white p-4 shadow-2xs hover:border-court-500/40 hover:bg-chalk-50 transition active:scale-[0.99] cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-black text-slate-900 truncate">
                        {s.title || "Tennis Session"}
                      </h3>
                      <span className="text-[10px] font-bold text-court-700 bg-court-50 px-2 py-0.5 rounded-full shrink-0 border border-court-500/20">
                        {s.matchFormat === "doubles" ? "Doubles" : "Singles"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-bold text-slate-600">
                        {s.players.length} players
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-bold text-slate-600">
                        {s.matches.length} matches
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {s.completedAt ? formatDate(s.completedAt) : formatDate(s.createdAt)}
                      </span>
                    </div>
                  </div>

                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🎾 App Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
};

export default HistoryListFeature;
