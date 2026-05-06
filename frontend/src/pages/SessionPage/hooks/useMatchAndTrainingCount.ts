import { type Session } from "@/data/sessions";
import { getMatchSubsessions } from "../../../tools/getMatchSubsessions";
import { getTrainingSubsessions } from "../../../tools/getTrainingSubsessions";

export const useMatchAndTrainingCount = (session: Session) => {
  const trainingCount = getTrainingSubsessions(session).length;
  const matchCount = getMatchSubsessions(session).length;
  const mixed = trainingCount > 0 && matchCount > 0;
  const typeLabel = mixed
    ? "Training + Match"
    : trainingCount > 0
      ? "Training"
      : "Match";

  return { trainingCount, matchCount, mixed, typeLabel };
};
