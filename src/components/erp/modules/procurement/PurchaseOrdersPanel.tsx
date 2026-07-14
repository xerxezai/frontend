import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, fmtINR, today, plusDays, PO_STATUS, StatusBadge } from './procurementShared';
import { downloadPurchaseOrderPDF } from './pdf';

interface ItemRow { product: string; quantity: string; unit_price: string; }
const emptyRow = (): ItemRow => ({ product: '', quantity: '1', unit_price: '0' });
const defPO = { supplier: '', order_date: today(), expected_delivery: '', notes: '' };

export default function PurchaseOrdersPanel() {
  const isAdmin = isSuperUser();
  const pos = useERPList<any>('procurement/purchase-orders/');
  const suppliers = useERPList<any>('procurement/suppliers/');
  const products = useERPList<any>('inventory/products/');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [poF, setPOF] = useState({ ...defPO });
  const [items, setItems] = useState<ItemRow[]>([emptyRow()]);
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pos.data.filter((p: any) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (dateFrom && p.order_date < dateFrom) return false;
      if (dateTo && p.order_date > dateTo) return false;
      if (!q) return true;
      return [p.po_number, p.supplier_name].some(v => (v || '').toLowerCase().includes(q));
    });
  }, [pos.data, search, statusFilter, dateFrom, dateTo]);

  const grandTotal = items.reduce((s, r) => s + (Number(r.quantity) || 0) * (Number(r.unit_price) || 0), 0);

  const close = () => { setShowModal(false); setEditing(null); };

  const savePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poF.supplier) { toast.error('Please select a supplier.'); return; }
    const validItems = items.filter(r => r.product && Number(r.quantity) > 0);
    if (validItems.length === 0) { toast.error('Add at least one line item.'); return; }
    try {
      const body: any = {
        supplier: Number(poF.supplier), order_date: poF.order_date,
        expected_delivery: poF.expected_delivery || null, notes: poF.notes,
        items: validItems.map(r => ({ product: Number(r.product), quantity: Number(r.quantity), unit_price: Number(r.unit_price) })),
      };
      if (editing) { await pos.update(editing.id, body); toast.success('Purchase order updated'); }
      else { await pos.create(body); toast.success('Purchase order created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await pos.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const sendPO = async (po: any) => {
    setBusyId(po.id);
    try { await erpFetch(`procurement/purchase-orders/${po.id}/send/`, { method: 'PUT' }); toast.success(`${po.po_number} sent to supplier`); pos.reload(); }
    catch (err: any) { toast.error(err.message || 'Could not send purchase order'); }
    finally { setBusyId(null); }
  };

  const receiveGoods = async (po: any) => {
    setBusyId(po.id);
    try {
      await erpFetch(`procurement/purchase-orders/${po.id}/receive/`, { method: 'POST', body: JSON.stringify({ received_date: today() }) });
      toast.success(`Goods received for ${po.po_number} — stock updated`);
      pos.reload();
    } catch (err: any) { toast.error(err.message || 'Could not receive goods'); }
    finally { setBusyId(null); }
  };

  const generateBill = async (po: any) => {
    setBusyId(po.id);
    try {
      await erpFetch('procurement/bills/', {
        method: 'POST',
        body: JSON.stringify({ supplier: po.supplier, purchase_order: po.id, issue_date: today(), due_date: plusDays(30), amount: po.total, notes: `Auto-generated from ${po.po_number}` }),
      });
      toast.success(`Bill generated for ${po.po_number}`);
    } catch (err: any) { toast.error(err.message || 'Could not generate bill'); }
    finally { setBusyId(null); }
  };

  const downloadPDF = async (po: any) => {
    try { await downloadPurchaseOrderPDF(po); }
    catch (err: any) { toast.error(err.message || 'Could not generate PDF'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('procurement/purchase-orders/export-csv/', `purchase-orders-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const addRow = () => setItems(rows => [...rows, emptyRow()]);
  const removeRow = (i: number) => setItems(rows => rows.filter((_, idx) => idx !== i));
  const updateRow = (i: number, patch: Partial<ItemRow>) => setItems(rows => rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const cols = [
    { key: 'po_number', label: 'PO Number' },
    { key: 'supplier_name', label: 'Supplier', render: (r: any) => r.supplier_name || '—' },
    { key: 'order_date', label: 'Order Date' },
    { key: 'expected_delivery', label: 'Expected Delivery', render: (r: any) => r.expected_delivery || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={PO_STATUS} /> },
    { key: 'total', label: 'Total', render: (r: any) => fmtINR(r.total) },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => (
        <div style={{ display: 'flex', gap: 5 }}>
          {r.status === 'draft' && (
            <button title="Send PO" disabled={busyId === r.id} onClick={() => sendPO(r)}
              style={{ background: 'rgba(29,78,216,0.08)', color: '#1d4ed8', border: '1px solid rgba(29,78,216,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
              <i className={`fas ${busyId === r.id ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} style={{ fontSize: 10 }} />
            </button>
          )}
          {(r.status === 'draft' || r.status === 'sent') && (
            <button title="Receive Goods" disabled={busyId === r.id} onClick={() => receiveGoods(r)}
              style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
              <i className={`fas ${busyId === r.id ? 'fa-spinner fa-spin' : 'fa-dolly'}`} style={{ fontSize: 10 }} />
            </button>
          )}
          <button title="Generate Bill" disabled={busyId === r.id} onClick={() => generateBill(r)}
            style={{ background: 'rgba(201,136,58,0.08)', color: '#C9883A', border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
            <i className="fas fa-file-invoice-dollar" style={{ fontSize: 10 }} />
          </button>
          <button title="Download PDF" onClick={() => downloadPDF(r)}
            style={{ background: 'rgba(107,114,128,0.08)', color: '#374151', border: '1px solid rgba(107,114,128,0.22)', width: 28, height: 28, borderRadius: 6, cursor: 'pointer' }}>
            <i className="fas fa-file-pdf" style={{ fontSize: 10 }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search PO # or supplier…" style={{ ...inp, width: 210, paddingLeft: 30 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 140 }}>
            <option value="all">All Status</option>
            {Object.entries(PO_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...inp, width: 140 }} title="From date" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...inp, width: 140 }} title="To date" />
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Purchase Orders" columns={cols} data={filtered} loading={pos.loading || suppliers.loading} error={pos.error} isAdmin={isAdmin}
        onAdd={() => { setPOF({ ...defPO }); setItems([emptyRow()]); setEditing(null); setShowModal(true); }}
        onEdit={r => {
          setEditing(r);
          setPOF({ supplier: String(r.supplier || ''), order_date: r.order_date || today(), expected_delivery: r.expected_delivery || '', notes: r.notes || '' });
          setItems(r.items?.length ? r.items.map((it: any) => ({ product: String(it.product || ''), quantity: String(it.quantity), unit_price: String(it.unit_price) })) : [emptyRow()]);
          setShowModal(true);
        }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Purchase Order' : 'Create Purchase Order'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={savePO} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Supplier *</label>
                <select value={poF.supplier} onChange={e => setPOF(f => ({ ...f, supplier: e.target.value }))} style={inp} required>
                  <option value="">— Select supplier —</option>
                  {suppliers.data.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Order Date</label><input type="date" value={poF.order_date} onChange={e => setPOF(f => ({ ...f, order_date: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Expected Delivery</label><input type="date" value={poF.expected_delivery} onChange={e => setPOF(f => ({ ...f, expected_delivery: e.target.value }))} style={inp} /></div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Line Items *</label>
                  <button type="button" onClick={addRow} style={{ background: 'none', border: 'none', color: '#C9883A', cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 12 }}>
                    <i className="fas fa-plus" style={{ marginRight: 4 }} />Add Item
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((row, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                      <select value={row.product} onChange={e => updateRow(i, { product: e.target.value })} style={inp}>
                        <option value="">— Product —</option>
                        {products.data.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <input type="number" min="0" step="0.01" value={row.quantity} onChange={e => updateRow(i, { quantity: e.target.value })} style={inp} placeholder="Qty" />
                      <input type="number" min="0" step="0.01" value={row.unit_price} onChange={e => updateRow(i, { unit_price: e.target.value })} style={inp} placeholder="Unit Price" />
                      <div style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: '#1A1A1A', textAlign: 'right' }}>
                        {fmtINR((Number(row.quantity) || 0) * (Number(row.unit_price) || 0))}
                      </div>
                      <button type="button" onClick={() => removeRow(i)} disabled={items.length === 1}
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, borderRadius: 6, cursor: items.length === 1 ? 'not-allowed' : 'pointer', opacity: items.length === 1 ? 0.4 : 1 }}>
                        <i className="fas fa-trash" style={{ fontSize: 10 }} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'right', marginTop: 10, fontFamily: FF, fontSize: 14, fontWeight: 800, color: '#C9883A' }}>
                  Total: {fmtINR(grandTotal)}
                </div>
              </div>

              <div><label style={lbl}>Notes</label><textarea value={poF.notes} onChange={e => setPOF(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
