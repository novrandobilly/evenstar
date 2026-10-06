import React from "react";
import type { HostUser } from "../../../../types/auth";

interface ProfileViewProps {
  profile?: HostUser | null;
  sessionsCount: number;
  onStartEdit: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  sessionsCount,
  onStartEdit,
}) => {
  return (
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
                Club Name:{" "}
                <span className="font-bold text-slate-800">
                  {profile.club_name}
                </span>
              </p>
            )}
            <div className="mt-1.5">
              <span className="inline-flex text-[10px] font-black uppercase tracking-wider text-court-800 bg-court-100/90 px-2.5 py-0.5 rounded-full border border-court-500/20">
                Free Version
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartEdit}
          className="h-8 w-8 rounded-full bg-chalk-100 hover:bg-chalk-200 border border-[#ded7c4] flex items-center justify-center text-xs text-slate-600 hover:text-slate-900 transition cursor-pointer active:scale-95 shadow-2xs shrink-0 self-end mb-0.5 ml-2"
          title="Edit Profile"
          aria-label="Edit Profile"
        >
          ✏️
        </button>
      </div>

      <div className="mt-4 pt-3.5 border-t border-chalk-100">
        <div className="bg-chalk-50 p-2.5 rounded-xl border border-[#ded7c4] flex items-center justify-between px-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Sessions Hosted
          </span>
          <span className="text-base font-black text-slate-900">
            {sessionsCount}
          </span>
        </div>
      </div>
    </>
  );
};

export default ProfileView;
