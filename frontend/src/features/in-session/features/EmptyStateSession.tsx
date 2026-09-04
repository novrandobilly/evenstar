import React from "react";
import { useNavigate } from "react-router-dom";

export const EmptyStateSession: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-court-100 text-3xl shadow-sm mb-4 border border-court-500/20">
        🎾
      </div>
      <h2 className="text-lg font-black text-slate-900 tracking-tight">No Active Match Session</h2>
      <p className="text-xs text-slate-500 mt-1 max-w-xs font-medium leading-relaxed">
        There is no match schedule currently running. Set up your players to start matchmaking.
      </p>
      <button
        type="button"
        onClick={() => navigate("/create-session")}
        className="mt-6 rounded-2xl bg-court-850 hover:bg-court-900 px-6 py-3.5 text-xs font-black text-volt-300 shadow-lg shadow-court-900/15 active:scale-[0.98] transition cursor-pointer border border-court-700/50"
      >
        Create New Session →
      </button>
    </div>
  );
};
