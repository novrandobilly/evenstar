// frontend/src/components/TrainingForm.tsx
import { useState } from "react";
import { EvenStarButton } from "@/components/EvenStarButton";
import { EvenStarText } from "@/components/EvenStarText";
import type { TrainingSubsession } from "@/data/sessions";

interface MetricRow {
  label: string;
  percentage: string;
}

export interface TrainingFormProps {
  sessionId: string;
  onAdd: (subsession: TrainingSubsession) => void;
  onCancel: () => void;
}

export function TrainingForm({ sessionId, onAdd, onCancel }: TrainingFormProps) {
  const [title, setTitle] = useState("");
  const [metrics, setMetrics] = useState<MetricRow[]>([
    { label: "", percentage: "" },
  ]);

  const updateMetric = (index: number, field: keyof MetricRow, value: string) => {
    setMetrics((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const addMetricRow = () =>
    setMetrics((prev) => [...prev, { label: "", percentage: "" }]);

  const removeMetricRow = (index: number) =>
    setMetrics((prev) => prev.filter((_, i) => i !== index));

  const validMetrics = metrics.filter(
    (m) => m.label.trim() !== "" && m.percentage !== "" && !isNaN(Number(m.percentage))
  );
  const canAdd = validMetrics.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    const subsession: TrainingSubsession = {
      id: `${sessionId}-s${Date.now()}`,
      type: "training",
      ...(title.trim() ? { title: title.trim() } : {}),
      metrics: validMetrics.map((m) => ({
        label: m.label.trim(),
        percentage: Math.min(100, Math.max(0, Math.round(Number(m.percentage)))),
      })),
    };
    onAdd(subsession);
  };

  const inputClass =
    "w-full rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors";

  return (
    <div className="rounded-xl border border-club-green/20 bg-ivory p-4 mb-4">
      <EvenStarText as="p" variant="label" tone="accent" caps className="font-semibold mb-3">
        New Training Block
      </EvenStarText>

      {/* Title */}
      <div className="mb-3">
        <EvenStarText as="label" variant="meta" tone="muted" caps className="block mb-1.5">
          Title (optional)
        </EvenStarText>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Warmup, Baseline, Serve"
          className={inputClass}
        />
      </div>

      {/* Metrics */}
      <div className="mb-3">
        <EvenStarText as="p" variant="meta" tone="muted" caps className="mb-2">
          Metrics
        </EvenStarText>
        <div className="space-y-2">
          {metrics.map((metric, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={metric.label}
                onChange={(e) => updateMetric(i, "label", e.target.value)}
                placeholder="Label"
                className="flex-1 rounded-md border border-ivory-rule bg-white px-3 py-2 text-sm text-club-green placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors"
              />
              <input
                type="number"
                value={metric.percentage}
                onChange={(e) => updateMetric(i, "percentage", e.target.value)}
                placeholder="%"
                min={0}
                max={100}
                className="w-16 rounded-md border border-ivory-rule bg-white px-2 py-2 text-sm text-club-green text-center placeholder:text-club-green-muted/50 outline-none focus:border-gold transition-colors"
              />
              <button
                type="button"
                onClick={() => removeMetricRow(i)}
                disabled={metrics.length === 1}
                aria-label="Remove metric"
                className="text-club-green-muted/50 hover:text-loss transition-colors disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMetricRow}
          className="mt-2 w-full rounded-md border border-dashed border-ivory-rule py-1.5 text-[10px] uppercase tracking-[0.18em] text-gold hover:border-gold transition-colors"
        >
          + Add Metric
        </button>
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
