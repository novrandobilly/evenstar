import React, { useState } from "react";

interface UseDragDropDesktopParams {
  matchesCount: number;
  onReorderMatches: (fromIndex: number, toIndex: number) => void;
}

export const useDragDropDesktop = ({
  matchesCount,
  onReorderMatches,
}: UseDragDropDesktopParams) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(
    null
  );

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOverRow = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const isTopHalf = relativeY < rect.height / 2;
    const targetGap = isTopHalf ? index : index + 1;

    if (dropIndicatorIndex !== targetGap) {
      setDropIndicatorIndex(targetGap);
    }
  };

  const executeDrop = (targetGap: number) => {
    if (draggedIndex !== null && targetGap !== null) {
      let finalIndex = targetGap;
      if (draggedIndex < targetGap) {
        finalIndex = targetGap - 1;
      }
      if (
        draggedIndex !== finalIndex &&
        finalIndex >= 0 &&
        finalIndex < matchesCount
      ) {
        onReorderMatches(draggedIndex, finalIndex);
      }
    }
    setDraggedIndex(null);
    setDropIndicatorIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetGap: number) => {
    e.preventDefault();
    e.stopPropagation();
    executeDrop(targetGap);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropIndicatorIndex(null);
  };

  return {
    draggedIndex,
    dropIndicatorIndex,
    handleDragStart,
    handleDragOverRow,
    handleDrop,
    handleDragEnd,
  };
};
