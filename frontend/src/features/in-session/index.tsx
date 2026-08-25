import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { useModal } from "../../context/modal";
import { EmptyStateSession } from "./features/EmptyStateSession";
import { RunningSession } from "./features/RunningSession";

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
    return <EmptyStateSession />;
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
