import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_EXPIRED_EVENT, tokenStorage } from '../services/api';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // With a stored token we must confirm it with /auth/me before routing.
  const [initializing, setInitializing] = useState(() => Boolean(tokenStorage.get()));

  useEffect(() => {
    if (!tokenStorage.get()) return undefined;
    let cancelled = false;
    authService
      .me()
      .then((profile) => {
        if (!cancelled) setUser(profile);
      })
      .catch((error) => {
        // Only an auth failure invalidates the token; keep it on network errors.
        if (error.normalized?.status === 401) tokenStorage.clear();
      })
      .finally(() => {
        if (!cancelled) setInitializing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, []);

  const login = useCallback(async (credentials) => {
    const token = await authService.login(credentials);
    tokenStorage.set(token);
    try {
      setUser(await authService.me());
    } catch (error) {
      tokenStorage.clear();
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, initializing, isAuthenticated: Boolean(user), login, logout }),
    [user, initializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
