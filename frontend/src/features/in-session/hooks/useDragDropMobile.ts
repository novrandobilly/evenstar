import React, { useState } from "react";

interface UseDragDropMobileParams {
  matchesCount: number;
  rowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onReorderMatches: (fromIndex: number, toIndex: number) => void;
}

export const useDragDropMobile = ({
  matchesCount,
  rowRefs,
  onReorderMatches,
}: UseDragDropMobileParams) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(
    null
  );

  const handleTouchStart = (_e: React.TouchEvent, index: number) => {
    setDraggedIndex(index);
    setDropIndicatorIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    const touchY = touch.clientY;

    let bestGap = 0;
    let found = false;

    for (let i = 0; i < matchesCount; i++) {
      const el = rowRefs.current[i];
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (touchY < midY) {
        bestGap = i;
        found = true;
        break;
      }
    }

    if (!found) bestGap = matchesCount;
    if (dropIndicatorIndex !== bestGap) setDropIndicatorIndex(bestGap);
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

  const handleTouchEnd = () => {
    if (draggedIndex !== null && dropIndicatorIndex !== null) {
      executeDrop(dropIndicatorIndex);
    }
    setDraggedIndex(null);
    setDropIndicatorIndex(null);
  };

  return {
    draggedIndex,
    dropIndicatorIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
