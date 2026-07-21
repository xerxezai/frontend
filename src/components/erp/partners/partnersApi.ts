import { erpFetch } from '../../../hooks/useERPApi';

export const partnersApi = {
  getApplications: (params?: { status?: string; country?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.country) qs.set('country', params.country);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return erpFetch(`partners/applications/${suffix}`);
  },
  getApplication: (id: number) => erpFetch(`partners/applications/${id}/`),
  updateApplication: (id: number, data: any) => erpFetch(`partners/applications/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
};
