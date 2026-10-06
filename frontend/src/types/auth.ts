export interface HostUser {
  id: string;
  collectionId: string;
  collectionName: "users";
  username: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  club_name?: string;
  club_logo?: string;
  avatar?: string;
  tier?: "free" | "pro";
  subscription_expires_at?: string;
  created: string;
  updated: string;
}

export interface LoginPayload {
  identity: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  club_name?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  club_name?: string;
  club_logo?: File | null;
  avatar?: File | null;
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
}
