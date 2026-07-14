import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, erpDownload, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, FF, inp, fmtINR, StatusBadge, DelDlg, today, plusDays, nextNumber } from './invoicingShared';
import InvoiceForm, { type InvoiceFormValues } from './InvoiceForm';
import { downloadInvoicePDF } from './pdf';

const emptyForm = (number: string): InvoiceFormValues => ({
  number, customer: '', issue_date: today(), due_date: plusDays(30), status: 'draft', notes: '', items: [],
});

export default function InvoicesPanel() {
  const isAdmin = isSuperUser();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const invoices = useERPList<any>('invoicing/invoices/');

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return invoices.data.filter((r: any) => {
      if (s && !(String(r.number || '').toLowerCase().includes(s) || String(r.customer_name || '').toLowerCase().includes(s))) return false;
      if (status && r.status !== status) return false;
      if (dateFrom && (!r.due_date || r.due_date < dateFrom)) return false;
      if (dateTo && (!r.due_date || r.due_date > dateTo)) return false;
      return true;
    });
  }, [invoices.data, search, status, dateFrom, dateTo]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [markingPaid, setMarkingPaid] = useState<number | null>(null);

  const close = () => { setShowModal(false); setEditing(null); };

  const handleSave = async (f: InvoiceFormValues) => {
    const body: any = {
      number: f.number.trim(), issue_date: f.issue_date, due_date: f.due_date, customer: Number(f.customer),
      status: f.status, notes: f.notes,
      items: f.items
        .filter(it => it.product || Number(it.quantity) > 0)
        .map(it => ({
          product: it.product ? Number(it.product) : null,
          description: it.description,
          quantity: it.quantity || '0',
          unit_price: it.unit_price || '0',
        })),
    };
    try {
      if (editing) { await invoices.update(editing.id, body); toast.success('Invoice updated'); }
      else { await invoices.create(body); toast.success('Invoice created'); }
      close();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      await invoices.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (e: any) { toast.error(e.message || 'Delete failed'); }
  };

  const markPaid = async (id: number) => {
    setMarkingPaid(id);
    try {
      await erpFetch(`invoicing/invoices/${id}/mark-paid/`, { method: 'POST' });
      toast.success('Marked as paid');
      invoices.reload();
    } catch (e: any) {
      toast.error(e.message || 'Could not mark as paid');
    } finally {
      setMarkingPaid(null);
    }
  };

  const exportCSV = async () => {
    try { await erpDownload('invoicing/invoices/export-csv/', `invoices-${new Date().toISOString().slice(0, 10)}.csv`); }
    catch (e: any) { toast.error(e.message || 'Export failed'); }
  };

  const cols = [
    { key: 'number', label: 'Number', render: (r: any) => r.number || r.id },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'issue_date', label: 'Issue Date', render: (r: any) => r.issue_date || '—' },
    { key: 'due_date', label: 'Due Date', render: (r: any) => r.due_date || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} isOverdue={r.is_overdue} /> },
    { key: 'total', label: 'Total', render: (r: any) => fmtINR(r.total) },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => (
        <div style={{ display: 'flex', gap: 5 }}>
          <button title="Download PDF" onClick={() => downloadInvoicePDF(r)}
            style={{ background:'rgba(59,130,246,0.08)',color:'#1d4ed8',border:'1px solid rgba(59,130,246,0.22)',width:28,height:28,borderRadius:6,cursor:'pointer' }}>
            <i className="fas fa-file-pdf" style={{ fontSize: 10 }} />
          </button>
          {isAdmin && r.status !== 'paid' && r.status !== 'cancelled' && (
            <button title="Mark as Paid" disabled={markingPaid === r.id}
              onClick={() => markPaid(r.id)}
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
      {/* toolbar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Search</label>
          <input type="text" placeholder="Customer name or invoice number…" value={search} onChange={e => setSearch(e.target.value)} style={inp} />
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

      <ERPTable title="Invoices" columns={cols} data={filtered} loading={invoices.loading} error={invoices.error} isAdmin={isAdmin}
        onAdd={() => { setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <InvoiceForm
          editing={!!editing}
          initial={editing
            ? {
                number: editing.number || '', customer: String(editing.customer || ''), issue_date: editing.issue_date || today(),
                due_date: editing.due_date || plusDays(30), status: editing.status || 'draft', notes: editing.notes || '',
                items: (editing.items || []).map((it: any) => ({ product: it.product ? String(it.product) : '', description: it.description || '', quantity: String(it.quantity), unit_price: String(it.unit_price) })),
              }
            : emptyForm(nextNumber('INV', invoices.data))}
          onClose={close}
          onSave={handleSave}
        />
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
