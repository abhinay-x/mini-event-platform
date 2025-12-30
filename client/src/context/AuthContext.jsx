import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthHeader } from '../api/http.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setAuthHeader(savedToken);
    }
  }, []);

  const persistSession = (tokenValue, userPayload) => {
    setToken(tokenValue);
    setUser(userPayload);
    setAuthHeader(tokenValue);
    localStorage.setItem('authToken', tokenValue);
    localStorage.setItem('authUser', JSON.stringify(userPayload));
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    setAuthHeader(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

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
      login: (payload) => handleAuth('login', payload),
      register: (payload) => handleAuth('register', payload),
      logout: clearSession
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
