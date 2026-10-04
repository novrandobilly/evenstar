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
  avatar?: string;
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
  avatar?: File | null;
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
}
