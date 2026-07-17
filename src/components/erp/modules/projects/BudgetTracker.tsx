import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD, useFmtCurrency, BUDGET_CATEGORY_LABEL, ProgressBar, DelDlg } from './projectsShared';

const defEntry = { category: 'materials', description: '', budgeted_amount: '', actual_amount: '0', date: new Date().toISOString().slice(0, 10), notes: '' };

function BudgetEntryForm({ projectId, onClose, onSaved }: { projectId: number; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ ...defEntry });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.description.trim()) { toast.error('Description is required.'); return; }
    if (!f.budgeted_amount || Number(f.budgeted_amount) <= 0) { toast.error('Budgeted amount must be greater than 0.'); return; }
    setSaving(true);
    try {
      await erpFetch(`project-management/projects/${projectId}/budget/`, {
        method: 'POST',
        body: JSON.stringify({ ...f, budgeted_amount: Number(f.budgeted_amount), actual_amount: Number(f.actual_amount || 0), project: projectId }),
      });
      toast.success('Budget entry added');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 440 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Add Budget Entry</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Category</label>
            <select value={f.category} onChange={e => setF(p => ({ ...p, category: e.target.value }))} style={inp}>
              {Object.entries(BUDGET_CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Description *</label><input value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={inp} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Budgeted Amount *</label><input type="number" value={f.budgeted_amount} onChange={e => setF(p => ({ ...p, budgeted_amount: e.target.value }))} style={inp} step="0.01" min="0.01" required /></div>
            <div><label style={lbl}>Actual Amount</label><input type="number" value={f.actual_amount} onChange={e => setF(p => ({ ...p, actual_amount: e.target.value }))} style={inp} step="0.01" min="0" /></div>
          </div>
          <div><label style={lbl}>Date</label><input type="date" value={f.date} onChange={e => setF(p => ({ ...p, date: e.target.value }))} style={inp} /></div>
          <div><label style={lbl}>Notes</label><textarea value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 55 }} /></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BudgetTracker({ projectId, entries, loading, onReload }: { projectId: number; entries: any[]; loading: boolean; onReload: () => void }) {
  const fmtINR = useFmtCurrency();
  const [showForm, setShowForm] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);

  const remove = async () => {
    try { await erpFetch(`project-management/budget-entries/${delId}/`, { method: 'DELETE' }); toast.success('Entry deleted'); setDelId(null); onReload(); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const totalBudgeted = entries.reduce((s, e) => s + Number(e.budgeted_amount || 0), 0);
  const totalActual = entries.reduce((s, e) => s + Number(e.actual_amount || 0), 0);

  if (loading) return <div className="d-flex justify-content-center py-4"><div className="spinner-border" style={{ color: '#C9883A' }} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none', borderRadius: 9, padding: '8px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
          <i className="fas fa-plus" style={{ marginRight: 6 }} />Add Budget Entry
        </button>
      </div>
      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>No budget entries yet.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FF, fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#fafaf8' }}>
                {['Category', 'Description', 'Budgeted', 'Actual', 'Variance', 'Used %', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '9px 10px', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B6B6B', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map(e => {
                const budgeted = Number(e.budgeted_amount || 0);
                const actual = Number(e.actual_amount || 0);
                const variance = budgeted - actual;
                const pctUsed = budgeted > 0 ? (actual / budgeted) * 100 : 0;
                const over = actual > budgeted;
                return (
                  <tr key={e.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '9px 10px' }}>{BUDGET_CATEGORY_LABEL[e.category] ?? e.category}</td>
                    <td style={{ padding: '9px 10px' }}>{e.description}</td>
                    <td style={{ padding: '9px 10px' }}>{fmtINR(budgeted)}</td>
                    <td style={{ padding: '9px 10px', color: over ? '#ef4444' : undefined, fontWeight: over ? 700 : undefined }}>{fmtINR(actual)}</td>
                    <td style={{ padding: '9px 10px', color: variance < 0 ? '#ef4444' : '#10b981', fontWeight: 700 }}>{fmtINR(variance)}</td>
                    <td style={{ padding: '9px 10px', width: 120 }}>
                      <ProgressBar value={pctUsed} height={6} accent={over ? '#ef4444' : '#C9883A'} />
                    </td>
                    <td style={{ padding: '9px 10px' }}>
                      <button onClick={() => setDelId(e.id)} title="Delete" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 26, height: 26, borderRadius: 6, cursor: 'pointer' }}>
                        <i className="fas fa-trash" style={{ fontSize: 9 }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#fafaf8', fontWeight: 800 }}>
                <td style={{ padding: '10px' }} colSpan={2}>Total</td>
                <td style={{ padding: '10px' }}>{fmtINR(totalBudgeted)}</td>
                <td style={{ padding: '10px', color: totalActual > totalBudgeted ? '#ef4444' : undefined }}>{fmtINR(totalActual)}</td>
                <td style={{ padding: '10px', color: totalBudgeted - totalActual < 0 ? '#ef4444' : '#10b981' }}>{fmtINR(totalBudgeted - totalActual)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {showForm && <BudgetEntryForm projectId={projectId} onClose={() => setShowForm(false)} onSaved={onReload} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={remove} />}
    </div>
  );
}
