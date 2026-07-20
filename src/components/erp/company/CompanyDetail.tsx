import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';
import { companiesApi } from './companiesApi';
import AddCompanyUserModal from './AddCompanyUserModal';

const FF = "'DM Sans',sans-serif";
const OG = '#C9883A';

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  active:    { label: 'Active',    bg: '#d1fae5', color: '#065f46' },
  trial:     { label: 'Trial',     bg: '#fef3c7', color: '#92400e' },
  inactive:  { label: 'Inactive',  bg: '#f1f5f9', color: '#64748b' },
  suspended: { label: 'Suspended', bg: '#fee2e2', color: '#991b1b' },
};
const ROLE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  company_admin: { label: 'Company Admin', bg: '#fee2e2', color: '#991b1b' },
  module_admin:  { label: 'Module Admin',  bg: '#dbeafe', color: '#1d4ed8' },
  regular_user:  { label: 'Regular User',  bg: '#d1fae5', color: '#065f46' },
  read_only:     { label: 'Read Only',     bg: '#f1f5f9', color: '#64748b' },
};

const Badge = ({ map, value }: { map: Record<string, { label: string; bg: string; color: string }>; value: string }) => {
  const m = map[value] ?? { label: value, bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF, whiteSpace: 'nowrap' }}>
      {m.label}
    </span>
  );
};

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const companyId = Number(id);

  const [company, setCompany] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([companiesApi.getCompany(companyId), companiesApi.getCompanyUsers(companyId)])
      .then(([c, u]: any[]) => { setCompany(c); setUsers(Array.isArray(u) ? u : []); })
      .catch((e: any) => { setError(e.message || 'Could not load company'); toast.error(e.message || 'Could not load company'); })
      .finally(() => setLoading(false));
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  const userCols = [
    { key: 'full_name', label: 'Name' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (r: any) => <Badge map={ROLE_BADGE} value={r.role} /> },
    { key: 'is_active', label: 'Status', render: (r: any) => <Badge map={{ true: { label: 'Active', bg: '#d1fae5', color: '#065f46' }, false: { label: 'Inactive', bg: '#f1f5f9', color: '#64748b' } }} value={String(r.is_active)} /> },
  ];

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
        <div className="spinner-border" style={{ color: OG }} role="status"></div>
        <p>Loading company…</p>
      </div>
    );
  }
  if (error || !company) {
    return <div className="alert alert-danger">{error || 'Company not found'}</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/erp/companies')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: '#6B6B6B', fontFamily: FF, display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 16 }}
      >
        <i className="fas fa-arrow-left" style={{ fontSize: 10 }} /> Back to Companies
      </button>

      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(201,136,58,0.06)',
        padding: 24, marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h4 style={{ fontFamily: FF, fontWeight: 800, fontSize: 20, color: '#1A1A1A', margin: 0 }}>{company.name}</h4>
          <Badge map={STATUS_BADGE} value={company.status} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, fontFamily: FF, fontSize: 13 }}>
          <div><div style={{ color: '#9ca3af', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Industry</div>{company.industry || '—'}</div>
          <div><div style={{ color: '#9ca3af', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Location</div>{[company.city, company.country].filter(Boolean).join(', ') || '—'}</div>
          <div><div style={{ color: '#9ca3af', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Phone</div>{company.phone || '—'}</div>
          <div><div style={{ color: '#9ca3af', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Email</div>{company.email || '—'}</div>
          <div><div style={{ color: '#9ca3af', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Plan</div><span style={{ textTransform: 'capitalize' }}>{company.plan}</span></div>
          <div><div style={{ color: '#9ca3af', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Users</div>{users.length}</div>
        </div>
      </div>

      <ERPTable
        title="Company Users"
        columns={userCols}
        data={users}
        loading={false}
        error={null}
        isAdmin={true}
        onAdd={() => setShowAddUser(true)}
      />

      {showAddUser && (
        <AddCompanyUserModal
          companyId={companyId}
          onClose={() => setShowAddUser(false)}
          onSuccess={() => { setShowAddUser(false); load(); toast.success('User added'); }}
        />
      )}
    </div>
  );
}
