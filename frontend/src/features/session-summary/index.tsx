import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { useModal } from "../../context/modal";
import { calculateStandings } from "../../utils/standings";
import { StandingsTable } from "../in-session/features/RunningSession/features/StandingsTable";
import { generateShareText } from "./shareText";
import { shareStandingsAsImage } from "../../utils/shareImage";

export const SessionSummaryFeature: React.FC = () => {
  const navigate = useNavigate();
  const { sessionHistory } = useSession();
  const { showModal } = useModal();
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // The just-completed session is the last entry in history
  const session = sessionHistory[sessionHistory.length - 1];

  const standings = session
    ? calculateStandings(session.players, session.matches)
    : [];
  const isDoubles = session?.matchFormat === "doubles";
  const formatLabel = isDoubles ? "Doubles (Americano)" : "Singles";

  const firstPlace = standings[0];
  const secondPlace = standings[1];
  const thirdPlace = standings[2];

  // Clipboard copy helper
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // continue to fallback
      }
    }
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  const handleShareImage = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const result = await shareStandingsAsImage(
        session?.title || "Tennis Session Results",
        formatLabel,
        standings,
      );
      if (result.message) {
        setNotification(result.message);
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error("Failed to share standings image:", err);
      setNotification("Failed to share standings image");
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyText = async () => {
    const textSummary = generateShareText(
      session?.title || "Tennis Session",
      formatLabel,
      session?.players.length ?? 0,
      standings,
    );
    const success = await copyToClipboard(textSummary);
    if (success) {
      setNotification("Copied leaderboard to clipboard!");
      setTimeout(() => setNotification(null), 2500);
    } else {
      setNotification("Failed to copy to clipboard");
      setTimeout(() => setNotification(null), 2500);
    }
  };

  const handleStartNewSession = () => {
    showModal({
      title: "Start New Session?",
      description:
        "Ready to start a fresh session? Your results have already been saved to history.",
      confirmText: "Start New Session",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        navigate("/create-session");
      },
    });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (!session) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4">🎾</div>
        <h2 className="text-lg font-black text-slate-900">No Session Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs font-medium">
          There is no completed session to display.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-2xl bg-court-850 hover:bg-court-900 px-6 py-3.5 text-xs font-black text-volt-300 shadow-md cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-4 py-6 select-none font-sans">
      <div className="space-y-4">
        {/* Header Branding */}
        <div className="text-center pt-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-100 to-amber-200 text-3xl shadow-sm mb-2.5 ring-4 ring-amber-50">
            🏆
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Tournament Complete!
          </h1>
          <p className="text-xs font-bold text-court-700 mt-0.5">
            {session.title || "Tennis Session"} · {formatLabel}
          </p>
        </div>

        {/* Social Share & Copy Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Native Image Share Button */}
          <button
            type="button"
            onClick={handleShareImage}
            disabled={isSharing}
            className="flex items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 px-4 py-3.5 text-xs font-black text-volt-300 shadow-md shadow-court-900/15 disabled:opacity-60 active:scale-[0.98] transition cursor-pointer border border-court-700/40"
          >
            {isSharing ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin text-volt-300"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-volt-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span>Share Image</span>
              </>
            )}
          </button>

          {/* Secondary Copy Text Action */}
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#ded7c4] bg-white px-4 py-3.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-chalk-50 hover:border-court-500/40 active:scale-[0.98] transition cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-court-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            <span>Copy Text</span>
          </button>
        </div>

        {/* Feedback Notification Toast */}
        {notification && (
          <div className="rounded-2xl bg-court-850 text-volt-300 text-xs font-black py-3 px-4 text-center shadow-lg animate-fade-in flex items-center justify-center gap-2 border border-court-700/50">
            <span>✓</span>
            <span>{notification}</span>
          </div>
        )}

        {/* Top 3 Podium Cards */}
        {firstPlace && (
          <div className="rounded-3xl border border-[#ded7c4] bg-white p-4 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-court-800 block text-center mb-3">
              Podium Finishers
            </span>
            <div className="grid grid-cols-3 gap-2 items-end pt-2 pb-1">
              {/* 2nd Place (Left) */}
              <div className="flex flex-col items-center text-center">
                {secondPlace ? (
                  <>
                    <span className="text-2xl mb-1">🥈</span>
                    <span className="text-xs font-black text-slate-900 truncate w-full px-1">
                      {secondPlace.player.name}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-500">
                      {secondPlace.diff > 0
                        ? `+${secondPlace.diff}`
                        : secondPlace.diff}
                    </span>
                    <div className="w-full h-14 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl mt-2 flex items-center justify-center font-mono font-black text-slate-500 text-sm border-t-2 border-slate-300">
                      2
                    </div>
                  </>
                ) : (
                  <div className="w-full h-14 bg-chalk-100 rounded-t-2xl mt-2" />
                )}
              </div>

              {/* 1st Place (Center - Elevated) */}
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-1 animate-bounce">🥇</span>
                <span className="text-xs font-black text-slate-900 truncate w-full px-1">
                  {firstPlace.player.name}
                </span>
                <span className="font-mono text-xs font-black text-court-700">
                  {firstPlace.diff > 0
                    ? `+${firstPlace.diff}`
                    : firstPlace.diff}
                </span>
                <div className="w-full h-20 bg-gradient-to-t from-amber-300/40 via-amber-200/30 to-amber-100/30 border-t-2 border-amber-400 rounded-t-2xl mt-2 flex items-center justify-center font-mono font-black text-amber-800 text-base shadow-xs">
                  1
                </div>
              </div>

              {/* 3rd Place (Right) */}
              <div className="flex flex-col items-center text-center">
                {thirdPlace ? (
                  <>
                    <span className="text-2xl mb-1">🥉</span>
                    <span className="text-xs font-black text-slate-900 truncate w-full px-1">
                      {thirdPlace.player.name}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-500">
                      {thirdPlace.diff > 0
                        ? `+${thirdPlace.diff}`
                        : thirdPlace.diff}
                    </span>
                    <div className="w-full h-10 bg-gradient-to-t from-amber-200/40 to-amber-100/20 rounded-t-2xl mt-2 flex items-center justify-center font-mono font-black text-amber-900 text-sm border-t-2 border-amber-300">
                      3
                    </div>
                  </>
                ) : (
                  <div className="w-full h-10 bg-chalk-100 rounded-t-2xl mt-2" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Full Final Standings Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Complete Standings
            </span>
            <span className="text-[10px] font-bold text-court-700 bg-court-100/70 px-2 py-0.5 rounded-full">
              Final Official Results
            </span>
          </div>
          <StandingsTable standings={standings} isFinal={true} />
        </div>

        {/* Collapsible Match History Breakdown */}
        <div className="rounded-3xl border border-[#ded7c4] bg-white overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setShowMatchHistory(!showMatchHistory)}
            className="flex w-full items-center justify-between p-4 text-xs font-black text-slate-900 hover:bg-chalk-50 transition cursor-pointer"
          >
            <span>Match Scores Breakdown ({session.matches.length})</span>
            <span className="text-court-700 font-bold">
              {showMatchHistory ? "▲" : "▼"}
            </span>
          </button>

          {showMatchHistory && (
            <div className="divide-y divide-chalk-100 p-2.5 pt-0 space-y-1">
              {session.matches.map((m, idx) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-2.5 px-2 text-xs"
                >
                  <span className="font-mono text-slate-400 font-bold w-6">
                    #{idx + 1}
                  </span>
                  <div className="flex-1 text-right font-extrabold truncate text-slate-800 pr-2.5">
                    {m.teamA.map((p) => p.name).join(" / ")}
                  </div>
                  <div className="font-mono font-black bg-chalk-100 px-2.5 py-1 rounded-lg text-slate-900 text-[11px] border border-[#ded7c4]">
                    {m.scoreA || "0"} - {m.scoreB || "0"}
                  </div>
                  <div className="flex-1 text-left font-extrabold truncate text-slate-800 pl-2.5">
                    {m.teamB.map((p) => p.name).join(" / ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="pt-6 pb-2 space-y-2">
        <button
          type="button"
          onClick={handleStartNewSession}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 py-4 text-xs font-black text-volt-300 shadow-lg shadow-court-900/20 active:scale-[0.98] transition cursor-pointer border border-court-700/50"
        >
          <span>Start New Session</span>
          <span className="text-base">🎾</span>
        </button>
        <button
          type="button"
          onClick={handleBackToHome}
          className="flex w-full items-center justify-center py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SessionSummaryFeature;
