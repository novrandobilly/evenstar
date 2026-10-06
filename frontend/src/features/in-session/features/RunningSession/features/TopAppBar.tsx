import React from "react";

interface TopAppBarProps {
  formatLabel: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ formatLabel }) => {
  return (
    <div className="mb-4">
      {/* 1. Uniform Centered Page Header */}
      <div className="flex items-center justify-center pt-1 mb-2">
        <h1 className="text-sm font-black uppercase tracking-widest text-slate-800 text-center">
          Running Session
        </h1>
      </div>

      {/* 2. Session Live Status */}
      <div className="flex items-center justify-center gap-1.5 pb-3 border-b border-chalk-200">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-court-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-court-600" />
        </span>
        <span className="text-[10px] font-black uppercase tracking-wider text-court-700">
          Live · {formatLabel}
        </span>
      </div>
    </div>
  );
};

export default TopAppBar;

