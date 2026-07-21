import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';
import { partnersApi } from './partnersApi';

const FF = "'DM Sans',sans-serif";
const OG = '#C9883A';

const PARTNER_STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: 'Pending',   bg: '#fff3e0', color: '#e65100' },
  approved:  { label: 'Approved',  bg: '#d1fae5', color: '#065f46' },
  rejected:  { label: 'Rejected',  bg: '#fee2e2', color: '#991b1b' },
  suspended: { label: 'Suspended', bg: '#f1f5f9', color: '#64748b' },
};
const DEAL_STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  submitted: { label: 'Submitted', bg: '#dbeafe', color: '#1d4ed8' },
  reviewing: { label: 'Reviewing', bg: '#fff3e0', color: '#e65100' },
  demo_scheduled: { label: 'Demo Scheduled', bg: '#ede9fe', color: '#6d28d9' },
  negotiating: { label: 'Negotiating', bg: '#fef9c3', color: '#a16207' },
  won: { label: 'Won', bg: '#d1fae5', color: '#065f46' },
  lost: { label: 'Lost', bg: '#fee2e2', color: '#991b1b' },
  cancelled: { label: 'Cancelled', bg: '#f1f5f9', color: '#64748b' },
};
const COMMISSION_STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: '#fff3e0', color: '#e65100' },
  approved: { label: 'Approved', bg: '#dbeafe', color: '#1d4ed8' },
  paid: { label: 'Paid', bg: '#d1fae5', color: '#065f46' },
};

const Badge = ({ value, map }: { value: string; map: Record<string, { label: string; bg: string; color: string }> }) => {
  const m = map[value] ?? { label: value, bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF, whiteSpace: 'nowrap' }}>
      {m.label}
    </span>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
  <div style={{
    background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${color}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
    padding: '16px 20px', flex: '1 1 140px',
  }}>
    <div style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', fontFamily: FF }}>{value}</div>
    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: FF, marginTop: 2 }}>{label}</div>
  </div>
);

const TabBar = ({ tabs, active, onChange }: { tabs: { key: string; label: string }[]; active: string; onChange: (k: string) => void }) => (
  <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: 20 }}>
    {tabs.map(t => (
      <button
        key={t.key} type="button" onClick={() => onChange(t.key)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '10px 18px',
          fontFamily: FF, fontSize: 13.5, fontWeight: 700,
          color: active === t.key ? OG : '#9b9690',
          borderBottom: active === t.key ? `2.5px solid ${OG}` : '2.5px solid transparent',
        }}
      >
        {t.label}
      </button>
    ))}
  </div>
);

const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflow: 'auto', padding: 20 };
const modalBox: React.CSSProperties = { background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: FF };
const fieldLabel: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 };
const inputBox: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', fontFamily: FF };

// ── Tab 1 — Applications ──────────────────────────────────────────────────

function ApplicationModal({ app, onClose, onSaved }: { app: any; onClose: () => void; onSaved: () => void }) {
  const [notes, setNotes] = useState(app.notes || '');
  const [saving, setSaving] = useState(false);

  const row = (label: string, value: any) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, fontFamily: FF }}>{label}</div>
      <div style={{ fontSize: 13.5, color: '#1A1A1A', fontFamily: FF }}>{value || '—'}</div>
    </div>
  );

  const approve = async () => {
    setSaving(true);
    try {
      await partnersApi.approvePartner(app.id);
      toast.success(`${app.full_name} approved — welcome email sent.`);
      onSaved(); onClose();
    } catch (e: any) { toast.error(e.message || 'Could not approve partner'); }
    finally { setSaving(false); }
  };
  const reject = async () => {
    setSaving(true);
    try {
      await partnersApi.rejectPartner(app.id, notes);
      toast.success('Application rejected');
      onSaved(); onClose();
    } catch (e: any) { toast.error(e.message || 'Could not reject application'); }
    finally { setSaving(false); }
  };
  const saveNotes = async () => {
    setSaving(true);
    try {
      await partnersApi.updatePartner(app.id, { notes });
      toast.success('Notes saved');
      onSaved(); onClose();
    } catch (e: any) { toast.error(e.message || 'Could not save notes'); }
    finally { setSaving(false); }
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={modalBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{app.full_name}</h3>
            <div style={{ marginTop: 6 }}><Badge value={app.status} map={PARTNER_STATUS_BADGE} /></div>
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
        {row('Packages Applied For', (app.modules || []).join(', '))}
        {row('Network Description', app.network_description)}
        {app.approved_by_name && row('Reviewed By', `${app.approved_by_name} on ${app.approved_at ? new Date(app.approved_at).toLocaleString() : ''}`)}

        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <label style={fieldLabel}>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Internal notes about this application…" style={{ ...inputBox, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {app.status !== 'rejected' && (
            <button onClick={reject} disabled={saving} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '11px', cursor: saving ? 'wait' : 'pointer', color: '#ef4444', fontWeight: 700, fontSize: 13 }}>
              Reject
            </button>
          )}
          {app.status !== 'approved' && (
            <button onClick={approve} disabled={saving} style={{ flex: 1, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 9, padding: '11px', cursor: saving ? 'wait' : 'pointer', color: '#16a34a', fontWeight: 700, fontSize: 13 }}>
              Approve
            </button>
          )}
          <button onClick={saveNotes} disabled={saving} style={{ flex: 1, background: 'linear-gradient(145deg,#e8a84e,#C9883A)', border: 'none', borderRadius: 9, padding: '11px', cursor: saving ? 'wait' : 'pointer', color: '#fff', fontWeight: 700, fontSize: 13 }}>
            {saving ? 'Saving…' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicationsTab() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selected, setSelected] = useState<any>(null);

  const load = useCallback(() => {
    setLoading(true); setError(null);
    partnersApi.getPartners({ status: statusFilter || undefined })
      .then((res: any) => setApps(Array.isArray(res) ? res : []))
      .catch((e: any) => { setError(e.message || 'Could not load applications'); toast.error(e.message || 'Could not load applications'); })
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const columns = [
    { key: 'full_name', label: 'Name', render: (r: any) => <span style={{ fontWeight: 700, color: OG }}>{r.full_name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Country', render: (r: any) => `${r.city}, ${r.country}` },
    {
      key: 'modules', label: 'Packages', width: 200,
      render: (r: any) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(r.modules || []).length === 0
            ? <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
            : (r.modules || []).map((m: string) => (
              <span key={m} style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#F0EBE4', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{m}</span>
            ))}
        </div>
      ),
    },
    { key: 'years_experience', label: 'Experience' },
    { key: 'estimated_deals', label: 'Deals/Month' },
    { key: 'status', label: 'Status', render: (r: any) => <Badge value={r.status} map={PARTNER_STATUS_BADGE} /> },
    { key: 'joined_at', label: 'Applied', render: (r: any) => new Date(r.joined_at).toLocaleDateString() },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputBox, width: 'auto', minWidth: 170, cursor: 'pointer' }}>
          <option value="">All Applications</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <ERPTable title="Applications" columns={columns} data={apps} loading={loading} error={error} isAdmin onEdit={(row: any) => setSelected(row)} />
      {selected && <ApplicationModal app={selected} onClose={() => setSelected(null)} onSaved={load} />}
    </div>
  );
}

// ── Tab 2 — Active Partners ───────────────────────────────────────────────

function ActivePartnersTab({ onViewDeals }: { onViewDeals: (partnerId: number) => void }) {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    partnersApi.getPartners({ status: 'approved' })
      .then((res: any) => setPartners(Array.isArray(res) ? res : []))
      .catch((e: any) => { setError(e.message || 'Could not load partners'); toast.error(e.message || 'Could not load partners'); })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'partner_code', label: 'Code', render: (r: any) => <span style={{ fontWeight: 700, color: OG }}>{r.partner_code}</span> },
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Country' },
    { key: 'commission_tier', label: 'Tier', render: (r: any) => <span style={{ textTransform: 'capitalize' }}>{r.commission_tier}</span> },
    { key: 'total_deals', label: 'Deals' },
    { key: 'total_commission_earned', label: 'Earned', render: (r: any) => `AED ${Number(r.total_commission_earned).toLocaleString()}` },
    { key: 'total_commission_paid', label: 'Paid', render: (r: any) => `AED ${Number(r.total_commission_paid).toLocaleString()}` },
    { key: 'joined_at', label: 'Approved', render: (r: any) => r.approved_at ? new Date(r.approved_at).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <ERPTable title="Active Partners" columns={columns} data={partners} loading={loading} error={error} isAdmin onEdit={(row: any) => onViewDeals(row.id)} />
      <p style={{ fontFamily: FF, fontSize: 12, color: '#9b9690', marginTop: 10 }}>Click a partner to view their deals in the All Deals tab.</p>
    </div>
  );
}

// ── Tab 3 — All Deals ──────────────────────────────────────────────────────

function DealModal({ deal, onClose, onSaved }: { deal: any; onClose: () => void; onSaved: () => void }) {
  const [status, setStatus] = useState(deal.status);
  const [dealValue, setDealValue] = useState(deal.deal_value || '');
  const [commissionRate, setCommissionRate] = useState(deal.commission_rate || '');
  const [commissionAmount, setCommissionAmount] = useState(deal.commission_amount || '');
  const [commissionStatus, setCommissionStatus] = useState(deal.commission_status);
  const [saving, setSaving] = useState(false);

  const row = (label: string, value: any) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, fontFamily: FF }}>{label}</div>
      <div style={{ fontSize: 13.5, color: '#1A1A1A', fontFamily: FF }}>{value || '—'}</div>
    </div>
  );

  const recalc = () => {
    const v = parseFloat(dealValue), r = parseFloat(commissionRate);
    if (!isNaN(v) && !isNaN(r)) setCommissionAmount((v * r / 100).toFixed(2));
  };

  const save = async () => {
    setSaving(true);
    try {
      await partnersApi.updateDeal(deal.id, {
        status,
        deal_value: dealValue || null,
        commission_rate: commissionRate || null,
        commission_amount: commissionAmount || null,
        commission_status: commissionStatus,
      });
      toast.success('Deal updated');
      onSaved(); onClose();
    } catch (e: any) { toast.error(e.message || 'Could not update deal'); }
    finally { setSaving(false); }
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={modalBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{deal.deal_number} — {deal.client_company}</h3>
            <div style={{ marginTop: 6 }}><Badge value={deal.status} map={DEAL_STATUS_BADGE} /></div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {row('Partner', `${deal.partner_name} (${deal.partner_code})`)}
          {row('Contact Person', deal.client_contact_person)}
          {row('Phone', deal.client_phone)}
          {row('Email', deal.client_email)}
          {row('Country', deal.client_country)}
          {row('Package', deal.package)}
          {row('Employees', deal.num_employees)}
          {row('Current System', deal.current_system)}
        </div>
        {deal.notes && row('Notes', deal.notes)}

        <div style={{ marginTop: 16, marginBottom: 14 }}>
          <label style={fieldLabel}>Deal Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputBox, cursor: 'pointer' }}>
            {Object.entries(DEAL_STATUS_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={fieldLabel}>Deal Value (AED)</label>
            <input type="number" value={dealValue} onChange={e => setDealValue(e.target.value)} onBlur={recalc} style={inputBox} placeholder="50000" />
          </div>
          <div>
            <label style={fieldLabel}>Commission Rate (%)</label>
            <input type="number" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} onBlur={recalc} style={inputBox} placeholder="20" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={fieldLabel}>Commission Amount (AED)</label>
            <input type="number" value={commissionAmount} onChange={e => setCommissionAmount(e.target.value)} style={inputBox} placeholder="Auto-calculated" />
          </div>
          <div>
            <label style={fieldLabel}>Commission Status</label>
            <select value={commissionStatus} onChange={e => setCommissionStatus(e.target.value)} style={{ ...inputBox, cursor: 'pointer' }}>
              {Object.entries(COMMISSION_STATUS_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        <button onClick={save} disabled={saving} style={{ width: '100%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', border: 'none', borderRadius: 9, padding: '12px', cursor: saving ? 'wait' : 'pointer', color: '#fff', fontWeight: 700, fontSize: 13.5 }}>
          {saving ? 'Saving…' : 'Save Deal'}
        </button>
      </div>
    </div>
  );
}

function AllDealsTab({ partnerFilter, onClearPartnerFilter }: { partnerFilter: number | null; onClearPartnerFilter: () => void }) {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const load = useCallback(() => {
    setLoading(true); setError(null);
    partnersApi.getDeals({ status: statusFilter || undefined, package: packageFilter || undefined, partner: partnerFilter || undefined })
      .then((res: any) => setDeals(Array.isArray(res) ? res : []))
      .catch((e: any) => { setError(e.message || 'Could not load deals'); toast.error(e.message || 'Could not load deals'); })
      .finally(() => setLoading(false));
  }, [statusFilter, packageFilter, partnerFilter]);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => ({
    total: deals.length,
    won: deals.filter((d: any) => d.status === 'won').length,
    pipelineValue: deals.filter((d: any) => d.deal_value).reduce((s: number, d: any) => s + Number(d.deal_value), 0),
  }), [deals]);

  const columns = [
    { key: 'deal_number', label: 'Deal #', render: (r: any) => <span style={{ fontWeight: 700, color: OG }}>{r.deal_number}</span> },
    { key: 'client_company', label: 'Client' },
    { key: 'partner_name', label: 'Partner', render: (r: any) => `${r.partner_name} (${r.partner_code})` },
    { key: 'package', label: 'Package', render: (r: any) => <span style={{ textTransform: 'capitalize' }}>{r.package}</span> },
    { key: 'status', label: 'Status', render: (r: any) => <Badge value={r.status} map={DEAL_STATUS_BADGE} /> },
    { key: 'deal_value', label: 'Value', render: (r: any) => r.deal_value ? `AED ${Number(r.deal_value).toLocaleString()}` : '—' },
    { key: 'commission_amount', label: 'Commission', render: (r: any) => r.commission_amount ? `AED ${Number(r.commission_amount).toLocaleString()}` : '—' },
    { key: 'commission_status', label: 'Comm. Status', render: (r: any) => <Badge value={r.commission_status} map={COMMISSION_STATUS_BADGE} /> },
    { key: 'submitted_at', label: 'Date', render: (r: any) => new Date(r.submitted_at).toLocaleDateString() },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard label="Total Deals" value={stats.total} color={OG} />
        <StatCard label="Won" value={stats.won} color="#16a34a" />
        <StatCard label="Pipeline Value" value={`AED ${stats.pipelineValue.toLocaleString()}`} color="#1d4ed8" />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputBox, width: 'auto', minWidth: 160, cursor: 'pointer' }}>
          <option value="">All Statuses</option>
          {Object.entries(DEAL_STATUS_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} style={{ ...inputBox, width: 'auto', minWidth: 160, cursor: 'pointer' }}>
          <option value="">All Packages</option>
          <option value="basic">Basic</option>
          <option value="professional">Professional</option>
          <option value="enterprise">Enterprise</option>
        </select>
        {partnerFilter && (
          <button type="button" onClick={onClearPartnerFilter} style={{ background: 'rgba(201,136,58,0.10)', border: '1px solid rgba(201,136,58,0.28)', borderRadius: 8, padding: '8px 14px', fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: OG, cursor: 'pointer' }}>
            Filtered by partner &times;
          </button>
        )}
      </div>

      <ERPTable title="All Deals" columns={columns} data={deals} loading={loading} error={error} isAdmin onEdit={(row: any) => setSelected(row)} />
      {selected && <DealModal deal={selected} onClose={() => setSelected(null)} onSaved={load} />}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────

export default function Partners() {
  const [tab, setTab] = useState<'applications' | 'active' | 'deals'>('applications');
  const [dealsPartnerFilter, setDealsPartnerFilter] = useState<number | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h4 style={{ fontFamily: FF, fontWeight: 800, fontSize: 19, color: '#1A1A1A', margin: 0 }}>Partners</h4>
      </div>

      <TabBar
        active={tab}
        onChange={k => setTab(k as any)}
        tabs={[
          { key: 'applications', label: 'Applications' },
          { key: 'active', label: 'Active Partners' },
          { key: 'deals', label: 'All Deals' },
        ]}
      />

      {tab === 'applications' && <ApplicationsTab />}
      {tab === 'active' && (
        <ActivePartnersTab onViewDeals={(partnerId) => { setDealsPartnerFilter(partnerId); setTab('deals'); }} />
      )}
      {tab === 'deals' && (
        <AllDealsTab partnerFilter={dealsPartnerFilter} onClearPartnerFilter={() => setDealsPartnerFilter(null)} />
      )}
    </div>
  );
}
