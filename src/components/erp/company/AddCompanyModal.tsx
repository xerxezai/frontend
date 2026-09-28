import { useState } from 'react';
import { companiesApi } from './companiesApi';
import PhoneInput from '../../common/PhoneInput';

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
        background: '#fff', borderRadius: 14, padding: 22, width: '100%', maxWidth: 400,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'DM Sans',sans-serif",
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Add Company</h3>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#666', lineHeight: 1, padding: 2 }}>&times;</button>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Company Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Trojan General Contracting" style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Max Users *</label>
            <input
              type="number" min={1} max={500} value={form.max_users}
              onChange={e => set('max_users', Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
              placeholder="10" style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Plan</label>
            <select value={form.plan} onChange={e => set('plan', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              {PLANS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Industry</label>
            <select value={form.industry} onChange={e => set('industry', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select...</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Country</label>
            <input value={form.country} onChange={e => set('country', e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>City</label>
            <input value={form.city} onChange={e => set('city', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <PhoneInput value={form.phone} onChange={v => set('phone', v)} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contact@company.com" style={inputStyle} />
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 12.5, marginBottom: 10 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, background: '#F8F7F4', color: '#374151', border: '1px solid rgba(0,0,0,0.10)',
              padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            style={{
              flex: 2, background: 'linear-gradient(145deg,#D93522,#D93522)', color: '#fff', border: 'none',
              padding: '10px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13,
              cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.75 : 1,
            }}>
            {loading ? 'Adding...' : 'Add Company'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;
