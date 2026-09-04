import React from "react";
import { useNavigate } from "react-router-dom";

export const EmptyStateSession: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="text-4xl mb-4">🎾</div>
      <h2 className="text-lg font-bold text-slate-900">No Active Session</h2>
      <p className="text-xs text-slate-500 mt-1 max-w-xs">
        There is no session in progress. Create a new session to generate the
        match schedule.
      </p>
      <button
        type="button"
        onClick={() => navigate("/create-session")}
        className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md cursor-pointer"
      >
        Create Session
      </button>
    </div>
  );
};
