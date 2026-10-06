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
        };
      case "players_limit":
        return {
          badge: "Session Capacity · Pro Feature",
          title: "Host Sessions Up To 32 Players",
        };
      case "history_locked":
        return {
          badge: "Full Archive · Pro Feature",
          title: "Unlock Lifetime Session Records",
        };
      case "club_branding":
        return {
          badge: "Club Identity · Pro Feature",
          title: "Custom Club Logo on Live Board",
        };
      default:
        return {
          badge: "Kickserve Pro",
          title: "Elevate Your Hosting Experience",
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
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-chalk-300 animate-modal-in flex flex-col text-left relative overflow-hidden">
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

        {/* Title */}
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
            {content.title}
          </h3>
        </div>

        {/* Features Checklist */}
        <div className="p-3.5 bg-chalk-50 rounded-2xl border border-chalk-300/80 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-court-100 text-court-800 text-[10px] font-black">
              ✓
            </span>
            <span className="text-slate-800 font-bold">
              Save 100 players in Roster
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-court-100 text-court-800 text-[10px] font-black">
              ✓
            </span>
            <span className="text-slate-800 font-bold">
              Up to 32 players per session
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-court-100 text-court-800 text-[10px] font-black">
              ✓
            </span>
            <span className="text-slate-800 font-bold">
              Unlimited lifetime session history
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-court-100 text-court-800 text-[10px] font-black">
              ✓
            </span>
            <span className="text-slate-800 font-bold">
              Custom Club Logo branding
            </span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              Rp 499.000
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              One-time payment
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap text-[11px] font-black uppercase tracking-wider text-court-850 bg-court-100 px-3 py-1.5 rounded-full border border-court-500/20 shadow-2xs">
            Lifetime Access
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
