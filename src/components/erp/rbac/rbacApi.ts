import { erpFetch } from '../../../hooks/useERPApi';

export const rbacApi = {
  getMyAccess: () => erpFetch('rbac/my-access/'),
  getModules: () => erpFetch('rbac/modules/'),
  getUsers: () => erpFetch('rbac/users/'),
  // Companies live under apps.companies, not apps.rbac, but this call is only ever made
  // from CreateUserModal (itself gated to platform admins), which is the same audience
  // apps.companies.views.CompanyListView already restricts to — no separate endpoint needed.
  getCompanies: () => erpFetch('companies/'),
  createUser: (data: any) => erpFetch('rbac/users/create/', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: number, data: any) => erpFetch(`rbac/users/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  deactivateUser: (id: number) => erpFetch(`rbac/users/${id}/`, { method: 'DELETE' }),
  permanentDeleteUser: (id: number) => erpFetch(`rbac/users/${id}/permanent-delete/`, { method: 'DELETE' }),
  grantAccess: (userId: number, data: any) => erpFetch(`rbac/users/${userId}/grant-access/`, { method: 'POST', body: JSON.stringify(data) }),
  revokeAccess: (userId: number, data: any) => erpFetch(`rbac/users/${userId}/revoke-access/`, { method: 'DELETE', body: JSON.stringify(data) }),
  getAccessRequests: () => erpFetch('rbac/access-requests/'),
  requestAccess: (data: any) => erpFetch('rbac/access-requests/', { method: 'POST', body: JSON.stringify(data) }),
  approveRequest: (id: number) => erpFetch(`rbac/access-requests/${id}/approve/`, { method: 'PUT', body: JSON.stringify({}) }),
  rejectRequest: (id: number) => erpFetch(`rbac/access-requests/${id}/reject/`, { method: 'PUT', body: JSON.stringify({}) }),
};
