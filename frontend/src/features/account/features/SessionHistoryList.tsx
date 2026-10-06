import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SessionConfig } from "../../../types/session";
import { useTPlan } from "../../../api/plan/useTPlan";
import UpgradeModal from "../../../components/UpgradeModal";

interface SessionHistoryListProps {
  sessions: SessionConfig[];
  isLoading: boolean;
}

export const SessionHistoryList: React.FC<SessionHistoryListProps> = ({
  sessions,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { isPro, isSessionWithinRetention } = useTPlan();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="pt-2">
        <div className="mb-3 px-1 flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Host Session History
          </span>
          {!isPro && sessions.length > 0 && (
            <span className="text-[10px] font-bold text-slate-400">
              Showing last 3 months
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-xs font-bold text-slate-400 animate-pulse bg-white rounded-2xl border border-chalk-200">
            Loading sessions from cloud...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-[#ded7c4] shadow-2xs">
            <span className="text-2xl block mb-1">🎾</span>
            <p className="text-xs font-bold text-slate-700">No completed sessions yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Complete a session to archive it to your cloud history.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.map((s) => {
              const isLocked =
                !isPro &&
                !isSessionWithinRetention(s.completedAt || s.createdAt);

              if (isLocked) {
                return (
                  <div
                    key={s.id}
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="relative w-full text-left rounded-2xl border border-chalk-300 bg-white/90 p-3.5 shadow-2xs hover:border-amber-400 transition cursor-pointer overflow-hidden group"
                  >
                    {/* Blurred Content */}
                    <div className="filter blur-[2px] opacity-40 select-none pointer-events-none flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
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
                        </div>
                      </div>
                      <span className="text-sm">→</span>
                    </div>

                    {/* Lock Overlay */}
                    <div className="absolute inset-0 flex items-center justify-between px-3.5 bg-white/30 backdrop-blur-[0.5px]">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 bg-amber-100/95 border border-amber-300/80 px-2.5 py-1 rounded-xl shadow-xs">
                        <span>🔒</span>
                        <span className="text-[10px] uppercase tracking-wider">
                          3+ mos old · Pro Only
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-court-850 bg-court-100 px-2 py-0.5 rounded-lg border border-court-500/20 group-hover:scale-105 transition">
                        Unlock ⚡
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => navigate(`/history/${s.id}`)}
                  className="w-full text-left rounded-2xl border border-chalk-300 bg-white p-3.5 shadow-2xs hover:border-court-500/40 hover:bg-chalk-50 transition active:scale-[0.99] cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
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
              );
            })}
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        reason="history_locked"
      />
    </>
  );
};

export default SessionHistoryList;
