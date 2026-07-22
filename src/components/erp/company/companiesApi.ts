import { erpFetch } from '../../../hooks/useERPApi';

export const companiesApi = {
  getCompanies: () => erpFetch('companies/'),
  getCompany: (id: number) => erpFetch(`companies/${id}/`),
  createCompany: (data: any) => erpFetch('companies/', { method: 'POST', body: JSON.stringify(data) }),
  updateCompany: (id: number, data: any) => erpFetch(`companies/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  deactivateCompany: (id: number) => erpFetch(`companies/${id}/`, { method: 'DELETE' }),
  getCompanyUsers: (id: number) => erpFetch(`companies/${id}/users/`),
  addCompanyUser: (id: number, data: any) => erpFetch(`companies/${id}/users/`, { method: 'POST', body: JSON.stringify(data) }),

  // Company Admin self-service — always the caller's own company, never a company_id.
  getMyCompanyStats: () => erpFetch('my-company/stats/'),
  getMyCompanyUsers: () => erpFetch('my-company/users/'),
  addMyCompanyUser: (data: any) => erpFetch('my-company/users/', { method: 'POST', body: JSON.stringify(data) }),
  updateMyCompanyUser: (userId: number, data: any) => erpFetch(`my-company/users/${userId}/`, { method: 'PUT', body: JSON.stringify(data) }),
  deactivateMyCompanyUser: (userId: number) => erpFetch(`my-company/users/${userId}/`, { method: 'DELETE' }),
};
