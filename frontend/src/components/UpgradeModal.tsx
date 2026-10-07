import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext";
import { useTProfile } from "../api/auth/useTProfile";
import { useTUpgrade } from "../api/payment/useTUpgrade";
import {
  useTPlans,
  FALLBACK_LIFETIME_PLAN,
  formatIdr,
  formatBillingCycle,
} from "../api/plan/useTPlans";
import { pb } from "../lib/pocketbase";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data: user } = useTProfile();
  const upgradeMutation = useTUpgrade();
  const { data: plans } = useTPlans();
  const activePlan = plans?.[0] || FALLBACK_LIFETIME_PLAN;

  const [isWaitingPayment, setIsWaitingPayment] = useState(false);
  const [openedUrl, setOpenedUrl] = useState<string | null>(null);

  // Prevent background scrolling when modal is active
  useEffect(() => {
    if (!isOpen) {
      setIsWaitingPayment(false);
      setOpenedUrl(null);
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Subscribe to realtime PocketBase updates on user record while modal is open
  useEffect(() => {
    if (!isOpen || !user?.id) return;

    let isSubscribed = true;

    pb.collection("users")
      .subscribe(user.id, (e) => {
        if (!isSubscribed) return;
        if (e.record.tier === "pro") {
          showToast({
            message: "🎉 Payment verified! Welcome to Kickserve Pro!",
          });
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          setIsWaitingPayment(false);
          onClose();
        }
      })
      .catch((err) => {
        console.warn("[UpgradeModal] Realtime subscription error:", err);
      });

    return () => {
      isSubscribed = false;
      pb.collection("users").unsubscribe(user.id).catch(() => {});
    };
  }, [isOpen, user?.id, onClose, queryClient, showToast]);

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
    if (!user) {
      showToast({
        message: "Please log in to your host account to upgrade.",
        type: "info",
      });
      onClose();
      navigate("/login");
      return;
    }

    upgradeMutation.mutate(
      { planCode: activePlan.code },
      {
        onSuccess: (data) => {
          if (data.paymentUrl) {
            setOpenedUrl(data.paymentUrl);
            setIsWaitingPayment(true);
            window.open(data.paymentUrl, "_blank");
          }
        },
      }
    );
  };

  const handleRefreshCheck = () => {
    queryClient.invalidateQueries({ queryKey: ["auth"] });
    showToast({
      message: "Checking payment status...",
      type: "info",
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-100 w-screen min-w-full h-screen min-h-dvh flex items-center justify-center bg-court-950/80 p-4 backdrop-blur-xs transition-all duration-300 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-chalk-300 animate-modal-in flex flex-col text-left relative overflow-hidden my-auto">
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-volt-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header & Close */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-court-100 text-court-850 text-[10px] font-black uppercase tracking-wider border border-court-500/20 shadow-2xs">
            <span>⚡</span>
            <span>{isWaitingPayment ? "Payment in Progress" : content.badge}</span>
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

        {isWaitingPayment ? (
          /* ⚡ Payment in Progress View */
          <div className="space-y-4 py-1">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                Checkout Tab Opened
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Complete your payment on the Mayar page using QRIS, Virtual Account, or E-Wallet.
              </p>
            </div>

            <div className="p-4 bg-court-50/70 rounded-2xl border border-court-500/20 flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-court-600" />
              </span>
              <span className="text-xs font-bold text-court-900">
                Awaiting instant confirmation from Mayar...
              </span>
            </div>

            <div className="space-y-2 pt-2">
              {openedUrl && (
                <button
                  type="button"
                  onClick={() => window.open(openedUrl, "_blank")}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 py-3.5 text-xs font-black text-volt-300 shadow-md shadow-court-900/20 active:scale-[0.98] transition cursor-pointer border border-court-700/50"
                >
                  <span>Re-open Mayar Checkout Page</span>
                  <span className="text-sm">↗</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRefreshCheck}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-chalk-100 hover:bg-chalk-200 py-3 text-xs font-bold text-slate-700 active:scale-[0.98] transition cursor-pointer border border-chalk-300"
              >
                <span>Check Status</span>
                <span>↻</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center py-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                Close & Wait in Background
              </button>
            </div>
          </div>
        ) : (
          /* Standard Pro Features & Pricing View */
          <>
            {/* Title */}
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                {content.title}
              </h3>
            </div>

            {/* Features Checklist */}
            <div className="p-3.5 bg-chalk-50 rounded-2xl border border-chalk-300/80 space-y-2.5">
              {(activePlan.features || []).map((featureText, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-court-100 text-court-800 text-[10px] font-black">
                    ✓
                  </span>
                  <span className="text-slate-800 font-bold">{featureText}</span>
                </div>
              ))}
            </div>

            {/* Pricing Box */}
            <div className="flex items-center justify-between px-1 pt-1">
              <div>
                <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {formatIdr(activePlan.price)}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  {formatBillingCycle(activePlan.billing_cycle)}
                </div>
              </div>
              <span className="shrink-0 whitespace-nowrap text-[11px] font-black uppercase tracking-wider text-court-850 bg-court-100 px-3 py-1.5 rounded-full border border-court-500/20 shadow-2xs">
                {activePlan.badge_label || "Lifetime Access"}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={upgradeMutation.isPending}
                onClick={handleUpgradeClick}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 py-3.5 text-xs font-black text-volt-300 shadow-md shadow-court-900/20 active:scale-[0.98] transition cursor-pointer border border-court-700/50 disabled:opacity-60"
              >
                {upgradeMutation.isPending ? (
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
                    <span>Connecting to Mayar...</span>
                  </>
                ) : (
                  <>
                    <span>Upgrade to Pro with Mayar</span>
                    <span className="text-sm">⚡</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center py-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default UpgradeModal;
