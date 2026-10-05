import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../../context/SessionContext";

export const ActiveSessionCard: React.FC = () => {
  const navigate = useNavigate();
  const { session, hasActiveSession } = useSession();

  if (!hasActiveSession) return null;

  return (
    <div className="rounded-3xl border-2 border-volt-500/80 bg-white p-4 shadow-md shadow-court-900/5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-court-600" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-court-700">
            {session.matches.length > 0 ? "Session in Play" : "Active Draft"}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-chalk-100 text-[10px] font-extrabold text-slate-600 border border-chalk-200">
          {session.players.length} Players
        </span>
      </div>

      <div className="text-sm font-extrabold text-slate-900 truncate mb-2.5">
        {session.title || "Tennis Session"}
      </div>

      <button
        type="button"
        onClick={() => {
          if (session.matches.length > 0) {
            navigate("/in-session");
          } else {
            navigate("/create-session");
          }
        }}
        className="w-full rounded-xl bg-court-850 hover:bg-court-900 py-3 text-xs font-black text-volt-300 active:scale-[0.99] transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Resume Active Session</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default ActiveSessionCard;
