import { useState } from 'react';
import { useERPList } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';

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
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif",
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
};

interface KVPair { key: string; value: string; }

const ALLOWANCE_PRESETS = ['House Rent Allowance (HRA)', 'Transport Allowance', 'Food Allowance', 'Medical Allowance', 'Mobile Allowance', 'Custom'];
const DEDUCTION_PRESETS = ['Provident Fund (PF)', 'Income Tax', 'Health Insurance', 'Loan Deduction', 'Advance Deduction', 'Custom'];

// ── Preset-driven add editor — dropdown picks a common allowance/deduction name (or
// Custom to type one), added items show as removable amount tags. ─────────────────────
function PresetEditor({ label, presets, items, onChange }: {
  label: string; presets: string[]; items: KVPair[]; onChange: (v: KVPair[]) => void;
}) {
  const [addingCustom, setAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');

  const addItem = (name: string) => {
    if (!name || items.some(i => i.key === name)) return;
    onChange([...items, { key: name, value: '' }]);
  };

  const handleSelect = (v: string) => {
    if (!v) return;
    if (v === 'Custom') { setAddingCustom(true); return; }
    addItem(v);
  };

  const confirmCustom = () => {
    addItem(customName.trim());
    setCustomName('');
    setAddingCustom(false);
  };

  const update = (i: number, val: string) => onChange(items.map((x, idx) => idx === i ? { ...x, value: val } : x));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label style={labelStyle}>{label}</label>
        <select value="" onChange={e => handleSelect(e.target.value)}
          style={{ border: `1px solid rgba(201,136,58,0.28)`, borderRadius: 7, padding: '4px 8px', fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: C.orange, fontWeight: 700, background: 'rgba(201,136,58,0.08)', cursor: 'pointer' }}>
          <option value="">+ Add {label.replace(/s$/, '')}</option>
          {presets.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      {addingCustom && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <input placeholder="Custom name" value={customName} onChange={e => setCustomName(e.target.value)}
            style={{ ...inputStyle, padding: '7px 10px' }} autoFocus />
          <button type="button" onClick={confirmCustom}
            style={{ background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 7, padding: '0 14px', fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>Add</button>
          <button type="button" onClick={() => { setAddingCustom(false); setCustomName(''); }}
            style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 7, padding: '0 12px', fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>Cancel</button>
        </div>
      )}
      {items.length === 0 ? (
        <div style={{ fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>None added yet.</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {items.map((item, i) => (
            <div key={item.key + i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.cream, border: `1px solid ${C.border}`, borderRadius: 8, padding: '5px 6px 5px 12px' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>{item.key}</span>
              <input type="number" min="0" step="0.01" placeholder="0" value={item.value} onChange={e => update(i, e.target.value)}
                style={{ width: 72, border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: 'none', padding: '3px 6px' }} />
              <button type="button" onClick={() => remove(i)}
                style={{ background: 'rgba(239,68,68,0.10)', border: 'none', borderRadius: 5, width: 20, height: 20, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-times" style={{ fontSize: 9 }} />
              </button>
            </div>
          ))}
        </div>
      )}
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

function sumValues(obj: Record<string, number> = {}) {
  return Object.values(obj).reduce((a: number, v: any) => a + parseFloat(v || 0), 0);
}

function StatCard({ label, val, icon, color }: { label: string; val: string; icon: string; color: string }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, borderTop: `2px solid ${color}`, padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={icon} style={{ color, fontSize: 13 }} />
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 18, color: C.dark }}>{val}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

function DeleteDlg({ name, busy, onCancel, onConfirm }: { name: string; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1060, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 400, width: '100%', borderTop: '2px solid #ef4444', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: C.dark }}>Delete Salary Structure?</h6>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Are you sure you want to delete the salary structure for <strong style={{ color: C.dark }}>{name}</strong>? This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={busy} style={{ flex: 1, background: C.cream, border: `1px solid ${C.border}`, borderRadius: 9, padding: 9, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: C.muted }}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: 9, cursor: busy ? 'wait' : 'pointer', color: '#ef4444', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

const emptyForm = { employee: '', basic_salary: '', effective_date: '', allowances: [] as KVPair[], deductions: [] as KVPair[] };

export default function SalaryStructuresModule() {
  const { formatAmount, symbol } = useCurrency();
  const structures = useERPList<any>('hr/salary-structures/');
  const employees = useERPList<any>('hr/employees/');

  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [saveOk, setSaveOk] = useState(false);
  const [deleting, setDeleting] = useState<any>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const openNew = () => {
    setSelected(null);
    setForm(emptyForm);
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

  const totalAllowances = form.allowances.reduce((s, a) => s + (parseFloat(a.value) || 0), 0);
  const totalDeductions = form.deductions.reduce((s, a) => s + (parseFloat(a.value) || 0), 0);
  const netPreview = (parseFloat(form.basic_salary) || 0) + totalAllowances - totalDeductions;

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

  const confirmDelete = async () => {
    setDeleteBusy(true);
    try {
      await structures.remove(deleting.id);
      setDeleting(null);
      if (selected?.id === deleting.id) openNew();
    } catch { /* useERPList surfaces nothing here; row stays with delete retryable */ }
    finally { setDeleteBusy(false); }
  };

  const netOf = (s: any) => parseFloat(s.basic_salary) + sumValues(s.allowances) - sumValues(s.deductions);
  const today = new Date().toISOString().slice(0, 10);
  const avgNet = structures.data.length ? structures.data.reduce((a: number, s: any) => a + netOf(s), 0) / structures.data.length : 0;
  const totalMonthlyCost = structures.data.reduce((a: number, s: any) => a + netOf(s), 0);

  return (
    <div style={{ animation: 'ssFadeUp 0.45s ease both' }}>
      <style>{`@keyframes ssFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @media(max-width:900px){.ss-grid{grid-template-columns:1fr!important}}`}</style>

      <div style={{ marginBottom: 18 }}>
        <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>Salary Setup</h4>
        <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0' }}>Per-employee basic + allowances + deductions</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
        <StatCard label="Total Employees with Salary Setup" val={String(structures.data.length)} icon="fas fa-users" color="#3b82f6" />
        <StatCard label="Average Salary" val={formatAmount(avgNet)} icon="fas fa-chart-line" color="#10b981" />
        <StatCard label="Total Monthly Payroll Cost" val={formatAmount(totalMonthlyCost)} icon="fas fa-wallet" color={C.orange} />
      </div>

      <div className="ss-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
        {/* Left: history */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h5 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: C.dark, margin: 0 }}>Salary History</h5>
            <button onClick={openNew}
              style={{ background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 3px 0 rgba(150,95,30,0.5)', display: 'flex', alignItems: 'center', gap: 7 }}>
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
                      {['Employee', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Effective', 'Status', ''].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {structures.data.map((s: any) => {
                      const totalA = sumValues(s.allowances);
                      const totalD = sumValues(s.deductions);
                      const active = s.effective_date <= today;
                      return (
                        <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#fafaf8')}
                          onMouseLeave={e => (e.currentTarget.style.background = '')}>
                          <td style={{ padding: '11px 16px', fontWeight: 600, color: C.dark, whiteSpace: 'nowrap' }}>{s.employee_name}</td>
                          <td style={{ padding: '11px 16px', fontWeight: 700 }}>{formatAmount(s.basic_salary)}</td>
                          <td style={{ padding: '11px 16px', color: '#3b82f6' }}>+{formatAmount(totalA)}</td>
                          <td style={{ padding: '11px 16px', color: '#ef4444' }}>-{formatAmount(totalD)}</td>
                          <td style={{ padding: '11px 16px', fontWeight: 800, color: '#10b981' }}>{formatAmount(netOf(s))}</td>
                          <td style={{ padding: '11px 16px', color: C.muted, whiteSpace: 'nowrap' }}>{s.effective_date}</td>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: active ? 'rgba(16,185,129,0.12)' : 'rgba(107,107,107,0.12)', color: active ? '#059669' : C.muted }}>
                              {active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => openEdit(s)}
                                style={{ background: 'rgba(201,136,58,0.08)', border: `1px solid rgba(201,136,58,0.22)`, borderRadius: 7, padding: '5px 10px', fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: C.orange, cursor: 'pointer', fontWeight: 600 }}>
                                <i className="fas fa-pen" style={{ fontSize: 10 }} />
                              </button>
                              <button onClick={() => setDeleting(s)}
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 7, padding: '5px 10px', fontSize: 12, color: '#ef4444', cursor: 'pointer' }}>
                                <i className="fas fa-trash" style={{ fontSize: 10 }} />
                              </button>
                            </div>
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
              <label style={labelStyle}>Employee</label>
              <select value={form.employee} onChange={e => setForm(f => ({ ...f, employee: e.target.value }))} style={inputStyle} required>
                <option value="">Select employee…</option>
                {employees.data.map((e: any) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Basic Salary</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", pointerEvents: 'none' }}>{symbol}</span>
                <input type="number" min="0" step="0.01" value={form.basic_salary} onChange={e => setForm(f => ({ ...f, basic_salary: e.target.value }))}
                  style={{ ...inputStyle, paddingLeft: symbol.length > 1 ? 46 : 30 }} required />
              </div>
            </div>
            <div>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
                Effective Date
                <i className="fas fa-info-circle" title="The date from which this salary structure becomes active for the employee" style={{ fontSize: 11, color: C.muted, cursor: 'help', textTransform: 'none', letterSpacing: 'normal', fontWeight: 400 }} />
              </label>
              <input type="date" value={form.effective_date} onChange={e => setForm(f => ({ ...f, effective_date: e.target.value }))} style={inputStyle} required />
            </div>
            <PresetEditor label="Allowances" presets={ALLOWANCE_PRESETS} items={form.allowances} onChange={v => setForm(f => ({ ...f, allowances: v }))} />
            <PresetEditor label="Deductions" presets={DEDUCTION_PRESETS} items={form.deductions} onChange={v => setForm(f => ({ ...f, deductions: v }))} />

            {(form.basic_salary || form.allowances.length > 0 || form.deductions.length > 0) && (
              <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 9, padding: '10px 14px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Net Salary</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 20, color: '#059669' }}>{formatAmount(netPreview)}</div>
              </div>
            )}

            <button type="submit" disabled={saving}
              style={{ background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 0', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1, boxShadow: '0 3px 0 rgba(150,95,30,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {saving && <span className="spinner-border spinner-border-sm" />}
              {selected ? 'Update' : 'Create'} Structure
            </button>
          </form>
        </div>
      </div>

      {deleting && (
        <DeleteDlg name={deleting.employee_name} busy={deleteBusy} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />
      )}
    </div>
  );
}
