export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  fullName: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role?: string;
}

export interface AuthSession {
  user: AuthenticatedUser;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  full_name: string;
}

export class AuthServiceError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AuthServiceError';
    this.status = status;
  }
}
