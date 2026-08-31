import { createContext, useEffect, useState } from 'react';
import { getMe, login as loginRequest, register as registerRequest } from '../api/auth';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'kickz_auth';

function readStoredAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredAuth();
    if (!stored?.token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(({ user }) => setAuth({ token: stored.token, user }))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setAuth(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function persist(nextAuth) {
    setAuth(nextAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
  }

  async function login(credentials) {
    const { token, user } = await loginRequest(credentials);
    persist({ token, user });
  }

  async function register(payload) {
    const { token, user } = await registerRequest(payload);
    persist({ token, user });
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: Boolean(auth?.token),
    isAdmin: auth?.user?.role === 'admin',
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
