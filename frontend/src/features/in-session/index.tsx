import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { useModal } from "../../context/modal";
import { RunningSession } from "./features/RunningSession/RunningSession";

export const InSessionFeature: React.FC = () => {
  const navigate = useNavigate();
  const {
    session,
    updateMatchScore,
    toggleMatchCompleted,
    reorderMatches,
    completeSession,
    addCustomMatch,
    editCustomMatch,
    deleteMatch,
    addPlayerWithName,
  } = useSession();
  const { showModal } = useModal();

  const handleEndSession = () => {
    const uncompletedCount = session.matches.filter(
      (m) => !m.isCompleted,
    ).length;
    const desc =
      uncompletedCount > 0
        ? `You still have ${uncompletedCount} unplayed matches. Are you sure you want to finish and view final standings?`
        : "Are you ready to complete the session and view the final results?";

    showModal({
      title: "Complete Session?",
      description: desc,
      confirmText: "Complete & View Results",
      cancelText: "Keep Playing",
      type: "primary",
      onConfirm: () => {
        completeSession();
        navigate("/session-summary");
      },
    });
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
      <RunningSession
        session={session}
        onUpdateScore={updateMatchScore}
        onToggleCompleted={toggleMatchCompleted}
        onReorderMatches={reorderMatches}
        onEndSession={handleEndSession}
        onAddCustomMatch={addCustomMatch}
        onEditCustomMatch={editCustomMatch}
        onDeleteMatch={deleteMatch}
        onAddPlayerWithName={addPlayerWithName}
      />
    </div>
  );
};

export default InSessionFeature;
