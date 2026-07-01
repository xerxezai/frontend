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

interface KVPair { key: string; value: string; }

function KVEditor({ label, items, onChange }: { label: string; items: KVPair[]; onChange: (v: KVPair[]) => void }) {
  const add    = () => onChange([...items, { key: '', value: '' }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'key' | 'value', val: string) =>
    onChange(items.map((x, idx) => idx === i ? { ...x, [field]: val } : x));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
        <button type="button" onClick={add}
          style={{ background: 'rgba(201,136,58,0.10)', border: `1px solid rgba(201,136,58,0.28)`, borderRadius: 7, padding: '3px 10px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: C.orange, fontWeight: 700, cursor: 'pointer' }}>
          + Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 7 }}>
          <input placeholder="Name (e.g. HRA)" value={item.key} onChange={e => update(i, 'key', e.target.value)}
            style={{ ...inputStyle, padding: '7px 10px' }} />
          <input type="number" placeholder="Amount" value={item.value} onChange={e => update(i, 'value', e.target.value)}
            style={{ ...inputStyle, padding: '7px 10px' }} />
          <button type="button" onClick={() => remove(i)}
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 7, width: 34, cursor: 'pointer', color: '#ef4444' }}>
            <i className="fas fa-times" style={{ fontSize: 11 }} />
          </button>
        </div>
      ))}
    </div>
  );
}

function pairsToObj(pairs: KVPair[]) {
  const obj: Record<string, number> = {};
  pairs.forEach(p => { if (p.key) obj[p.key] = parseFloat(p.value) || 0; });
  return obj;
}

function objToPairs(obj: Record<string, number> = {}): KVPair[] {
  return Object.entries(obj).map(([key, value]) => ({ key, value: String(value) }));
}

export default function SalaryStructuresModule() {
  const structures = useERPList<any>('hr/salary-structures/');
  const employees  = useERPList<any>('hr/employees/');

  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({
    employee: '', basic_salary: '', effective_date: '',
    allowances: [] as KVPair[], deductions: [] as KVPair[],
  });
  const [saving, setSaving]   = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [saveOk, setSaveOk]   = useState(false);

  const openNew = () => {
    setSelected(null);
    setForm({ employee: '', basic_salary: '', effective_date: '', allowances: [], deductions: [] });
    setSaveErr(''); setSaveOk(false);
  };

  const openEdit = (s: any) => {
    setSelected(s);
    setForm({
      employee: String(s.employee),
      basic_salary: String(s.basic_salary),
      effective_date: s.effective_date,
      allowances: objToPairs(s.allowances),
      deductions: objToPairs(s.deductions),
    });
    setSaveErr(''); setSaveOk(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setSaveErr(''); setSaveOk(false);
    const body = {
      employee: parseInt(form.employee),
      basic_salary: parseFloat(form.basic_salary),
      effective_date: form.effective_date,
      allowances: pairsToObj(form.allowances),
      deductions: pairsToObj(form.deductions),
    };
    try {
      if (selected) await structures.update(selected.id, body);
      else await structures.create(body);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
      openNew();
    } catch (err: any) { setSaveErr(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start', animation: 'ssFadeUp 0.45s ease both' }}>
      <style>{`@keyframes ssFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @media(max-width:900px){.ss-grid{grid-template-columns:1fr!important}}`}</style>

      {/* Left: list */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>Salary Structures</h4>
            <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0' }}>Per-employee basic + allowances + deductions</p>
          </div>
          <button onClick={openNew}
            style={{ background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 3px 0 rgba(150,95,30,0.5)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="fas fa-plus" />New
          </button>
        </div>

        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          {structures.loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
          ) : structures.data.length === 0 ? (
            <div style={{ padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>No salary structures defined yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                <thead>
                  <tr style={{ background: '#fafaf9' }}>
                    {['Employee', 'Basic Salary', 'Allowances', 'Deductions', 'Effective', ''].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {structures.data.map((s: any) => {
                    const totalA = Object.values(s.allowances ?? {}).reduce((a: number, v: any) => a + parseFloat(v), 0);
                    const totalD = Object.values(s.deductions ?? {}).reduce((a: number, v: any) => a + parseFloat(v), 0);
                    return (
                      <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fafaf8')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}>
                        <td style={{ padding: '11px 16px', fontWeight: 600, color: C.dark }}>{s.employee_name}</td>
                        <td style={{ padding: '11px 16px', fontWeight: 700, color: '#10b981' }}>${parseFloat(s.basic_salary).toLocaleString()}</td>
                        <td style={{ padding: '11px 16px', color: '#3b82f6' }}>+${totalA.toLocaleString()}</td>
                        <td style={{ padding: '11px 16px', color: '#ef4444' }}>-${totalD.toLocaleString()}</td>
                        <td style={{ padding: '11px 16px', color: C.muted }}>{s.effective_date}</td>
                        <td style={{ padding: '11px 16px' }}>
                          <button onClick={() => openEdit(s)}
                            style={{ background: 'rgba(201,136,58,0.08)', border: `1px solid rgba(201,136,58,0.22)`, borderRadius: 7, padding: '5px 12px', fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: C.orange, cursor: 'pointer', fontWeight: 600 }}>
                            <i className="fas fa-pen" style={{ marginRight: 5, fontSize: 10 }} />Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right: form */}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 80 }}>
        <h5 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: C.dark, margin: '0 0 18px' }}>
          {selected ? 'Edit Structure' : 'New Salary Structure'}
        </h5>
        {saveOk && <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 9, padding: '10px 14px', marginBottom: 14, color: '#059669', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}><i className="fas fa-check-circle" style={{ marginRight: 6 }} />Saved successfully!</div>}
        {saveErr && <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 9, padding: '10px 14px', marginBottom: 14, color: '#ef4444', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{saveErr}</div>}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Employee</label>
            <select value={form.employee} onChange={e => setForm(f => ({ ...f, employee: e.target.value }))} style={inputStyle} required>
              <option value="">Select employee…</option>
              {employees.data.map((e: any) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Basic Salary</label>
            <input type="number" min="0" step="0.01" value={form.basic_salary} onChange={e => setForm(f => ({ ...f, basic_salary: e.target.value }))} style={inputStyle} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Effective Date</label>
            <input type="date" value={form.effective_date} onChange={e => setForm(f => ({ ...f, effective_date: e.target.value }))} style={inputStyle} required />
          </div>
          <KVEditor label="Allowances" items={form.allowances} onChange={v => setForm(f => ({ ...f, allowances: v }))} />
          <KVEditor label="Deductions" items={form.deductions} onChange={v => setForm(f => ({ ...f, deductions: v }))} />
          <button type="submit" disabled={saving}
            style={{ background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 0', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1, boxShadow: '0 3px 0 rgba(150,95,30,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {saving && <span className="spinner-border spinner-border-sm" />}
            {selected ? 'Update' : 'Create'} Structure
          </button>
        </form>
      </div>
    </div>
  );
}
