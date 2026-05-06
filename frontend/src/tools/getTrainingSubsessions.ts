import {
  isTrainingSubsession,
  type Session,
  type TrainingSubsession,
} from "@/data/sessions";

export function getTrainingSubsessions(session: Session): TrainingSubsession[] {
  return session.subsessions.filter(isTrainingSubsession);
}
