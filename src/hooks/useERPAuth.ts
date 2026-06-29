import { useState, useCallback } from 'react';
import apiService from '../services/api';

export function useERPAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('xerxez_token')
  );
  const [role, setRole] = useState<string>(() =>
    localStorage.getItem('xerxez_role') || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.login({ username, password });
      if (res.success) {
        setToken(res.data.access);
        setRole(res.data.role || 'admin');
        return true;
      } else {
        const e = res as import('../services/api').ApiError;
        const detail = e.details?.non_field_errors?.[0]
          || e.details?.detail
          || e.message
          || 'Invalid username or password';
        setError(detail);
        return false;
      }
    } catch {
      setError('Network error — please check your connection');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    const refresh = JSON.parse(localStorage.getItem('auth_tokens') || '{}').refresh;
    apiService.logout();          // clears auth_tokens + xerxez_* keys
    if (refresh) {
      apiService.post('/auth/logout/', { refresh }).catch(() => {});
    }
    setToken(null);
    setRole('');
  }, []);

  return { token, role, loading, error, login, logout, isAuthenticated: !!token };
}
