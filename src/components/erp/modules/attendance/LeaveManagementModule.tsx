import { useState } from 'react';
import { useMyLeaves } from '../../../../hooks/useERPApi';

const C = {
  orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444', cancelled: '#6B6B6B',
};

const Badge = ({ s }: { s: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 9px', borderRadius: 20,
    background: `${STATUS_COLORS[s] ?? C.muted}18`,
    color: STATUS_COLORS[s] ?? C.muted,
    fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
    textTransform: 'capitalize',
  }}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
    {s}
  </span>
);

const inputStyle: React.CSSProperties = {
  width: '100%', border: `1px solid ${C.border}`, borderRadius: 9,
  padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
  background: C.cream, outline: 'none', boxSizing: 'border-box',
};

export default function LeaveManagementModule() {
  const { data, loading, submitLeave } = useMyLeaves();
  const [tab, setTab] = useState<'submit' | 'history'>('submit');
  const [form, setForm] = useState({ type: 'annual', from_date: '', to_date: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState('');
  const [submitOk, setSubmitOk] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setSubmitErr(''); setSubmitOk(false);
    try {
      const from = new Date(form.from_date);
      const to   = new Date(form.to_date);
      const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86400000) + 1);
      // employee id resolved server-side via the linked user; pass 1 as placeholder
      // (server should resolve via request.user.employee_profile in a production flow)
      await submitLeave({ ...form, days });
      setSubmitOk(true);
      setForm({ type: 'annual', from_date: '', to_date: '', reason: '' });
    } catch (e: any) {
      setSubmitErr(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ animation: 'lvFadeUp 0.45s ease both' }}>
      <style>{`@keyframes lvFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ marginBottom: 22 }}>
        <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>Leave Management</h4>
        <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0' }}>Submit new leave requests and track approvals</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: C.white, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, width: 'fit-content' }}>
        {(['submit', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              border: 'none', borderRadius: 7, padding: '8px 20px',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
              cursor: 'pointer', transition: 'background 0.18s, color 0.18s',
              background: tab === t ? C.orangeGrad : 'transparent',
              color: tab === t ? '#fff' : C.muted,
            }}>
            {t === 'submit' ? 'Submit Leave' : 'My Requests'}
          </button>
        ))}
      </div>

      {tab === 'submit' && (
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '24px', maxWidth: 520, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h5 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: C.dark, margin: '0 0 18px' }}>New Leave Request</h5>
          {submitOk && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: 9, padding: '12px 16px', marginBottom: 16, color: '#059669', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              <i className="fas fa-check-circle" style={{ marginRight: 7 }} />Request submitted! Awaiting HR approval.
            </div>
          )}
          {submitErr && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 9, padding: '12px 16px', marginBottom: 16, color: '#ef4444', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              {submitErr}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Leave Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle} required>
                <option value="annual">Annual</option>
                <option value="sick">Sick</option>
                <option value="unpaid">Unpaid</option>
                <option value="maternity">Maternity</option>
                <option value="paternity">Paternity</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>From Date</label>
                <input type="date" value={form.from_date} onChange={e => setForm(f => ({ ...f, from_date: e.target.value }))} style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>To Date</label>
                <input type="date" value={form.to_date} onChange={e => setForm(f => ({ ...f, to_date: e.target.value }))} style={inputStyle} required />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Reason</label>
              <textarea
                value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                rows={3} placeholder="Optional reason..." style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <button type="submit" disabled={submitting}
              style={{
                background: C.orangeGrad, color: '#fff', border: 'none',
                borderRadius: 10, padding: '11px 0', fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: 14, cursor: submitting ? 'default' : 'pointer',
                opacity: submitting ? 0.6 : 1, boxShadow: '0 3px 0 rgba(150,95,30,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {submitting && <span className="spinner-border spinner-border-sm" />}
              Submit Request
            </button>
          </form>
        </div>
      )}

      {tab === 'history' && (
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
          ) : data.length === 0 ? (
            <div style={{ padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>No leave requests yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                <thead>
                  <tr style={{ background: '#fafaf9' }}>
                    {['Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Decided By'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((r: any) => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fafaf8')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <td style={{ padding: '11px 16px', fontWeight: 600, color: C.dark, textTransform: 'capitalize' }}>{r.type}</td>
                      <td style={{ padding: '11px 16px', color: C.muted }}>{r.from_date}</td>
                      <td style={{ padding: '11px 16px', color: C.muted }}>{r.to_date}</td>
                      <td style={{ padding: '11px 16px', fontWeight: 600 }}>{r.days}</td>
                      <td style={{ padding: '11px 16px', color: C.muted, maxWidth: 160 }}>{r.reason || '—'}</td>
                      <td style={{ padding: '11px 16px' }}><Badge s={r.status} /></td>
                      <td style={{ padding: '11px 16px', color: C.muted }}>{r.decided_by_username || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
