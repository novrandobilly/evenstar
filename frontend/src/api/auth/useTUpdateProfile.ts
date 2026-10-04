import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import { useToast } from "../../context/ToastContext";
import type { UpdateProfilePayload, HostUser } from "../../types/auth";

export const useTUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { showToast, showGeneralErrorToast } = useToast();

  return useMutation({
    mutationKey: ["auth-update"],
    mutationFn: async (payload: UpdateProfilePayload) => {
      const currentUserId = pb.authStore.record?.id;
      if (!currentUserId) throw new Error("Not authenticated");

      const formData = new FormData();
      if (payload.name !== undefined) formData.append("name", payload.name);
      if (payload.club_name !== undefined) formData.append("club_name", payload.club_name);
      if (payload.avatar instanceof File) formData.append("avatar", payload.avatar);
      if (payload.password && payload.passwordConfirm) {
        formData.append("password", payload.password);
        formData.append("passwordConfirm", payload.passwordConfirm);
        if (payload.oldPassword) formData.append("oldPassword", payload.oldPassword);
      }

      const updated = await pb.collection("users").update<HostUser>(currentUserId, formData);
      return updated;
    },
    onSuccess: () => {
      showToast({ message: "Profile updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { message?: string }; message?: string };
      const msg = err?.response?.message || err?.message || "Failed to update profile.";
      showGeneralErrorToast(msg);
    },
  });
};
