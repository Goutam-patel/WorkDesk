'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, login as loginRequest, logout as logoutRequest, refreshSession, register as registerRequest } from '../lib/api/auth';
import { clearAccessToken, setAccessToken } from '../lib/api/client';

export const AuthContext = createContext(null);

function persistAuth(accessToken, user) {
  setAccessToken(accessToken);
  localStorage.setItem('workdesk_user', JSON.stringify(user));
}

function clearPersistedAuth() {
  clearAccessToken();
  localStorage.removeItem('workdesk_user');
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawUser = localStorage.getItem('workdesk_user');
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch {
      localStorage.removeItem('workdesk_user');
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const syncCurrentUser = useCallback(async () => {
    try {
      await refreshSession();
      const response = await getCurrentUser();
      const currentUser = response.user;
      setUser(currentUser);
      localStorage.setItem('workdesk_user', JSON.stringify(currentUser));
    } catch {
      clearPersistedAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      syncCurrentUser();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [syncCurrentUser]);

  const login = useCallback(async (payload) => {
    const response = await loginRequest(payload);
    persistAuth(response.accessToken || response.token, response.user);
    setUser(response.user);
    return response;
  }, []);

  const register = useCallback(async (payload) => {
    const response = await registerRequest(payload);
    persistAuth(response.accessToken || response.token, response.user);
    setUser(response.user);
    return response;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    clearPersistedAuth();
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      refreshUser: syncCurrentUser
    }),
    [user, loading, login, register, logout, syncCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
