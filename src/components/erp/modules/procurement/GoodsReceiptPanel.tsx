import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, today } from './procurementShared';

interface ItemRow { product: string; quantity_received: string; }
const emptyRow = (): ItemRow => ({ product: '', quantity_received: '' });
const defReceipt = { purchase_order: '', warehouse: '', received_date: today(), notes: '' };

export default function GoodsReceiptPanel() {
  const isAdmin = isSuperUser();
  const receipts = useERPList<any>('procurement/goods-receipts/');
  const purchaseOrders = useERPList<any>('procurement/purchase-orders/');
  const products = useERPList<any>('inventory/products/');
  const warehouses = useERPList<any>('inventory/warehouses/');

  const [showModal, setShowModal] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);
  const [rF, setRF] = useState({ ...defReceipt });
  const [items, setItems] = useState<ItemRow[]>([emptyRow()]);
  const [saving, setSaving] = useState(false);

  const close = () => setShowModal(false);

  const selectedPO = purchaseOrders.data.find((p: any) => String(p.id) === rF.purchase_order);

  const applyPOItems = (poId: string) => {
    const po = purchaseOrders.data.find((p: any) => String(p.id) === poId);
    setRF(f => ({ ...f, purchase_order: poId }));
    if (po?.items?.length) {
      setItems(po.items.map((it: any) => ({ product: String(it.product || ''), quantity_received: String(it.quantity) })));
    } else {
      setItems([emptyRow()]);
    }
  };

  const addRow = () => setItems(rows => [...rows, emptyRow()]);
  const removeRow = (i: number) => setItems(rows => rows.filter((_, idx) => idx !== i));
  const updateRow = (i: number, patch: Partial<ItemRow>) => setItems(rows => rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const saveReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rF.purchase_order) { toast.error('Please select a purchase order.'); return; }
    const validItems = items.filter(r => r.product && Number(r.quantity_received) > 0);
    if (validItems.length === 0) { toast.error('Add at least one item with quantity received.'); return; }
    setSaving(true);
    try {
      await erpFetch('procurement/goods-receipts/', {
        method: 'POST',
        body: JSON.stringify({
          purchase_order: Number(rF.purchase_order), warehouse: rF.warehouse ? Number(rF.warehouse) : null,
          received_date: rF.received_date, notes: rF.notes,
          items: validItems.map(r => ({ product: Number(r.product), quantity_received: Number(r.quantity_received) })),
        }),
      });
      toast.success('Goods receipt recorded — inventory stock updated');
      receipts.reload();
      purchaseOrders.reload();
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const confirmDel = async () => {
    try { await receipts.remove(delId!); toast.success('Deleted — stock movement reversed'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const cols = [
    { key: 'receipt_number', label: 'Receipt Number' },
    { key: 'po_number', label: 'PO Number', render: (r: any) => r.po_number || '—' },
    { key: 'supplier_name', label: 'Supplier', render: (r: any) => r.supplier_name || '—' },
    { key: 'warehouse_name', label: 'Warehouse', render: (r: any) => r.warehouse_name || '—' },
    { key: 'received_date', label: 'Received Date' },
    { key: 'items', label: 'Items', render: (r: any) => r.items?.length ?? 0 },
  ];

  return (
    <div>
      <p style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', marginBottom: 14 }}>
        Recording a receipt books an inbound stock movement per item and marks its purchase order as Received —
        inventory stock updates automatically.
      </p>

      <ERPTable title="Goods Receipts" columns={cols} data={receipts.data} loading={receipts.loading} error={receipts.error} isAdmin={isAdmin}
        onAdd={() => {
          const defaultWarehouse = warehouses.data.find((w: any) => w.is_active) || warehouses.data[0];
          setRF({ ...defReceipt, warehouse: defaultWarehouse ? String(defaultWarehouse.id) : '' });
          setItems([emptyRow()]);
          setShowModal(true);
        }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 620 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Add Goods Receipt</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveReceipt} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Purchase Order *</label>
                <select value={rF.purchase_order} onChange={e => applyPOItems(e.target.value)} style={inp} required>
                  <option value="">— Select purchase order —</option>
                  {purchaseOrders.data.filter((p: any) => p.status !== 'cancelled').map((p: any) => (
                    <option key={p.id} value={p.id}>{p.po_number} — {p.supplier_name} ({p.status})</option>
                  ))}
                </select>
                {selectedPO?.status === 'received' && (
                  <p style={{ fontSize: 11.5, color: '#92400e', marginTop: 6 }}>This PO was already received — a new receipt will add further stock on top of it.</p>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Receiving Warehouse</label>
                  <select value={rF.warehouse} onChange={e => setRF(f => ({ ...f, warehouse: e.target.value }))} style={inp}>
                    <option value="">— Default (first active) —</option>
                    {warehouses.data.map((w: any) => <option key={w.id} value={w.id}>{w.code} — {w.name}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Received Date</label><input type="date" value={rF.received_date} onChange={e => setRF(f => ({ ...f, received_date: e.target.value }))} style={inp} /></div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Items Received *</label>
                  <button type="button" onClick={addRow} style={{ background: 'none', border: 'none', color: '#C9883A', cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 12 }}>
                    <i className="fas fa-plus" style={{ marginRight: 4 }} />Add Item
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((row, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'center' }}>
                      <select value={row.product} onChange={e => updateRow(i, { product: e.target.value })} style={inp}>
                        <option value="">— Product —</option>
                        {products.data.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <input type="number" min="0" step="0.01" value={row.quantity_received} onChange={e => updateRow(i, { quantity_received: e.target.value })} style={inp} placeholder="Qty Received" />
                      <button type="button" onClick={() => removeRow(i)} disabled={items.length === 1}
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, borderRadius: 6, cursor: items.length === 1 ? 'not-allowed' : 'pointer', opacity: items.length === 1 ? 0.4 : 1 }}>
                        <i className="fas fa-trash" style={{ fontSize: 10 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div><label style={lbl}>Notes</label><textarea value={rF.notes} onChange={e => setRF(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={close} style={CNCL}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
