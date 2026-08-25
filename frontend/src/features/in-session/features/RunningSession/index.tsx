import React, { useState, useRef } from "react";
import type { SessionConfig, MatchItem } from "../../../../types/session";
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

interface RunningSessionProps {
  session: SessionConfig;
  onUpdateScore: (matchId: string, scoreA: string, scoreB: string) => void;
  onToggleCompleted: (matchId: string) => void;
  onReorderMatches: (fromIndex: number, toIndex: number) => void;
  onEndSession: () => void;
  onAddCustomMatch: (
    teamA: any[],
    teamB: any[],
  ) => { success: boolean; error?: string };
  onEditCustomMatch: (
    matchId: string,
    teamA: any[],
    teamB: any[],
  ) => { success: boolean; error?: string };
  onDeleteMatch: (matchId: string) => void;
  onAddPlayerWithName: (name: string) => void;
}

export const RunningSession: React.FC<RunningSessionProps> = ({
  session,
  onUpdateScore,
  onToggleCompleted,
  onReorderMatches,
  onEndSession,
  onAddCustomMatch,
  onEditCustomMatch,
  onDeleteMatch,
  onAddPlayerWithName,
}) => {
  const { showModal } = useModal();
  const [activeTab, setActiveTab] = useState<"matches" | "standings">(
    "matches",
  );

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
    onReorderMatches,
  });

  const mobileDrag = useDragDropMobile({
    matchesCount: session.matches.length,
    rowRefs,
    onReorderMatches,
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
        onDeleteMatch(matchId);
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-4 py-5 select-none">
      <div>
        <TopAppBar
          formatLabel={formatLabel}
          sessionTitle={session.title}
          onEndSession={onEndSession}
        />

        <TopActionButtons
          session={session}
          onAddCustomMatch={onAddCustomMatch}
          onAddPlayerWithName={onAddPlayerWithName}
        />

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          completedCount={completedCount}
          totalCount={totalCount}
          hasWins={standings.some((s) => s.gamesWon > 0)}
        />

        {activeTab === "matches" && (
          <MatchesSchedule
            session={session}
            onUpdateScore={onUpdateScore}
            onToggleCompleted={onToggleCompleted}
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

      <RunningSessionFooter onEndSession={onEndSession} />

      <EditMatchModal
        isOpen={isFormModalOpen}
        editingMatch={editingMatch}
        session={session}
        onClose={() => setIsFormModalOpen(false)}
        onEditCustomMatch={onEditCustomMatch}
        onDeleteMatch={handleDeleteMatch}
      />
    </div>
  );
};
