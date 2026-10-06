import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import type { SessionRecord, SessionConfig } from "../../types/session";
import { sessionRecordToConfig } from "./useTGetSessions";

export const useTLiveSession = (sessionId: string | undefined) => {
  const queryClient = useQueryClient();
  const [isDeleted, setIsDeleted] = useState(false);
  const [lastUpdatedMatchId, setLastUpdatedMatchId] = useState<string | null>(null);

  const query = useQuery<SessionConfig | null>({
    queryKey: ["live-session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      try {
        const record = await pb.collection("sessions").getOne<SessionRecord>(sessionId);
        return sessionRecordToConfig(record);
      } catch (err: unknown) {
        console.error("Failed to load live session:", err);
        return null;
      }
    },
    enabled: Boolean(sessionId),
    staleTime: 1000 * 5, // 5s fresh cache
  });

  useEffect(() => {
    if (!sessionId) return;
    let isMounted = true;

    // Realtime SSE subscription
    pb.collection("sessions")
      .subscribe<SessionRecord>(sessionId, (e) => {
        if (!isMounted) return;

        if (e.action === "delete") {
          setIsDeleted(true);
          queryClient.setQueryData(["live-session", sessionId], null);
        } else if (e.action === "update") {
          const prevSession = queryClient.getQueryData<SessionConfig>(["live-session", sessionId]);
          const updatedConfig = sessionRecordToConfig(e.record);
          queryClient.setQueryData(["live-session", sessionId], updatedConfig);

          // Find which match was updated for visual pulse animation
          if (prevSession && updatedConfig.matches) {
            const changedMatch = updatedConfig.matches.find((m, i) => {
              const prevM = prevSession.matches[i];
              return (
                !prevM ||
                prevM.scoreA !== m.scoreA ||
                prevM.scoreB !== m.scoreB ||
                prevM.isCompleted !== m.isCompleted
              );
            });
            if (changedMatch) {
              setLastUpdatedMatchId(changedMatch.id);
              setTimeout(() => {
                if (isMounted) setLastUpdatedMatchId(null);
              }, 2000);
            }
          }
        }
      })
      .catch((err) => {
        console.warn("Could not establish realtime connection for live session:", err);
      });

    // Cleanup: Guaranteed unsubscribe on unmount
    return () => {
      isMounted = false;
      pb.collection("sessions").unsubscribe(sessionId).catch(() => {});
    };
  }, [sessionId, queryClient]);

  return {
    session: query.data,
    isLoading: query.isLoading,
    isError: query.isError || (query.isSuccess && !query.data && !query.isLoading),
    isDeleted,
    lastUpdatedMatchId,
    refetch: query.refetch,
  };
};

export default useTLiveSession;
