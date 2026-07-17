import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD, ASSET_CATEGORY, ASSET_STATUS } from './assetsShared';

const defAsset = {
  name: '', category: 'equipment', status: 'active', location: '', department: '', assigned_to: '',
  purchase_date: '', purchase_cost: '', current_value: '', depreciation_rate: '0',
  next_maintenance: '', maintenance_interval_days: '90', notes: '',
};

export default function AssetForm({ asset, onClose, onSaved }: { asset?: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ ...defAsset });
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    erpFetch('sales/orders/salespeople/')
      .then((res: any) => setUsers((Array.isArray(res) ? res : []).filter((p: any) => p.type === 'user')))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (asset) {
      setF({
        name: asset.name || '', category: asset.category || 'equipment', status: asset.status || 'active',
        location: asset.location || '', department: asset.department || '', assigned_to: String(asset.assigned_to || ''),
        purchase_date: asset.purchase_date || '', purchase_cost: String(asset.purchase_cost ?? ''),
        current_value: asset.current_value != null ? String(asset.current_value) : '',
        depreciation_rate: String(asset.depreciation_rate ?? '0'),
        next_maintenance: asset.next_maintenance || '', maintenance_interval_days: String(asset.maintenance_interval_days ?? '90'),
        notes: asset.notes || '',
      });
    }
  }, [asset]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) { toast.error('Asset name is required.'); return; }
    if (!f.location.trim()) { toast.error('Location is required.'); return; }
    if (!f.purchase_date || !f.purchase_cost) { toast.error('Purchase date and cost are required.'); return; }
    setSaving(true);
    try {
      const body: any = {
        name: f.name, category: f.category, status: f.status, location: f.location, department: f.department,
        assigned_to: f.assigned_to ? Number(f.assigned_to) : null,
        purchase_date: f.purchase_date, purchase_cost: Number(f.purchase_cost),
        current_value: f.current_value ? Number(f.current_value) : null,
        depreciation_rate: Number(f.depreciation_rate || 0),
        next_maintenance: f.next_maintenance || null, maintenance_interval_days: Number(f.maintenance_interval_days || 90),
        notes: f.notes,
      };
      if (asset) await erpFetch(`asset-management/assets/${asset.id}/`, { method: 'PUT', body: JSON.stringify(body) });
      else await erpFetch('asset-management/assets/', { method: 'POST', body: JSON.stringify(body) });
      toast.success(asset ? 'Asset updated' : 'Asset added');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={CRD}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{asset ? 'Edit Asset' : 'Add Asset'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Asset Name *</label><input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} style={inp} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Category</label>
              <select value={f.category} onChange={e => setF(p => ({ ...p, category: e.target.value }))} style={inp}>
                {Object.entries(ASSET_CATEGORY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Status</label>
              <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value }))} style={inp}>
                {Object.entries(ASSET_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Location *</label><input value={f.location} onChange={e => setF(p => ({ ...p, location: e.target.value }))} style={inp} required /></div>
            <div><label style={lbl}>Department</label><input value={f.department} onChange={e => setF(p => ({ ...p, department: e.target.value }))} style={inp} /></div>
          </div>
          <div><label style={lbl}>Assigned To</label>
            <select value={f.assigned_to} onChange={e => setF(p => ({ ...p, assigned_to: e.target.value }))} style={inp}>
              <option value="">— Unassigned —</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Purchase Date *</label><input type="date" value={f.purchase_date} onChange={e => setF(p => ({ ...p, purchase_date: e.target.value }))} style={inp} required /></div>
            <div><label style={lbl}>Purchase Cost *</label><input type="number" value={f.purchase_cost} onChange={e => setF(p => ({ ...p, purchase_cost: e.target.value }))} style={inp} step="0.01" min="0.01" required /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Current Value</label><input type="number" value={f.current_value} onChange={e => setF(p => ({ ...p, current_value: e.target.value }))} style={inp} step="0.01" min="0" /></div>
            <div><label style={lbl}>Depreciation Rate (% / yr)</label><input type="number" value={f.depreciation_rate} onChange={e => setF(p => ({ ...p, depreciation_rate: e.target.value }))} style={inp} step="0.01" min="0" max="100" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Next Maintenance</label><input type="date" value={f.next_maintenance} onChange={e => setF(p => ({ ...p, next_maintenance: e.target.value }))} style={inp} /></div>
            <div><label style={lbl}>Maintenance Interval (days)</label><input type="number" value={f.maintenance_interval_days} onChange={e => setF(p => ({ ...p, maintenance_interval_days: e.target.value }))} style={inp} min="1" /></div>
          </div>
          <div><label style={lbl}>Notes</label><textarea value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
