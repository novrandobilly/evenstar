import React from "react";
import { useLogout } from "../../../api/auth/useLogout";
import { useModal } from "../../../context/modal";

export const LogoutButton: React.FC = () => {
  const logout = useLogout();
  const { showModal } = useModal();

  const handleLogout = () => {
    showModal({
      title: "Log out of Kickserve?",
      description: "Are you sure you want to sign out from your host account?",
      confirmText: "Log Out",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        logout();
      },
    });
  };

  return (
    <div className="pt-4 pb-2">
      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 hover:text-rose-700 py-3.5 px-4 text-xs font-black shadow-2xs active:scale-[0.98] transition cursor-pointer"
      >
        <svg
          className="w-4 h-4 text-rose-500 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Log Out from Host Account</span>
      </button>
    </div>
  );
};

export default LogoutButton;
