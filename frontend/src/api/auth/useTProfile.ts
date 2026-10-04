import { useQuery } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import type { HostUser } from "../../types/auth";

export const useTProfile = () => {
  return useQuery<HostUser | null>({
    queryKey: ["auth"],
    queryFn: async () => {
      if (!pb.authStore.isValid) {
        return null;
      }
      try {
        const authData = await pb.collection("users").authRefresh<HostUser>();
        return authData.record;
      } catch {
        pb.authStore.clear();
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
