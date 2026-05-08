import { useState } from "react";
import { EvenStarButton } from "@/components/EvenStarButton";
import { TrainingForm } from "@/components/TrainingForm";
import { MatchForm } from "@/components/MatchForm";
import type { Subsession } from "@/data/sessions";

type ActiveForm = "training" | "match" | null;

export function AddSubsessionControls({
  sessionId,
  onAdd,
}: {
  sessionId: string;
  onAdd: (subsession: Subsession) => void;
}) {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  const toggleForm = (type: "training" | "match") => {
    setActiveForm((prev) => (prev === type ? null : type));
  };

  const handleAdd = (subsession: Subsession) => {
    onAdd(subsession);
    setActiveForm(null);
  };

  return (
    <>
      <div className="flex gap-3 mb-4">
        <EvenStarButton
          variant={activeForm === "training" ? "solid" : "outline"}
          size="md"
          onClick={() => toggleForm("training")}
          className="flex-1"
        >
          + Training
        </EvenStarButton>
        <EvenStarButton
          variant={activeForm === "match" ? "solid" : "outline"}
          size="md"
          onClick={() => toggleForm("match")}
          className="flex-1"
        >
          + Match
        </EvenStarButton>
      </div>

      {activeForm === "training" && (
        <TrainingForm
          sessionId={sessionId}
          onAdd={handleAdd}
          onCancel={() => setActiveForm(null)}
        />
      )}
      {activeForm === "match" && (
        <MatchForm
          sessionId={sessionId}
          onAdd={handleAdd}
          onCancel={() => setActiveForm(null)}
        />
      )}
    </>
  );
}
