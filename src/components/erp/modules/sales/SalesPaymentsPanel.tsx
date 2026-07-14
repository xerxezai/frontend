import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpDownload, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, fmtINR, PAYMENT_METHODS, today } from '../invoicing/invoicingShared';

const defP = { invoice: '', amount: '', method: 'cash', paid_at: '', reference: '', notes: '' };

/** Payments scoped to invoices raised against Sales Orders — see SalesInvoicesPanel for the
 * rationale (thin sales-focused view over the shared invoicing app, not a separate backend). */
export default function SalesPaymentsPanel() {
  const isAdmin = isSuperUser();
  const payments = useERPList<any>('invoicing/payments/');
  const invoices = useERPList<any>('invoicing/invoices/');

  const invoiceById = useMemo(() => {
    const m = new Map<number, any>();
    invoices.data.forEach((inv: any) => m.set(inv.id, inv));
    return m;
  }, [invoices.data]);

  const salesPayments = useMemo(
    () => payments.data.filter((p: any) => invoiceById.get(p.invoice)?.sales_order),
    [payments.data, invoiceById],
  );

  const salesInvoices = useMemo(() => invoices.data.filter((inv: any) => inv.sales_order), [invoices.data]);
  const unpaidSalesInvoices = useMemo(
    () => salesInvoices.filter((i: any) => Number(i.balance ?? (i.total - i.amount_paid)) > 0),
    [salesInvoices],
  );

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => salesPayments.filter((p: any) => {
    if (search) {
      const q = search.toLowerCase();
      const so = invoiceById.get(p.invoice)?.sales_order_number || '';
      if (!(p.invoice_number || '').toLowerCase().includes(q) && !(p.customer_name || '').toLowerCase().includes(q) && !so.toLowerCase().includes(q)) return false;
    }
    if (methodFilter && p.method !== methodFilter) return false;
    const d = (p.paid_at || '').slice(0, 10);
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  }), [salesPayments, invoiceById, search, methodFilter, dateFrom, dateTo]);

  const [showModal, setShowModal] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);
  const [pF, setPF] = useState({ ...defP });

  const close = () => { setShowModal(false); setPF({ ...defP }); };
  const refreshAll = () => { payments.reload(); invoices.reload(); };

  const onInvoicePick = (invoiceId: string) => {
    const inv = invoiceById.get(Number(invoiceId));
    const balance = inv ? Number(inv.balance ?? (inv.total - inv.amount_paid)) : 0;
    setPF(f => ({ ...f, invoice: invoiceId, amount: balance > 0 ? String(balance) : f.amount }));
  };

  const savePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pF.invoice) { toast.error('Please select an invoice.'); return; }
    if (!pF.amount || Number(pF.amount) <= 0) { toast.error('Amount must be greater than 0.'); return; }
    try {
      await payments.create({
        invoice: Number(pF.invoice), amount: Number(pF.amount), method: pF.method,
        paid_at: pF.paid_at ? new Date(pF.paid_at).toISOString() : new Date().toISOString(),
        reference: pF.reference, notes: pF.notes,
      } as any);
      toast.success('Payment recorded — invoice status updated automatically');
      close();
      refreshAll();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await payments.remove(delId!); toast.success('Deleted — invoice status recalculated'); setDelId(null); refreshAll(); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('invoicing/payments/export-csv/?invoice__sales_order__isnull=false', `sales-payments-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'invoice_number', label: 'Invoice', render: (r: any) => r.invoice_number || r.invoice || '—' },
    { key: 'sales_order_number', label: 'Sales Order', render: (r: any) => invoiceById.get(r.invoice)?.sales_order_number || '—' },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'amount', label: 'Amount', render: (r: any) => fmtINR(r.amount) },
    { key: 'method', label: 'Method', render: (r: any) => PAYMENT_METHODS.find(m => m.key === r.method)?.label || r.method || '—' },
    { key: 'paid_at', label: 'Date', render: (r: any) => r.paid_at ? new Date(r.paid_at).toLocaleDateString('en-IN') : '—' },
    { key: 'reference', label: 'Reference', render: (r: any) => r.reference || '—' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Search</label>
          <input type="text" placeholder="Customer, invoice # or SO #…" value={search} onChange={e => setSearch(e.target.value)} style={inp} />
        </div>
        <div style={{ minWidth: 160 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Method</label>
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} style={inp}>
            <option value="">All Methods</option>
            {PAYMENT_METHODS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inp} />
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inp} />
        </div>
        <button onClick={exportCSV} disabled={filtered.length === 0}
          style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: filtered.length === 0 ? 'not-allowed' : 'pointer', color: '#1A1A1A', whiteSpace: 'nowrap' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: OG }} />Export CSV
        </button>
      </div>

      <ERPTable title="Sales Payments" columns={cols} data={filtered} loading={payments.loading || invoices.loading} error={payments.error} isAdmin={isAdmin}
        onAdd={() => { setPF({ ...defP, paid_at: today() }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Record Payment</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={savePayment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Sales Invoice</label><select value={pF.invoice} onChange={e => onInvoicePick(e.target.value)} style={inp}>
                <option value="">— Select invoice —</option>
                {unpaidSalesInvoices.map((i: any) => <option key={i.id} value={i.id}>{i.number} ({i.sales_order_number}) — {i.customer_name} ({fmtINR(i.balance)} due)</option>)}
              </select></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Amount *</label><input type="number" value={pF.amount} onChange={e => setPF(f => ({ ...f, amount: e.target.value }))} style={inp} required step="0.01" min="0.01" /></div>
                <div><label style={lbl}>Payment Method</label><select value={pF.method} onChange={e => setPF(f => ({ ...f, method: e.target.value }))} style={inp}>
                  {PAYMENT_METHODS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                </select></div>
              </div>
              <div><label style={lbl}>Payment Date</label><input type="date" value={pF.paid_at} onChange={e => setPF(f => ({ ...f, paid_at: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Reference Number</label><input value={pF.reference} onChange={e => setPF(f => ({ ...f, reference: e.target.value }))} style={inp} placeholder="Transaction ID, cheque number…" /></div>
              <div><label style={lbl}>Notes</label><textarea value={pF.notes} onChange={e => setPF(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 70 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
