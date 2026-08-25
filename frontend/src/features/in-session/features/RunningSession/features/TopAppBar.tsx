import React from "react";

interface TopAppBarProps {
  formatLabel: string;
  sessionTitle: string;
  onEndSession: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  formatLabel,
  sessionTitle,
  onEndSession,
}) => {
  return (
    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
          Live Session · {formatLabel}
        </span>
        <h1 className="text-base font-bold text-slate-900 truncate max-w-55">
          {sessionTitle || "Tennis Session"}
        </h1>
      </div>

      <button
        type="button"
        onClick={onEndSession}
        className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1 cursor-pointer"
      >
        End
      </button>
    </div>
  );
};
