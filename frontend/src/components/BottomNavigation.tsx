import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useModal } from "../context/modal";
import logoSingle from "../assets/logo-single.svg";

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, resetSession } = useSession();
  const { showModal } = useModal();

  const isHistoryActive =
    location.pathname === "/history" || location.pathname.startsWith("/history/");
  const isAccountActive = location.pathname === "/account";

  const handleStartClick = () => {
    if (session.matches.length > 0) {
      showModal({
        title: "Active Session in Progress",
        description: `You currently have a running session ("${
          session.title || "Tennis Session"
        }") with ${session.matches.length} matches. Starting a new session will discard your current match progress.`,
        confirmText: "Discard & Start Fresh",
        cancelText: "Keep Playing",
        type: "danger",
        onConfirm: () => {
          resetSession();
          navigate("/create-session");
        },
      });
    } else {
      navigate("/create-session");
    }
  };

  return (
    <nav className="sticky bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-[#ded7c4] px-8 py-2 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between max-w-xs mx-auto relative">
        {/* 1. Left: History */}
        <button
          type="button"
          onClick={() => navigate("/history")}
          className={`flex flex-col items-center gap-1 transition cursor-pointer py-1 px-3 ${
            isHistoryActive
              ? "text-court-850 font-black"
              : "text-slate-400 hover:text-slate-600 font-bold"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={isHistoryActive ? 2.5 : 2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-[10px] uppercase tracking-wider">History</span>
        </button>

        {/* 2. Middle: Start Button (Dark container with neon volt Kickserve logo) */}
        <div className="flex flex-col items-center -mt-6">
          <button
            type="button"
            onClick={handleStartClick}
            className="h-14 w-14 rounded-full bg-court-850 hover:bg-court-900 border-4 border-[#fcfbf7] shadow-xl shadow-court-950/25 flex items-center justify-center cursor-pointer active:scale-95 transition"
            title="Start a new session"
          >
            <img
              src={logoSingle}
              alt="Start"
              className="h-7 w-auto object-contain"
            />
          </button>
          <span className="text-[10px] font-black uppercase tracking-wider text-court-800 mt-1">
            Start
          </span>
        </div>

        {/* 3. Right: Account */}
        <button
          type="button"
          onClick={() => navigate("/account")}
          className={`flex flex-col items-center gap-1 transition cursor-pointer py-1 px-3 ${
            isAccountActive
              ? "text-court-850 font-black"
              : "text-slate-400 hover:text-slate-600 font-bold"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={isAccountActive ? 2.5 : 2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-[10px] uppercase tracking-wider">Account</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;
