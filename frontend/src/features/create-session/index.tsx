import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { useModal } from "../../context/modal";
import { useTGetRoster } from "../../api/rosters/useTGetRoster";
import { useTSaveRoster } from "../../api/rosters/useTSaveRoster";
import { RosterPickerModal } from "./features/RosterPickerModal";
import {
  type Player,
  MIN_PLAYERS_DOUBLES,
  MIN_PLAYERS_SINGLES,
} from "../../types/session";
import { useTPlan } from "../../api/plan/useTPlan";
import UpgradeModal, { type UpgradeReason } from "../../components/UpgradeModal";

export const CreateSessionFeature: React.FC = () => {
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { showModal } = useModal();

  const {
    session,
    setSessionTitle,
    setMatchFormat,
    setDoublesMode,
    setPlayerCount,
    setRosterPlayers,
    addPlayer,
    removePlayer,
    updatePlayerName,
    startSession,
  } = useSession();

  const { data: roster } = useTGetRoster();
  const saveRosterMutation = useTSaveRoster();

  const { isPro, limits, features } = useTPlan();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<UpgradeReason>("general");

  const [isRosterPickerOpen, setIsRosterPickerOpen] = useState(false);

  const isDoubles = session.matchFormat === "doubles";
  const minRequired = isDoubles ? MIN_PLAYERS_DOUBLES : MIN_PLAYERS_SINGLES;
  const playerCount = session.players.length;
  const maxPlayersAllowed = limits.maxSessionPlayers;
  const filledCount = session.players.filter(
    (p) => p.name.trim().length > 0
  ).length;
  const canStart = filledCount >= minRequired;
  const hasUnfilledSlots = filledCount < playerCount;

  const handleDecrement = () => {
    if (playerCount > minRequired) {
      setPlayerCount(playerCount - 1);
    }
  };

  const handleIncrement = () => {
    if (playerCount >= maxPlayersAllowed) {
      setUpgradeReason("players_limit");
      setIsUpgradeModalOpen(true);
      return;
    }
    setPlayerCount(playerCount + 1);
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val > maxPlayersAllowed) {
        setPlayerCount(maxPlayersAllowed);
        setUpgradeReason("players_limit");
        setIsUpgradeModalOpen(true);
      } else {
        setPlayerCount(val);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === playerCount - 1) {
        if (playerCount < maxPlayersAllowed) {
          addPlayer();
          setTimeout(() => {
            inputRefs.current[index + 1]?.focus();
          }, 50);
        } else if (!isPro) {
          setUpgradeReason("players_limit");
          setIsUpgradeModalOpen(true);
        }
      } else {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOpenRosterPicker = () => {
    if (!features.canSaveRoster) {
      setUpgradeReason("roster");
      setIsUpgradeModalOpen(true);
      return;
    }
    setIsRosterPickerOpen(true);
  };

  const handleApplySelectedRoster = (selected: Player[]) => {
    setRosterPlayers(selected);
  };

  const handleSaveCurrentToPool = () => {
    if (!features.canSaveRoster) {
      setUpgradeReason("roster");
      setIsUpgradeModalOpen(true);
      return;
    }

    const currentNamed = session.players
      .map((p) => p.name.trim())
      .filter((n) => n.length > 0);

    if (currentNamed.length === 0) return;

    const existingPool = roster?.players || [];
    let newPool = [...existingPool];

    currentNamed.forEach((name) => {
      const exists = newPool.some(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );
      if (!exists) {
        newPool.push({
          id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name,
        });
      }
    });

    const isOverLimit = newPool.length > limits.maxRosterPlayers;
    if (isOverLimit) {
      newPool = newPool.slice(0, limits.maxRosterPlayers);
    }

    const successMessage = isOverLimit
      ? `Pool capacity is max ${limits.maxRosterPlayers} players. Saved first ${limits.maxRosterPlayers} to your pool!`
      : "Players saved to your roster pool!";

    saveRosterMutation.mutate({
      name: roster?.name || "My Players",
      players: newPool,
      successMessage,
    });
  };

  const proceedWithStart = () => {
    startSession();
    navigate("/in-session");
  };

  const handleStartSession = () => {
    if (!canStart) return;

    if (hasUnfilledSlots) {
      const emptyCount = playerCount - filledCount;
      showModal({
        title: `Proceed with ${filledCount} players?`,
        description: `You have ${emptyCount} unfilled player slot${
          emptyCount > 1 ? "s" : ""
        }. The session will proceed with only the ${filledCount} named players.`,
        confirmText: "Proceed Anyway",
        cancelText: "Cancel",
        type: "primary",
        onConfirm: proceedWithStart,
      });
    } else {
      proceedWithStart();
    }
  };

  const hasSavedRoster = roster && roster.players && roster.players.length > 0;

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-5 py-6 font-sans select-none">
      <div>
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pt-1 mb-5">
          <button
            type="button"
            onClick={() => navigate("/account")}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-chalk-100 transition cursor-pointer active:scale-95 -ml-1"
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <h1 className="text-sm font-black uppercase tracking-widest text-slate-800 text-center flex-1">
            Pre-Session
          </h1>

          <div className="w-8" />
        </div>

        {/* Session Title Input */}
        <div className="mb-5 bg-white p-4 rounded-2xl border border-chalk-300 shadow-2xs focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-500/20 transition">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
            Session Title
          </label>
          <input
            type="text"
            value={session.title}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder="e.g. Sunday Morning Club"
            className="w-full text-base font-extrabold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
          />
        </div>

        {/* Match Format: Doubles / Singles */}
        <div className="mb-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
            Match Format
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-chalk-200/80 rounded-2xl border border-chalk-300">
            <button
              type="button"
              onClick={() => setMatchFormat("doubles")}
              className={`py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                isDoubles
                  ? "bg-court-850 text-volt-300 shadow-md shadow-court-900/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <span>👥</span>
              <span>Doubles (2v2)</span>
            </button>
            <button
              type="button"
              onClick={() => setMatchFormat("singles")}
              className={`py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                !isDoubles
                  ? "bg-court-850 text-volt-300 shadow-md shadow-court-900/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <span>👤</span>
              <span>Singles (1v1)</span>
            </button>
          </div>
        </div>

        {/* Doubles Game Mode */}
        {isDoubles && (
          <div className="mb-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
              Game Mode
            </label>
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border-2 border-court-600/30 bg-white cursor-pointer hover:border-court-600 transition shadow-2xs">
              <input
                type="radio"
                name="doublesMode"
                value="americano"
                checked={session.doublesMode === "americano"}
                onChange={() => setDoublesMode("americano")}
                className="mt-0.5 h-4 w-4 text-court-700 accent-court-700 focus:ring-court-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">
                    Americano Tournament
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-volt-100 text-court-900 px-1.5 py-0.5 rounded">
                    Popular
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed font-medium">
                  Rotating partners every round with guaranteed fair playtime.
                </span>
              </div>
            </label>
          </div>
        )}

        {/* Unified Players Container */}
        <div className="mb-5">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
            Player Roster
          </label>

          <div className="rounded-3xl border border-chalk-300 bg-white p-4 shadow-xs">
            {/* Header with Stepper & Pick from Saved Roster */}
            <div className="flex items-center justify-between pb-3 border-b border-chalk-200 mb-3 gap-2">
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 block truncate">
                  Total Roster
                </span>
                <p className="text-[11px] text-court-700 font-bold mt-0.5">
                  {filledCount} of {playerCount} named (Min {minRequired})
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Clean Button: Saved Roster */}
                <button
                  type="button"
                  onClick={handleOpenRosterPicker}
                  className="inline-flex items-center gap-1.5 bg-court-50 hover:bg-court-100 text-court-850 hover:text-court-950 border border-court-500/30 px-2.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer active:scale-95 shadow-2xs"
                  title={
                    isPro
                      ? hasSavedRoster
                        ? `Select from ${roster?.players.length} players in your saved pool`
                        : "Pick players from your saved roster pool"
                      : "Upgrade to Pro to save and pick regular community members"
                  }
                >
                  <span className="text-xs">{isPro ? "⚡" : "🔒"}</span>
                  <span>Saved Roster</span>
                  {!isPro && (
                    <span className="text-[9px] font-black uppercase text-amber-900 bg-amber-200/80 px-1 py-0.2 rounded">
                      Pro
                    </span>
                  )}
                </button>

                <div className="h-4 w-px bg-chalk-200" />

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={playerCount <= minRequired}
                    className="h-8 w-8 rounded-xl bg-chalk-100 text-sm font-black text-slate-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition hover:bg-chalk-200 cursor-pointer flex items-center justify-center border border-chalk-300"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min={minRequired}
                    max={maxPlayersAllowed}
                    value={playerCount}
                    onChange={handleNumberInputChange}
                    className="w-10 text-center text-sm font-black text-slate-900 bg-chalk-50 rounded-xl py-1 border border-chalk-300 focus:outline-none focus:border-court-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={playerCount >= maxPlayersAllowed && isPro}
                    className="h-8 w-8 rounded-xl bg-chalk-100 text-sm font-black text-slate-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition hover:bg-chalk-200 cursor-pointer flex items-center justify-center border border-chalk-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Player Inputs */}
            <div className="space-y-2">
              {session.players.map((player, index) => {
                const isFilled = player.name.trim().length > 0;
                const canRemove = playerCount > minRequired;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all ${
                      isFilled
                        ? "border-court-500/30 bg-court-50/40"
                        : "border-chalk-300 bg-chalk-50/70 focus-within:border-court-600 focus-within:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black shrink-0 ${
                        isFilled
                          ? "bg-court-700 text-volt-300"
                          : "bg-chalk-200 text-slate-500"
                      }`}
                    >
                      {index + 1}
                    </span>

                    <input
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      value={player.name}
                      onChange={(e) => updatePlayerName(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      placeholder={`Player ${index + 1}`}
                      className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none"
                    />

                    {canRemove && (
                      <button
                        type="button"
                        onClick={() => removePlayer(index)}
                        className="text-slate-300 hover:text-rose-500 text-xs px-1.5 transition cursor-pointer"
                        title="Remove player"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Save Current Players to Pool Link */}
            {filledCount > 0 && (
              <div className="pt-3 mt-2 border-t border-chalk-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSaveCurrentToPool}
                  disabled={saveRosterMutation.isPending}
                  className="text-[11px] font-bold text-court-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>💾</span>
                  <span>
                    {saveRosterMutation.isPending
                      ? "Saving to Pool..."
                      : "Save these players to my pool"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Session CTA */}
      <div className="pt-4 border-t border-chalk-200 mt-2">
        <button
          type="button"
          disabled={!canStart}
          onClick={handleStartSession}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black transition cursor-pointer ${
            canStart
              ? "bg-court-850 hover:bg-court-900 text-volt-300 shadow-lg shadow-court-900/20 active:scale-[0.98] border border-court-700/50"
              : "bg-chalk-200 text-slate-400 cursor-not-allowed border border-chalk-300"
          }`}
        >
          <span>Generate Schedule & Start</span>
          <span className="text-base">🎾</span>
        </button>

        {!canStart && (
          <p className="text-center text-[11px] font-semibold text-slate-400 mt-2">
            Enter at least {minRequired} player names to generate matches
          </p>
        )}
      </div>

      {/* Roster Picker Modal */}
      <RosterPickerModal
        isOpen={isRosterPickerOpen}
        currentPlayers={session.players}
        onClose={() => setIsRosterPickerOpen(false)}
        onApplySelected={handleApplySelectedRoster}
      />

      {/* Upgrade to Pro Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        reason={upgradeReason}
      />
    </div>
  );
};

export default CreateSessionFeature;
