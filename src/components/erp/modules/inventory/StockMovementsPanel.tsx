import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, MOVEMENT_TYPES, MovementBadge, nowISO } from './inventoryShared';

const defM = { product: '', warehouse: '', type: 'in', quantity: '', reason: '', notes: '' };

export default function StockMovementsPanel() {
  const isAdmin = isSuperUser();
  const movements = useERPList<any>('inventory/stock-movements/');
  const products = useERPList<any>('inventory/products/');
  const warehouses = useERPList<any>('inventory/warehouses/');

  const [showModal, setShowModal] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);
  const [mF, setMF] = useState({ ...defM });

  const [productFilter, setProductFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const closeModal = () => setShowModal(false);

  const saveMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mF.product)   { toast.error('Product is required.'); return; }
    if (!mF.warehouse) { toast.error('Warehouse is required.'); return; }
    if (!mF.quantity || Number(mF.quantity) <= 0) { toast.error('Quantity must be greater than 0.'); return; }
    try {
      await movements.create({
        product: Number(mF.product), warehouse: Number(mF.warehouse), type: mF.type,
        quantity: Number(mF.quantity), reason: mF.reason, notes: mF.notes, occurred_at: nowISO(),
      });
      toast.success('Movement recorded');
      closeModal();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await movements.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const filtered = useMemo(() => movements.data.filter((m: any) => {
    if (productFilter && String(m.product) !== productFilter) return false;
    if (typeFilter && m.type !== typeFilter) return false;
    const d = (m.occurred_at || '').slice(0, 10);
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  }), [movements.data, productFilter, typeFilter, dateFrom, dateTo]);

  const cols = [
    { key: 'product', label: 'Product', render: (r: any) => r.product_name || '—' },
    { key: 'warehouse', label: 'Warehouse', render: (r: any) => r.warehouse_name || '—' },
    { key: 'type', label: 'Type', render: (r: any) => <MovementBadge type={r.type} /> },
    { key: 'quantity', label: 'Qty' },
    { key: 'reason', label: 'Reason', render: (r: any) => r.reason || '—' },
    { key: 'occurred_at', label: 'Date', render: (r: any) => r.occurred_at ? new Date(r.occurred_at).toLocaleString('en-IN') : '—' },
    { key: 'created_by_name', label: 'User', render: (r: any) => r.created_by_name || '—' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ minWidth: 180 }}>
          <label style={{ ...lbl, marginBottom: 4 }}>Product</label>
          <select value={productFilter} onChange={e => setProductFilter(e.target.value)} style={inp}>
            <option value="">All Products</option>
            {products.data.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 150 }}>
          <label style={{ ...lbl, marginBottom: 4 }}>Type</label>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={inp}>
            <option value="">All Types</option>
            {Object.entries(MOVEMENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ ...lbl, marginBottom: 4 }}>From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inp} />
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ ...lbl, marginBottom: 4 }}>To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inp} />
        </div>
      </div>

      <ERPTable title="Stock Movements" columns={cols} data={filtered} loading={movements.loading} error={movements.error} isAdmin={isAdmin}
        onAdd={() => { setMF({ ...defM }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={CRD}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Record Stock Movement</h5>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveMovement} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Product</label><select value={mF.product} onChange={e => setMF(f => ({ ...f, product: e.target.value }))} style={inp}><option value="">— Select —</option>{products.data.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div><label style={lbl}>Warehouse</label><select value={mF.warehouse} onChange={e => setMF(f => ({ ...f, warehouse: e.target.value }))} style={inp}><option value="">— Select —</option>{warehouses.data.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Type</label><select value={mF.type} onChange={e => setMF(f => ({ ...f, type: e.target.value }))} style={inp}>
                  {Object.entries(MOVEMENT_TYPES).filter(([k]) => k !== 'transfer').map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select></div>
                <div><label style={lbl}>Quantity *</label><input type="number" value={mF.quantity} onChange={e => setMF(f => ({ ...f, quantity: e.target.value }))} style={inp} required min="0.01" step="0.01" /></div>
              </div>
              <div><label style={lbl}>Reason</label><input value={mF.reason} onChange={e => setMF(f => ({ ...f, reason: e.target.value }))} style={inp} placeholder="e.g. Customer return, damaged in transit…" /></div>
              <div><label style={lbl}>Notes</label><input value={mF.notes} onChange={e => setMF(f => ({ ...f, notes: e.target.value }))} style={inp} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={closeModal} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>Record</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
