import React from "react";
import { useToast } from "../context/ToastContext";

export type UpgradeReason =
  | "roster"
  | "players_limit"
  | "history_locked"
  | "club_branding"
  | "general";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: UpgradeReason;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  reason = "general",
}) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const getReasonContent = () => {
    switch (reason) {
      case "roster":
        return {
          badge: "Roster Pool · Pro Feature",
          title: "Save Up To 100 Regular Players",
          desc: "Tired of typing player names every week? Pro members can save up to 100 community members and assemble matches in 1 tap.",
        };
      case "players_limit":
        return {
          badge: "Tournament Capacity · Pro Feature",
          title: "Host Tournaments Up To 32 Players",
          desc: "Free sessions support up to 12 players. Upgrade to Pro to run large multi-court tournaments for up to 32 players.",
        };
      case "history_locked":
        return {
          badge: "Full Archive · Pro Feature",
          title: "Unlock Lifetime Session Records",
          desc: "Free accounts keep recent 3-month history unblurred. Upgrade to Pro to unlock all past matches and complete seasonal archives.",
        };
      case "club_branding":
        return {
          badge: "Club Identity · Pro Feature",
          title: "Custom Club Logo on Live Board",
          desc: "Upgrade to Pro to upload your community logo (up to 1MB) and showcase your club identity on all spectator screens.",
        };
      default:
        return {
          badge: "Kickserve Pro",
          title: "Elevate Your Tournament Hosting",
          desc: "Unlock everything you need to run professional racquet sessions and tournaments with zero hassle.",
        };
    }
  };

  const content = getReasonContent();

  const handleUpgradeClick = () => {
    showToast({
      message: "Mayar payment gateway checkout will be connected next!",
      type: "info",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-court-950/75 p-4 backdrop-blur-xs transition-all duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-[#ded7c4] animate-modal-in flex flex-col text-left relative overflow-hidden">
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-volt-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header & Close */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-court-100 text-court-850 text-[10px] font-black uppercase tracking-wider border border-court-500/20 shadow-2xs">
            <span>⚡</span>
            <span>{content.badge}</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-black p-1 cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Title & Desc */}
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
            {content.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
            {content.desc}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="p-3.5 bg-chalk-50 rounded-2xl border border-chalk-300/80 space-y-2.5">
          <div className="flex items-start gap-2.5 text-xs">
            <span className="text-volt-500 font-black text-sm">✓</span>
            <div className="text-slate-800 font-bold">
              <span>Save 100 players in Roster</span>
              <span className="text-[11px] font-normal text-slate-500 block">
                1-tap lineup setup for regular sessions
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <span className="text-volt-500 font-black text-sm">✓</span>
            <div className="text-slate-800 font-bold">
              <span>Up to 32 players per session</span>
              <span className="text-[11px] font-normal text-slate-500 block">
                Multi-court Americano & tournaments (Free: 12)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <span className="text-volt-500 font-black text-sm">✓</span>
            <div className="text-slate-800 font-bold">
              <span>Unlimited lifetime session history</span>
              <span className="text-[11px] font-normal text-slate-500 block">
                Unlock all matches older than 3 months
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <span className="text-volt-500 font-black text-sm">✓</span>
            <div className="text-slate-800 font-bold">
              <span>Custom Club Logo branding</span>
              <span className="text-[11px] font-normal text-slate-500 block">
                Display your club logo on live spectator board
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="flex items-baseline justify-between px-2 pt-1">
          <div>
            <span className="text-xl font-black text-slate-900">Rp 49.000</span>
            <span className="text-xs font-bold text-slate-500"> / month</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-court-700 bg-court-100 px-2 py-0.5 rounded-md">
            Cancel anytime
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleUpgradeClick}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 py-3.5 text-xs font-black text-volt-300 shadow-md shadow-court-900/20 active:scale-[0.98] transition cursor-pointer border border-court-700/50"
          >
            <span>Upgrade to Pro with Mayar</span>
            <span className="text-sm">⚡</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-center py-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
