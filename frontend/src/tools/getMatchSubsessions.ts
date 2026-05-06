import {
  isMatchSubsession,
  type Session,
  type MatchSubsession,
} from "@/data/sessions";

export function getMatchSubsessions(session: Session): MatchSubsession[] {
  return session.subsessions.filter(isMatchSubsession);
}
