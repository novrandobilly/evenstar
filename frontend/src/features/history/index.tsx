import React from "react";
import { useNavigate } from "react-router-dom";
import { useTGetSessions } from "../../api/sessions/useTGetSessions";
import { useTDeleteSession } from "../../api/sessions/useTDeleteSession";
import { useModal } from "../../context/modal";
import BottomNavigation from "../../components/BottomNavigation";

export const HistoryListFeature: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useTGetSessions();
  const deleteSessionMutation = useTDeleteSession();
  const { showModal } = useModal();

  const savedSessions = sessions || [];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleDeleteHistory = (sessionId: string, sessionTitle: string) => {
    showModal({
      title: "Delete Session Record?",
      description: `Are you sure you want to permanently delete "${sessionTitle || "Tennis Session"}" from your history?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        deleteSessionMutation.mutate(sessionId);
      },
    });
  };

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
                <div
                  key={s.id}
                  className="rounded-2xl border border-chalk-300 bg-white shadow-2xs flex items-stretch overflow-hidden hover:border-court-500/40 transition group"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/history/${s.id}`)}
                    className="flex-1 text-left p-4 hover:bg-chalk-50 transition active:scale-[0.99] cursor-pointer"
                  >
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
                      <span className="text-[11px] font-bold text-court-600 group-hover:text-court-800 transition ml-auto">
                        View Results →
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteHistory(s.id, s.title)}
                    className="shrink-0 px-3.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition text-sm border-l border-chalk-100 cursor-pointer"
                    title="Delete session record"
                    aria-label="Delete session record"
                  >
                    ✕
                  </button>
                </div>
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
