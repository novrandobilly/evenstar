import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { pb } from "../../lib/pocketbase";
import { useToast } from "../../context/ToastContext";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();

  return () => {
    pb.authStore.clear();
    try {
      localStorage.removeItem("evenstar_tennis_session_config");
      sessionStorage.removeItem("evenstar_tennis_session_config");
    } catch {}
    queryClient.clear();
    showToast({ message: "Logged out successfully." });
    navigate("/login");
  };
}
