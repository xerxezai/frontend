import { erpFetch } from '../../../hooks/useERPApi';

export const companiesApi = {
  getCompanies: () => erpFetch('companies/'),
  getCompany: (id: number) => erpFetch(`companies/${id}/`),
  createCompany: (data: any) => erpFetch('companies/', { method: 'POST', body: JSON.stringify(data) }),
  updateCompany: (id: number, data: any) => erpFetch(`companies/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  deactivateCompany: (id: number) => erpFetch(`companies/${id}/`, { method: 'DELETE' }),
  getCompanyUsers: (id: number) => erpFetch(`companies/${id}/users/`),
  addCompanyUser: (id: number, data: any) => erpFetch(`companies/${id}/users/`, { method: 'POST', body: JSON.stringify(data) }),
};
