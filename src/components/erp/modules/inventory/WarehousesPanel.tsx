import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency } from './inventoryShared';

const defW = { name: '', code: '', location: '', capacity: '0', is_active: 'true' };
const defT = { product: '', from_warehouse: '', to_warehouse: '', quantity: '', notes: '' };

export default function WarehousesPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const warehouses = useERPList<any>('inventory/warehouses/');
  const products = useERPList<any>('inventory/products/');

  const [modal, setModal] = useState<'none' | 'add' | 'edit' | 'transfer'>('none');
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [wF, setWF] = useState({ ...defW });
  const [tF, setTF] = useState({ ...defT });
  const [transferring, setTransferring] = useState(false);

  const closeModal = () => { setModal('none'); setEditing(null); };

  const saveWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { name: wF.name, location: wF.location, capacity: Number(wF.capacity) || 0, is_active: wF.is_active === 'true' };
      if (wF.code) body.code = wF.code;
      if (editing) { await warehouses.update(editing.id, body); toast.success('Warehouse updated'); }
      else { await warehouses.create(body); toast.success('Warehouse created'); }
      closeModal();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await warehouses.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const runTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tF.product || !tF.from_warehouse || !tF.to_warehouse || !tF.quantity) { toast.error('Product, both warehouses and quantity are required.'); return; }
    if (tF.from_warehouse === tF.to_warehouse) { toast.error('Source and destination warehouse must differ.'); return; }
    setTransferring(true);
    try {
      await erpFetch('inventory/stock-transfer/', {
        method: 'POST',
        body: JSON.stringify({
          product: Number(tF.product), from_warehouse: Number(tF.from_warehouse), to_warehouse: Number(tF.to_warehouse),
          quantity: Number(tF.quantity), notes: tF.notes,
        }),
      });
      toast.success('Stock transferred');
      warehouses.reload();
      closeModal();
    } catch (err: any) { toast.error(err.message || 'Transfer failed'); }
    finally { setTransferring(false); }
  };

  const cols = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location', render: (r: any) => r.location || '—' },
    { key: 'capacity', label: 'Capacity', render: (r: any) => Number(r.capacity) > 0 ? Number(r.capacity).toLocaleString('en-IN') : 'Unlimited' },
    { key: 'current_stock_units', label: 'Current Stock (units)', render: (r: any) => Number(r.current_stock_units ?? 0).toLocaleString('en-IN') },
    { key: 'current_stock_value', label: 'Stock Value', render: (r: any) => fmtINR(r.current_stock_value) },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? '✅' : '❌' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        {isAdmin && (
          <button onClick={() => { setTF({ ...defT }); setModal('transfer'); }} style={{ background: 'rgba(201,136,58,0.10)', color: OG, border: '1px solid rgba(201,136,58,0.28)', borderRadius: 9, padding: '9px 16px', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
            <i className="fas fa-exchange-alt" style={{ marginRight: 6 }} />Stock Transfer
          </button>
        )}
      </div>

      <ERPTable title="Warehouses" columns={cols} data={warehouses.data} loading={warehouses.loading} error={warehouses.error} isAdmin={isAdmin}
        onAdd={() => { setWF({ ...defW }); setEditing(null); setModal('add'); }}
        onEdit={r => { setEditing(r); setWF({ name: r.name || '', code: r.code || '', location: r.location || '', capacity: String(r.capacity ?? '0'), is_active: String(r.is_active ?? true) }); setModal('edit'); }}
        onDelete={id => setDelId(id)} />

      {(modal === 'add' || modal === 'edit') && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Warehouse' : 'Add New Warehouse'}</h5>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveWarehouse} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Name *</label><input value={wF.name} onChange={e => setWF(f => ({ ...f, name: e.target.value }))} style={inp} required /></div>
              <div><label style={lbl}>Code</label><input value={wF.code} onChange={e => setWF(f => ({ ...f, code: e.target.value }))} style={inp} placeholder="auto-generated if blank" /></div>
              <div><label style={lbl}>Location</label><input value={wF.location} onChange={e => setWF(f => ({ ...f, location: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Capacity (units, 0 = unlimited)</label><input type="number" value={wF.capacity} onChange={e => setWF(f => ({ ...f, capacity: e.target.value }))} style={inp} min="0" step="1" /></div>
              <div><label style={lbl}>Active</label><select value={wF.is_active} onChange={e => setWF(f => ({ ...f, is_active: e.target.value }))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={closeModal} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {modal === 'transfer' && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Stock Transfer</h5>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={runTransfer} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Product</label><select value={tF.product} onChange={e => setTF(f => ({ ...f, product: e.target.value }))} style={inp} required>
                <option value="">— Select —</option>
                {products.data.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>From Warehouse</label><select value={tF.from_warehouse} onChange={e => setTF(f => ({ ...f, from_warehouse: e.target.value }))} style={inp} required>
                  <option value="">— Select —</option>
                  {warehouses.data.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select></div>
                <div><label style={lbl}>To Warehouse</label><select value={tF.to_warehouse} onChange={e => setTF(f => ({ ...f, to_warehouse: e.target.value }))} style={inp} required>
                  <option value="">— Select —</option>
                  {warehouses.data.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select></div>
              </div>
              <div><label style={lbl}>Quantity *</label><input type="number" value={tF.quantity} onChange={e => setTF(f => ({ ...f, quantity: e.target.value }))} style={inp} required min="0.01" step="0.01" /></div>
              <div><label style={lbl}>Notes</label><input value={tF.notes} onChange={e => setTF(f => ({ ...f, notes: e.target.value }))} style={inp} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={closeModal} style={CNCL}>Cancel</button>
                <button type="submit" disabled={transferring} style={{ ...SAVE, opacity: transferring ? 0.7 : 1, cursor: transferring ? 'not-allowed' : 'pointer' }}>{transferring ? 'Transferring…' : 'Transfer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
