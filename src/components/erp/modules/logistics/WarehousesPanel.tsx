import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, today } from './logisticsShared';

const defWarehouse = { name: '', location: '', capacity: '0', manager: '', is_active: 'true' };

export default function WarehousesPanel() {
  const isAdmin = isSuperUser();
  const warehouses = useERPList<any>('logistics/warehouses/');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [wF, setWF] = useState({ ...defWarehouse });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return warehouses.data.filter((w: any) => {
      if (statusFilter === 'active' && !w.is_active) return false;
      if (statusFilter === 'inactive' && w.is_active) return false;
      if (!q) return true;
      return [w.name, w.location, w.manager].some(v => (v || '').toLowerCase().includes(q));
    });
  }, [warehouses.data, search, statusFilter]);

  const close = () => { setShowModal(false); setEditing(null); };

  const saveWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wF.name.trim()) { toast.error('Warehouse name is required.'); return; }
    try {
      const body = { ...wF, capacity: Number(wF.capacity) || 0, is_active: wF.is_active === 'true' };
      if (editing) { await warehouses.update(editing.id, body); toast.success('Warehouse updated'); }
      else { await warehouses.create(body); toast.success('Warehouse created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await warehouses.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('logistics/warehouses/export-csv/', `warehouses-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location', render: (r: any) => r.location || '—' },
    { key: 'capacity', label: 'Capacity', render: (r: any) => Number(r.capacity || 0).toLocaleString('en-IN') },
    { key: 'manager', label: 'Manager', render: (r: any) => r.manager || '—' },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? '✅' : '❌' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search warehouses…" style={{ ...inp, width: 220, paddingLeft: 30 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} style={{ ...inp, width: 140 }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Warehouses" columns={cols} data={filtered} loading={warehouses.loading} error={warehouses.error} isAdmin={isAdmin}
        onAdd={() => { setWF({ ...defWarehouse }); setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setWF({ name: r.name || '', location: r.location || '', capacity: String(r.capacity ?? '0'), manager: r.manager || '', is_active: String(r.is_active ?? true) }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Warehouse' : 'Add Warehouse'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveWarehouse} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Name *</label><input value={wF.name} onChange={e => setWF(f => ({ ...f, name: e.target.value }))} style={inp} required /></div>
              <div><label style={lbl}>Location</label><input value={wF.location} onChange={e => setWF(f => ({ ...f, location: e.target.value }))} style={inp} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Capacity</label><input type="number" min="0" step="0.01" value={wF.capacity} onChange={e => setWF(f => ({ ...f, capacity: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Manager</label><input value={wF.manager} onChange={e => setWF(f => ({ ...f, manager: e.target.value }))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Active</label><select value={wF.is_active} onChange={e => setWF(f => ({ ...f, is_active: e.target.value }))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
