import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';
import { partnersApi } from './partnersApi';

const FF = "'DM Sans',sans-serif";
const OG = '#C9883A';

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: 'Pending',   bg: '#fff3e0', color: '#e65100' },
  reviewing: { label: 'Reviewing', bg: '#dbeafe', color: '#1d4ed8' },
  approved:  { label: 'Approved',  bg: '#d1fae5', color: '#065f46' },
  rejected:  { label: 'Rejected',  bg: '#fee2e2', color: '#991b1b' },
};

const Badge = ({ value }: { value: string }) => {
  const m = STATUS_BADGE[value] ?? { label: value, bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF, whiteSpace: 'nowrap' }}>
      {m.label}
    </span>
  );
};

// 1-2 modules -> 10% (blue), 3-5 (or more, short of the full suite) -> 20% (orange),
// Full ERP Suite selected -> 30% (green), regardless of what else is checked alongside it.
function commissionTier(modules: string[]): { pct: string; label: string; bg: string; color: string } {
  if (modules.includes('Full ERP Suite (All Modules)')) return { pct: '30%', label: 'Qualifies for 30% commission', bg: '#d1fae5', color: '#065f46' };
  if (modules.length >= 3) return { pct: '20%', label: 'Qualifies for 20% commission', bg: '#fff3e0', color: '#e65100' };
  if (modules.length >= 1) return { pct: '10%', label: 'Qualifies for 10% commission', bg: '#dbeafe', color: '#1d4ed8' };
  return { pct: '—', label: 'No modules selected', bg: '#f1f5f9', color: '#64748b' };
}

const CommissionBadge = ({ modules }: { modules: string[] }) => {
  const t = commissionTier(modules || []);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 11px', borderRadius: 20, fontSize: 11, fontWeight: 800, background: t.bg, color: t.color, fontFamily: FF, whiteSpace: 'nowrap' }}>
      <i className="fas fa-percentage" style={{ fontSize: 9 }} />
      {t.pct}
    </span>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div style={{
    background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${color}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
    padding: '16px 20px', flex: '1 1 140px',
  }}>
    <div style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', fontFamily: FF }}>{value}</div>
    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: FF, marginTop: 2 }}>{label}</div>
  </div>
);

function DetailModal({ app, onClose, onSaved }: { app: any; onClose: () => void; onSaved: () => void }) {
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.notes || '');
  const [saving, setSaving] = useState(false);

  const save = async (newStatus?: string) => {
    setSaving(true);
    try {
      await partnersApi.updateApplication(app.id, { status: newStatus || status, notes });
      toast.success('Application updated');
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message || 'Could not update application');
    } finally {
      setSaving(false);
    }
  };

  const row = (label: string, value: any) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, fontFamily: FF }}>{label}</div>
      <div style={{ fontSize: 13.5, color: '#1A1A1A', fontFamily: FF }}>{value || '—'}</div>
    </div>
  );

  const tier = commissionTier(app.modules || []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflow: 'auto', padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: FF }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{app.full_name}</h3>
            <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
              <Badge value={app.status} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: tier.bg, color: tier.color, fontFamily: FF }}>
                {tier.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {row('Email', app.email)}
          {row('Phone', app.phone)}
          {row('LinkedIn', app.linkedin_url)}
          {row('Location', `${app.city}, ${app.country}`)}
          {row('Target Market', app.target_market)}
          {row('Languages', (app.languages || []).join(', '))}
          {row('Profession', app.current_profession)}
          {row('Experience', app.years_experience)}
          {row('Deals/Month', app.estimated_deals)}
        </div>
        {row('Modules They Can Sell', (app.modules || []).join(', '))}
        {row('Network Description', app.network_description)}
        {app.reviewed_by_name && row('Reviewed By', `${app.reviewed_by_name} on ${app.reviewed_at ? new Date(app.reviewed_at).toLocaleString() : ''}`)}

        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>Notes</label>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="Internal notes about this application…"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: FF }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
            {Object.entries(STATUS_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => save('rejected')} disabled={saving} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '11px', cursor: saving ? 'wait' : 'pointer', color: '#ef4444', fontWeight: 700, fontSize: 13 }}>
            Reject
          </button>
          <button onClick={() => save('approved')} disabled={saving} style={{ flex: 1, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 9, padding: '11px', cursor: saving ? 'wait' : 'pointer', color: '#16a34a', fontWeight: 700, fontSize: 13 }}>
            Approve
          </button>
          <button onClick={() => save()} disabled={saving} style={{ flex: 1, background: 'linear-gradient(145deg,#e8a84e,#C9883A)', border: 'none', borderRadius: 9, padding: '11px', cursor: saving ? 'wait' : 'pointer', color: '#fff', fontWeight: 700, fontSize: 13 }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PartnerApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    partnersApi.getApplications({ status: statusFilter || undefined, country: countryFilter || undefined })
      .then((res: any) => setApplications(Array.isArray(res) ? res : []))
      .catch((e: any) => { setError(e.message || 'Could not load applications'); toast.error(e.message || 'Could not load applications'); })
      .finally(() => setLoading(false));
  }, [statusFilter, countryFilter]);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }), [applications]);

  const countries = useMemo(() => Array.from(new Set(applications.map(a => a.country))).sort(), [applications]);

  const columns = [
    { key: 'full_name', label: 'Name', render: (r: any) => <span style={{ fontWeight: 700, color: OG }}>{r.full_name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Country', render: (r: any) => `${r.city}, ${r.country}` },
    { key: 'target_market', label: 'Target Market' },
    {
      key: 'modules', label: 'Modules', width: 220,
      render: (r: any) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(r.modules || []).length === 0
            ? <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
            : (r.modules || []).map((m: string) => (
              <span key={m} style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#F0EBE4', color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                {m}
              </span>
            ))}
        </div>
      ),
    },
    { key: 'commission', label: 'Commission', render: (r: any) => <CommissionBadge modules={r.modules || []} /> },
    { key: 'years_experience', label: 'Experience' },
    { key: 'estimated_deals', label: 'Deals/Month' },
    { key: 'status', label: 'Status', render: (r: any) => <Badge value={r.status} /> },
    { key: 'created_at', label: 'Date', render: (r: any) => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h4 style={{ fontFamily: FF, fontWeight: 800, fontSize: 19, color: '#1A1A1A', margin: 0 }}>Partner Applications</h4>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard label="Total" value={stats.total} color={OG} />
        <StatCard label="Pending" value={stats.pending} color="#e65100" />
        <StatCard label="Approved" value={stats.approved} color="#16a34a" />
        <StatCard label="Rejected" value={stats.rejected} color="#ef4444" />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 13, fontFamily: FF, cursor: 'pointer', minWidth: 160 }}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 13, fontFamily: FF, cursor: 'pointer', minWidth: 160 }}>
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <ERPTable
        title="Applications"
        columns={columns}
        data={applications}
        loading={loading}
        error={error}
        isAdmin={true}
        onEdit={(row: any) => setSelected(row)}
      />

      {selected && (
        <DetailModal
          app={selected}
          onClose={() => setSelected(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
