import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTProfile } from "../../api/auth/useTProfile";
import { useTUpdateProfile } from "../../api/auth/useTUpdateProfile";
import { useLogout } from "../../api/auth/useLogout";
import { useTGetSessions } from "../../api/sessions/useTGetSessions";
import { useModal } from "../../context/modal";

export const AccountFeature: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useTProfile();
  const { data: sessions } = useTGetSessions();
  const updateProfileMutation = useTUpdateProfile();
  const logout = useLogout();
  const { showModal } = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [clubName, setClubName] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleStartEdit = () => {
    setName(profile?.name || "");
    setClubName(profile?.club_name || "");
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (showPasswordChange) {
      if (newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters.");
        return;
      }
      if (newPassword !== newPasswordConfirm) {
        setPasswordError("New passwords do not match.");
        return;
      }
    }

    updateProfileMutation.mutate(
      {
        name: name.trim(),
        club_name: clubName.trim(),
        ...(showPasswordChange
          ? {
              oldPassword,
              password: newPassword,
              passwordConfirm: newPasswordConfirm,
            }
          : {}),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setShowPasswordChange(false);
          setOldPassword("");
          setNewPassword("");
          setNewPasswordConfirm("");
        },
      }
    );
  };

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

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-xs font-bold text-slate-400 animate-pulse">
          Loading host profile...
        </div>
      </div>
    );
  }

  const completedSessionsCount = sessions?.length || 0;

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full px-5 py-6 font-sans select-none">
      <div className="space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-court-900 transition cursor-pointer px-2 py-1 -ml-2 rounded-lg hover:bg-chalk-100"
          >
            <span>←</span>
            <span>Home</span>
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-court-700 bg-court-100/70 px-2.5 py-1 rounded-full border border-court-500/20">
            Host Profile
          </span>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-[#ded7c4] bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-court-850 text-volt-300 flex items-center justify-center font-black text-xl shadow-md border border-court-700/50 shrink-0">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "H"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-black text-slate-900 truncate">
                {profile?.name || "Session Host"}
              </h2>
              <p className="text-xs text-slate-400 font-medium truncate">
                {profile?.email}
              </p>
              {profile?.club_name && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-court-800 bg-court-50 px-2 py-0.5 rounded-full border border-court-500/20 mt-1">
                  <span>🎾</span> {profile.club_name}
                </span>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-chalk-100">
            <div className="bg-chalk-50 p-3 rounded-2xl border border-[#ded7c4] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Tournaments
              </span>
              <span className="text-lg font-black text-slate-900">
                {completedSessionsCount}
              </span>
            </div>
            <div className="bg-chalk-50 p-3 rounded-2xl border border-[#ded7c4] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Host Status
              </span>
              <span className="text-xs font-black text-court-700 mt-1 block">
                ✓ Active Host
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Toggle / Form */}
        {!isEditing ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleStartEdit}
              className="w-full rounded-2xl bg-white border border-[#ded7c4] hover:border-court-600 hover:bg-chalk-50 py-3.5 px-4 text-xs font-black text-slate-800 shadow-2xs active:scale-[0.98] transition cursor-pointer flex items-center justify-between"
            >
              <span>Edit Host Details</span>
              <span>✏️</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100/70 py-3.5 px-4 text-xs font-black text-rose-700 active:scale-[0.98] transition cursor-pointer flex items-center justify-between"
            >
              <span>Log Out</span>
              <span>🚪</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="rounded-3xl border border-[#ded7c4] bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-chalk-100">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Edit Host Info
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setShowPasswordChange(false);
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {passwordError && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 text-center">
                {passwordError}
              </div>
            )}

            <div className="bg-chalk-50 p-3 rounded-2xl border border-[#ded7c4] focus-within:border-court-600 focus-within:bg-white transition">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent"
              />
            </div>

            <div className="bg-chalk-50 p-3 rounded-2xl border border-[#ded7c4] focus-within:border-court-600 focus-within:bg-white transition">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Club / Community Name
              </label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="e.g. Sunday Tennis Club"
                className="w-full text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
              />
            </div>

            {/* Password Change Toggle */}
            <div className="pt-2">
              {!showPasswordChange ? (
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(true)}
                  className="text-xs font-bold text-court-800 hover:underline cursor-pointer"
                >
                  Change Password →
                </button>
              ) : (
                <div className="space-y-2.5 pt-2 border-t border-chalk-100">
                  <div className="bg-chalk-50 p-3 rounded-2xl border border-[#ded7c4] focus-within:border-court-600 focus-within:bg-white transition">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Required to change password"
                      className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-chalk-50 p-3 rounded-2xl border border-[#ded7c4] focus-within:border-court-600 focus-within:bg-white transition">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 chars"
                        className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="bg-chalk-50 p-3 rounded-2xl border border-[#ded7c4] focus-within:border-court-600 focus-within:bg-white transition">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        Confirm New
                      </label>
                      <input
                        type="password"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        placeholder="Repeat"
                        className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending || !name.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 text-volt-300 py-3.5 text-xs font-black shadow-md shadow-court-900/10 active:scale-[0.98] transition cursor-pointer border border-court-700/50 mt-2"
            >
              {updateProfileMutation.isPending ? (
                <span>Saving Changes...</span>
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Back to Home CTA */}
      <div className="pt-6 pb-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full py-2.5 text-center text-xs font-bold text-slate-400 hover:text-slate-800 transition cursor-pointer"
        >
          Back to Sessions
        </button>
      </div>
    </div>
  );
};

export default AccountFeature;
