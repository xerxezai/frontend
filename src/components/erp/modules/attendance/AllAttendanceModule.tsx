import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';

const C = {
  orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};

const STATUS_COLORS: Record<string, string> = {
  present: '#10b981', late: '#eab308', half_day: '#f97316', absent: '#ef4444',
};

const Badge = ({ s }: { s: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px',
    borderRadius: 20, background: `${STATUS_COLORS[s] ?? C.muted}18`,
    color: STATUS_COLORS[s] ?? C.muted,
    fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize',
  }}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
    {s.replace('_', ' ')}
  </span>
);

const inputStyle: React.CSSProperties = {
  border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px',
  fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: C.cream, outline: 'none',
};
const fmtTime = (iso?: string | null) => iso ? new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—';

// ── Manual attendance entry modal ────────────────────────────────────────────
function ManualAttendanceModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const employees = useERPList<any>('hr/employees/');
  const [form, setForm] = useState({
    employee: '', date: new Date().toISOString().slice(0, 10),
    clock_in_time: '', clock_out_time: '', status: 'present', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.employee || !form.date) { setError('Employee and date are required.'); return; }
    setSaving(true);
    setError('');
    try {
      const body: any = {
        employee: Number(form.employee), date: form.date, status: form.status,
        notes: form.notes, is_manual: true,
      };
      // Combine the admin-picked date + time-of-day into a full ISO datetime for the
      // backend's check_in/check_out DateTimeFields — hours is then auto-derived server-side.
      if (form.clock_in_time) body.check_in = `${form.date}T${form.clock_in_time}:00`;
      if (form.clock_out_time) body.check_out = `${form.date}T${form.clock_out_time}:00`;

      await erpFetch('hr/attendance/', { method: 'POST', body: JSON.stringify(body) });
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Failed to add attendance record');
    } finally {
      setSaving(false);
    }
  };

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" };
  const fieldStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.cream, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.dark }}>Add Manual Attendance</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: C.muted }}>&times;</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Employee *</label>
          <select value={form.employee} onChange={e => set('employee', e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}>
            <option value="">Select employee...</option>
            {employees.data.map((e: any) => <option key={e.id} value={e.id}>{e.full_name} ({e.code})</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Date *</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={fieldStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Clock In</label>
            <input type="time" value={form.clock_in_time} onChange={e => set('clock_in_time', e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>Clock Out</label>
            <input type="time" value={form.clock_out_time} onChange={e => set('clock_out_time', e.target.value)} style={fieldStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Status *</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
            <option value="absent">Absent</option>
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Reason for manual entry" style={{ ...fieldStyle, resize: 'vertical', minHeight: 60 }} />
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 14 }}>{error}</p>}

        <button
          onClick={submit} disabled={saving}
          style={{ width: '100%', background: C.orangeGrad, color: '#fff', border: 'none', padding: '13px 20px', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.75 : 1 }}
        >
          {saving ? 'Saving...' : 'Add Attendance'}
        </button>
      </div>
    </div>
  );
}

export default function AllAttendanceModule() {
  const isAdmin = isSuperUser();
  const employees = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');

  const [empFilter, setEmpFilter]       = useState('');
  const [deptFilter, setDeptFilter]     = useState('');
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [records, setRecords]           = useState<any[]>([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [fetched, setFetched]           = useState(false);
  const [showManual, setShowManual]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(''); setFetched(true);
    try {
      const params = new URLSearchParams();
      if (empFilter)    params.set('employee', empFilter);
      if (deptFilter)   params.set('department', deptFilter);
      if (dateFrom)     params.set('date_from', dateFrom);
      if (dateTo)       params.set('date_to', dateTo);
      if (statusFilter) params.set('status', statusFilter);
      const res = await erpFetch(`hr/attendance/report/?${params}`);
      setRecords(Array.isArray(res) ? res : res.results ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [empFilter, deptFilter, dateFrom, dateTo, statusFilter]);

  const exportCSV = () => {
    const header = ['Employee', 'Department', 'Date', 'Clock In', 'Clock Out', 'Hours', 'Status', 'Notes'];
    const rows = records.map(r => [
      r.employee_name, r.department_name || '', r.date,
      r.check_in ? new Date(r.check_in).toLocaleTimeString() : '',
      r.check_out ? new Date(r.check_out).toLocaleTimeString() : '',
      r.hours, r.status, r.notes,
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `attendance_report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ animation: 'aaFadeUp 0.45s ease both' }}>
      <style>{`@keyframes aaFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
        <div>
          <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>All Attendance</h4>
          <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0' }}>
            Admin: full employee attendance records with filtering
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowManual(true)}
            style={{ background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="fas fa-plus" style={{ fontSize: 11 }} />Add Manual Attendance
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 180 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Employee</label>
            <select value={empFilter} onChange={e => setEmpFilter(e.target.value)} style={inputStyle}>
              <option value="">All Employees</option>
              {employees.data.map((e: any) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 160 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Department</label>
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={inputStyle}>
              <option value="">All Departments</option>
              {departments.data.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={inputStyle}>
              <option value="">All</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
              <option value="absent">Absent</option>
            </select>
          </div>
          <button onClick={load} disabled={loading}
            style={{ background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 9, padding: '8px 20px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : <i className="fas fa-search" />}
            Search
          </button>
          {records.length > 0 && (
            <button onClick={exportCSV}
              style={{ background: C.cream, color: C.dark, border: `1px solid ${C.border}`, borderRadius: 9, padding: '8px 16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              <i className="fas fa-file-excel" />Export to Excel
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {!fetched ? (
          <div style={{ padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
            <i className="fas fa-filter" style={{ fontSize: 32, display: 'block', marginBottom: 10, color: '#ddd' }} />
            Apply filters and click Search to view records.
          </div>
        ) : loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
        ) : error ? (
          <div style={{ padding: 24, color: '#ef4444', fontFamily: "'DM Sans', sans-serif" }}>{error}</div>
        ) : records.length === 0 ? (
          <div style={{ padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>No records found.</div>
        ) : (
          <>
            <div style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: C.dark }}>{records.length} records</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                <thead>
                  <tr style={{ background: '#fafaf9' }}>
                    {['Employee', 'Department', 'Date', 'Clock In', 'Clock Out', 'Hours', 'Status', 'Notes'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r: any) => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}`, background: `${STATUS_COLORS[r.status] ?? C.muted}0a` }}>
                      <td style={{ padding: '11px 16px', fontWeight: 600, color: C.dark }}>{r.employee_name}</td>
                      <td style={{ padding: '11px 16px', color: C.muted }}>{r.department_name || '—'}</td>
                      <td style={{ padding: '11px 16px', color: C.muted }}>{r.date}</td>
                      <td style={{ padding: '11px 16px', color: C.muted }}>{fmtTime(r.check_in)}</td>
                      <td style={{ padding: '11px 16px', color: C.muted }}>{fmtTime(r.check_out)}</td>
                      <td style={{ padding: '11px 16px', fontWeight: 600 }}>{r.hours ? `${parseFloat(r.hours).toFixed(2)}h` : '—'}</td>
                      <td style={{ padding: '11px 16px' }}><Badge s={r.status || 'present'} /></td>
                      <td style={{ padding: '11px 16px', color: C.muted }}>{r.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showManual && (
        <ManualAttendanceModal
          onClose={() => setShowManual(false)}
          onSuccess={() => { setShowManual(false); toast.success('Attendance record added'); load(); }}
        />
      )}
    </div>
  );
}
