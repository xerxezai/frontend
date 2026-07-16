import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, erpDownload, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency, KpiCard, PAYMENT_METHODS, today } from './invoicingShared';

const defP = { invoice: '', amount: '', method: 'cash', paid_at: '', reference: '', notes: '' };

interface DashboardData {
  total_paid: string;
  total_paid_this_month: string;
  outstanding: string;
}

export default function PaymentsPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const payments = useERPList<any>('invoicing/payments/');
  const invoices = useERPList<any>('invoicing/invoices/');

  const [dash, setDash] = useState<DashboardData | null>(null);
  const loadDash = useCallback(() => {
    erpFetch('invoicing/dashboard/').then(setDash).catch(() => {});
  }, []);
  useEffect(() => { loadDash(); }, [loadDash]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [pF, setPF] = useState({ ...defP });

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const close = () => { setShowModal(false); setEditing(null); };
  const refreshAll = () => { payments.reload(); invoices.reload(); loadDash(); };

  // Only invoices with an outstanding balance make sense to record a payment against.
  const unpaidInvoices = useMemo(() => invoices.data.filter((i: any) => Number(i.balance ?? (i.total - i.amount_paid)) > 0), [invoices.data]);

  const filtered = useMemo(() => payments.data.filter((p: any) => {
    if (search) {
      const q = search.toLowerCase();
      if (!(p.invoice_number || '').toLowerCase().includes(q) && !(p.customer_name || '').toLowerCase().includes(q)) return false;
    }
    if (methodFilter && p.method !== methodFilter) return false;
    const d = (p.paid_at || '').slice(0, 10);
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  }), [payments.data, search, methodFilter, dateFrom, dateTo]);

  const onInvoicePick = (invoiceId: string) => {
    const inv = invoices.data.find((i: any) => String(i.id) === invoiceId);
    const balance = inv ? Number(inv.balance ?? (inv.total - inv.amount_paid)) : 0;
    setPF(f => ({ ...f, invoice: invoiceId, amount: balance > 0 ? String(balance) : f.amount }));
  };

  const savePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pF.invoice)  { toast.error('Please select an invoice.'); return; }
    if (!pF.amount || Number(pF.amount) <= 0) { toast.error('Amount must be greater than 0.'); return; }
    try {
      const body: any = {
        invoice: Number(pF.invoice), amount: Number(pF.amount), method: pF.method,
        paid_at: pF.paid_at ? new Date(pF.paid_at).toISOString() : new Date().toISOString(),
        reference: pF.reference, notes: pF.notes,
      };
      if (editing) { await payments.update(editing.id, body); toast.success('Payment updated'); }
      else { await payments.create(body); toast.success('Payment recorded — invoice status updated automatically'); }
      close();
      refreshAll();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      await payments.remove(delId!);
      toast.success('Deleted — invoice status recalculated'); setDelId(null);
      refreshAll();
    } catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('invoicing/payments/export-csv/', `payments-${new Date().toISOString().slice(0, 10)}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'invoice_number', label: 'Invoice', render: (r: any) => r.invoice_number || r.invoice || '—' },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'amount', label: 'Amount', render: (r: any) => fmtINR(r.amount) },
    { key: 'method', label: 'Method', render: (r: any) => PAYMENT_METHODS.find(m => m.key === r.method)?.label || r.method || '—' },
    { key: 'paid_at', label: 'Date', render: (r: any) => r.paid_at ? new Date(r.paid_at).toLocaleDateString('en-IN') : '—' },
    { key: 'reference', label: 'Reference', render: (r: any) => r.reference || '—' },
  ];

  return (
    <div>
      {dash && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
          <KpiCard icon="fas fa-calendar-days" label="This Month" value={fmtINR(dash.total_paid_this_month)} accent={OG} />
          <KpiCard icon="fas fa-infinity" label="All Time" value={fmtINR(dash.total_paid)} accent="#10b981" />
          <KpiCard icon="fas fa-hourglass-half" label="Pending" value={fmtINR(dash.outstanding)} accent="#f59e0b" />
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Search</label>
          <input type="text" placeholder="Customer name or invoice number…" value={search} onChange={e => setSearch(e.target.value)} style={inp} />
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

      <ERPTable title="Payments" columns={cols} data={filtered} loading={payments.loading} error={payments.error} isAdmin={isAdmin}
        onAdd={() => { setPF({ ...defP, paid_at: today() }); setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setPF({ invoice: String(r.invoice || ''), amount: String(r.amount || ''), method: r.method || 'cash', paid_at: r.paid_at ? r.paid_at.slice(0, 10) : today(), reference: r.reference || '', notes: r.notes || '' }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Payment' : 'Add Payment'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={savePayment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Invoice</label><select value={pF.invoice} onChange={e => onInvoicePick(e.target.value)} style={inp}>
                <option value="">— Select invoice —</option>
                {(editing ? invoices.data : unpaidInvoices).map((i: any) => <option key={i.id} value={i.id}>{i.number} — {i.customer_name} ({fmtINR(i.balance)} due)</option>)}
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
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
