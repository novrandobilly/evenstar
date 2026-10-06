import React, { useState } from "react";
import { useSession } from "../../../../../../context/SessionContext";
import { AddMatchModal } from "./features/AddMatchModal";
import { AddPlayerModal } from "./features/AddPlayerModal";
import { LiveShareModal } from "./features/LiveShareModal";

export const TopActionButtons: React.FC = () => {
  const { session, addCustomMatch, addPlayerWithName } = useSession();
  const [isAddMatchModalOpen, setIsAddMatchModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isLiveShareModalOpen, setIsLiveShareModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-3.5">
        <button
          type="button"
          onClick={() => setIsAddMatchModalOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-white border border-[#ded7c4] hover:border-court-500 hover:bg-court-50/50 py-2.5 px-2 text-xs font-bold text-slate-800 shadow-2xs active:scale-[0.98] transition cursor-pointer"
        >
          <span className="text-xs">🎾</span>
          <span>+ Match</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAddPlayerModalOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-white border border-[#ded7c4] hover:border-court-500 hover:bg-court-50/50 py-2.5 px-2 text-xs font-bold text-slate-800 shadow-2xs active:scale-[0.98] transition cursor-pointer"
        >
          <span className="text-xs">👤</span>
          <span>+ Player</span>
        </button>

        <button
          type="button"
          onClick={() => setIsLiveShareModalOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-court-50 border border-court-500/30 hover:bg-court-100 text-court-900 py-2.5 px-2 text-xs font-black shadow-2xs active:scale-[0.98] transition cursor-pointer"
          title="Share live court schedule & standings via QR code"
        >
          <span className="text-xs">📱</span>
          <span>Live QR</span>
        </button>
      </div>

      <AddMatchModal
        isOpen={isAddMatchModalOpen}
        session={session}
        onClose={() => setIsAddMatchModalOpen(false)}
        onAddCustomMatch={addCustomMatch}
      />

      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        session={session}
        onClose={() => setIsAddPlayerModalOpen(false)}
        onAddPlayerWithName={addPlayerWithName}
      />

      <LiveShareModal
        isOpen={isLiveShareModalOpen}
        onClose={() => setIsLiveShareModalOpen(false)}
      />
    </>
  );
};
