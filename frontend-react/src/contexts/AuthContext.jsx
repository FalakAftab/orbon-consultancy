import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearSession, fetchMe, getStoredUser, login as loginRequest, logout as logoutRequest, setSession } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    fetchMe()
      .then((response) => {
        if (!active) return;
        setUser(response.user || null);
      })
      .catch(() => {
        if (!active) return;
        clearSession();
        setToken('');
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const loginWithToken = (newToken, newUser) => {
    setSession(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const signIn = async (credentials) => {
    const response = await loginRequest(credentials);
    setSession(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const signOut = async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
      setToken('');
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, signIn, signOut, loginWithToken, refreshUser: (u) => setUser(u) }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
