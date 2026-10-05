import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import { useToast } from "../../context/ToastContext";
import type { Player } from "../../types/session";
import type { RosterRecord } from "../../types/roster";

export const useTSaveRoster = () => {
  const queryClient = useQueryClient();
  const { showToast, showGeneralErrorToast } = useToast();

  return useMutation({
    mutationKey: ["roster-save"],
    mutationFn: async ({
      players,
      name = "My Players",
    }: {
      players: Player[];
      name?: string;
    }) => {
      const hostId = pb.authStore.record?.id;
      if (!hostId) throw new Error("Host must be logged in to save roster");

      // Check if roster already exists
      const existing = queryClient.getQueryData<RosterRecord | null>(["roster"]);

      if (existing?.id) {
        return await pb.collection("rosters").update<RosterRecord>(existing.id, {
          name,
          players,
        });
      } else {
        // Double check database if not in cache
        const records = await pb.collection("rosters").getFullList<RosterRecord>({
          filter: `host = "${hostId}"`,
        });

        if (records.length > 0) {
          return await pb.collection("rosters").update<RosterRecord>(records[0].id, {
            name,
            players,
          });
        }

        return await pb.collection("rosters").create<RosterRecord>({
          host: hostId,
          name,
          players,
        });
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["roster"], data);
      queryClient.invalidateQueries({ queryKey: ["roster"] });
      showToast({ message: "Player roster updated successfully!" });
    },
    onError: (error: unknown) => {
      console.error("Failed to save roster:", error);
      const err = error as { response?: { message?: string }; message?: string };
      const msg = err?.response?.message || err?.message || "Could not save roster.";
      showGeneralErrorToast(msg);
    },
  });
};
