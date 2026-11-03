import type { AuthSession, AuthenticatedUser, LoginRequest, RegisterRequest } from '../types/auth.types';
import { AuthServiceError } from '../types/auth.types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
const authBackendEnabled = import.meta.env.VITE_AUTH_BACKEND_READY === 'true';

const pendingIntegrationMessage =
  'Secure authentication is not available yet. Please try again after the backend integration is enabled.';

function requireSecureBackend(): void {
  if (!authBackendEnabled) {
    throw new AuthServiceError(pendingIntegrationMessage);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  requireSecureBackend();

  const response = await fetch(`${apiBaseUrl}/api/v1/auth${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!response.ok) {
    // Deliberately keep authentication failures generic in the UI.
    throw new AuthServiceError('Unable to sign in with those details.', response.status);
  }

  return response.json() as Promise<T>;
}

/**
 * These methods expect the production backend to use Secure, HttpOnly session
 * cookies. This client intentionally never reads or stores access/refresh tokens.
 */
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthSession> {
    return request<AuthSession>('/login', { method: 'POST', body: JSON.stringify(credentials) });
  },

  async register({ fullName, email, password }: RegisterRequest): Promise<AuthSession> {
    return request<AuthSession>('/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
  },

  async refreshToken(): Promise<AuthSession> {
    return request<AuthSession>('/refresh', { method: 'POST' });
  },

  async logout(): Promise<void> {
    await request<void>('/logout', { method: 'POST' });
  },

  async getCurrentUser(): Promise<AuthenticatedUser> {
    return request<AuthenticatedUser>('/me');
  },
};
