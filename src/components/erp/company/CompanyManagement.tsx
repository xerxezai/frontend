import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { companiesApi } from './companiesApi';
import AddCompanyModal from './AddCompanyModal';

const FF = "'DM Sans',sans-serif";
const OG = '#D93522';
const BORDER = 'rgba(0,0,0,0.08)';

const TH: React.CSSProperties = {
  fontSize: 10, letterSpacing: '0.6px', padding: '10px 10px',
  textTransform: 'uppercase', fontWeight: 700, color: '#6B6B6B',
  borderBottom: '1px solid rgba(0,0,0,0.07)', whiteSpace: 'nowrap',
};
const TD: React.CSSProperties = {
  padding: '9px 10px', verticalAlign: 'middle', color: '#333',
  borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 12.5,
};

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

const limitColor = (pct: number) => (pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981');

const UserLimitBar = ({ current, max }: { current: number; max: number }) => {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const color = limitColor(pct);
  return (
    <div style={{ minWidth: 100 }}>
      <div style={{ fontFamily: FF, fontSize: 11.5, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{current} / {max}</div>
      <div style={{ width: '100%', height: 5, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 300ms ease' }} />
      </div>
    </div>
  );
};

function DeleteCompanyConfirm({ name, busy, onCancel, onConfirm }: { name: string; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 420, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: '#1A1A1A' }}>Delete company?</h6>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: '#1A1A1A' }}>{name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={busy} style={{ flex: 1, background: '#F8F7F4', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '9px', cursor: busy ? 'wait' : 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CompanyManagement() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState<any>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

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

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await companiesApi.permanentDeleteCompany(deleting.id);
      toast.success('Company deleted successfully');
      setDeleting(null);
      setCompanies(prev => prev.filter(c => c.id !== deleting.id));
    } catch (e: any) {
      toast.error(e.message || 'Could not delete company');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h4 style={{ fontFamily: FF, fontWeight: 800, fontSize: 19, color: '#1A1A1A', margin: 0 }}>Companies</h4>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: 'linear-gradient(145deg,#D93522 0%,#D93522 100%)', color: '#fff', border: 'none', borderRadius: 9, padding: '7px 14px', fontFamily: FF, fontWeight: 700, fontSize: 12, boxShadow: '0 3px 0 rgba(150,95,30,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <i className="fas fa-plus" style={{ fontSize: 10 }}></i> Add New
        </button>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
          <div className="spinner-border" style={{ color: OG }} role="status"></div>
          <p>Loading companies…</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : companies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}` }}>
          <p className="mb-0" style={{ color: '#6B6B6B', fontFamily: FF, fontSize: 13.5, fontWeight: 600 }}>No companies found. Add the first one.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#fafaf8' }}>
                <th style={TH}>Company</th>
                <th style={TH}>Industry</th>
                <th style={TH}>Location</th>
                <th style={TH}>User Limit</th>
                <th style={TH}>Plan</th>
                <th style={TH}>Status</th>
                <th style={{ ...TH, width: 130 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((r: any) => (
                <tr key={r.id}>
                  <td style={TD}><span style={{ fontWeight: 700, color: OG }}>{r.name}</span></td>
                  <td style={TD}>{r.industry || '—'}</td>
                  <td style={TD}>{[r.city, r.country].filter(Boolean).join(', ') || '—'}</td>
                  <td style={TD}><UserLimitBar current={r.user_count ?? 0} max={r.max_users ?? 0} /></td>
                  <td style={TD}><span style={{ textTransform: 'capitalize' }}>{r.plan}</span></td>
                  <td style={TD}><Badge value={r.status} /></td>
                  <td style={{ ...TD, width: 130 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button title="Edit" onClick={() => navigate(`/erp/companies/${r.id}`)}
                        style={{ background: 'rgba(217,53,34,0.08)', color: OG, border: '1px solid rgba(217,53,34,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                        <i className="fas fa-pen" style={{ fontSize: 10 }}></i>
                      </button>
                      <button title="Deactivate — keeps the company and its data, just marks it Inactive" onClick={() => deactivate(r.id)}
                        style={{ background: 'rgba(245,158,11,0.10)', color: '#92400e', border: '1px solid rgba(245,158,11,0.28)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                        <i className="fas fa-ban" style={{ fontSize: 10 }}></i>
                      </button>
                      <button title="Permanently delete" onClick={() => setDeleting(r)}
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                        <i className="fas fa-trash" style={{ fontSize: 10 }}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <AddCompanyModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); load(); toast.success('Company added'); }}
        />
      )}
      {deleting && (
        <DeleteCompanyConfirm name={deleting.name} busy={deleteBusy} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />
      )}
    </div>
  );
}
