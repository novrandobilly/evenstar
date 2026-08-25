import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import {
  MAX_PLAYERS,
  MIN_PLAYERS_DOUBLES,
  MIN_PLAYERS_SINGLES,
} from "../../types/session";

export const CreateSessionFeature: React.FC = () => {
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    session,
    setSessionTitle,
    setMatchFormat,
    setDoublesMode,
    setPlayerCount,
    addPlayer,
    removePlayer,
    updatePlayerName,
    startSession,
  } = useSession();

  const isDoubles = session.matchFormat === "doubles";
  const minRequired = isDoubles ? MIN_PLAYERS_DOUBLES : MIN_PLAYERS_SINGLES;
  const playerCount = session.players.length;
  const filledCount = session.players.filter(
    (p) => p.name.trim().length > 0,
  ).length;
  const isAllFilled = filledCount === playerCount && playerCount >= minRequired;

  const handleDecrement = () => {
    if (playerCount > minRequired) {
      setPlayerCount(playerCount - 1);
    }
  };

  const handleIncrement = () => {
    if (playerCount < MAX_PLAYERS) {
      setPlayerCount(playerCount + 1);
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setPlayerCount(val);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === playerCount - 1 && playerCount < MAX_PLAYERS) {
        addPlayer();
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 50);
      } else {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleStartSession = () => {
    startSession();
    navigate("/in-session");
  };

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-5 py-6">
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition"
          >
            ← Back
          </button>
        </div>

        {/* Session Title */}
        <div className="mb-6">
          <input
            type="text"
            value={session.title}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder="Session Name"
            className="w-full text-xl font-bold tracking-tight text-slate-900 placeholder:text-slate-300 focus:outline-none border-b border-slate-200 pb-2 focus:border-emerald-600 transition"
          />
        </div>

        {/* Match Format: Doubles / Singles */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Match Format
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setMatchFormat("doubles")}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                isDoubles
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Doubles (2v2)
            </button>
            <button
              type="button"
              onClick={() => setMatchFormat("singles")}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                !isDoubles
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Singles (1v1)
            </button>
          </div>
        </div>

        {/* Doubles Game Mode */}
        {isDoubles && (
          <div className="mb-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Game Mode
            </label>
            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300 transition">
              <input
                type="radio"
                name="doublesMode"
                value="americano"
                checked={session.doublesMode === "americano"}
                onChange={() => setDoublesMode("americano")}
                className="mt-0.5 h-4 w-4 text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block">
                  Americano
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 leading-relaxed">
                  Rotating partners each round with fair match rotation.
                </span>
              </div>
            </label>
          </div>
        )}

        {/* Unified Players Container (Count Control + Names) */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Players
          </label>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            {/* Header with Stepper */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Total Players
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {filledCount} of {playerCount} named (Min {minRequired})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={playerCount <= minRequired}
                  className="h-8 w-8 rounded-lg bg-slate-100 text-sm font-bold text-slate-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition hover:bg-slate-200"
                >
                  -
                </button>

                <input
                  type="number"
                  min={minRequired}
                  max={MAX_PLAYERS}
                  value={playerCount}
                  onChange={handleNumberInputChange}
                  className="w-12 text-center text-sm font-black text-slate-900 bg-slate-50 rounded-lg py-1 border border-slate-200 focus:outline-none focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={playerCount >= MAX_PLAYERS}
                  className="h-8 w-8 rounded-lg bg-slate-100 text-sm font-bold text-slate-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dynamic Player Inputs (Natural full list without inner scrollbar) */}
            <div className="space-y-2">
              {session.players.map((player, index) => {
                const isFilled = player.name.trim().length > 0;
                const canRemove = playerCount > minRequired;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 transition ${
                      isFilled
                        ? "border-slate-200 bg-white"
                        : "border-slate-100 bg-slate-50/70 focus-within:border-slate-400 focus-within:bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-400 min-w-[1.2rem] text-center">
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
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none"
                    />

                    {canRemove && (
                      <button
                        type="button"
                        onClick={() => removePlayer(index)}
                        className="text-slate-300 hover:text-rose-500 text-xs px-1 transition"
                        title="Remove player"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Start Session CTA */}
      <div className="pt-4 border-t border-slate-100 mt-2">
        <button
          type="button"
          disabled={!isAllFilled}
          onClick={handleStartSession}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition ${
            isAllFilled
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <span>Start Session</span>
          <span>🎾</span>
        </button>

        {!isAllFilled && (
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Fill in all {playerCount} player names to start
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateSessionFeature;
