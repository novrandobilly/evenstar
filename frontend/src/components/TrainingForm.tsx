// frontend/src/components/TrainingForm.tsx
import { useState } from "react";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import { cn } from "@/lib/utils";
import type { TrainingSubsession } from "@/data/sessions";

const TRAINING_GROUPS = [
  { label: "Groundstrokes", items: ["Forehand", "Backhand"] },
  { label: "Serve",         items: ["First Serve", "Second Serve", "Kick Serve"] },
  { label: "Net Game",      items: ["Volley", "Overhead", "Net Play", "Approach"] },
  { label: "Movement",      items: ["Return", "Footwork", "Baseline"] },
  { label: "General",       items: ["Warmup", "Other"] },
] as const;

type TrainingItem = (typeof TRAINING_GROUPS)[number]["items"][number];

export interface TrainingFormProps {
  sessionId: string;
  onAdd: (subsession: TrainingSubsession) => void;
  onCancel: () => void;
}

export function TrainingForm({ sessionId, onAdd, onCancel }: TrainingFormProps) {
  const [titlePreset, setTitlePreset] = useState<TrainingItem | "">("");
  const [titleCustom, setTitleCustom] = useState("");
  const [accuracy, setAccuracy] = useState(50);

  const isOther = titlePreset === "Other";
  const resolvedTitle = isOther ? titleCustom.trim() : titlePreset;
  const canAdd = titlePreset !== "" && (!isOther || titleCustom.trim() !== "");

  const handlePresetSelect = (preset: TrainingItem) => {
    setTitlePreset(preset);
    setTitleCustom("");
  };

  const handleAdd = () => {
    if (!canAdd) return;
    const subsession: TrainingSubsession = {
      id: `${sessionId}-s${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "training",
      ...(resolvedTitle ? { title: resolvedTitle } : {}),
      metrics: [{ label: "Accuracy", percentage: accuracy }],
    };
    onAdd(subsession);
  };

  return (
    <div className="rounded-xl border border-club-green/20 bg-ivory p-4 mb-4">
      <EvenStarText as="p" variant="label" tone="accent" caps className="font-semibold mb-3">
        New Training Block
      </EvenStarText>

      {/* Focus — grouped chips */}
      <div className="mb-4">
        <EvenStarText as="p" variant="meta" tone="muted" caps className="mb-2">
          Focus
        </EvenStarText>
        <div className="space-y-2">
          {TRAINING_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-gold mb-1.5">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                      titlePreset === preset
                        ? "border-club-green bg-club-green text-ivory"
                        : "border-ivory-rule text-club-green-muted hover:border-gold hover:text-gold"
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {isOther && (
          <input
            type="text"
            value={titleCustom}
            onChange={(e) => setTitleCustom(e.target.value)}
            placeholder="Describe your focus…"
            autoFocus
            className="mt-2 w-full rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors"
          />
        )}
      </div>

      {/* Accuracy slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <EvenStarText as="p" variant="meta" tone="muted" caps>
            Accuracy
          </EvenStarText>
          <EvenStarText as="span" variant="label" tone="accent" caps className="font-semibold tabular-nums text-gold">
            {accuracy}%
          </EvenStarText>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={accuracy}
          onChange={(e) => setAccuracy(Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor: "#a6853a" }}
          aria-label="Accuracy percentage"
        />
        <div className="flex justify-between mt-0.5">
          <EvenStarText as="span" variant="meta" tone="muted" className="text-[10px]">0%</EvenStarText>
          <EvenStarText as="span" variant="meta" tone="muted" className="text-[10px]">100%</EvenStarText>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <EvenStarButton variant="solid" size="md" disabled={!canAdd} onClick={handleAdd} className="flex-1">
          Add
        </EvenStarButton>
        <EvenStarButton variant="outline" size="md" onClick={onCancel} className="flex-1">
          Cancel
        </EvenStarButton>
      </div>
    </div>
  );
}
