import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthHeader } from '../api/http.js';

const SESSION_KEY = 'authSession';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const persistSession = (tokenValue, userPayload, expiresAt = Date.now() + SESSION_TTL_MS) => {
    setToken(tokenValue);
    setUser(userPayload);
    setAuthHeader(tokenValue);
    const sessionPayload = {
      token: tokenValue,
      user: userPayload,
      expiresAt
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    setAuthHeader(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  useEffect(() => {
    const restoreSession = () => {
      try {
        const rawSession = localStorage.getItem(SESSION_KEY);
        if (rawSession) {
          const parsed = JSON.parse(rawSession);
          if (parsed.expiresAt && parsed.expiresAt > Date.now() && parsed.token && parsed.user) {
            persistSession(parsed.token, parsed.user, parsed.expiresAt);
            return;
          }
          localStorage.removeItem(SESSION_KEY);
        }

        const legacyToken = localStorage.getItem('authToken');
        const legacyUser = localStorage.getItem('authUser');
        if (legacyToken && legacyUser) {
          persistSession(legacyToken, JSON.parse(legacyUser));
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      } catch (err) {
        console.error('Failed to restore session', err);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const handleAuth = async (path, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/auth/${path}`, payload);
      persistSession(data.token, data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Authentication failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      initializing,
      login: (payload) => handleAuth('login', payload),
      register: (payload) => handleAuth('register', payload),
      logout: clearSession
    }),
    [user, token, loading, error, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
