import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import { useToast } from "../../context/ToastContext";

export const useTDeleteSession = () => {
  const queryClient = useQueryClient();
  const { showToast, showGeneralErrorToast } = useToast();

  return useMutation({
    mutationKey: ["sessions-delete"],
    mutationFn: async (sessionId: string) => {
      await pb.collection("sessions").delete(sessionId);
      return sessionId;
    },
    onSuccess: (sessionId) => {
      showToast({ message: "Session removed from history." });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.removeQueries({ queryKey: ["session", sessionId] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { message?: string }; message?: string };
      const msg = err?.response?.message || err?.message || "Failed to delete session.";
      showGeneralErrorToast(msg);
    },
  });
};
