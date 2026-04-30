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
  const [sets, setSets] = useState<SetRow[]>([{ ours: "", theirs: "" }]);

  const result = useMemo(() => computeResult(sets), [sets]);

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
    setSets([{ ours: "", theirs: "" }]);
  };

  const hasOpponent =
    event === "Singles"
      ? opponent1.trim() !== ""
      : opponent1.trim() !== "" && opponent2.trim() !== "";
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
            ? [opponent1.trim()]
            : [opponent1.trim(), opponent2.trim()],
        ...(event === "Doubles" && partner.trim()
          ? { yourPartner: partner.trim() }
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
      <div className="mb-3">
        {event === "Singles" ? (
          <>
            <EvenStarText as="label" variant="meta" tone="muted" caps className="block mb-1.5">
              Opponent
            </EvenStarText>
            <input
              type="text"
              value={opponent1}
              onChange={(e) => setOpponent1(e.target.value)}
              placeholder="Opponent name"
              className={inputClass}
            />
          </>
        ) : (
          <>
            <EvenStarText as="label" variant="meta" tone="muted" caps className="block mb-1.5">
              Your Partner
            </EvenStarText>
            <input
              type="text"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              placeholder="Partner name (optional)"
              className={cn(inputClass, "mb-2")}
            />
            <EvenStarText as="label" variant="meta" tone="muted" caps className="block mb-1.5">
              Opponents
            </EvenStarText>
            <div className="flex gap-2">
              <input
                type="text"
                value={opponent1}
                onChange={(e) => setOpponent1(e.target.value)}
                placeholder="Opponent 1"
                className="flex-1 rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors"
              />
              <input
                type="text"
                value={opponent2}
                onChange={(e) => setOpponent2(e.target.value)}
                placeholder="Opponent 2"
                className="flex-1 rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors"
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
