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
    <div className="grid grid-cols-2 gap-1.5 p-1 bg-chalk-200/90 rounded-2xl mb-4 text-xs font-bold border border-[#ded7c4]">
      <button
        type="button"
        onClick={() => setActiveTab("matches")}
        className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
          activeTab === "matches"
            ? "bg-court-850 text-volt-300 shadow-md shadow-court-900/10 font-black"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/40 font-extrabold"
        }`}
      >
        <span>Matches</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-md ${
            activeTab === "matches"
              ? "bg-court-700 text-volt-200"
              : "bg-chalk-300/80 text-slate-600"
          }`}
        >
          {completedCount}/{totalCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("standings")}
        className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
          activeTab === "standings"
            ? "bg-court-850 text-volt-300 shadow-md shadow-court-900/10 font-black"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/40 font-extrabold"
        }`}
      >
        <span>Standings</span>
        {hasWins && (
          <span className="flex h-2 w-2 rounded-full bg-volt-400 animate-pulse" />
        )}
      </button>
    </div>
  );
};
