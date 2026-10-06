import React from "react";

interface RunningSessionFooterProps {
  onEndSession: () => void;
  onDiscardSession?: () => void;
}

export const RunningSessionFooter: React.FC<RunningSessionFooterProps> = ({
  onEndSession,
  onDiscardSession,
}) => {
  return (
    <div className="pt-3 border-t border-chalk-200 mt-2 sticky bottom-0 bg-[#fcfbf7]/95 backdrop-blur-md py-3 space-y-2">
      <button
        type="button"
        onClick={onEndSession}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 py-3.5 text-xs font-black text-volt-300 shadow-lg shadow-court-900/20 active:scale-[0.98] transition cursor-pointer border border-court-700/50"
      >
        <span>Complete & View Summary</span>
        <span className="text-sm">🏆</span>
      </button>

      {onDiscardSession && (
        <button
          type="button"
          onClick={onDiscardSession}
          className="w-full text-center text-[11px] font-bold text-slate-400 hover:text-rose-600 transition cursor-pointer py-0.5"
        >
          End & discard session without saving
        </button>
      )}
    </div>
  );
};
