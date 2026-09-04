import React from "react";

interface RunningSessionFooterProps {
  onEndSession: () => void;
}

export const RunningSessionFooter: React.FC<RunningSessionFooterProps> = ({
  onEndSession,
}) => {
  return (
    <div className="pt-3 border-t border-chalk-200 mt-2 sticky bottom-0 bg-[#fcfbf7]/90 backdrop-blur-md py-3">
      <button
        type="button"
        onClick={onEndSession}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 py-3.5 text-xs font-black text-volt-300 shadow-lg shadow-court-900/20 active:scale-[0.98] transition cursor-pointer border border-court-700/50"
      >
        <span>Complete & View Summary</span>
        <span className="text-sm">🏆</span>
      </button>
    </div>
  );
};
