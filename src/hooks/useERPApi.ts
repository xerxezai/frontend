import { useState, useEffect, useCallback } from 'react';

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend-production-b9f2.up.railway.app/api/v1';

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) return JSON.parse(stored).access || null;
  } catch {}
  return localStorage.getItem('xerxez_token');
}

function clearAllTokens() {
  ['auth_tokens', 'xerxez_token', 'xerxez_role', 'xerxez_name'].forEach(k =>
    localStorage.removeItem(k)
  );
}

async function erpFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      clearAllTokens();
      window.location.href = '/erp';
    }
    throw new Error(data.detail || JSON.stringify(data));
  }
  return data;
}

export function useERPList<T>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await erpFetch(path);
      setData(Array.isArray(res) ? res : res.results ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (body: Partial<T>) => {
    const res = await erpFetch(path, { method: 'POST', body: JSON.stringify(body) });
    await load();
    return res;
  }, [path, load]);

  const update = useCallback(async (id: number, body: Partial<T>) => {
    const res = await erpFetch(`${path}${id}/`, { method: 'PATCH', body: JSON.stringify(body) });
    await load();
    return res;
  }, [path, load]);

  const remove = useCallback(async (id: number) => {
    await erpFetch(`${path}${id}/`, { method: 'DELETE' });
    await load();
  }, [path, load]);

  return { data, loading, error, reload: load, create, update, remove };
}

export function useERPDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    erpFetch('reports/dashboard/')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

