import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';
import { companiesApi } from './companiesApi';
import AddCompanyModal from './AddCompanyModal';

const FF = "'DM Sans',sans-serif";
const OG = '#C9883A';

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  active:    { label: 'Active',    bg: '#d1fae5', color: '#065f46' },
  trial:     { label: 'Trial',     bg: '#fef3c7', color: '#92400e' },
  inactive:  { label: 'Inactive',  bg: '#f1f5f9', color: '#64748b' },
  suspended: { label: 'Suspended', bg: '#fee2e2', color: '#991b1b' },
};

const Badge = ({ value }: { value: string }) => {
  const m = STATUS_BADGE[value] ?? { label: value, bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF, whiteSpace: 'nowrap' }}>
      {m.label}
    </span>
  );
};

export default function CompanyManagement() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    companiesApi.getCompanies()
      .then((res: any) => setCompanies(Array.isArray(res) ? res : []))
      .catch((e: any) => { setError(e.message || 'Could not load companies'); toast.error(e.message || 'Could not load companies'); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const deactivate = async (id: number) => {
    if (!window.confirm('Deactivate this company? Its users will keep their accounts but the company will show as Inactive.')) return;
    try {
      await companiesApi.deactivateCompany(id);
      toast.success('Company deactivated');
      load();
    } catch (e: any) {
      toast.error(e.message || 'Could not deactivate company');
    }
  };

  const columns = [
    { key: 'name', label: 'Company', render: (r: any) => <span style={{ fontWeight: 700, color: OG }}>{r.name}</span> },
    { key: 'industry', label: 'Industry', render: (r: any) => r.industry || '—' },
    { key: 'country', label: 'Location', render: (r: any) => [r.city, r.country].filter(Boolean).join(', ') || '—' },
    { key: 'user_count', label: 'Users', render: (r: any) => r.user_count ?? 0 },
    { key: 'plan', label: 'Plan', render: (r: any) => <span style={{ textTransform: 'capitalize' }}>{r.plan}</span> },
    { key: 'status', label: 'Status', render: (r: any) => <Badge value={r.status} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h4 style={{ fontFamily: FF, fontWeight: 800, fontSize: 19, color: '#1A1A1A', margin: 0 }}>Companies</h4>
      </div>

      <ERPTable
        title="Client Companies"
        columns={columns}
        data={companies}
        loading={loading}
        error={error}
        isAdmin={true}
        onAdd={() => setShowAdd(true)}
        onEdit={(row: any) => navigate(`/erp/companies/${row.id}`)}
        onDelete={deactivate}
      />

      {showAdd && (
        <AddCompanyModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); load(); toast.success('Company added'); }}
        />
      )}
    </div>
  );
}
