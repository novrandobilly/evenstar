import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { RunningSessionScreen } from "../../components/RunningSessionScreen";

export const InSessionFeature: React.FC = () => {
  const navigate = useNavigate();
  const {
    session,
    updateMatchScore,
    toggleMatchCompleted,
    reorderMatches,
    resetSession,
  } = useSession();

  const handleEndSession = () => {
    if (confirm("End this session and return to home?")) {
      resetSession();
      navigate("/");
    }
  };

  if (!session.matches || session.matches.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4">🎾</div>
        <h2 className="text-lg font-bold text-slate-900">No Active Session</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          There is no session in progress. Create a new session to generate the
          match schedule.
        </p>
        <button
          type="button"
          onClick={() => navigate("/create-session")}
          className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md"
        >
          Create Session
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 antialiased font-sans">
      <RunningSessionScreen
        session={session}
        onUpdateScore={updateMatchScore}
        onToggleCompleted={toggleMatchCompleted}
        onReorderMatches={reorderMatches}
        onEndSession={handleEndSession}
      />
    </div>
  );
};

export default InSessionFeature;
