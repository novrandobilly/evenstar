import { useQuery } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import type { SessionRecord, SessionConfig } from "../../types/session";

export const sessionRecordToConfig = (record: SessionRecord): SessionConfig => {
  const host = record.expand?.host;
  const isProHost = host?.tier === "pro";
  const hostClubName = isProHost && host?.club_name ? host.club_name : undefined;
  const hostClubLogoUrl =
    isProHost && host?.club_logo ? pb.files.getURL(host, host.club_logo) : undefined;

  return {
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
    hostClubName,
    hostClubLogoUrl,
  };
};

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
