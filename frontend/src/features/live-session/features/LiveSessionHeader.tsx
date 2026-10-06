import React from "react";

interface LiveSessionHeaderProps {
  sessionTitle: string;
  formatLabel: string;
  isCompleted: boolean;
  completedCount: number;
  totalCount: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const LiveSessionHeader: React.FC<LiveSessionHeaderProps> = ({
  sessionTitle,
  formatLabel,
  isCompleted,
  completedCount,
  totalCount,
  onRefresh,
  isRefreshing = false,
}) => {
  const percentCompleted =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-3 pb-3 border-b border-chalk-200">
      {/* Brand & Connection Status Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎾</span>
          <span className="text-xs font-black uppercase tracking-widest text-slate-800">
            Kickserve <span className="text-court-600">Live</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Real-time SSE indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-court-100/80 rounded-full border border-court-500/20 shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-court-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-court-600" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-court-800">
              {isCompleted ? "Completed" : "Live Sync"}
            </span>
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh live board"
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-chalk-100 rounded-lg transition cursor-pointer"
            >
              <svg
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-court-600" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Session Title & Format Badge */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-black tracking-tight text-slate-900 truncate">
            {sessionTitle || "Tennis Session"}
          </h1>
          <span className="text-[10px] font-bold text-court-700 bg-chalk-100 px-2 py-0.5 rounded-lg border border-chalk-300 shrink-0">
            {formatLabel}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>Match Progress</span>
            <span className="font-mono text-slate-800">
              {completedCount} / {totalCount} completed ({percentCompleted}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-chalk-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isCompleted ? "bg-amber-400" : "bg-court-600"
              }`}
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Alert Banner */}
      {isCompleted && (
        <div className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-black shadow-2xs">
          <span>🏆</span>
          <span>Session has completed! Check final standings below.</span>
        </div>
      )}
    </div>
  );
};

export default LiveSessionHeader;
