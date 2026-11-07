import { useAppSelector } from '../app/hooks';

export function useAuth() {
  const user = useAppSelector((state) => state.auth.user);
  return { user, isAuthenticated: Boolean(user), isAdmin: user?.role === 'Admin' };
}
