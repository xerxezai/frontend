import { useState } from 'react';
import { useMyAttendance } from '../../../../hooks/useERPApi';

const C = {
  orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};

const STATUS_COLORS: Record<string, string> = {
  present: '#10b981', late: '#f59e0b', half_day: '#6366f1', absent: '#ef4444',
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
    {s.replace('_', ' ')}
  </span>
);

export default function MyAttendanceModule() {
  const { data, loading, error } = useMyAttendance();
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFrom, setFilterFrom]   = useState('');
  const [filterTo, setFilterTo]       = useState('');

  const filtered = data.filter(r => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterFrom && r.date < filterFrom) return false;
    if (filterTo && r.date > filterTo) return false;
    return true;
  });

  return (
    <div style={{ animation: 'attFadeUp 0.45s ease both' }}>
      <style>{`@keyframes attFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Page title */}
      <div style={{ marginBottom: 22 }}>
        <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>My Attendance</h4>
        <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0' }}>
          Your personal clock-in/out history
        </p>
      </div>

      {/* Filter bar */}
      <div style={{
        background: C.white, borderRadius: 12, border: `1px solid ${C.border}`,
        padding: '14px 18px', marginBottom: 20,
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Status</label>
          <select
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: C.cream, outline: 'none' }}
          >
            <option value="">All</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
            <option value="absent">Absent</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>From</label>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
            style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: C.cream, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>To</label>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
            style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: C.cream, outline: 'none' }} />
        </div>
        <button onClick={() => { setFilterStatus(''); setFilterFrom(''); setFilterTo(''); }}
          style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', color: C.muted }}>
          Reset
        </button>
      </div>

      {/* Table */}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
        ) : error ? (
          <div style={{ padding: 24, color: '#ef4444', fontFamily: "'DM Sans', sans-serif" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
            <i className="fas fa-calendar-times" style={{ fontSize: 36, display: 'block', marginBottom: 12, color: '#ddd' }} />
            No records match your filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Date', 'Clock In', 'Clock Out', 'Hours Worked', 'Status', 'Notes'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafaf8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '11px 16px', fontWeight: 600, color: C.dark }}>{r.date}</td>
                    <td style={{ padding: '11px 16px', color: C.muted }}>{r.check_in ? new Date(r.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td style={{ padding: '11px 16px', color: C.muted }}>{r.check_out ? new Date(r.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td style={{ padding: '11px 16px', color: C.dark, fontWeight: 600 }}>{r.hours ? `${parseFloat(r.hours).toFixed(2)}h` : '—'}</td>
                    <td style={{ padding: '11px 16px' }}><Badge s={r.status || 'present'} /></td>
                    <td style={{ padding: '11px 16px', color: C.muted }}>{r.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
