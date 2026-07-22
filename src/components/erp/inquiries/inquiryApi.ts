import { erpFetch } from '../../../hooks/useERPApi';

export interface Inquiry {
  id: number;
  full_name: string; email: string; phone: string; company: string;
  service: string; urgency: 'normal' | 'urgent' | 'critical'; subject: string; message: string;
  country: string; hear_about_us: string;
  industry: string; current_challenge: string;
  plan_interest: string; team_size: string; timeline: string; erp_modules: string;
  budget_currency: string; budget_range: string;
  tech_stack: string; deployment_env: string; num_developers: string;
  cloud_provider: string; current_infra: string; migration_needed: string;
  project_type: string; project_timeline: string; approx_budget: string;
  training_team_size: string; training_mode: string; topics_of_interest: string; training_duration: string;
  created_at: string; updated_at: string; is_read: boolean;
  status: 'new' | 'reviewed' | 'replied' | 'closed';
  assigned_to: number | null; assigned_to_name: string | null;
  priority: 'low' | 'medium' | 'high';
  notes: string; replied_at: string | null;
}

export interface InquiryStats {
  total: number; new: number; reviewed: number; replied: number; closed: number;
  high_priority: number; this_week: number; this_month: number;
}

export interface InquiryFilters {
  status?: string; priority?: string; service?: string;
  date_from?: string; date_to?: string; search?: string;
}

export const inquiryApi = {
  list: (filters?: InquiryFilters): Promise<Inquiry[]> => {
    const qs = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => { if (v) qs.set(k, v); });
    }
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return erpFetch(`contact/inquiries/${suffix}`);
  },
  get: (id: number): Promise<Inquiry> => erpFetch(`contact/inquiries/${id}/`),
  update: (id: number, data: Partial<Inquiry>): Promise<Inquiry> =>
    erpFetch(`contact/inquiries/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<null> => erpFetch(`contact/inquiries/${id}/`, { method: 'DELETE' }),
  stats: (): Promise<InquiryStats> => erpFetch('contact/inquiries/stats/'),
};
