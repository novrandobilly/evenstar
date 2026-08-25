import React from "react";

interface TabNavigationProps {
  activeTab: "matches" | "standings";
  setActiveTab: (tab: "matches" | "standings") => void;
  completedCount: number;
  totalCount: number;
  hasWins: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  completedCount,
  totalCount,
  hasWins,
}) => {
  return (
    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/80 rounded-2xl mb-4 text-xs font-bold">
      <button
        type="button"
        onClick={() => setActiveTab("matches")}
        className={`py-2 rounded-xl transition cursor-pointer ${
          activeTab === "matches"
            ? "bg-white text-slate-900 shadow-xs"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        Matches ({completedCount}/{totalCount})
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("standings")}
        className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
          activeTab === "standings"
            ? "bg-white text-slate-900 shadow-xs"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <span>Standings</span>
        {hasWins && <span className="flex h-2 w-2 rounded-full bg-emerald-500" />}
      </button>
    </div>
  );
};
