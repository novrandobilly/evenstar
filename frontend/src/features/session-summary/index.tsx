import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import { useModal } from '../../context/modal';
import { calculateStandings } from '../../utils/standings';
import { StandingsTable } from '../../components/StandingsTable';

export const SessionSummaryFeature: React.FC = () => {
  const navigate = useNavigate();
  const { session, resetSession } = useSession();
  const { showModal } = useModal();
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const standings = calculateStandings(session.players, session.matches);
  const isDoubles = session.matchFormat === 'doubles';
  const formatLabel = isDoubles ? 'Doubles (Americano)' : 'Singles';

  const firstPlace = standings[0];
  const secondPlace = standings[1];
  const thirdPlace = standings[2];

  const generateTextSummary = () => {
    const lines = [
      `🎾 *${session.title || 'Tennis Session'} - Final Results* 🏆`,
      `Format: ${formatLabel} | ${session.players.length} Players`,
      ``,
    ];

    standings.forEach((s) => {
      const medal = s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : `${s.rank}.`;
      lines.push(`${medal} ${s.player.name} — ${s.gamesWon} pts (${s.matchWins}-${s.matchLosses}, diff: ${s.diff >= 0 ? '+' : ''}${s.diff})`);
    });

    lines.push(``);
    lines.push(`Generated with Evenstar Tennis 🎾`);
    return lines.join('\n');
  };

  // Robust clipboard copy with fallback
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // continue to fallback
      }
    }
    // Fallback using textarea execCommand
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  const handleShareNative = async () => {
    const textSummary = generateTextSummary();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${session.title || 'Tennis Session'} - Final Results`,
          text: textSummary,
        });
        return;
      } catch (err: unknown) {
        // If user cancelled, don't fallback to copy
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }
    // Fallback: Copy to clipboard
    handleCopyText();
  };

  const handleCopyText = async () => {
    const text = generateTextSummary();
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedNotification('Copied leaderboard to clipboard!');
      setTimeout(() => setCopiedNotification(null), 2500);
    } else {
      setCopiedNotification('Failed to copy to clipboard');
      setTimeout(() => setCopiedNotification(null), 2500);
    }
  };

  const handleStartNewSession = () => {
    showModal({
      title: 'Start New Session?',
      description: 'Starting a new session will clear current session results. Make sure you have shared the leaderboard first.',
      confirmText: 'Start New Session',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        resetSession();
        navigate('/create-session');
      },
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

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
            {session.title || 'Tennis Session'} · {formatLabel}
          </p>
        </div>

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
                      {secondPlace.gamesWon} pts
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
                  {firstPlace.gamesWon} pts
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
                      {thirdPlace.gamesWon} pts
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

        {/* Social Share & Copy Actions - Modern Familiar Standard App Button Styles */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Primary Share Action */}
          <button
            type="button"
            onClick={handleShareNative}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 active:scale-[0.98] transition"
          >
            {/* Standard Mobile Share Arrow Icon */}
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
            <span>Share</span>
          </button>

          {/* Secondary Copy WhatsApp Action */}
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition"
          >
            {/* Standard Copy Clipboard Icon */}
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

        {/* Copy Toast Feedback */}
        {copiedNotification && (
          <div className="rounded-xl bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 text-center shadow-lg animate-fade-in flex items-center justify-center gap-2">
            <span>✓</span>
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Full Final Standings Table */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Complete Standings
          </span>
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
            <span className="text-slate-400">{showMatchHistory ? '▲' : '▼'}</span>
          </button>

          {showMatchHistory && (
            <div className="divide-y divide-slate-100 p-2 pt-0 space-y-1">
              {session.matches.map((m, idx) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-2 px-2 text-xs"
                >
                  <span className="text-slate-400 font-bold w-6">#{idx + 1}</span>
                  <div className="flex-1 text-right font-semibold truncate text-slate-800 pr-2">
                    {m.teamA.map((p) => p.name).join(' / ')}
                  </div>
                  <div className="font-black bg-slate-100 px-2 py-0.5 rounded text-slate-900 text-[11px]">
                    {m.scoreA || '0'} - {m.scoreB || '0'}
                  </div>
                  <div className="flex-1 text-left font-semibold truncate text-slate-800 pl-2">
                    {m.teamB.map((p) => p.name).join(' / ')}
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
