import React, { useState } from "react";
import type { HostUser } from "../../../../types/auth";
import { ProfileView } from "./ProfileView";
import { ProfileEditForm } from "./ProfileEditForm";

interface ProfileCardProps {
  profile?: HostUser | null;
  sessionsCount: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  sessionsCount,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="rounded-3xl border border-[#ded7c4] bg-white p-5 shadow-xs relative overflow-hidden">
      {!isEditing ? (
        <ProfileView
          profile={profile}
          sessionsCount={sessionsCount}
          onStartEdit={() => setIsEditing(true)}
        />
      ) : (
        <ProfileEditForm
          profile={profile}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default ProfileCard;
