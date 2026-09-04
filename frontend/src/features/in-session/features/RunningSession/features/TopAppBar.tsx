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
    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-chalk-200">
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-court-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-court-600" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-court-700">
            Live Court · {formatLabel}
          </span>
        </div>
        <h1 className="text-base font-black text-slate-900 truncate max-w-56 tracking-tight">
          {sessionTitle || "Tennis Session"}
        </h1>
      </div>

      <button
        type="button"
        onClick={onEndSession}
        className="text-xs font-bold text-slate-500 hover:text-clay-600 hover:bg-clay-50 px-2.5 py-1.5 rounded-xl transition cursor-pointer border border-transparent hover:border-clay-500/20"
      >
        Finish
      </button>
    </div>
  );
};
