import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import type { LoginPayload, HostUser } from "../../types/auth";

export const useTLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast, showGeneralErrorToast } = useToast();

  return useMutation({
    mutationKey: ["auth"],
    mutationFn: async ({ identity, password }: LoginPayload) => {
      const response = await pb
        .collection("users")
        .authWithPassword<HostUser>(identity, password);
      return response;
    },
    onSuccess: (data) => {
      showToast({ message: `Welcome back, ${data.record.name || "Host"}!` });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      navigate("/");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { message?: string }; message?: string };
      const msg = err?.response?.message || err?.message || "Invalid email or password.";
      showGeneralErrorToast(msg);
    },
  });
};
