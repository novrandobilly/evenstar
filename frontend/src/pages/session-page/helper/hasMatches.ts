import { type Session } from "@/data/sessions";
import { getMatchSubsessions } from "../../../tools/getMatchSubsessions";

export function hasMatches(session: Session): boolean {
  return getMatchSubsessions(session).length > 0;
}
