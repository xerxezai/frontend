import { useState, useEffect, useCallback } from 'react';

/** Decodes the JWT access token and returns true if is_superuser === true. */
export function isSuperUser(): boolean {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      const payload = JSON.parse(atob(JSON.parse(stored).access.split('.')[1]));
      if (payload.is_superuser === true) return true;
    }
  } catch {}
  const role = localStorage.getItem('xerxez_role') || '';
  return role === 'admin' || role === 'super_admin' || role === 'superuser';
}

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

/** Platform admin's "active company" selection (Company Switcher) — there's no server
 * session for this (see backend apps.companies.utils docstring), so it's carried as a
 * header on every request instead, same as auth/role state already lives client-side. */
function getActiveCompanyId(): string | null {
  return localStorage.getItem('xerxez_active_company_id');
}

export async function erpFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const activeCompanyId = getActiveCompanyId();
  const res = await fetch(`${BASE}/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(activeCompanyId ? { 'X-Active-Company-Id': activeCompanyId } : {}),
      ...(options.headers || {}),
    },
  });
  // 204 No Content (successful DELETE) has no body — don't parse
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) {
    if (res.status === 401) {
      clearAllTokens();
      window.location.href = '/erp';
    }
    throw new Error(data?.detail || JSON.stringify(data) || `HTTP ${res.status}`);
  }
  return data;
}

/** Multipart upload (no JSON Content-Type so the browser sets its own boundary). */
export async function erpUpload(path: string, formData: FormData, method: string = 'POST') {
  const token = getToken();
  const res = await fetch(`${BASE}/${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) throw new Error(data?.detail || JSON.stringify(data) || `HTTP ${res.status}`);
  return data;
}

/** Authenticated GET for non-JSON responses (CSV/file exports) — triggers a browser download. */
export async function erpDownload(path: string, filename: string) {
  const token = getToken();
  const res = await fetch(`${BASE}/${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const data = (res.headers.get('content-type') || '').includes('application/json') ? await res.json() : null;
    throw new Error(data?.detail || `HTTP ${res.status}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    erpFetch('reports/dashboard/')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

export function useERPSalesReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    erpFetch('reports/sales/')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useERPActivity(refreshMs = 60000) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    erpFetch('reports/activity/')
      .then(res => setData(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    if (!refreshMs) return;
    const iv = setInterval(load, refreshMs);
    return () => clearInterval(iv);
  }, [load, refreshMs]);

  return { data, loading, reload: load };
}

/** Polls the backend health endpoint (root-level, outside /api/v1) to drive a
 * System Online / Offline badge. */
export function useSystemStatus(intervalMs = 30000) {
  const [online, setOnline] = useState<boolean | null>(null);
  const healthUrl = BASE.replace(/\/api\/v\d+\/?$/, '') + '/health/health/';

  useEffect(() => {
    let cancelled = false;
    const check = () => {
      fetch(healthUrl)
        .then(r => { if (!cancelled) setOnline(r.ok); })
        .catch(() => { if (!cancelled) setOnline(false); });
    };
    check();
    const iv = setInterval(check, intervalMs);
    return () => { cancelled = true; clearInterval(iv); };
  }, [healthUrl, intervalMs]);

  return online;
}

// ── Attendance hooks ──────────────────────────────────────────────────────────

export function useAttendanceTodayStatus() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    erpFetch('hr/attendance/today-status/')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const clockIn = useCallback(async () => {
    const res = await erpFetch('hr/attendance/clock-in/', { method: 'POST', body: JSON.stringify({}) });
    load();
    return res;
  }, [load]);

  const clockOut = useCallback(async () => {
    const res = await erpFetch('hr/attendance/clock-out/', { method: 'POST', body: JSON.stringify({}) });
    load();
    return res;
  }, [load]);

  return { data, loading, error, clockIn, clockOut, reload: load };
}

export function useMyAttendance() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    erpFetch('hr/attendance/my-records/')
      .then((res: any) => setData(Array.isArray(res) ? res : res.results ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

export function useMyLeaves() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    erpFetch('hr/leave-requests/my-leaves/')
      .then((res: any) => setData(Array.isArray(res) ? res : res.results ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const submitLeave = useCallback(async (body: Record<string, unknown>) => {
    const res = await erpFetch('hr/leave-requests/', { method: 'POST', body: JSON.stringify(body) });
    load();
    return res;
  }, [load]);

  return { data, loading, error, reload: load, submitLeave };
}

export function useMyPayslips() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    erpFetch('hr/payroll/my-payslips/')
      .then((res: any) => setData(Array.isArray(res) ? res : res.results ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}
