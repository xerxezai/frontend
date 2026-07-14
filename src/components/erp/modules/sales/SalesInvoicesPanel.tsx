import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, erpDownload, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, FF, inp, lbl, SAVE, CNCL, OVR, CRD, fmtINR, StatusBadge, DelDlg, today, plusDays, nextNumber } from '../invoicing/invoicingShared';
import { QuickPaymentModal } from '../invoicing/InvoicesPanel';
import { downloadInvoicePDF } from '../invoicing/pdf';

const defF = { order: '', issue_date: today(), due_date: plusDays(30), notes: '' };

/** Invoices/Payments scoped to Sales Orders only — a thin, sales-focused view over the
 * shared invoicing app (Invoice already carries a nullable sales_order FK), rather than
 * a separate backend module. The full, unscoped list still lives under Accounting. */
export default function SalesInvoicesPanel() {
  const isAdmin = isSuperUser();
  const invoices = useERPList<any>('invoicing/invoices/');
  const orders = useERPList<any>('sales/orders/');

  const salesInvoices = useMemo(() => invoices.data.filter((inv: any) => inv.sales_order), [invoices.data]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => salesInvoices.filter((r: any) => {
    const s = search.trim().toLowerCase();
    if (s && !(String(r.number || '').toLowerCase().includes(s) || String(r.customer_name || '').toLowerCase().includes(s) || String(r.sales_order_number || '').toLowerCase().includes(s))) return false;
    if (status && r.status !== status) return false;
    if (dateFrom && (!r.due_date || r.due_date < dateFrom)) return false;
    if (dateTo && (!r.due_date || r.due_date > dateTo)) return false;
    return true;
  }), [salesInvoices, search, status, dateFrom, dateTo]);

  // Orders that don't already have a fully-invoiced total are worth generating an invoice for.
  const invoiceableOrders = useMemo(() => orders.data.filter((o: any) => o.invoice_status !== 'fully_invoiced'), [orders.data]);

  const [showModal, setShowModal] = useState(false);
  const [f, setF] = useState({ ...defF });
  const [saving, setSaving] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);
  const [markingPaid, setMarkingPaid] = useState<number | null>(null);
  const [sending, setSending] = useState<number | null>(null);
  const [payTarget, setPayTarget] = useState<any>(null);

  const close = () => { setShowModal(false); setF({ ...defF }); };
  const refreshAll = () => { invoices.reload(); orders.reload(); };

  const generateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.order) { toast.error('Please select a sales order.'); return; }
    const order = orders.data.find((o: any) => String(o.id) === f.order);
    if (!order) { toast.error('Order not found.'); return; }
    setSaving(true);
    try {
      const items = (order.items || []).length
        ? order.items.map((it: any) => ({ product: it.product || null, description: it.description, quantity: it.quantity, unit_price: it.unit_price }))
        : [{ product: null, description: `Sales Order ${order.number}`, quantity: '1', unit_price: order.total }];
      await erpFetch('invoicing/invoices/', {
        method: 'POST',
        body: JSON.stringify({
          number: nextNumber('INV', invoices.data), customer: order.customer, sales_order: order.id,
          issue_date: f.issue_date, due_date: f.due_date, status: 'draft', notes: f.notes, items,
        }),
      });
      toast.success(`Invoice generated for ${order.number}`);
      close();
      refreshAll();
    } catch (err: any) { toast.error(err.message || 'Could not generate invoice'); }
    finally { setSaving(false); }
  };

  const confirmDel = async () => {
    try { await invoices.remove(delId!); toast.success('Deleted'); setDelId(null); refreshAll(); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
  };

  const markPaid = async (id: number) => {
    setMarkingPaid(id);
    try { await erpFetch(`invoicing/invoices/${id}/mark-paid/`, { method: 'PUT' }); toast.success('Marked as paid'); refreshAll(); }
    catch (e: any) { toast.error(e.message || 'Could not mark as paid'); }
    finally { setMarkingPaid(null); }
  };

  const sendInvoice = async (id: number) => {
    setSending(id);
    try { await erpFetch(`invoicing/invoices/${id}/send/`, { method: 'PUT' }); toast.success('Invoice sent'); refreshAll(); }
    catch (e: any) { toast.error(e.message || 'Could not send invoice'); }
    finally { setSending(null); }
  };

  const exportCSV = async () => {
    try { await erpDownload('invoicing/invoices/export-csv/?sales_order__isnull=false', `sales-invoices-${today()}.csv`); }
    catch (e: any) { toast.error(e.message || 'Export failed'); }
  };

  const cols = [
    { key: 'number', label: 'Number', render: (r: any) => r.number || r.id },
    { key: 'sales_order_number', label: 'Sales Order', render: (r: any) => r.sales_order_number || '—' },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'due_date', label: 'Due Date', render: (r: any) => r.due_date || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} isOverdue={r.is_overdue} /> },
    { key: 'total', label: 'Total', render: (r: any) => fmtINR(r.total) },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => (
        <div style={{ display: 'flex', gap: 5 }}>
          {isAdmin && r.status === 'draft' && (
            <button title="Send" disabled={sending === r.id} onClick={() => sendInvoice(r.id)}
              style={{ background:'rgba(59,130,246,0.08)',color:'#1d4ed8',border:'1px solid rgba(59,130,246,0.22)',width:28,height:28,borderRadius:6,cursor: sending === r.id ? 'wait' : 'pointer' }}>
              <i className={`fas ${sending === r.id ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} style={{ fontSize: 10 }} />
            </button>
          )}
          {isAdmin && r.status !== 'paid' && r.status !== 'cancelled' && (
            <button title="Record Payment" onClick={() => setPayTarget(r)}
              style={{ background:'rgba(201,136,58,0.08)',color:OG,border:'1px solid rgba(201,136,58,0.22)',width:28,height:28,borderRadius:6,cursor:'pointer' }}>
              <i className="fas fa-hand-holding-dollar" style={{ fontSize: 10 }} />
            </button>
          )}
          <button title="Download PDF" onClick={() => downloadInvoicePDF(r)}
            style={{ background:'rgba(107,114,128,0.08)',color:'#374151',border:'1px solid rgba(107,114,128,0.22)',width:28,height:28,borderRadius:6,cursor:'pointer' }}>
            <i className="fas fa-file-pdf" style={{ fontSize: 10 }} />
          </button>
          {isAdmin && r.status !== 'paid' && r.status !== 'cancelled' && (
            <button title="Mark as Paid" disabled={markingPaid === r.id} onClick={() => markPaid(r.id)}
              style={{ background:'rgba(16,185,129,0.08)',color:'#059669',border:'1px solid rgba(16,185,129,0.22)',width:28,height:28,borderRadius:6,cursor: markingPaid === r.id ? 'wait' : 'pointer' }}>
              <i className={`fas ${markingPaid === r.id ? 'fa-spinner fa-spin' : 'fa-check-circle'}`} style={{ fontSize: 10 }} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Search</label>
          <input type="text" placeholder="Customer, invoice # or SO #…" value={search} onChange={e => setSearch(e.target.value)} style={inp} />
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={inp}>
            <option value="">All Statuses</option>
            <option value="draft">Draft</option><option value="sent">Sent</option><option value="partial">Partially Paid</option>
            <option value="paid">Paid</option><option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Due From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inp} />
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Due To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inp} />
        </div>
        <button onClick={exportCSV} disabled={filtered.length === 0}
          style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: filtered.length === 0 ? 'not-allowed' : 'pointer', color: '#1A1A1A', whiteSpace: 'nowrap' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: OG }} />Export CSV
        </button>
      </div>

      <ERPTable title="Sales Invoices" columns={cols} data={filtered} loading={invoices.loading || orders.loading} error={invoices.error} isAdmin={isAdmin}
        onAdd={() => { setF({ ...defF }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Generate Invoice from Sales Order</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={generateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Sales Order *</label>
                <select value={f.order} onChange={e => setF(v => ({ ...v, order: e.target.value }))} style={inp} required>
                  <option value="">— Select sales order —</option>
                  {invoiceableOrders.map((o: any) => <option key={o.id} value={o.id}>{o.number} — {o.customer_name} ({fmtINR(o.total)})</option>)}
                </select>
                <p style={{ fontSize: 11.5, color: '#6B6B6B', margin: '4px 0 0' }}>Copies the order's line items onto the new invoice.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Issue Date</label><input type="date" value={f.issue_date} onChange={e => setF(v => ({ ...v, issue_date: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Due Date</label><input type="date" value={f.due_date} onChange={e => setF(v => ({ ...v, due_date: e.target.value }))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Notes</label><textarea value={f.notes} onChange={e => setF(v => ({ ...v, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={close} style={CNCL}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Generating…' : 'Generate Invoice'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {payTarget && <QuickPaymentModal invoice={payTarget} onClose={() => setPayTarget(null)} onSaved={() => { setPayTarget(null); refreshAll(); }} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
