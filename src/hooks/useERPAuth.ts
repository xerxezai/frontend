import { useState, useCallback } from 'react';
import apiService from '../services/api';

const TOKEN_KEY = 'auth_tokens';

export function useERPAuth() {
  const [token, setToken] = useState<string | null>(() => {
    try {
      const s = localStorage.getItem(TOKEN_KEY);
      return s ? JSON.parse(s).access : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.login({ username, password });
      if (res.success) {
        setToken(res.data.token);
        return true;
      } else {
        const e = res as import('../services/api').ApiError;
        setError(e.details?.non_field_errors?.[0] || e.message || 'Invalid credentials');
        return false;
      }
    } catch {
      setError('Network error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiService.logout();
    setToken(null);
  }, []);

  return { token, loading, error, login, logout, isAuthenticated: !!token };
}
