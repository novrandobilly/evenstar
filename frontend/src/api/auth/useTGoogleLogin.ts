import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import type { HostUser } from "../../types/auth";

export const useTGoogleLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast, showGeneralErrorToast } = useToast();

  return useMutation({
    mutationKey: ["auth-google"],
    mutationFn: async () => {
      const authData = await pb
        .collection("users")
        .authWithOAuth2<HostUser>({ provider: "google" });
      return authData;
    },
    onSuccess: (data) => {
      showToast({ message: `Signed in as ${data.record.name || "Host"}!` });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      navigate("/account");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { message?: string }; message?: string };
      const msg =
        err?.response?.message ||
        err?.message ||
        "Google Sign-In was cancelled or not configured in PocketBase.";
      showGeneralErrorToast(msg);
    },
  });
};
