export interface UserTokenData {
    // JWT Standard Claims
    sub: string;             // This is usually the email or user ID in the token
    exp: number;             // Expiration timestamp (seconds)

    // Identity (from 'users' table)
    id: number;
    email: string;
    isActive: boolean;       // matches 'is_active'
    emailVerified: boolean;  // matches 'email_verified'
    preferredLanguageId: number | null;
    // Profile (from 'profiles' table)
    username: string;
    gender?: string;
    birthYear?: number;
    // Roles (from 'user_role_assignments' joined with 'user_roles')
    roles: string[];         // e.g., ['admin', 'reader']
    
    // Extra Chronicles context
    countryId?: number;      // matches 'country_id'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserTokenData;
}