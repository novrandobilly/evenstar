import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { useModal } from "../../context/modal";
import PWAGuide from "../../components/PWAGuide";
import logo from "../../assets/logo.svg";

export const HomeFeature: React.FC = () => {
  const navigate = useNavigate();
  const { session, hasActiveSession, sessionHistory, deleteHistorySession } =
    useSession();
  const { showModal, hideModal } = useModal();

  const handleResume = () => {
    if (session.matches.length > 0) {
      navigate("/in-session");
    } else {
      navigate("/create-session");
    }
  };

  const handleOpenPwaGuide = () => {
    showModal({
      title: "Install Kickserve App",
      contentBody: <PWAGuide onClose={hideModal} />,
      hideActions: true,
    });
  };

  // Show newest first
  const historyNewestFirst = [...sessionHistory].reverse();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-1 flex-col w-full font-sans select-none">
      {/* 🎾 HERO SECTION MATCHING SCREENSHOT */}
      <div className="relative w-full min-h-[88vh] sm:min-h-160 flex flex-col justify-between p-6 overflow-hidden bg-slate-900">
        {/* Background Image Asset */}
        <div
          className="absolute inset-0 bg-cover bg-position-[center_right_-20px] sm:bg-center"
          style={{ backgroundImage: "url('/home-background.png')" }}
        />

        {/* High-Contrast Gradient Overlays for ultra clean text legibility */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Content Container (z-10) */}
        <div className="relative z-10 flex flex-col justify-between h-full flex-1">
          {/* Top Brand Bar */}
          <div className="flex items-end gap-2">
            <img
              src={logo}
              alt="Kickserve"
              className="h-5 w-auto object-contain drop-shadow-sm brightness-110"
            />
            <div className="flex items-end gap-1.5 pl-1.5 border-l border-white/20">
              <span className="text-[10px] font-normal tracking-wider text-slate-300 uppercase leading-none">
                BY
              </span>
              <span className="text-[10px] font-normal tracking-widest text-white uppercase leading-none">
                <span className="font-black">ENVIEN</span>
                STUDIO
              </span>
            </div>
          </div>

          {/* Hero Headline & Subtitle */}
          <div className="my-auto pt-8 pb-4">
            <h1 className="text-[54px] sm:text-[60px] font-black italic tracking-tighter leading-[0.92] text-left">
              <span className="block text-white drop-shadow-md -rotate-5">
                Plan
              </span>
              <span className="block text-white drop-shadow-md -rotate-5 pl-1.5">
                Less,
              </span>
              <span className="block text-volt-500 drop-shadow-md -rotate-5 pl-3">
                Play
              </span>
              <span className="block text-volt-500 drop-shadow-md -rotate-5 pl-4.5">
                More.
              </span>
            </h1>

            <div className="mt-5 space-y-0.5 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-sm text-left max-w-xs">
              <p className="text-white/90">Kickserve handles</p>
              <p className="text-white/90">the matchups, scores,</p>
              <p className="text-white/90">and standings.</p>
              <p className="text-volt-400 font-bold pt-0.5">
                You just bring your game.
              </p>
            </div>
          </div>

          {/* Bottom Action CTAs in Hero */}
          <div className="space-y-3 w-full max-w-70 sm:max-w-xs pb-2">
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => navigate("/create-session")}
              className="w-full flex items-center justify-between rounded-full bg-volt-500 hover:bg-volt-400 px-6 py-4 text-slate-950 font-black text-sm shadow-2xl shadow-black/40 active:scale-[0.98] transition cursor-pointer"
            >
              <span>Start a Session</span>
              <span className="text-base font-black">→</span>
            </button>

            {/* PWA App Install Button */}
            <button
              type="button"
              onClick={handleOpenPwaGuide}
              className="w-full flex items-center justify-center rounded-full bg-white hover:bg-slate-100 px-6 py-3.5 text-slate-950 font-bold text-xs shadow-lg shadow-black/20 active:scale-[0.98] transition cursor-pointer"
            >
              <span>Use Kickserve as App</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🎾 SESSIONS SECTION UNDER THE HERO */}
      <div className="px-5 py-6 bg-[#fcfbf7] space-y-5 border-t border-chalk-300">
        {/* Active Session in Progress Card */}
        {hasActiveSession && (
          <div className="rounded-3xl border-2 border-volt-500/70 bg-white p-4.5 shadow-md shadow-court-900/5 relative overflow-hidden transition-all hover:border-volt-500">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-court-600" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-court-700">
                  {session.matches.length > 0
                    ? "Session in Play"
                    : "Active Draft"}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-chalk-100 text-[10px] font-extrabold text-slate-600 border border-chalk-200">
                {session.players.length} Players
              </span>
            </div>

            <div className="text-base font-extrabold text-slate-900 truncate mb-3">
              {session.title || "Tennis Session"}
            </div>

            <button
              type="button"
              onClick={handleResume}
              className="w-full rounded-2xl bg-court-850 hover:bg-court-900 py-3.5 text-xs font-black text-volt-300 active:scale-[0.99] transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Resume Session</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Past Sessions History */}
        {historyNewestFirst.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Recent Sessions
              </span>
              <span className="text-[10px] font-bold text-court-700 bg-court-100/70 px-2.5 py-0.5 rounded-full border border-court-500/20">
                {historyNewestFirst.length} Saved
              </span>
            </div>

            <div className="space-y-2.5">
              {historyNewestFirst.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-chalk-300 bg-white shadow-2xs flex items-stretch overflow-hidden hover:border-court-500/40 transition group"
                >
                  {/* Tappable card area */}
                  <button
                    type="button"
                    onClick={() => navigate(`/history/${s.id}`)}
                    className="flex-1 text-left p-3.5 hover:bg-chalk-50 transition active:scale-[0.99] cursor-pointer"
                  >
                    <div className="text-xs font-black text-slate-900 truncate">
                      {s.title || "Tennis Session"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-court-700 bg-court-50 px-1.5 py-0.5 rounded">
                        {s.players.length} players
                      </span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {s.completedAt
                          ? formatDate(s.completedAt)
                          : formatDate(s.createdAt)}
                      </span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] font-bold text-court-600 group-hover:text-court-800 transition">
                        View →
                      </span>
                    </div>
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => deleteHistorySession(s.id)}
                    className="shrink-0 px-3.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition text-sm border-l border-chalk-100 cursor-pointer"
                    title="Delete session from history"
                    aria-label="Delete session from history"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center pt-3 pb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            🎾 Kickserve · by envienstudio.com
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeFeature;
