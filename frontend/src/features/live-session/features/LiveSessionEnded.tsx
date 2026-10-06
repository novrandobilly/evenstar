import React from "react";
import { useNavigate } from "react-router-dom";

interface LiveSessionEndedProps {
  message?: string;
}

export const LiveSessionEnded: React.FC<LiveSessionEndedProps> = ({
  message = "This live session has ended or is no longer active. The host may have finished or discarded it.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full select-none">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-chalk-100 border border-chalk-300 text-4xl shadow-inner mb-4">
        🎾
      </div>
      <h2 className="text-xl font-black tracking-tight text-slate-900">
        Session Ended or Not Found
      </h2>
      <p className="text-xs text-slate-500 mt-2 max-w-xs font-medium leading-relaxed">
        {message}
      </p>
      
      <div className="w-full mt-8 space-y-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-2xl bg-court-850 hover:bg-court-900 py-4 text-xs font-black text-volt-300 shadow-md shadow-court-900/15 transition cursor-pointer active:scale-98 border border-court-700/40"
        >
          Host Your Own Tournament
        </button>
        <p className="text-[11px] text-slate-400 font-bold">
          Kickserve — Free & Instant Racquet Matchmaker
        </p>
      </div>
    </div>
  );
};

export default LiveSessionEnded;
