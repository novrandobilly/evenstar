import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { useModal } from "../../context/modal";
import PWAGuide from "../../components/PWAGuide";
import logo from "../../assets/logo.svg";

export const HomeFeature: React.FC = () => {
  const navigate = useNavigate();
  const { session, hasActiveSession, sessionHistory, deleteHistorySession } =
    useSession();
  const { showModal, hideModal } = useModal();

  const handleResume = () => {
    if (session.matches.length > 0) {
      navigate("/in-session");
    } else {
      navigate("/create-session");
    }
  };

  const handleOpenPwaGuide = () => {
    showModal({
      title: "Install Kickserve App",
      contentBody: <PWAGuide onClose={hideModal} />,
      hideActions: true,
    });
  };

  // Show newest first
  const historyNewestFirst = [...sessionHistory].reverse();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-7 max-w-md mx-auto w-full">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleOpenPwaGuide}
          className="inline-flex items-center gap-1.5 rounded-full border border-chalk-300 bg-white hover:bg-chalk-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs active:scale-[0.98] transition cursor-pointer"
        >
          <span>📱</span>
          <span>Use as App</span>
        </button>
      </div>

      {/* Brand Hero Card */}
      <div className="mt-6 rounded-3xl bg-linear-to-br from-court-900 via-court-850 to-court-950 p-6 text-white shadow-xl shadow-court-950/20 relative overflow-hidden border border-court-700/50">
        {/* Decorative Court Geometry */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-volt-500/15 to-transparent rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 border border-white/10 rounded-full pointer-events-none" />

        <div className="relative z-10">
          <img
            src={logo}
            alt="Kickserve"
            className="h-10 w-auto max-w-56 object-contain drop-shadow-sm brightness-105"
          />
          <div className="mt-3.5 space-y-0.5">
            <p className="text-sm font-bold text-chalk-100 tracking-tight">
              Minimalist Tennis Host Assistant
            </p>
            <p className="text-xs text-court-100/70 font-medium">
              Fair rotations, live standings & match schedules.
            </p>
          </div>
        </div>
      </div>

      {/* Center Actions Section */}
      <div className="space-y-4 my-auto py-6">
        {/* Active Session Card */}
        {hasActiveSession && (
          <div className="rounded-3xl border-2 border-volt-500/60 bg-white p-4.5 shadow-md shadow-court-900/5 relative overflow-hidden transition-all hover:border-volt-500">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-court-600" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-court-700">
                  {session.matches.length > 0
                    ? "Session in Play"
                    : "Active Draft"}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-chalk-100 text-[10px] font-extrabold text-slate-600 border border-chalk-200">
                {session.players.length} Players
              </span>
            </div>

            <div className="text-base font-extrabold text-slate-900 truncate mb-3">
              {session.title || "Tennis Session"}
            </div>

            <button
              type="button"
              onClick={handleResume}
              className="w-full rounded-2xl bg-court-850 hover:bg-court-900 py-3.5 text-xs font-black text-volt-300 active:scale-[0.99] transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Resume Session</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Primary CTA: Create Session */}
        <button
          type="button"
          onClick={() => navigate("/create-session")}
          className="group flex w-full items-center justify-between rounded-3xl bg-court-850 hover:bg-court-900 p-4 text-white shadow-xl shadow-court-900/15 active:scale-[0.98] transition-all cursor-pointer border border-court-700/40"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-volt-500 text-court-950 text-xl font-bold shadow-sm group-hover:scale-105 transition">
              🎾
            </div>
            <div className="text-left">
              <span className="block text-sm font-black tracking-tight text-white">
                Create New Session
              </span>
              <span className="block text-[11px] font-semibold text-court-100/70">
                Setup players & format
              </span>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-volt-400 group-hover:translate-x-0.5 transition font-bold text-sm">
            →
          </div>
        </button>

        {/* Past Sessions History */}
        {historyNewestFirst.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Recent Sessions
              </span>
              <span className="text-[10px] font-bold text-court-700 bg-court-100/60 px-2 py-0.5 rounded-full">
                {historyNewestFirst.length} Saved
              </span>
            </div>

            <div className="space-y-2">
              {historyNewestFirst.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-chalk-300 bg-white shadow-2xs flex items-stretch overflow-hidden hover:border-court-500/40 transition group"
                >
                  {/* Tappable card area */}
                  <button
                    type="button"
                    onClick={() => navigate(`/history/${s.id}`)}
                    className="flex-1 text-left p-3.5 hover:bg-chalk-50 transition active:scale-[0.99] cursor-pointer"
                  >
                    <div className="text-xs font-black text-slate-900 truncate">
                      {s.title || "Tennis Session"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-court-700 bg-court-50 px-1.5 py-0.5 rounded">
                        {s.players.length} players
                      </span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {s.completedAt
                          ? formatDate(s.completedAt)
                          : formatDate(s.createdAt)}
                      </span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] font-bold text-court-600 group-hover:text-court-800 transition">
                        View →
                      </span>
                    </div>
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => deleteHistorySession(s.id)}
                    className="shrink-0 px-3.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition text-sm border-l border-slate-100 cursor-pointer"
                    title="Delete session from history"
                    aria-label="Delete session from history"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer minimal info */}
      <div className="text-center pt-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          🎾 Kickserve · Powered by envienstudio.com
        </span>
      </div>
    </div>
  );
};

export default HomeFeature;
