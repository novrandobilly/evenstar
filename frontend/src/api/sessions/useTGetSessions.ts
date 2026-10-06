import { useQuery } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import type { SessionRecord, SessionConfig } from "../../types/session";

export const sessionRecordToConfig = (record: SessionRecord): SessionConfig => ({
  id: record.id,
  title: record.title,
  matchFormat: record.match_format,
  doublesMode: record.doubles_mode,
  players: record.players || [],
  matches: record.matches || [],
  createdAt: record.created,
  completedAt: record.completed_at || record.updated,
  sport: record.sport,
  status: record.status,
});

export const useTGetSessions = () => {
  return useQuery<SessionConfig[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      if (!pb.authStore.isValid || !pb.authStore.record?.id) {
        return [];
      }

      const records = await pb.collection("sessions").getFullList<SessionRecord>({
        sort: "-created",
        filter: `host = "${pb.authStore.record.id}"`,
      });

      return records.map(sessionRecordToConfig);
    },
    enabled: pb.authStore.isValid,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
