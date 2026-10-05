import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../../context/SessionContext";
import { useModal } from "../../../context/modal";
import { useToast } from "../../../context/ToastContext";

export const ActiveSessionCard: React.FC = () => {
  const navigate = useNavigate();
  const { session, hasActiveSession, resetSession } = useSession();
  const { showModal } = useModal();
  const { showToast } = useToast();

  if (!hasActiveSession) return null;

  const isPlay = session.matches.length > 0;

  const handleResume = () => {
    if (isPlay) {
      navigate("/in-session");
    } else {
      navigate("/create-session");
    }
  };

  const handleDiscard = () => {
    showModal({
      title: isPlay ? "End & Discard Session?" : "Discard Draft Session?",
      description: isPlay
        ? "This will end the current running session and clear all match progress. This cannot be undone."
        : "This will discard your current pre-session setup and clear player selections.",
      confirmText: "Discard Session",
      cancelText: "Keep Session",
      type: "danger",
      onConfirm: () => {
        resetSession();
        showToast({
          message: isPlay
            ? "Running session has been ended and cleared."
            : "Draft session cleared.",
          type: "info",
        });
      },
    });
  };

  return (
    <div className="rounded-3xl border-2 border-volt-500/80 bg-white p-4 shadow-md shadow-court-900/5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-court-600" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-court-700">
            {isPlay ? "Session in Play" : "Active Draft"}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-chalk-100 text-[10px] font-extrabold text-slate-600 border border-chalk-200">
          {session.players.length} Players
        </span>
      </div>

      <div className="text-sm font-extrabold text-slate-900 truncate mb-3">
        {session.title || "Tennis Session"}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleResume}
          className="flex-1 rounded-xl bg-court-850 hover:bg-court-900 py-3 text-xs font-black text-volt-300 active:scale-[0.99] transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Resume Session</span>
          <span>→</span>
        </button>

        <button
          type="button"
          onClick={handleDiscard}
          className="px-3.5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          title="End and discard session"
        >
          <svg
            className="w-3.5 h-3.5 text-rose-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          <span>End</span>
        </button>
      </div>
    </div>
  );
};

export default ActiveSessionCard;
