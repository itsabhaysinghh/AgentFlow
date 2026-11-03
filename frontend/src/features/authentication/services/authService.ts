import type { AuthenticatedUser, LoginRequest, RegisterRequest, TokenResponse } from '../types/auth.types';
import { AuthServiceError } from '../types/auth.types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {

  const response = await fetch(`${apiBaseUrl}/api/v1/auth${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });

  if (!response.ok) {
    // Deliberately keep authentication failures generic in the UI.
    throw new AuthServiceError('Unable to sign in with those details.', response.status);
  }

  return response.json() as Promise<T>;
}

/**
 * Access tokens are held only in application memory; they are never written to
 * localStorage or sessionStorage. The backend should migrate to HttpOnly cookies.
 */
export const authService = {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    return request<TokenResponse>('/login', { method: 'POST', body: JSON.stringify(credentials) });
  },

  async register({ fullName, email, password }: RegisterRequest): Promise<TokenResponse> {
    return request<TokenResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
  },

  async refreshToken(): Promise<TokenResponse> {
    return request<TokenResponse>('/refresh', { method: 'POST' });
  },

  async logout(): Promise<void> {
    await request<void>('/logout', { method: 'POST' });
  },

  async getCurrentUser(token: string): Promise<AuthenticatedUser> {
    return request<AuthenticatedUser>('/me', {}, token);
  },
};
