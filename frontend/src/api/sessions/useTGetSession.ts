import { useQuery } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import type { SessionRecord, SessionConfig } from "../../types/session";
import { sessionRecordToConfig } from "./useTGetSessions";

export const useTGetSession = (sessionId: string | undefined) => {
  return useQuery<SessionConfig | null>({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      if (!sessionId || !pb.authStore.isValid) return null;

      const record = await pb.collection("sessions").getOne<SessionRecord>(sessionId);
      return sessionRecordToConfig(record);
    },
    enabled: Boolean(sessionId && pb.authStore.isValid),
    retry: 1,
  });
};
