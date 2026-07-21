import { erpFetch } from '../../../hooks/useERPApi';

export const partnersApi = {
  // Tab 1 — Applications (Partner rows, any status)
  getPartners: (params?: { status?: string; country?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.country) qs.set('country', params.country);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return erpFetch(`partners/admin/partners/${suffix}`);
  },
  getPartner: (id: number) => erpFetch(`partners/admin/partners/${id}/`),
  updatePartner: (id: number, data: any) => erpFetch(`partners/admin/partners/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  approvePartner: (id: number, password: string) => erpFetch(`partners/admin/partners/${id}/approve/`, { method: 'PUT', body: JSON.stringify({ password }) }),
  rejectPartner: (id: number, notes?: string) => erpFetch(`partners/admin/partners/${id}/reject/`, { method: 'PUT', body: JSON.stringify(notes !== undefined ? { notes } : {}) }),
  deletePartner: (id: number) => erpFetch(`partners/admin/partners/${id}/`, { method: 'DELETE' }),

  // Tab 3 — All Deals
  getDeals: (params?: { status?: string; partner?: number | string; package?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.partner) qs.set('partner', String(params.partner));
    if (params?.package) qs.set('package', params.package);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return erpFetch(`partners/admin/deals/${suffix}`);
  },
  updateDeal: (id: number, data: any) => erpFetch(`partners/admin/deals/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDeal: (id: number) => erpFetch(`partners/admin/deals/${id}/`, { method: 'DELETE' }),
};
