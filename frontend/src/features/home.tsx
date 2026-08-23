import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import logo from "../assets/logo.svg";

export const HomeFeature: React.FC = () => {
  const navigate = useNavigate();
  const { session, hasActiveSession, sessionHistory, deleteHistorySession } =
    useSession();

  const handleResume = () => {
    if (session.matches.length > 0) {
      navigate("/in-session");
    } else {
      navigate("/create-session");
    }
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
    <div className="flex flex-1 flex-col justify-between px-6 py-10 max-w-md mx-auto w-full">
      {/* Top Brand */}
      <div className="pt-12 flex flex-row items-start justify-start gap-4">
        <img src={logo} alt="Kickserve" className="h-21 w-21" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Kickserve
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-normal leading-relaxed">
            Minimalist tennis host assistant.
          </p>
          <p className="text-sm text-slate-400 font-normal leading-relaxed">
            Matchmaker & session manager.
          </p>
        </div>
      </div>

      {/* Center Actions */}
      <div className="space-y-3 my-auto py-8">
        {hasActiveSession && (
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <span>
                {session.matches.length > 0 ? "Live Session" : "Active Draft"}
              </span>
              <span>{session.players.length} Players</span>
            </div>
            <div className="text-sm font-bold text-slate-900 truncate mb-3">
              {session.title || "Tennis Session"}
            </div>
            <button
              type="button"
              onClick={handleResume}
              className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-900 active:scale-[0.99] transition hover:bg-slate-200"
            >
              Resume Session
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate("/create-session")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition hover:bg-slate-800"
        >
          <span>Create Session</span>
          <span>→</span>
        </button>

        {/* Past Sessions History */}
        {historyNewestFirst.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Past Sessions
              </span>
              <span className="text-[10px] font-semibold text-slate-300">
                {historyNewestFirst.length} / 3
              </span>
            </div>
            <div className="space-y-2">
              {historyNewestFirst.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-slate-100 bg-white shadow-xs flex items-stretch overflow-hidden"
                >
                  {/* Tappable card area — navigates to read-only view */}
                  <button
                    type="button"
                    onClick={() => navigate(`/history/${s.id}`)}
                    className="flex-1 text-left p-3.5 hover:bg-slate-50 transition active:scale-[0.99]"
                  >
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {s.title || "Tennis Session"}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {s.players.length} players
                      </span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {s.completedAt
                          ? formatDate(s.completedAt)
                          : formatDate(s.createdAt)}
                      </span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        View →
                      </span>
                    </div>
                  </button>
                  {/* Delete button — stops propagation so it doesn't navigate */}
                  <button
                    type="button"
                    onClick={() => deleteHistorySession(s.id)}
                    className="shrink-0 px-3.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition text-sm border-l border-slate-100"
                    title="Delete from history"
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
      <div className="text-center">
        <span className="text-[11px] font-medium text-slate-300">
          PWA Mobile First
        </span>
      </div>
    </div>
  );
};

export default HomeFeature;
