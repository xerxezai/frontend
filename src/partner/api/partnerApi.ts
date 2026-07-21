const BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend-production-b9f2.up.railway.app/api/v1';

// Deliberately separate from the ERP's localStorage keys (auth_tokens/xerxez_token) —
// the Partner Portal is a completely separate login/account system, so a user logged
// into both must not collide or interfere with each other.
const ACCESS_KEY = 'partner_access';
const PROFILE_KEY = 'partner_profile';

export interface PartnerProfile {
  id: number; full_name: string; email: string; phone: string; country: string; city: string;
  target_market: string; linkedin_url: string; languages: string[];
  current_profession: string; years_experience: string; modules: string[]; estimated_deals: string;
  network_description: string; commission_tier: 'basic' | 'professional' | 'enterprise';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  partner_code: string | null; total_deals: number;
  total_commission_earned: string; total_commission_paid: string;
  joined_at: string;
}

export interface DashboardStats {
  total_deals: number; pending_deals: number; won_deals: number; lost_deals: number;
  total_commission_earned: string; total_commission_pending: string; total_commission_paid: string;
  partner_code: string | null; commission_tier: string;
}

export interface Deal {
  id: number; deal_number: string;
  client_company: string; client_contact_person: string; client_phone: string; client_email: string; client_country: string;
  package: 'basic' | 'professional' | 'enterprise';
  num_employees: string; current_system: string; notes: string;
  status: 'submitted' | 'reviewing' | 'demo_scheduled' | 'negotiating' | 'won' | 'lost' | 'cancelled';
  deal_value: string | null; commission_rate: string | null; commission_amount: string | null;
  commission_status: 'pending' | 'approved' | 'paid'; commission_paid_at: string | null;
  submitted_at: string; updated_at: string;
}

export interface NewDealPayload {
  client_company: string; client_contact_person: string; client_phone: string; client_email: string; client_country: string;
  package: string; num_employees: string; current_system: string; notes: string;
}

export interface TrainingMaterial {
  id: number; title: string; description: string; action: 'view' | 'download'; url: string | null;
}

export function getToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getStoredPartner(): PartnerProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredPartner(p: PartnerProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function isPartnerLoggedIn(): boolean {
  return !!getToken();
}

export function partnerLogout() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

async function partnerFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) {
    if (res.status === 401 && token) {
      partnerLogout();
      window.location.href = '/partner';
    }
    throw new Error(data?.error || (data && JSON.stringify(data)) || `HTTP ${res.status}`);
  }
  return data;
}

export const partnerApi = {
  login: async (email: string, password: string): Promise<PartnerProfile> => {
    const data = await partnerFetch('partners/login/', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem(ACCESS_KEY, data.access);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data.partner));
    return data.partner as PartnerProfile;
  },
  me: (): Promise<PartnerProfile> => partnerFetch('partners/me/'),
  dashboard: (): Promise<DashboardStats> => partnerFetch('partners/dashboard/'),
  listDeals: (): Promise<Deal[]> => partnerFetch('partners/deals/'),
  getDeal: (id: number): Promise<Deal> => partnerFetch(`partners/deals/${id}/`),
  submitDeal: (payload: NewDealPayload): Promise<Deal> =>
    partnerFetch('partners/deals/', { method: 'POST', body: JSON.stringify(payload) }),
  materials: (): Promise<TrainingMaterial[]> => partnerFetch('partners/materials/'),
};
