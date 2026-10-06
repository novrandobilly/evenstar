import React, { useState, useRef } from "react";
import type { HostUser } from "../../../../types/auth";
import { useTUpdateProfile } from "../../../../api/auth/useTUpdateProfile";
import { useTPlan } from "../../../../api/plan/useTPlan";
import { pb } from "../../../../lib/pocketbase";
import UpgradeModal from "../../../../components/UpgradeModal";

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
  const { isPro, features } = useTPlan();

  const [name, setName] = useState(profile?.name || "");
  const [clubName, setClubName] = useState(profile?.club_name || "");
  const [clubLogoFile, setClubLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    profile?.club_logo ? pb.files.getURL(profile, profile.club_logo) : null
  );
  const [removeExistingLogo, setRemoveExistingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate 1MB limit
    if (file.size > 1024 * 1024) {
      setLogoError("Club logo must be smaller than 1MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setClubLogoFile(file);
    setRemoveExistingLogo(false);
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setClubLogoFile(null);
    setLogoPreview(null);
    setRemoveExistingLogo(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setLogoError(null);

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
        ...(features.canUploadClubLogo
          ? {
              club_logo: clubLogoFile
                ? clubLogoFile
                : removeExistingLogo
                ? null
                : undefined,
            }
          : {}),
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
      }
    );
  };

  return (
    <>
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

        {logoError && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 text-center">
            {logoError}
          </div>
        )}

        {/* Display Name */}
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

        {/* Club Name */}
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

        {/* Club Logo Branding Section */}
        {isPro ? (
          <div className="bg-chalk-50 p-3 rounded-2xl border border-chalk-300 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Club Logo (Max 1MB)
              </label>
              <span className="text-[10px] font-bold text-court-700 bg-court-100 px-2 py-0.5 rounded-full">
                ⚡ Pro Host
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="h-12 w-12 rounded-xl bg-chalk-200 border border-chalk-300 flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <span className="text-xl text-slate-400">🎾</span>
                )}
              </div>

              <div className="flex-1 flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-court-850 hover:bg-court-900 text-volt-300 text-[11px] font-black shadow-2xs transition cursor-pointer active:scale-95"
                >
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                </button>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-2.5 py-1.5 rounded-xl bg-chalk-200 hover:bg-rose-100 hover:text-rose-700 text-slate-600 text-[11px] font-bold transition cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gradient-to-r from-amber-50 to-chalk-50 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🔒</span>
                <span className="text-[11px] font-black text-amber-950 uppercase tracking-wider">
                  Club Logo Branding
                </span>
              </div>
              <p className="text-[10px] text-amber-800/80 font-medium mt-0.5 truncate">
                Upgrade to Pro to upload custom logo (up to 1MB)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-[10px] font-black shrink-0 transition cursor-pointer shadow-xs active:scale-95"
            >
              Upgrade ⚡
            </button>
          </div>
        )}

        {/* Change Password Toggle */}
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

        {/* Buttons */}
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

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        reason="club_branding"
      />
    </>
  );
};

export default ProfileEditForm;
