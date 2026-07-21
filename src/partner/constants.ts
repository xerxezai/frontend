// Kept in sync manually with backend COMMISSION_RATES (apps/partners/models.py) and the
// public Contact/Partner-application forms' package cards.
export const PACKAGES = [
  {
    value: 'basic', label: 'Basic', pct: 10,
    includes: 'Dashboard, HR, CRM, Sales, Accounting',
  },
  {
    value: 'professional', label: 'Professional', pct: 20,
    includes: 'Basic + Procurement, Logistics, Document Management',
  },
  {
    value: 'enterprise', label: 'Enterprise', pct: 30,
    includes: 'Everything + Project Mgmt, Asset Mgmt, QHSE, MLM',
  },
] as const;

export const NUM_EMPLOYEES = ['1-10', '11-50', '51-200', '201-500', '500+'] as const;

export const CURRENT_SYSTEMS = [
  { value: 'excel', label: 'Currently using Excel' },
  { value: 'other_erp', label: 'Currently using another ERP' },
  { value: 'nothing', label: 'No system (manual process)' },
  { value: 'other', label: 'Other' },
] as const;

export const DEAL_STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  submitted: { label: 'Submitted', bg: '#dbeafe', color: '#1d4ed8' },
  reviewing: { label: 'Reviewing', bg: '#fff3e0', color: '#e65100' },
  demo_scheduled: { label: 'Demo Scheduled', bg: '#ede9fe', color: '#6d28d9' },
  negotiating: { label: 'Negotiating', bg: '#fef9c3', color: '#a16207' },
  won: { label: 'Won', bg: '#d1fae5', color: '#065f46' },
  lost: { label: 'Lost', bg: '#fee2e2', color: '#991b1b' },
  cancelled: { label: 'Cancelled', bg: '#f1f5f9', color: '#64748b' },
};

export const COMMISSION_STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: '#fff3e0', color: '#e65100' },
  approved: { label: 'Approved', bg: '#dbeafe', color: '#1d4ed8' },
  paid: { label: 'Paid', bg: '#d1fae5', color: '#065f46' },
};

export const OG = '#C9883A';
export const DARK = '#1a1208';
export const CREAM = '#F8F7F4';
export const FF = "'DM Sans',sans-serif";
