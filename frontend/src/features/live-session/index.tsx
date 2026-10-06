import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTLiveSession } from "../../api/sessions/useTLiveSession";
import { calculateStandings } from "../../utils/standings";

import { LiveSessionHeader } from "./features/LiveSessionHeader";
import { LiveMatchesView } from "./features/LiveMatchesView";
import { LiveStandingsView } from "./features/LiveStandingsView";
import { LiveSessionEnded } from "./features/LiveSessionEnded";

export const LiveSessionFeature: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"matches" | "standings">("matches");

  const {
    session,
    isLoading,
    isError,
    isDeleted,
    lastUpdatedMatchId,
    refetch,
  } = useTLiveSession(sessionId);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full select-none">
        <div className="text-3xl animate-spin mb-3">🎾</div>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
          Connecting to Court...
        </h2>
        <p className="text-xs font-bold text-slate-400 mt-1">
          Loading live spectator board
        </p>
      </div>
    );
  }

  if (isDeleted) {
    return (
      <LiveSessionEnded message="The host has ended or discarded this session." />
    );
  }

  if (isError || !session) {
    return (
      <LiveSessionEnded message="Session not found or link has expired. Check with your session host for a new link." />
    );
  }

  const isDoubles = session.matchFormat === "doubles";
  const formatLabel = isDoubles ? "Doubles (Americano)" : "Singles";
  const completedCount = session.matches.filter((m) => m.isCompleted).length;
  const totalCount = session.matches.length;
  const isCompleted = session.status === "completed";

  const standings = calculateStandings(session.players, session.matches);
  const hasWins = standings.some((s) => s.gamesWon > 0 || s.matchWins > 0);

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-4 py-5 select-none font-sans">
      <div className="space-y-4">
        {/* Header with Live Sync Status & Progress */}
        <LiveSessionHeader
          sessionTitle={session.title || "Tennis Session"}
          formatLabel={formatLabel}
          isCompleted={isCompleted}
          completedCount={completedCount}
          totalCount={totalCount}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-chalk-200/90 rounded-2xl text-xs font-bold border border-chalk-300 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("matches")}
            className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "matches"
                ? "bg-court-850 text-volt-300 shadow-md shadow-court-900/10 font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/40 font-extrabold"
            }`}
          >
            <span>Live Schedule</span>
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
            <span>Live Standings</span>
            {hasWins && (
              <span className="flex h-2 w-2 rounded-full bg-volt-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "matches" && (
          <LiveMatchesView
            matches={session.matches}
            lastUpdatedMatchId={lastUpdatedMatchId}
          />
        )}

        {activeTab === "standings" && (
          <LiveStandingsView
            standings={standings}
            isCompleted={isCompleted}
            completedCount={completedCount}
          />
        )}
      </div>

      {/* Footer Branding & Call to Action */}
      <div className="pt-6 pb-2 text-center space-y-2 border-t border-chalk-200 mt-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-xs font-bold text-court-700 hover:text-court-850 transition cursor-pointer flex items-center justify-center gap-1 mx-auto"
        >
          <span>Host a match with Kickserve</span>
          <span>→</span>
        </button>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Live Court-Side Board · Powered by Kickserve
        </p>
      </div>
    </div>
  );
};

export default LiveSessionFeature;
