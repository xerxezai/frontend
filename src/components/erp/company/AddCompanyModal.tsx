import { useState } from 'react';
import { companiesApi } from './companiesApi';

const INDUSTRIES = ['Engineering & EPC', 'Oil & Gas', 'Construction', 'Manufacturing', 'Facilities Management', 'Other'];
const PLANS = [
  { value: 'trial', label: 'Trial' },
  { value: 'basic', label: 'Basic' },
  { value: 'professional', label: 'Professional' },
];

const AddCompanyModal = ({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void }) => {
  const [form, setForm] = useState({
    name: '', industry: '', country: 'UAE', city: '', phone: '', email: '', plan: 'trial', max_users: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim()) { setError('Company name is required'); return; }
    setLoading(true);
    setError('');
    try {
      await companiesApi.createCompany(form);
      onSuccess?.();
    } catch (e: any) {
      setError(e.message || 'Failed to add company');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.06em', color: '#666', marginBottom: 6,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 9999, overflow: 'auto', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'DM Sans',sans-serif",
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Add Company</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Company Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Trojan General Contracting" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Maximum Users Allowed *</label>
          <input
            type="number" min={1} max={500} value={form.max_users}
            onChange={e => set('max_users', Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
            placeholder="e.g. 10" style={inputStyle}
          />
          <p style={{ fontSize: 11.5, color: '#9ca3af', margin: '5px 0 0' }}>Set the maximum number of users this company can have.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Industry</label>
            <select value={form.industry} onChange={e => set('industry', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select industry...</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Country</label>
            <input value={form.country} onChange={e => set('country', e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>City</label>
            <input value={form.city} onChange={e => set('city', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contact@company.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Plan</label>
          <select value={form.plan} onChange={e => set('plan', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {PLANS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 14 }}>{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none',
            padding: '13px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14,
            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.75 : 1,
          }}>
          {loading ? 'Adding...' : 'Add Company'}
        </button>
      </div>
    </div>
  );
};

export default AddCompanyModal;
