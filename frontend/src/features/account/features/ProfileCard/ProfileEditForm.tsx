import React, { useState } from "react";
import type { HostUser } from "../../../../types/auth";
import { useTUpdateProfile } from "../../../../api/auth/useTUpdateProfile";

interface ProfileEditFormProps {
  profile?: HostUser | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profile,
  onCancel,
  onSuccess,
}) => {
  const updateProfileMutation = useTUpdateProfile();

  const [name, setName] = useState(profile?.name || "");
  const [clubName, setClubName] = useState(profile?.club_name || "");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
          onSuccess();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-chalk-100">
        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
          Edit Host Info
        </span>
        <button
          type="button"
          onClick={onCancel}
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

      <div className="bg-chalk-50 p-3 rounded-2xl border border-chalk-300 focus-within:border-court-600 focus-within:bg-white transition">
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

      <div className="bg-chalk-50 p-3 rounded-2xl border border-chalk-300 focus-within:border-court-600 focus-within:bg-white transition">
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

      <div className="pt-1">
        {!showPasswordChange ? (
          <button
            type="button"
            onClick={() => setShowPasswordChange(true)}
            className="text-xs font-bold text-court-850 hover:underline cursor-pointer"
          >
            Change Password →
          </button>
        ) : (
          <div className="space-y-2.5 pt-2 border-t border-chalk-100">
            <div className="bg-chalk-50 p-3 rounded-2xl border border-chalk-300 focus-within:border-court-600 focus-within:bg-white transition">
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
              <div className="bg-chalk-50 p-3 rounded-2xl border border-chalk-300 focus-within:border-court-600 focus-within:bg-white transition">
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
              <div className="bg-chalk-50 p-3 rounded-2xl border border-chalk-300 focus-within:border-court-600 focus-within:bg-white transition">
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

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-2xl bg-chalk-100 hover:bg-chalk-200 text-slate-700 py-3 text-xs font-bold transition cursor-pointer border border-chalk-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updateProfileMutation.isPending || !name.trim()}
          className="flex-2 flex items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 text-volt-300 py-3 text-xs font-black shadow-md shadow-court-900/10 active:scale-[0.98] transition cursor-pointer border border-court-700/50"
        >
          {updateProfileMutation.isPending ? (
            <span>Saving...</span>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
