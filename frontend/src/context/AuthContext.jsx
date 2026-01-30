import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setMember(null);
      setLoading(false);
      return;
    }
    try {
      const data = await authApi.me();
      setUser(data.user);
      setMember(data.member);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setMember(data.member);
    return data;
  };

  const register = async (body) => {
    const data = await authApi.register(body);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setMember(data.member);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMember(null);
  };

  const value = {
    user,
    member,
    loading,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
