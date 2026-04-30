// frontend/src/components/MatchForm.tsx
import { useState, useMemo } from "react";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import type { MatchSubsession, MatchResult } from "@/data/sessions";

interface SetRow {
  ours: string;
  theirs: string;
}

type PlayerKey = "opponent1" | "opponent2" | "partner";
type AnonMap = Record<PlayerKey, boolean>;

const ANON_RESET: AnonMap = { opponent1: false, opponent2: false, partner: false };

function computeResult(sets: SetRow[]): MatchResult | null {
  const complete = sets.filter(
    (s) => s.ours !== "" && s.theirs !== "" && !isNaN(Number(s.ours)) && !isNaN(Number(s.theirs)) && Number(s.ours) >= 0 && Number(s.theirs) >= 0
  );
  if (complete.length === 0) return null;
  const won = complete.filter((s) => Number(s.ours) > Number(s.theirs)).length;
  const lost = complete.filter((s) => Number(s.ours) < Number(s.theirs)).length;
  if (won > lost) return "win";
  if (lost > won) return "loss";
  return "draw";
}

export interface MatchFormProps {
  sessionId: string;
  onAdd: (subsession: MatchSubsession) => void;
  onCancel: () => void;
}

export function MatchForm({ sessionId, onAdd, onCancel }: MatchFormProps) {
  const [event, setEvent] = useState<"Singles" | "Doubles">("Singles");
  const [opponent1, setOpponent1] = useState("");
  const [opponent2, setOpponent2] = useState("");
  const [partner, setPartner] = useState("");
  const [anon, setAnon] = useState<AnonMap>(ANON_RESET);
  const [sets, setSets] = useState<SetRow[]>([{ ours: "", theirs: "" }]);

  const result = useMemo(() => computeResult(sets), [sets]);

  const toggleAnon = (key: PlayerKey) =>
    setAnon((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateSet = (index: number, field: keyof SetRow, value: string) => {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const addSetRow = () => setSets((prev) => [...prev, { ours: "", theirs: "" }]);

  const removeSetRow = (index: number) =>
    setSets((prev) => prev.filter((_, i) => i !== index));

  const handleEventChange = (newEvent: "Singles" | "Doubles") => {
    setEvent(newEvent);
    setOpponent1("");
    setOpponent2("");
    setPartner("");
    setAnon(ANON_RESET);
    setSets([{ ours: "", theirs: "" }]);
  };

  const hasOpponent =
    event === "Singles"
      ? anon.opponent1 || opponent1.trim() !== ""
      : (anon.opponent1 || opponent1.trim() !== "") &&
        (anon.opponent2 || opponent2.trim() !== "");
  const hasCompleteSet = sets.some((s) => s.ours !== "" && s.theirs !== "");
  const canAdd = hasOpponent && hasCompleteSet && result !== null;

  const handleAdd = () => {
    if (!canAdd || !result) return;
    const subsession: MatchSubsession = {
      id: `${sessionId}-s${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "match",
      event,
      opponent: {
        opponentNames:
          event === "Singles"
            ? [anon.opponent1 ? "Anonymous" : opponent1.trim()]
            : [
                anon.opponent1 ? "Anonymous" : opponent1.trim(),
                anon.opponent2 ? "Anonymous" : opponent2.trim(),
              ],
        ...(event === "Doubles" && (anon.partner || partner.trim())
          ? { yourPartner: anon.partner ? "Anonymous" : partner.trim() }
          : {}),
      },
      result,
      sets: sets
        .filter((s) => s.ours !== "" && s.theirs !== "" && !isNaN(Number(s.ours)) && !isNaN(Number(s.theirs)) && Number(s.ours) >= 0 && Number(s.theirs) >= 0)
        .map((s) => ({ ours: Number(s.ours), theirs: Number(s.theirs) })),
    };
    onAdd(subsession);
  };

  const inputClass =
    "w-full rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors";
  const anonInputClass =
    "w-full rounded-md border border-dashed border-ivory-rule/80 bg-ivory-dark px-3 py-2 text-sm text-club-green-muted/60 italic";

  const AnonPill = ({ playerKey }: { playerKey: PlayerKey }) => (
    <button
      type="button"
      onClick={() => toggleAnon(playerKey)}
      className={cn(
        "text-[10px] uppercase tracking-[0.1em] rounded-full px-2.5 py-0.5 border transition-colors",
        anon[playerKey]
          ? "border-gold/60 bg-gold/10 text-gold font-semibold"
          : "border-ivory-rule text-club-green-muted/70 hover:border-gold/50 hover:text-gold"
      )}
    >
      {anon[playerKey] ? "✓ Anonymous" : "Anonymous"}
    </button>
  );

  return (
    <div className="rounded-xl border border-club-green/20 bg-ivory p-4 mb-4">
      <EvenStarText as="p" variant="label" tone="accent" caps className="font-semibold mb-3">
        New Match
      </EvenStarText>

      {/* Singles / Doubles toggle */}
      <div className="mb-3">
        <EvenStarText as="p" variant="meta" tone="muted" caps className="mb-1.5">
          Match Type
        </EvenStarText>
        <div className="flex gap-2">
          {(["Singles", "Doubles"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleEventChange(type)}
              className={cn(
                "flex-1 rounded-md border py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                event === type
                  ? "border-club-green bg-club-green text-ivory"
                  : "border-ivory-rule text-club-green-muted hover:border-gold hover:text-gold"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Name fields */}
      <div className="mb-3 space-y-2">
        {event === "Singles" ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <EvenStarText as="label" variant="meta" tone="muted" caps>Opponent</EvenStarText>
              <AnonPill playerKey="opponent1" />
            </div>
            <input
              type="text"
              value={anon.opponent1 ? "Anonymous" : opponent1}
              onChange={(e) => setOpponent1(e.target.value)}
              placeholder="Opponent name"
              disabled={anon.opponent1}
              className={anon.opponent1 ? anonInputClass : inputClass}
            />
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <EvenStarText as="label" variant="meta" tone="muted" caps>Your Partner</EvenStarText>
                <AnonPill playerKey="partner" />
              </div>
              <input
                type="text"
                value={anon.partner ? "Anonymous" : partner}
                onChange={(e) => setPartner(e.target.value)}
                placeholder="Partner name (optional)"
                disabled={anon.partner}
                className={anon.partner ? anonInputClass : inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <EvenStarText as="label" variant="meta" tone="muted" caps>Opponent 1</EvenStarText>
                <AnonPill playerKey="opponent1" />
              </div>
              <input
                type="text"
                value={anon.opponent1 ? "Anonymous" : opponent1}
                onChange={(e) => setOpponent1(e.target.value)}
                placeholder="Opponent 1 name"
                disabled={anon.opponent1}
                className={anon.opponent1 ? anonInputClass : inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <EvenStarText as="label" variant="meta" tone="muted" caps>Opponent 2</EvenStarText>
                <AnonPill playerKey="opponent2" />
              </div>
              <input
                type="text"
                value={anon.opponent2 ? "Anonymous" : opponent2}
                onChange={(e) => setOpponent2(e.target.value)}
                placeholder="Opponent 2 name"
                disabled={anon.opponent2}
                className={anon.opponent2 ? anonInputClass : inputClass}
              />
            </div>
          </>
        )}
      </div>

      {/* Sets */}
      <div className="mb-3">
        <EvenStarText as="p" variant="meta" tone="muted" caps className="mb-2">
          Sets
        </EvenStarText>
        <div className="space-y-2">
          {sets.map((set, i) => (
            <div key={i} className="flex items-center gap-2">
              <EvenStarText as="span" variant="label" tone="accent" caps className="w-7 shrink-0 tabular-nums">
                S{i + 1}
              </EvenStarText>
              <input
                type="number"
                value={set.ours}
                onChange={(e) => updateSet(i, "ours", e.target.value)}
                min={0}
                placeholder="0"
                className="w-14 rounded-md border border-ivory-rule bg-white px-2 py-2 text-sm font-semibold text-center text-club-green outline-none focus:border-gold transition-colors"
              />
              <span className="text-club-green-muted font-semibold">–</span>
              <input
                type="number"
                value={set.theirs}
                onChange={(e) => updateSet(i, "theirs", e.target.value)}
                min={0}
                placeholder="0"
                className="w-14 rounded-md border border-ivory-rule bg-white px-2 py-2 text-sm font-semibold text-center text-club-green outline-none focus:border-gold transition-colors"
              />
              <button
                type="button"
                onClick={() => removeSetRow(i)}
                disabled={sets.length === 1}
                aria-label="Remove set"
                className="ml-auto text-club-green-muted/50 hover:text-loss transition-colors disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSetRow}
          className="mt-2 w-full rounded-md border border-dashed border-ivory-rule py-1.5 text-[10px] uppercase tracking-[0.18em] text-gold hover:border-gold transition-colors"
        >
          + Add Set
        </button>
      </div>

      {/* Auto result */}
      <div
        className={cn(
          "rounded-md border px-3 py-2 mb-3 flex items-center justify-between",
          result === "win"
            ? "border-win/30 bg-win/8"
            : result === "loss"
              ? "border-loss/30 bg-loss/8"
              : result === "draw"
                ? "border-gold/30 bg-gold/8"
                : "border-ivory-rule bg-ivory"
        )}
      >
        <EvenStarText as="span" variant="meta" tone="muted" caps>
          Result (auto)
        </EvenStarText>
        {result ? (
          <EvenStarText
            as="span"
            variant="label"
            caps
            className={cn(
              "font-semibold",
              result === "win"
                ? "text-win"
                : result === "loss"
                  ? "text-loss"
                  : "text-gold"
            )}
          >
            {result}
          </EvenStarText>
        ) : (
          <EvenStarText as="span" variant="meta" tone="muted">
            — enter scores above
          </EvenStarText>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <EvenStarButton
          variant="solid"
          size="md"
          disabled={!canAdd}
          onClick={handleAdd}
          className="flex-1"
        >
          Add
        </EvenStarButton>
        <EvenStarButton
          variant="outline"
          size="md"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </EvenStarButton>
      </div>
    </div>
  );
}
