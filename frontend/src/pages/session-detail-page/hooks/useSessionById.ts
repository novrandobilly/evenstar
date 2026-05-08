import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSessions } from "@/hooks/useSessions";
import type { Session } from "@/data/sessions";

export function useSessionById(): Session | undefined {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { sessions } = useSessions();

  return useMemo(() => {
    if (!sessionId) return undefined;
    return sessions.find((s) => s.id === sessionId);
  }, [sessionId, sessions]);
}
