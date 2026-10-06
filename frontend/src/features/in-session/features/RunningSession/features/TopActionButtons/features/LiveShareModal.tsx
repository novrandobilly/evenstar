import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useSession } from "../../../../../../../context/SessionContext";
import { useToast } from "../../../../../../../context/ToastContext";

interface LiveShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveShareModal: React.FC<LiveShareModalProps> = ({ isOpen, onClose }) => {
  const { session, ensureLiveSessionSynced } = useSession();
  const { showToast } = useToast();
  const [activeSessionId, setActiveSessionId] = useState(session.id);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSyncing(true);
      ensureLiveSessionSynced()
        .then((id) => {
          setActiveSessionId(id);
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }
  }, [isOpen, ensureLiveSessionSynced]);

  if (!isOpen) return null;

  const liveUrl = `${window.location.origin}/live/${activeSessionId}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(liveUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = liveUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showToast({ message: "Live link copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({ message: "Failed to copy link", type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-court-950/70 p-4 backdrop-blur-xs transition-all duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-[#ded7c4] animate-modal-in flex flex-col items-center text-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-chalk-100">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-court-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-court-600" />
            </span>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Live Spectator Board
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold px-1.5 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-chalk-50 rounded-3xl border-2 border-dashed border-[#ded7c4] flex flex-col items-center justify-center shadow-inner my-1">
          {isSyncing ? (
            <div className="h-44 w-44 flex flex-col items-center justify-center gap-2">
              <div className="text-2xl animate-spin">🎾</div>
              <p className="text-[11px] font-bold text-slate-400">Syncing live board...</p>
            </div>
          ) : (
            <QRCodeSVG
              value={liveUrl}
              size={176}
              level="M"
              fgColor="#0b241c"
              bgColor="#fcfbf7"
              className="rounded-xl shadow-2xs"
            />
          )}
        </div>

        {/* Instructions */}
        <div>
          <p className="text-xs font-bold text-slate-800">
            Scan with phone camera
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 max-w-xs leading-relaxed">
            Players can watch live matches, court assignments, and standings in real-time. No account needed.
          </p>
        </div>

        {/* Link Box & Copy Button */}
        <div className="w-full flex items-center gap-2 p-1.5 bg-chalk-100/80 rounded-2xl border border-chalk-300">
          <input
            type="text"
            readOnly
            value={liveUrl}
            className="flex-1 bg-transparent px-2.5 text-[11px] font-bold text-slate-700 select-all outline-none truncate"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer active:scale-95 shrink-0 ${
              copied
                ? "bg-court-700 text-volt-300"
                : "bg-court-850 hover:bg-court-900 text-volt-300 shadow-xs"
            }`}
          >
            {copied ? "Copied! ✓" : "Copy Link"}
          </button>
        </div>

        {/* Close Button */}
        <div className="w-full pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-chalk-100 py-3 text-xs font-bold text-slate-700 hover:bg-chalk-200 transition cursor-pointer border border-[#ded7c4]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveShareModal;
