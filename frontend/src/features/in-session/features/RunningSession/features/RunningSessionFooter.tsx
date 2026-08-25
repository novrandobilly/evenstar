import React from "react";

interface RunningSessionFooterProps {
  onEndSession: () => void;
}

export const RunningSessionFooter: React.FC<RunningSessionFooterProps> = ({
  onEndSession,
}) => {
  return (
    <div className="pt-4 border-t border-slate-100 mt-2 sticky bottom-0 bg-slate-50 py-3">
      <button
        type="button"
        onClick={onEndSession}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition hover:bg-slate-800 cursor-pointer"
      >
        <span>Complete & View Summary</span>
        <span>🏆</span>
      </button>
    </div>
  );
};
