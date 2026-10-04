import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import { useToast } from "../../context/ToastContext";
import type { SessionConfig, SessionRecord } from "../../types/session";

export const useTCreateSession = () => {
  const queryClient = useQueryClient();
  const { showToast, showGeneralErrorToast } = useToast();

  return useMutation({
    mutationKey: ["sessions-create"],
    mutationFn: async (session: SessionConfig) => {
      const hostId = pb.authStore.record?.id;
      if (!hostId) throw new Error("Host must be logged in to save session");

      const record = await pb.collection("sessions").create<SessionRecord>({
        host: hostId,
        title: session.title || "Tennis Session",
        sport: session.sport || "tennis",
        match_format: session.matchFormat,
        doubles_mode: session.doublesMode,
        players: session.players,
        matches: session.matches,
        status: "completed",
        completed_at: session.completedAt || new Date().toISOString(),
      });

      return record;
    },
    onSuccess: () => {
      showToast({ message: "Tournament saved to your host history!" });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error: unknown) => {
      console.error("Failed to save session to PocketBase:", error);
      const err = error as { response?: { message?: string }; message?: string };
      const msg = err?.response?.message || err?.message || "Could not save tournament history.";
      showGeneralErrorToast(msg);
    },
  });
};
