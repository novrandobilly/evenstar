import { useMutation } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import { useToast } from "../../context/ToastContext";

export interface CreatePaymentResponse {
  success: boolean;
  paymentUrl: string;
  paymentId: string;
}

export interface UpgradeParams {
  planCode?: string;
}

export const useTUpgrade = () => {
  const { showGeneralErrorToast } = useToast();

  return useMutation({
    mutationFn: async (params?: UpgradeParams) => {
      if (!pb.authStore.isValid) {
        throw new Error("Please log in to upgrade to Kickserve Pro.");
      }

      const response = await pb.send<CreatePaymentResponse>(
        "/api/mayar/create-payment",
        {
          method: "POST",
          body: params?.planCode ? { planCode: params.planCode } : undefined,
        }
      );

      return response;
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { error?: string; message?: string };
        message?: string;
      };
      const msg =
        err?.response?.error ||
        err?.response?.message ||
        err?.message ||
        "Failed to initiate payment with Mayar.";
      showGeneralErrorToast(msg);
    },
  });
};

export default useTUpgrade;
