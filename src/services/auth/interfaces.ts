export interface UserProfile {
  countryIsoCode: string;
  countryName: string;
  birthYear: number | null;
  gender: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export interface UserTokenData {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  emailVerified: boolean;
  preferredLanguageCode: string;
  preferredLanguageName: string;
  roles: string[];
  profile: UserProfile;
  jwt: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = UserTokenData;