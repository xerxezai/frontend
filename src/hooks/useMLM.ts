import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export interface MLMProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  referral_code: string;
  referrer_username: string | null;
  level: number;
  is_active: boolean;
  joined_at: string;
  total_referrals: number;
}

export interface MLMEarnings {
  total_earned: string;
  pending_earnings: string;
  approved_earnings: string;
  paid_earnings: string;
  last_payout: string | null;
}

export interface MLMCommission {
  id: number;
  earner_username: string;
  source_username: string;
  transaction_reference: string;
  level: number;
  commission_rate: string;
  amount: string;
  status: string;
  created_at: string;
}

export interface MLMDashboard {
  profile: MLMProfile;
  earnings: MLMEarnings;
  commissions_by_level: { level: number; total: string }[];
  direct_referrals: number;
  total_downline: number;
}

export function useMLMDashboard() {
  const [dashboard, setDashboard] = useState<MLMDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getMLMDashboard();
      if (res.success) {
        setDashboard(res.data);
        setHasProfile(true);
      } else {
        const errRes = res as import('../services/api').ApiError;
        if (errRes.status === 404) setHasProfile(false);
        else if (errRes.status === 401) setError('not_authenticated');
        else setError(errRes.message || 'Failed to load dashboard');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { dashboard, loading, error, hasProfile, reload: load };
}

export function useMLMCommissions() {
  const [commissions, setCommissions] = useState<MLMCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    apiService.getMLMCommissions().then(res => {
      if (!mounted) return;
      if (res.success) setCommissions(Array.isArray(res.data) ? res.data : []);
      else {
        const errRes = res as import('../services/api').ApiError;
        setError(errRes.message || 'Failed to load commissions');
      }
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return { commissions, loading, error };
}

export function useMLMJoin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const join = useCallback(async (referrerCode?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.joinMLM(referrerCode);
      if (res.success) {
        setSuccess(true);
      } else {
        const errRes = res as import('../services/api').ApiError;
        setError(
          errRes.details?.user?.[0] ||
          errRes.details?.non_field_errors?.[0] ||
          errRes.message ||
          'Failed to join MLM'
        );
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { join, loading, error, success };
}

export function useMLMAuth() {
  const [token, setToken] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem('auth_tokens');
      return stored ? JSON.parse(stored).access : null;
    } catch { return null; }
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.login({ username, password });
      if (res.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      } else {
        const errRes = res as import('../services/api').ApiError;
        setError(errRes.details?.non_field_errors?.[0] || errRes.message || 'Invalid credentials');
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
    setUser(null);
  }, []);

  return { token, user, loading, error, login, logout, isAuthenticated: !!token };
}
