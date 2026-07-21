import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PhoneInput, { isValidPhone } from '../../components/common/PhoneInput';
import { partnerApi } from '../api/partnerApi';
import { PACKAGES, NUM_EMPLOYEES, CURRENT_SYSTEMS, OG, FF } from '../constants';

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)', padding: '24px 28px', marginBottom: 22,
};
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', height: 44, padding: '0 14px', borderRadius: 10,
  border: '1.5px solid #E4DFD8', fontSize: 13.5, fontFamily: FF, color: '#141413', background: '#fafaf8', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#5a5650',
  letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6, fontFamily: FF,
};
const sectionHeader = (n: number, title: string) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
    <div style={{
      width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(145deg,#e8a84e,${OG})`,
      boxShadow: '0 3px 0 rgba(130,80,20,0.50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#fff' }}>{n}</span>
    </div>
    <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: '#141413' }}>{title}</span>
    <div style={{ flex: 1, height: 1, background: '#F0EBE4' }} />
  </div>
);

const EMPTY = {
  client_company: '', client_contact_person: '', client_phone: '', client_email: '', client_country: '',
  package: '', num_employees: '', current_system: '', notes: '',
};

const SubmitDeal = () => {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [dealNumber, setDealNumber] = useState('');
  const set = (k: keyof typeof EMPTY, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.client_company.trim()) { toast.error('Client company name is required.'); return; }
    if (!form.client_contact_person.trim()) { toast.error('Client contact person is required.'); return; }
    if (!form.client_phone.trim() || !isValidPhone(form.client_phone)) { toast.error('Please enter a valid client phone number with country code.'); return; }
    if (!form.client_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) { toast.error('Please enter a valid client email address.'); return; }
    if (!form.client_country.trim()) { toast.error('Client country is required.'); return; }
    if (!form.package) { toast.error('Select the package the client is interested in.'); return; }
    if (!form.num_employees) { toast.error('Select the number of employees.'); return; }
    if (!form.current_system) { toast.error('Select the client’s current system.'); return; }

    setSending(true);
    try {
      const deal = await partnerApi.submitDeal(form);
      setDealNumber(deal.deal_number);
      setForm(EMPTY);
      toast.success('Deal submitted!');
    } catch (e: any) {
      toast.error(e.message || 'Could not submit deal.');
    } finally {
      setSending(false);
    }
  };

  if (dealNumber) {
    return (
      <div style={{
        ...cardStyle, textAlign: 'center', padding: '52px 30px', maxWidth: 520, margin: '40px auto',
      }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#4ade80)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px',
          boxShadow: '0 8px 32px rgba(34,197,94,0.30)',
        }}>
          <i className="fas fa-check" style={{ color: '#fff', fontSize: 26 }} />
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: '#141413', marginBottom: 10 }}>
          Deal Submitted Successfully!
        </h2>
        <p style={{ fontFamily: FF, fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 6 }}>
          Deal number: <strong style={{ color: OG }}>{dealNumber}</strong>
        </p>
        <p style={{ fontFamily: FF, fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 22 }}>
          Our team will contact the client within 24 hours to schedule a demo.
          You can track this deal in My Deals.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/partner/deals" style={{
            textDecoration: 'none', background: `linear-gradient(145deg,#e8a84e,${OG})`, color: '#fff',
            fontFamily: FF, fontWeight: 700, fontSize: 13.5, padding: '12px 22px', borderRadius: 10,
          }}>
            View My Deals
          </Link>
          <button type="button" onClick={() => setDealNumber('')} style={{
            background: '#fafaf8', border: '1.5px solid #E4DFD8', color: '#5a5650',
            fontFamily: FF, fontWeight: 700, fontSize: 13.5, padding: '12px 22px', borderRadius: 10, cursor: 'pointer',
          }}>
            Submit Another Deal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div style={cardStyle}>
        {sectionHeader(1, 'Client Information')}
        <div className="row g-3">
          <div className="col-md-6">
            <label style={labelStyle}>Client Company Name *</label>
            <input value={form.client_company} onChange={e => set('client_company', e.target.value)} style={inputStyle} disabled={sending} placeholder="Acme Corp" />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Client Contact Person *</label>
            <input value={form.client_contact_person} onChange={e => set('client_contact_person', e.target.value)} style={inputStyle} disabled={sending} placeholder="Jane Smith" />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Client Phone *</label>
            <PhoneInput value={form.client_phone} disabled={sending} onChange={v => set('client_phone', v)} />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Client Email *</label>
            <input type="email" value={form.client_email} onChange={e => set('client_email', e.target.value)} style={inputStyle} disabled={sending} placeholder="jane@acmecorp.com" />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Client Country *</label>
            <input value={form.client_country} onChange={e => set('client_country', e.target.value)} style={inputStyle} disabled={sending} placeholder="United Arab Emirates" />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        {sectionHeader(2, 'Deal Details')}
        <label style={labelStyle}>Package Interested In *</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
          {PACKAGES.map(p => {
            const selected = form.package === p.value;
            return (
              <button type="button" key={p.value} disabled={sending} onClick={() => set('package', p.value)} style={{
                textAlign: 'left', cursor: sending ? 'not-allowed' : 'pointer',
                border: `2px solid ${selected ? OG : '#E4DFD8'}`, borderRadius: 12, padding: '16px 18px',
                background: selected ? 'rgba(201,136,58,0.08)' : '#fafaf8',
                boxShadow: selected ? '0 0 0 3px rgba(201,136,58,0.12)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: FF, fontSize: 14.5, fontWeight: 800, color: selected ? OG : '#141413' }}>{p.label}</span>
                  <i className={selected ? 'fas fa-dot-circle' : 'far fa-circle'} style={{ color: selected ? OG : '#c7c2ba', fontSize: 15 }} />
                </div>
                <p style={{ fontFamily: FF, fontSize: 12, color: '#6B6B6B', lineHeight: 1.5, margin: '0 0 10px' }}>{p.includes}</p>
                <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: OG }}>Your commission: {p.pct}%</span>
              </button>
            );
          })}
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label style={labelStyle}>Number of Employees *</label>
            <select value={form.num_employees} onChange={e => set('num_employees', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} disabled={sending}>
              <option value="">Select…</option>
              {NUM_EMPLOYEES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Current System *</label>
            <select value={form.current_system} onChange={e => set('current_system', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} disabled={sending}>
              <option value="">Select…</option>
              {CURRENT_SYSTEMS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        {sectionHeader(3, 'Additional Info')}
        <label style={labelStyle}>Notes</label>
        <textarea
          rows={4} value={form.notes} onChange={e => set('notes', e.target.value)} disabled={sending}
          placeholder="Any additional information about this client or deal…"
          style={{ ...inputStyle, height: 'auto', padding: '12px 14px', resize: 'vertical' as const }}
        />
      </div>

      <button
        type="button" onClick={submit} disabled={sending}
        style={{
          width: '100%', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
          background: sending ? 'rgba(201,136,58,0.55)' : `linear-gradient(145deg,#e8a84e,${OG})`,
          color: '#fff', fontFamily: FF, fontWeight: 700, fontSize: 14.5,
          border: 'none', borderRadius: 12, cursor: sending ? 'not-allowed' : 'pointer',
        }}
      >
        {sending ? 'Submitting…' : <>Submit Deal <i className="fas fa-arrow-right" style={{ fontSize: 13 }} /></>}
      </button>
    </div>
  );
};

export default SubmitDeal;
