import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import type { RegisterPayload, HostUser } from "../../types/auth";

export const useTRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast, showGeneralErrorToast } = useToast();

  return useMutation({
    mutationKey: ["auth"],
    mutationFn: async (payload: RegisterPayload) => {
      // 1. Create the user record in PocketBase
      await pb.collection("users").create<HostUser>({
        email: payload.email,
        password: payload.password,
        passwordConfirm: payload.passwordConfirm,
        name: payload.name,
        club_name: payload.club_name || "",
      });

      // 2. Automatically sign in with the new credentials
      const authData = await pb
        .collection("users")
        .authWithPassword<HostUser>(payload.email, payload.password);

      return authData;
    },
    onSuccess: (data) => {
      showToast({ message: `Account created! Welcome, ${data.record.name || "Host"}!` });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      navigate("/");
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { message?: string };
        data?: { message?: string };
        message?: string;
      };
      const msg =
        err?.response?.message ||
        err?.data?.message ||
        err?.message ||
        "Failed to register. Please check your details.";
      showGeneralErrorToast(msg);
    },
  });
};
