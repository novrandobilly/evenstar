import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../../../context/SessionContext";
import { calculateStandings } from "../../../../utils/standings";
import { useModal } from "../../../../context/modal";

import { useDragDropDesktop } from "../../hooks/useDragDropDesktop";
import { useDragDropMobile } from "../../hooks/useDragDropMobile";

import { TopAppBar } from "./features/TopAppBar";
import { TopActionButtons } from "./features/TopActionButtons";
import { TabNavigation } from "./features/TabNavigation";
import { MatchesSchedule } from "./features/MatchesSchedule";
import { LiveStandings } from "./features/LiveStandings";
import { RunningSessionFooter } from "./features/RunningSessionFooter";
import { EditMatchModal } from "./features/EditMatchModal";
import type { MatchItem } from "../../../../types/session";

export const RunningSession: React.FC = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const {
    session,
    reorderMatches,
    completeSession,
    editCustomMatch,
    deleteMatch,
  } = useSession();

  const [activeTab, setActiveTab] = useState<"matches" | "standings">("matches");

  // Modals visibility state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchItem | null>(null);

  const isDoubles = session.matchFormat === "doubles";
  const formatLabel = isDoubles ? "Doubles (Americano)" : "Singles";
  const completedCount = session.matches.filter((m) => m.isCompleted).length;
  const totalCount = session.matches.length;

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const desktopDrag = useDragDropDesktop({
    matchesCount: session.matches.length,
    onReorderMatches: reorderMatches,
  });

  const mobileDrag = useDragDropMobile({
    matchesCount: session.matches.length,
    rowRefs,
    onReorderMatches: reorderMatches,
  });

  const draggedIndex =
    desktopDrag.draggedIndex !== null
      ? desktopDrag.draggedIndex
      : mobileDrag.draggedIndex;
  const dropIndicatorIndex =
    desktopDrag.dropIndicatorIndex !== null
      ? desktopDrag.dropIndicatorIndex
      : mobileDrag.dropIndicatorIndex;

  const standings = calculateStandings(session.players, session.matches);

  const handleOpenEditModal = (match: MatchItem) => {
    setEditingMatch(match);
    setIsFormModalOpen(true);
  };

  const handleDeleteMatch = (matchId: string) => {
    showModal({
      title: "Delete Match?",
      description:
        "Are you sure you want to delete this match? This cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        deleteMatch(matchId);
      },
    });
  };

  const handleEndSession = () => {
    const uncompletedCount = session.matches.filter((m) => !m.isCompleted).length;
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

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-4 py-5 select-none">
      <div>
        <TopAppBar
          formatLabel={formatLabel}
          sessionTitle={session.title}
          onEndSession={handleEndSession}
        />

        <TopActionButtons />

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          completedCount={completedCount}
          totalCount={totalCount}
          hasWins={standings.some((s) => s.gamesWon > 0)}
        />

        {activeTab === "matches" && (
          <MatchesSchedule
            onOpenEditModal={handleOpenEditModal}
            desktopDrag={desktopDrag}
            mobileDrag={mobileDrag}
            draggedIndex={draggedIndex}
            dropIndicatorIndex={dropIndicatorIndex}
            rowRefs={rowRefs}
          />
        )}

        {activeTab === "standings" && (
          <LiveStandings
            completedCount={completedCount}
            standings={standings}
          />
        )}
      </div>

      <RunningSessionFooter onEndSession={handleEndSession} />

      <EditMatchModal
        isOpen={isFormModalOpen}
        editingMatch={editingMatch}
        session={session}
        onClose={() => setIsFormModalOpen(false)}
        onEditCustomMatch={editCustomMatch}
        onDeleteMatch={handleDeleteMatch}
      />
    </div>
  );
};
