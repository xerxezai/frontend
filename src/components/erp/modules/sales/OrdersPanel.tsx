import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, FF, inp, lbl, SAVE, CNCL, useFmtCurrency, O_STATUS, DelDlg, today, nextNumber, SearchableSelect } from './salesShared';

const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:700,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };

const defO = { number: '', customer: '', order_date: '', status: 'open', assignee: '', notes: '' };

interface ItemRow { product: string; quantity: string; unit_price: string; }
const emptyRow = (): ItemRow => ({ product: '', quantity: '1', unit_price: '0' });

/** The salespeople dropdown mixes regular Users and MLM Distributors — value is encoded as
 * "user:<id>" or "distributor:<id>" so a single <select> can drive either FK on the order. */
const encodeAssignee = (r: any): string => {
  if (r.salesperson) return `user:${r.salesperson}`;
  if (r.distributor) return `distributor:${r.distributor}`;
  return '';
};
const decodeAssignee = (value: string): { salesperson: number | null; distributor: number | null } => {
  if (!value) return { salesperson: null, distributor: null };
  const [type, id] = value.split(':');
  return { salesperson: type === 'user' ? Number(id) : null, distributor: type === 'distributor' ? Number(id) : null };
};

export default function OrdersPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const orders = useERPList<any>('sales/orders/');
  const customers = useERPList<any>('crm/customers/');
  const salespeople = useERPList<any>('sales/orders/salespeople/');
  const products = useERPList<any>('inventory/products/');
  const invoices = useERPList<any>('invoicing/invoices/');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [oF, setOF] = useState({ ...defO });
  const [items, setItems] = useState<ItemRow[]>([emptyRow()]);
  const [savingStatus, setSavingStatus] = useState<number | null>(null);
  const [generatingInvoice, setGeneratingInvoice] = useState<number | null>(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [salespersonFilter, setSalespersonFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => orders.data.filter((r: any) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (salespersonFilter && encodeAssignee(r) !== salespersonFilter) return false;
    if (dateFrom && (!r.order_date || r.order_date < dateFrom)) return false;
    if (dateTo && (!r.order_date || r.order_date > dateTo)) return false;
    return true;
  }), [orders.data, statusFilter, salespersonFilter, dateFrom, dateTo]);

  const salespersonOptions = useMemo(
    () => salespeople.data.map((p: any) => ({ value: `${p.type}:${p.id}`, label: p.type === 'distributor' ? `⬡ ${p.name}` : p.name })),
    [salespeople.data],
  );

  const grandTotal = items.reduce((s, r) => s + (Number(r.quantity) || 0) * (Number(r.unit_price) || 0), 0);

  const close = () => { setShowModal(false); setEditing(null); };

  const addRow = () => setItems(rows => [...rows, emptyRow()]);
  const removeRow = (i: number) => setItems(rows => rows.filter((_, idx) => idx !== i));
  const updateRow = (i: number, patch: Partial<ItemRow>) => setItems(rows => rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const saveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oF.number.trim())  { toast.error('Order number is required.'); return; }
    if (!oF.order_date)     { toast.error('Order date is required.'); return; }
    if (!oF.customer)       { toast.error('Please select a customer.'); return; }
    const validItems = items.filter(r => r.product && Number(r.quantity) > 0);
    if (validItems.length === 0) { toast.error('Add at least one line item.'); return; }
    try {
      const { salesperson, distributor } = decodeAssignee(oF.assignee);
      const body: any = {
        number: oF.number.trim(), order_date: oF.order_date, customer: Number(oF.customer),
        status: oF.status, salesperson, distributor, notes: oF.notes,
        items: validItems.map(r => ({ product: Number(r.product), quantity: Number(r.quantity), unit_price: Number(r.unit_price) })),
      };
      if (editing) { await orders.update(editing.id, body); toast.success('Order updated'); }
      else { await orders.create(body); toast.success('Order created'); }
      close();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await orders.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
  };

  const changeStatus = async (id: number, newStatus: string) => {
    setSavingStatus(id);
    try {
      await erpFetch(`sales/orders/${id}/status/`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
      toast.success('Status updated');
      orders.reload();
    } catch (e: any) {
      toast.error(e.message || 'Status update failed');
    } finally {
      setSavingStatus(null);
    }
  };

  const changeSalesperson = async (id: number, value: string) => {
    try {
      const { salesperson, distributor } = decodeAssignee(value);
      await orders.update(id, { salesperson, distributor });
      toast.success('Salesperson assigned');
    } catch (e: any) {
      toast.error(e.message || 'Could not assign salesperson');
    }
  };

  const plusDays = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  const generateInvoice = async (order: any) => {
    setGeneratingInvoice(order.id);
    try {
      // Use the order's pre-tax subtotal (not its GST-inclusive total) as the fallback
      // line's unit_price — the invoice applies its own 18% GST on top, so seeding it
      // with the already-taxed total would double-apply GST.
      const orderItems = (order.items || []).length
        ? order.items.map((it: any) => ({ product: it.product || null, description: it.description, quantity: it.quantity, unit_price: it.unit_price }))
        : [{ product: null, description: `Sales Order ${order.number}`, quantity: '1', unit_price: order.subtotal ?? order.total }];
      await erpFetch('invoicing/invoices/', {
        method: 'POST',
        body: JSON.stringify({
          number: nextNumber('INV', invoices.data), customer: order.customer, sales_order: order.id,
          issue_date: today(), due_date: plusDays(30), status: 'sent',
          notes: `Auto-generated from ${order.number}`, items: orderItems,
        }),
      });
      toast.success(`Invoice generated for ${order.number}`);
      orders.reload();
      invoices.reload();
    } catch (e: any) {
      toast.error(e.message || 'Could not generate invoice');
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const cols = [
    { key: 'number', label: 'Number', render: (r: any) => r.number || r.id },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'order_date', label: 'Date', render: (r: any) => r.order_date || '—' },
    {
      key: 'status', label: 'Status',
      render: (r: any) => (
        <select
          value={r.status}
          disabled={!isAdmin || savingStatus === r.id}
          onChange={e => changeStatus(r.id, e.target.value)}
          style={{ border: 'none', background: 'transparent', cursor: isAdmin ? 'pointer' : 'default', fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 700 }}
        >
          {Object.entries(O_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      ),
    },
    {
      key: 'salesperson', label: 'Salesperson',
      render: (r: any) => isAdmin ? (
        <select value={encodeAssignee(r)} onChange={e => changeSalesperson(r.id, e.target.value)}
          style={{ border: '1px solid rgba(0,0,0,0.10)', borderRadius: 6, padding: '3px 6px', background: '#fafaf8', fontFamily: "'DM Sans',sans-serif", fontSize: 11.5 }}>
          <option value="">— Unassigned —</option>
          {salespeople.data.map((p: any) => <option key={`${p.type}:${p.id}`} value={`${p.type}:${p.id}`}>{p.type === 'distributor' ? `⬡ ${p.name}` : p.name}</option>)}
        </select>
      ) : (r.distributor_name || r.salesperson_name || '—'),
    },
    { key: 'invoice_number', label: 'Invoice', render: (r: any) => r.invoice_number || '—' },
    { key: 'total', label: 'Total', render: (r: any) => fmtINR(r.total) },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => (
        r.invoice_status !== 'fully_invoiced' && Number(r.total) > 0 ? (
          <button title="Generate Invoice" disabled={generatingInvoice === r.id} onClick={() => generateInvoice(r)}
            style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.22)', width: 28, height: 28, borderRadius: 6, cursor: generatingInvoice === r.id ? 'wait' : 'pointer' }}>
            <i className={`fas ${generatingInvoice === r.id ? 'fa-spinner fa-spin' : 'fa-file-invoice-dollar'}`} style={{ fontSize: 10 }} />
          </button>
        ) : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ minWidth: 150 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={inp}>
            <option value="">All Statuses</option>
            {Object.entries(O_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Salesperson</label>
          <SearchableSelect value={salespersonFilter} onChange={setSalespersonFilter} options={salespersonOptions} emptyLabel="All Salespeople" placeholder="Search salesperson…" />
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inp} />
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inp} />
        </div>
        {(statusFilter || salespersonFilter || dateFrom || dateTo) && (
          <button onClick={() => { setStatusFilter(''); setSalespersonFilter(''); setDateFrom(''); setDateTo(''); }}
            style={{ background: 'none', border: 'none', color: OG, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: FF, padding: '9px 0' }}>Clear</button>
        )}
      </div>

      <ERPTable title="Sales Orders" columns={cols} data={filtered} loading={orders.loading} error={orders.error} isAdmin={isAdmin}
        onAdd={() => { setOF({ ...defO, number: nextNumber('SO', orders.data), order_date: today() }); setItems([emptyRow()]); setEditing(null); setShowModal(true); }}
        onEdit={r => {
          setEditing(r);
          setOF({ number: r.number || '', customer: String(r.customer || ''), order_date: r.order_date || '', status: r.status || 'open', assignee: encodeAssignee(r), notes: r.notes || '' });
          setItems(r.items?.length ? r.items.map((it: any) => ({ product: String(it.product || ''), quantity: String(it.quantity), unit_price: String(it.unit_price) })) : [emptyRow()]);
          setShowModal(true);
        }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={CRD}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Order' : 'Add Order'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveOrder} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Order Number</label><input type="text" value={oF.number} onChange={e => setOF(f => ({ ...f, number: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Customer</label><select value={oF.customer} onChange={e => setOF(f => ({ ...f, customer: e.target.value }))} style={inp}>
                <option value="">— Select customer —</option>
                {customers.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
              <div><label style={lbl}>Order Date</label><input type="date" value={oF.order_date} onChange={e => setOF(f => ({ ...f, order_date: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Status</label><select value={oF.status} onChange={e => setOF(f => ({ ...f, status: e.target.value }))} style={inp}>
                {Object.entries(O_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select></div>
              <div><label style={lbl}>Assign Salesperson</label>
              <SearchableSelect value={oF.assignee} onChange={v => setOF(f => ({ ...f, assignee: v }))} options={salespersonOptions} emptyLabel="— Unassigned —" placeholder="Search salesperson…" />
              <p style={{ fontSize: 11.5, color: '#6B6B6B', margin: '4px 0 0' }}>Assigning an MLM distributor and confirming the order auto-generates a pending commission.</p>
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
                  Order Total: {fmtINR(grandTotal)}
                </div>
              </div>

              <div><label style={lbl}>Notes</label><textarea value={oF.notes} onChange={e => setOF(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 80 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
