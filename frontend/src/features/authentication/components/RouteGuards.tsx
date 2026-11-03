import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export function RequireAuth() { const { user } = useAuth(); return user ? <Outlet /> : <Navigate to="/login" replace />; }
export function RedirectAuthenticated() { const { user } = useAuth(); return user ? <Navigate to="/app" replace /> : <Outlet />; }
