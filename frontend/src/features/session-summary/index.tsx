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

  /**
   * SHARE STANDINGS AS IMAGE:
   * Dynamically renders the standings table into a clean PNG image and shares natively:
   * - iOS / Android / macOS Safari: Opens native OS Share Sheet with the image file
   * - Desktop macOS/Windows browsers: Copies image directly to clipboard or downloads PNG
   */
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
      <div className="flex min-h-dvh flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4">🎾</div>
        <h2 className="text-lg font-bold text-slate-900">No Session Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          There is no completed session to display.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-4 py-6 select-none font-sans">
      <div className="space-y-5">
        {/* Header Branding */}
        <div className="text-center pt-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm mb-2">
            🏆
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Session Completed!
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {session.title || "Tennis Session"} · {formatLabel}
          </p>
        </div>

        {/* Social Share & Copy Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Native Image Share Button (iOS / Android / macOS native share sheet & desktop fallback) */}
          <button
            type="button"
            onClick={handleShareImage}
            disabled={isSharing}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 disabled:opacity-60 active:scale-[0.98] transition cursor-pointer"
          >
            {isSharing ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin text-white"
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
                  className="w-4 h-4 text-white"
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
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition"
          >
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            <span>Copy Text</span>
          </button>
        </div>

        {/* Feedback Notification Toast */}
        {notification && (
          <div className="rounded-xl bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 text-center shadow-lg animate-fade-in flex items-center justify-center gap-2">
            <span>✓</span>
            <span>{notification}</span>
          </div>
        )}

        {/* Top 3 Podium Cards */}
        {firstPlace && (
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center mb-3">
              Podium Finishers
            </span>
            <div className="grid grid-cols-3 gap-2 items-end pt-2 pb-1">
              {/* 2nd Place (Left) */}
              <div className="flex flex-col items-center text-center">
                {secondPlace ? (
                  <>
                    <span className="text-xl mb-1">🥈</span>
                    <span className="text-xs font-bold text-slate-900 truncate w-full px-1">
                      {secondPlace.player.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {secondPlace.diff > 0
                        ? `+${secondPlace.diff}`
                        : secondPlace.diff}
                    </span>
                    <div className="w-full h-14 bg-slate-100 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-400 text-sm">
                      2
                    </div>
                  </>
                ) : (
                  <div className="w-full h-14 bg-slate-50 rounded-t-xl mt-2" />
                )}
              </div>

              {/* 1st Place (Center - Elevated) */}
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-1 animate-bounce">🥇</span>
                <span className="text-xs font-extrabold text-slate-900 truncate w-full px-1">
                  {firstPlace.player.name}
                </span>
                <span className="text-xs font-black text-emerald-600">
                  {firstPlace.diff > 0
                    ? `+${firstPlace.diff}`
                    : firstPlace.diff}
                </span>
                <div className="w-full h-20 bg-amber-400/20 border-t-2 border-amber-400 rounded-t-xl mt-2 flex items-center justify-center font-black text-amber-700 text-base shadow-xs">
                  1
                </div>
              </div>

              {/* 3rd Place (Right) */}
              <div className="flex flex-col items-center text-center">
                {thirdPlace ? (
                  <>
                    <span className="text-xl mb-1">🥉</span>
                    <span className="text-xs font-bold text-slate-900 truncate w-full px-1">
                      {thirdPlace.player.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {thirdPlace.diff > 0
                        ? `+${thirdPlace.diff}`
                        : thirdPlace.diff}
                    </span>
                    <div className="w-full h-10 bg-amber-100/50 rounded-t-xl mt-2 flex items-center justify-center font-black text-amber-800 text-sm">
                      3
                    </div>
                  </>
                ) : (
                  <div className="w-full h-10 bg-slate-50 rounded-t-xl mt-2" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Full Final Standings Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Complete Standings
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {session.title || "Kickserve"}
            </span>
          </div>
          <StandingsTable standings={standings} isFinal={true} />
        </div>

        {/* Collapsible Match History Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setShowMatchHistory(!showMatchHistory)}
            className="flex w-full items-center justify-between p-3.5 text-xs font-bold text-slate-900 hover:bg-slate-50 transition"
          >
            <span>Match Scores Breakdown ({session.matches.length})</span>
            <span className="text-slate-400">
              {showMatchHistory ? "▲" : "▼"}
            </span>
          </button>

          {showMatchHistory && (
            <div className="divide-y divide-slate-100 p-2 pt-0 space-y-1">
              {session.matches.map((m, idx) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-2 px-2 text-xs"
                >
                  <span className="text-slate-400 font-bold w-6">
                    #{idx + 1}
                  </span>
                  <div className="flex-1 text-right font-semibold truncate text-slate-800 pr-2">
                    {m.teamA.map((p) => p.name).join(" / ")}
                  </div>
                  <div className="font-black bg-slate-100 px-2 py-0.5 rounded text-slate-900 text-[11px]">
                    {m.scoreA || "0"} - {m.scoreB || "0"}
                  </div>
                  <div className="flex-1 text-left font-semibold truncate text-slate-800 pl-2">
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition hover:bg-emerald-700"
        >
          <span>Start New Session</span>
          <span>🎾</span>
        </button>
        <button
          type="button"
          onClick={handleBackToHome}
          className="flex w-full items-center justify-center py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SessionSummaryFeature;
