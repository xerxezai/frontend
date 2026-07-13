import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import { OG, OG_G, DARK, FF, STAGES, type DealStage, type Deal } from './crmShared';

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 9,
  border: '1px solid rgba(0,0,0,0.10)', background: '#F8F7F4',
  fontFamily: FF, fontSize: 13, outline: 'none', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#6B6B6B',
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5, fontFamily: FF,
};

interface Props {
  deal?: Deal;
  defaultStage?: DealStage;
  defaultCustomerId?: number | null;
  defaultLeadId?: number | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function CRMDealForm({ deal, defaultStage = 'new', defaultCustomerId = null, defaultLeadId = null, onClose, onSaved }: Props) {
  const customers = useERPList<any>('crm/customers/');
  const leads = useERPList<any>('crm/leads/');
  const isEdit = !!deal;

  const [form, setForm] = useState(() => {
    if (deal) {
      return {
        title: deal.title,
        linkType: deal.customer ? 'customer' : deal.lead ? 'lead' : 'customer',
        customer: deal.customer ? String(deal.customer) : '',
        lead: deal.lead ? String(deal.lead) : '',
        value: deal.value ?? '',
        stage: deal.stage,
        probability: deal.probability != null ? String(deal.probability) : '0',
        expected_close: deal.expected_close ? deal.expected_close.slice(0, 10) : '',
        notes: deal.notes ?? '',
      };
    }
    return {
      title: '',
      linkType: defaultCustomerId ? 'customer' : defaultLeadId ? 'lead' : 'customer',
      customer: defaultCustomerId ? String(defaultCustomerId) : '',
      lead: defaultLeadId ? String(defaultLeadId) : '',
      value: '',
      stage: defaultStage,
      probability: '0',
      expected_close: '',
      notes: '',
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim()) { setError('Deal title is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const body: Record<string, any> = {
        title: form.title,
        value: form.value || '0',
        stage: form.stage,
        probability: Math.min(100, Math.max(0, Number(form.probability) || 0)),
        expected_close: form.expected_close || null,
        notes: form.notes,
        customer: form.linkType === 'customer' && form.customer ? Number(form.customer) : null,
        lead: form.linkType === 'lead' && form.lead ? Number(form.lead) : null,
      };
      const res = isEdit
        ? await erpFetch(`crm/deals/${deal!.id}/`, { method: 'PUT', body: JSON.stringify(body) })
        : await erpFetch('crm/deals/', { method: 'POST', body: JSON.stringify(body) });
      if (res?.id === undefined) { setError(isEdit ? 'Could not save changes.' : 'Could not save the deal.'); return; }
      onSaved();
      onClose();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes crmFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes crmSlideInRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(2px)', animation: 'crmFadeIn 0.2s ease both' }}
      />
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(420px, 100vw)',
          background: '#fff', zIndex: 901, boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          animation: 'crmSlideInRight 0.35s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: DARK, margin: 0 }}>{isEdit ? 'Edit Deal' : 'New Deal'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={lbl}>Deal Title *</label>
            <input style={inp} value={form.title} placeholder="e.g. Enterprise ERP Rollout" onChange={e => set('title', e.target.value)} />
          </div>

          <div>
            <label style={lbl}>Link to</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {(['customer', 'lead'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('linkType', t)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', fontFamily: FF,
                    fontSize: 12.5, fontWeight: 700, textTransform: 'capitalize',
                    border: form.linkType === t ? `1.5px solid ${OG}` : '1px solid rgba(0,0,0,0.10)',
                    background: form.linkType === t ? 'rgba(201,136,58,0.08)' : '#fff',
                    color: form.linkType === t ? OG : '#6B6B6B',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            {form.linkType === 'customer' ? (
              <select style={inp} value={form.customer} onChange={e => set('customer', e.target.value)}>
                <option value="">— Select customer —</option>
                {customers.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            ) : (
              <select style={inp} value={form.lead} onChange={e => set('lead', e.target.value)}>
                <option value="">— Select lead —</option>
                {leads.data.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Value (₹)</label>
              <input type="number" style={inp} value={form.value} placeholder="0" min="0" step="0.01" onChange={e => set('value', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Expected Close</label>
              <input type="date" style={inp} value={form.expected_close} onChange={e => set('expected_close', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Stage</label>
              <select style={inp} value={form.stage} onChange={e => set('stage', e.target.value)}>
                {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Probability (%)</label>
              <input type="number" style={inp} value={form.probability} min="0" max="100" step="5" onChange={e => set('probability', e.target.value)} />
            </div>
          </div>

          <div>
            <label style={lbl}>Notes</label>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }} value={form.notes} placeholder="Any context for this deal…" onChange={e => set('notes', e.target.value)} />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: 12.5, fontFamily: FF, margin: 0 }}>{error}</p>}
        </div>

        <div style={{ padding: '16px 22px', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '10px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            style={{
              flex: 2, background: OG_G, color: '#fff', border: 'none', borderRadius: 9, padding: '10px',
              cursor: saving ? 'not-allowed' : 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 13,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Deal'}
          </button>
        </div>
      </div>
    </>
  );
}
