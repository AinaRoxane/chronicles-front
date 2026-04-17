export interface UserProfile {
  countryIsoCode: string;
  countryName: string;
  birthYear: number | null;
  gender: string | null;
  bio: string | null;
  avatarUrl: string | null;
  nbPosts: number;
  nbWorks: number;
  nbFollowers: number;
  nbFollowing: number;
}

export interface UserTokenData {
  id: number;
  email: string;
  username: string;
  usertag: string;
  isActive: boolean;
  emailVerified: boolean;
  preferredLanguageCode: string;
  preferredLanguageName: string;
  roles: string[];
  profile: UserProfile;
  jwt: string;
}

export interface LoginRequest {
  identifier?: string;
  email?: string;
  password: string;
}

export type LoginResponse = UserTokenData;