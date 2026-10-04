import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTProfile } from "../../api/auth/useTProfile";
import { useTUpdateProfile } from "../../api/auth/useTUpdateProfile";
import { useLogout } from "../../api/auth/useLogout";
import { useTGetSessions } from "../../api/sessions/useTGetSessions";
import { useTDeleteSession } from "../../api/sessions/useTDeleteSession";
import { useSession } from "../../context/SessionContext";
import { useModal } from "../../context/modal";
import BottomNavigation from "../../components/BottomNavigation";

export const AccountFeature: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: isLoadingProfile } = useTProfile();
  const { data: sessions, isLoading: isLoadingSessions } = useTGetSessions();
  const { session, hasActiveSession } = useSession();
  const updateProfileMutation = useTUpdateProfile();
  const deleteSessionMutation = useTDeleteSession();
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

  const handleDeleteHistory = (sessionId: string, sessionTitle: string) => {
    showModal({
      title: "Delete Session Record?",
      description: `Are you sure you want to permanently delete "${sessionTitle || "Tennis Session"}" from your history?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        deleteSessionMutation.mutate(sessionId);
      },
    });
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

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-xs font-bold text-slate-400 animate-pulse">
          Loading host dashboard...
        </div>
      </div>
    );
  }

  const savedSessions = sessions || [];

  return (
    <div className="flex flex-1 flex-col justify-between max-w-md mx-auto w-full font-sans select-none relative">
      <div className="px-5 pt-6 pb-2 space-y-5">
        {/* Simple Text Header with back button space */}
        <div className="flex items-center justify-between pt-1">
          <div className="w-8 flex items-center">
            {/* Space for back button if needed on subpages */}
          </div>
          <h1 className="text-sm font-black uppercase tracking-widest text-slate-800">
            Host Dashboard
          </h1>
          <div className="w-8" />
        </div>

        {/* Host Profile Card */}
        <div className="rounded-3xl border border-[#ded7c4] bg-white p-5 shadow-xs relative overflow-hidden">
          {!isEditing ? (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="h-13 w-13 rounded-2xl bg-court-850 text-volt-300 flex items-center justify-center font-black text-xl shadow-md border border-court-700/50 shrink-0">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : "H"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-black text-slate-900 truncate">
                      {profile?.name || "Session Host"}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium truncate">
                      {profile?.email}
                    </p>
                    {profile?.club_name && (
                      <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                        Club Name: <span className="font-bold text-slate-800">{profile.club_name}</span>
                      </p>
                    )}
                    {/* Tier Information Capsule Tag (No Icon) */}
                    <div className="mt-1.5">
                      <span className="inline-flex text-[10px] font-black uppercase tracking-wider text-court-800 bg-court-100/90 px-2.5 py-0.5 rounded-full border border-court-500/20">
                        Free Version
                      </span>
                    </div>
                  </div>
                </div>

                {/* Circle Edit Pencil Button Aligned Bottom */}
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="h-8 w-8 rounded-full bg-chalk-100 hover:bg-chalk-200 border border-[#ded7c4] flex items-center justify-center text-xs text-slate-600 hover:text-slate-900 transition cursor-pointer active:scale-95 shadow-2xs shrink-0 self-end mb-0.5 ml-2"
                  title="Edit Profile"
                  aria-label="Edit Profile"
                >
                  ✏️
                </button>
              </div>

              {/* Stats Bar */}
              <div className="mt-4 pt-3.5 border-t border-chalk-100">
                <div className="bg-chalk-50 p-2.5 rounded-xl border border-[#ded7c4] flex items-center justify-between px-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Sessions Hosted
                  </span>
                  <span className="text-base font-black text-slate-900">
                    {savedSessions.length}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
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

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setShowPasswordChange(false);
                  }}
                  className="flex-1 rounded-2xl bg-chalk-100 hover:bg-chalk-200 text-slate-700 py-3 text-xs font-bold transition cursor-pointer border border-[#ded7c4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending || !name.trim()}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-court-850 hover:bg-court-900 text-volt-300 py-3 text-xs font-black shadow-md shadow-court-900/10 active:scale-[0.98] transition cursor-pointer border border-court-700/50"
                >
                  {updateProfileMutation.isPending ? (
                    <span>Saving...</span>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Primary Host CTAs */}
        <div className="space-y-2.5">
          {/* Active Session in Progress Card */}
          {hasActiveSession && (
            <div className="rounded-3xl border-2 border-volt-500/80 bg-white p-4 shadow-md shadow-court-900/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-court-600" />
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-court-700">
                    {session.matches.length > 0
                      ? "Session in Play"
                      : "Active Draft"}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-chalk-100 text-[10px] font-extrabold text-slate-600 border border-chalk-200">
                  {session.players.length} Players
                </span>
              </div>

              <div className="text-sm font-extrabold text-slate-900 truncate mb-2.5">
                {session.title || "Tennis Session"}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (session.matches.length > 0) {
                    navigate("/in-session");
                  } else {
                    navigate("/create-session");
                  }
                }}
                className="w-full rounded-xl bg-court-850 hover:bg-court-900 py-3 text-xs font-black text-volt-300 active:scale-[0.99] transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Resume Active Session</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* Start New Session CTA */}
          <button
            type="button"
            onClick={() => navigate("/create-session")}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-volt-500 hover:bg-volt-400 py-4 text-xs font-black text-slate-950 shadow-lg shadow-court-900/10 active:scale-[0.98] transition cursor-pointer"
          >
            <span>Start a New Session</span>
            <span className="text-sm">🎾</span>
          </button>
        </div>

        {/* Host Session History from PocketBase */}
        <div className="pt-2">
          <div className="mb-3 px-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Host Session History
            </span>
          </div>

          {isLoadingSessions ? (
            <div className="p-4 text-center text-xs font-bold text-slate-400 animate-pulse bg-white rounded-2xl border border-chalk-200">
              Loading sessions from cloud...
            </div>
          ) : savedSessions.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-[#ded7c4] shadow-2xs">
              <span className="text-2xl block mb-1">🎾</span>
              <p className="text-xs font-bold text-slate-700">No completed sessions yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Complete a session to archive it to your cloud history.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedSessions.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-chalk-300 bg-white shadow-2xs flex items-stretch overflow-hidden hover:border-court-500/40 transition group"
                >
                  {/* Tappable card area */}
                  <button
                    type="button"
                    onClick={() => navigate(`/history/${s.id}`)}
                    className="flex-1 text-left p-3.5 hover:bg-chalk-50 transition active:scale-[0.99] cursor-pointer"
                  >
                    <div className="text-xs font-black text-slate-900 truncate">
                      {s.title || "Tennis Session"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-court-700 bg-court-50 px-1.5 py-0.5 rounded">
                        {s.players.length} players
                      </span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {s.completedAt
                          ? formatDate(s.completedAt)
                          : formatDate(s.createdAt)}
                      </span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] font-bold text-court-600 group-hover:text-court-800 transition">
                        View →
                      </span>
                    </div>
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteHistory(s.id, s.title)}
                    className="shrink-0 px-3.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition text-sm border-l border-chalk-100 cursor-pointer"
                    title="Delete session record"
                    aria-label="Delete session record"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profound and clear Log Out Button */}
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
      </div>

      {/* 🎾 App Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
};

export default AccountFeature;
