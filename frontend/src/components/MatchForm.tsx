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

interface AnonPillProps {
  playerKey: PlayerKey;
  active: boolean;
  onToggle: (key: PlayerKey) => void;
}

function AnonPill({ playerKey, active, onToggle }: AnonPillProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(playerKey)}
      className={cn(
        "text-[10px] uppercase tracking-[0.1em] rounded-full px-2.5 py-0.5 border transition-colors",
        active
          ? "border-ace/60 bg-ace/10 text-ace font-semibold"
          : "border-line text-ink-3 hover:border-edge hover:text-ink-2"
      )}
    >
      {active ? "✓ Anonymous" : "Anonymous"}
    </button>
  );
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
    "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none focus:border-ace transition-colors";
  const anonInputClass =
    "w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm text-ink-3 italic";

  return (
    <div className="rounded-2xl border border-line bg-raised p-4 mb-4">
      <EvenStarText as="p" variant="label" tone="accent" caps className="font-semibold mb-3">
        New Match
      </EvenStarText>

      {/* Singles / Doubles toggle */}
      <div className="mb-3">
        <EvenStarText as="p" variant="meta" tone="muted" caps className="mb-1.5">
          Match Type
        </EvenStarText>
        <div className="flex gap-1 p-1 bg-raised rounded-xl border border-line">
          {(["Singles", "Doubles"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleEventChange(type)}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors",
                event === type
                  ? "bg-ace text-surface"
                  : "text-ink-2 hover:text-ink"
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
              <AnonPill playerKey="opponent1" active={anon.opponent1} onToggle={toggleAnon} />
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
                <AnonPill playerKey="partner" active={anon.partner} onToggle={toggleAnon} />
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
                <AnonPill playerKey="opponent1" active={anon.opponent1} onToggle={toggleAnon} />
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
                <AnonPill playerKey="opponent2" active={anon.opponent2} onToggle={toggleAnon} />
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
                aria-label={`Set ${i + 1} your score`}
                className="w-14 rounded-lg border border-line bg-raised px-2 py-2 text-sm font-bold text-center text-ink outline-none focus:border-ace transition-colors"
              />
              <span className="text-ink-3 font-bold">–</span>
              <input
                type="number"
                value={set.theirs}
                onChange={(e) => updateSet(i, "theirs", e.target.value)}
                min={0}
                placeholder="0"
                aria-label={`Set ${i + 1} opponent score`}
                className="w-14 rounded-lg border border-line bg-raised px-2 py-2 text-sm font-bold text-center text-ink outline-none focus:border-ace transition-colors"
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
          className="mt-2 w-full rounded-lg border border-dashed border-line py-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-3 hover:border-ace hover:text-ace transition-colors"
        >
          + Add Set
        </button>
      </div>

      {/* Auto result */}
      <div
        className={cn(
          "rounded-lg border px-3 py-2 mb-3 flex items-center justify-between",
          result === "win"
            ? "border-win/30 bg-win/8"
            : result === "loss"
              ? "border-loss/30 bg-loss/8"
              : result === "draw"
                ? "border-draw/30 bg-draw/8"
                : "border-line bg-raised"
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
                  : "text-draw"
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
