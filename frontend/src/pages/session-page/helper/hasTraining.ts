import { type Session } from "@/data/sessions";
import { getTrainingSubsessions } from "../../../tools/getTrainingSubsessions";

export function hasTraining(session: Session): boolean {
  return getTrainingSubsessions(session).length > 0;
}
