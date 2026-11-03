import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { authService } from './services/authService';
import type { AuthenticatedUser, LoginRequest } from './types/auth.types';

interface AuthContextValue { user: AuthenticatedUser | null; login: (credentials: LoginRequest) => Promise<void>; logout: () => Promise<void>; }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const value = useMemo<AuthContextValue>(() => ({
    user,
    async login(credentials) {
      const response = await authService.login(credentials);
      setAccessToken(response.access_token);
      setUser({ id: response.user_id, email: response.email, fullName: response.full_name });
    },
    async logout() {
      if (accessToken) await authService.logout();
      setAccessToken(null);
      setUser(null);
    },
  }), [accessToken, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
