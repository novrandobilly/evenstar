import { useQuery } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import type { RosterRecord } from "../../types/roster";

export const useTGetRoster = () => {
  return useQuery<RosterRecord | null>({
    queryKey: ["roster"],
    queryFn: async () => {
      if (!pb.authStore.isValid || !pb.authStore.record?.id) {
        return null;
      }

      try {
        const records = await pb.collection("rosters").getFullList<RosterRecord>({
          sort: "-updated",
          filter: `host = "${pb.authStore.record.id}"`,
        });

        return records.length > 0 ? records[0] : null;
      } catch (err) {
        console.error("Failed to fetch roster:", err);
        return null;
      }
    },
    enabled: pb.authStore.isValid,
    staleTime: 1000 * 60 * 2,
  });
};
