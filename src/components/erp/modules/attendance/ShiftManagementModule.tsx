import { useState } from 'react';
import { useERPList } from '../../../../hooks/useERPApi';

const C = {
  orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};

const inputStyle: React.CSSProperties = {
  width: '100%', border: `1px solid ${C.border}`, borderRadius: 9,
  padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
  background: C.cream, outline: 'none', boxSizing: 'border-box',
};

export default function ShiftManagementModule() {
  const shifts    = useERPList<any>('hr/shifts/');
  const employees = useERPList<any>('hr/employees/');

  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ name: '', start_time: '', end_time: '', employee_ids: [] as number[] });
  const [saving, setSaving]       = useState(false);
  const [saveErr, setSaveErr]     = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaveErr('');
    try {
      await shifts.create(form);
      setForm({ name: '', start_time: '', end_time: '', employee_ids: [] });
      setShowForm(false);
    } catch (err: any) { setSaveErr(err.message); }
    finally { setSaving(false); }
  };

  const toggleEmp = (id: number) => {
    setForm(f => ({
      ...f,
      employee_ids: f.employee_ids.includes(id)
        ? f.employee_ids.filter(x => x !== id)
        : [...f.employee_ids, id],
    }));
  };

  return (
    <div style={{ animation: 'smFadeUp 0.45s ease both' }}>
      <style>{`@keyframes smFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>Shift Management</h4>
          <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0' }}>Create and assign work shifts to employees</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          style={{
            background: showForm ? C.cream : C.orangeGrad,
            color: showForm ? C.dark : '#fff',
            border: showForm ? `1px solid ${C.border}` : 'none',
            borderRadius: 10, padding: '10px 20px',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: showForm ? 'none' : '0 3px 0 rgba(150,95,30,0.5)',
          }}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`} />
          {showForm ? 'Cancel' : 'New Shift'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, marginBottom: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h5 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: C.dark, margin: '0 0 16px' }}>New Shift</h5>
          {saveErr && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 9, padding: '10px 14px', marginBottom: 14, color: '#ef4444', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{saveErr}</div>}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Shift Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Morning Shift" style={inputStyle} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Start Time</label>
                <input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>End Time</label>
                <input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} style={inputStyle} required />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Assign Employees</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {employees.data.map((emp: any) => {
                  const sel = form.employee_ids.includes(emp.id);
                  return (
                    <button key={emp.id} type="button" onClick={() => toggleEmp(emp.id)}
                      style={{
                        border: sel ? `1.5px solid ${C.orange}` : `1px solid ${C.border}`,
                        borderRadius: 8, padding: '5px 12px',
                        background: sel ? 'rgba(201,136,58,0.10)' : C.cream,
                        color: sel ? C.orange : C.muted,
                        fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: sel ? 700 : 500,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}>
                      {sel && <i className="fas fa-check" style={{ marginRight: 5, fontSize: 10 }} />}
                      {emp.full_name}
                    </button>
                  );
                })}
              </div>
            </div>
            <button type="submit" disabled={saving}
              style={{
                background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 10,
                padding: '11px 0', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14,
                cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1,
                boxShadow: '0 3px 0 rgba(150,95,30,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {saving && <span className="spinner-border spinner-border-sm" />}
              Create Shift
            </button>
          </form>
        </div>
      )}

      {/* Shift cards */}
      {shifts.loading ? (
        <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
      ) : shifts.data.length === 0 ? (
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
          <i className="fas fa-exchange-alt" style={{ fontSize: 32, display: 'block', marginBottom: 12, color: '#ddd' }} />
          No shifts yet. Create your first shift.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {shifts.data.map((s: any) => (
            <div key={s.id} style={{
              background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
              borderTop: `2px solid ${C.orange}`, padding: '18px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              transition: 'transform 0.22s, box-shadow 0.22s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: C.orangeGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(201,136,58,0.30)' }}>
                  <i className="fas fa-exchange-alt" style={{ color: '#fff', fontSize: 12 }} />
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: C.dark }}>{s.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 18, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}>Start</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: C.orange }}>{s.start_time}</div>
                </div>
                <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 18 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}>End</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: C.dark }}>{s.end_time}</div>
                </div>
              </div>
              {s.employee_names?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {s.employee_names.slice(0, 4).map((n: string) => (
                    <span key={n} style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: C.muted }}>
                      {n}
                    </span>
                  ))}
                  {s.employee_names.length > 4 && (
                    <span style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: C.orange, fontWeight: 700 }}>
                      +{s.employee_names.length - 4} more
                    </span>
                  )}
                </div>
              )}
              <button onClick={() => shifts.remove(s.id)}
                style={{ marginTop: 14, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>
                <i className="fas fa-trash" style={{ marginRight: 5, fontSize: 10 }} />Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
