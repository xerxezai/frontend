import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD, useFmtCurrency, MAINTENANCE_TYPE_LABEL } from './assetsShared';

const defRecord = { maintenance_type: 'preventive', performed_by: '', vendor: '', date: new Date().toISOString().slice(0, 10), cost: '', description: '', parts_replaced: '', next_due: '' };

function MaintenanceForm({ assetId, onClose, onSaved }: { assetId: number; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ ...defRecord });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.performed_by.trim() || !f.description.trim() || !f.cost) { toast.error('Performed by, description and cost are required.'); return; }
    setSaving(true);
    try {
      await erpFetch(`asset-management/assets/${assetId}/maintenance/`, {
        method: 'POST',
        body: JSON.stringify({ ...f, cost: Number(f.cost), next_due: f.next_due || null }),
      });
      toast.success('Maintenance logged');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Log Maintenance</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Type</label>
              <select value={f.maintenance_type} onChange={e => setF(p => ({ ...p, maintenance_type: e.target.value }))} style={inp}>
                {Object.entries(MAINTENANCE_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Date</label><input type="date" value={f.date} onChange={e => setF(p => ({ ...p, date: e.target.value }))} style={inp} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Performed By *</label><input value={f.performed_by} onChange={e => setF(p => ({ ...p, performed_by: e.target.value }))} style={inp} required /></div>
            <div><label style={lbl}>Vendor</label><input value={f.vendor} onChange={e => setF(p => ({ ...p, vendor: e.target.value }))} style={inp} /></div>
          </div>
          <div><label style={lbl}>Cost *</label><input type="number" value={f.cost} onChange={e => setF(p => ({ ...p, cost: e.target.value }))} style={inp} step="0.01" min="0" required /></div>
          <div><label style={lbl}>Description *</label><textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 55 }} required /></div>
          <div><label style={lbl}>Parts Replaced</label><input value={f.parts_replaced} onChange={e => setF(p => ({ ...p, parts_replaced: e.target.value }))} style={inp} /></div>
          <div><label style={lbl}>Next Due</label><input type="date" value={f.next_due} onChange={e => setF(p => ({ ...p, next_due: e.target.value }))} style={inp} /></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MaintenanceHistory({ assetId, records, loading, onReload }: { assetId: number; records: any[]; loading: boolean; onReload: () => void }) {
  const fmtINR = useFmtCurrency();
  const [showForm, setShowForm] = useState(false);
  const totalCost = records.reduce((s, r) => s + Number(r.cost || 0), 0);

  if (loading) return <div className="d-flex justify-content-center py-4"><div className="spinner-border" style={{ color: '#C9883A' }} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B' }}>Total maintenance cost: <strong style={{ color: '#1A1A1A' }}>{fmtINR(totalCost)}</strong></div>
        <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none', borderRadius: 9, padding: '8px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
          <i className="fas fa-plus" style={{ marginRight: 6 }} />Log Maintenance
        </button>
      </div>
      {records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>No maintenance records yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.map(r => (
            <div key={r.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 12.5, color: '#1A1A1A' }}>{MAINTENANCE_TYPE_LABEL[r.maintenance_type] ?? r.maintenance_type}</span>
                  <span style={{ fontFamily: FF, fontSize: 11.5, color: '#9ca3af', marginLeft: 8 }}>{r.date} · {r.performed_by}{r.vendor ? ` (${r.vendor})` : ''}</span>
                </div>
                <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 13, color: '#C9883A' }}>{fmtINR(r.cost)}</span>
              </div>
              <div style={{ fontFamily: FF, fontSize: 12, color: '#374151', marginTop: 6 }}>{r.description}</div>
              {r.parts_replaced && <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginTop: 4 }}>Parts: {r.parts_replaced}</div>}
            </div>
          ))}
        </div>
      )}
      {showForm && <MaintenanceForm assetId={assetId} onClose={() => setShowForm(false)} onSaved={onReload} />}
    </div>
  );
}
