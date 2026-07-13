import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, FF, inp, fmtINR, Q_STATUS, StatusBadge, DelDlg, today, nextNumber } from './salesShared';
import QuotationForm, { type QuotationFormValues } from './QuotationForm';
import { downloadQuotationPDF, exportQuotationsCSV } from './pdf';

const emptyForm = (number: string): QuotationFormValues => ({
  number, customer: '', issue_date: today(), status: 'draft', valid_until: '', notes: '', items: [],
});

export default function QuotationsPanel() {
  const isAdmin = isSuperUser();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fixed base path — create/update/remove append the row id directly to this path,
  // so it must never carry a query string (see useERPList's `${path}${id}/` construction).
  const quotations = useERPList<any>('sales/quotations/');

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return quotations.data.filter((r: any) => {
      if (s && !(String(r.number || '').toLowerCase().includes(s) || String(r.customer_name || '').toLowerCase().includes(s))) return false;
      if (status && r.status !== status) return false;
      if (dateFrom && (!r.issue_date || r.issue_date < dateFrom)) return false;
      if (dateTo && (!r.issue_date || r.issue_date > dateTo)) return false;
      return true;
    });
  }, [quotations.data, search, status, dateFrom, dateTo]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [converting, setConverting] = useState<number | null>(null);

  const close = () => { setShowModal(false); setEditing(null); };

  const handleSave = async (f: QuotationFormValues) => {
    const body: any = {
      number: f.number.trim(), issue_date: f.issue_date, customer: Number(f.customer),
      status: f.status, valid_until: f.valid_until || null, notes: f.notes,
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
      if (editing) { await quotations.update(editing.id, body); toast.success('Quotation updated'); }
      else { await quotations.create(body); toast.success('Quotation created'); }
      close();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      await quotations.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (e: any) { toast.error(e.message || 'Delete failed'); }
  };

  const convertToOrder = async (id: number) => {
    setConverting(id);
    try {
      const res = await erpFetch(`sales/quotations/${id}/convert/`, { method: 'POST' });
      toast.success(`Converted to order ${res.number}`);
      quotations.reload();
    } catch (e: any) {
      toast.error(e.message || 'Conversion failed');
    } finally {
      setConverting(null);
    }
  };

  const cols = [
    { key: 'number', label: 'Number', render: (r: any) => r.number || r.id },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'issue_date', label: 'Issued', render: (r: any) => r.issue_date || '—' },
    { key: 'valid_until', label: 'Valid Until', render: (r: any) => r.valid_until || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge val={r.status} map={Q_STATUS} /> },
    { key: 'total', label: 'Total', render: (r: any) => fmtINR(r.total) },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => (
        <div style={{ display: 'flex', gap: 5 }}>
          <button title="Download PDF" onClick={() => downloadQuotationPDF(r)}
            style={{ background:'rgba(59,130,246,0.08)',color:'#1d4ed8',border:'1px solid rgba(59,130,246,0.22)',width:28,height:28,borderRadius:6,cursor:'pointer' }}>
            <i className="fas fa-file-pdf" style={{ fontSize: 10 }} />
          </button>
          {isAdmin && (
            <button title="Convert to Sales Order" disabled={converting === r.id}
              onClick={() => convertToOrder(r.id)}
              style={{ background:'rgba(16,185,129,0.08)',color:'#059669',border:'1px solid rgba(16,185,129,0.22)',width:28,height:28,borderRadius:6,cursor: converting === r.id ? 'wait' : 'pointer' }}>
              <i className={`fas ${converting === r.id ? 'fa-spinner fa-spin' : 'fa-right-left'}`} style={{ fontSize: 10 }} />
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
          <input type="text" placeholder="Customer name or quotation number…" value={search} onChange={e => setSearch(e.target.value)} style={inp} />
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={inp}>
            <option value="">All Statuses</option>
            {Object.entries(Q_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
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
        <button onClick={() => exportQuotationsCSV(filtered)} disabled={filtered.length === 0}
          style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: filtered.length === 0 ? 'not-allowed' : 'pointer', color: '#1A1A1A', whiteSpace: 'nowrap' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: OG }} />Export CSV
        </button>
      </div>

      <ERPTable title="Quotations" columns={cols} data={filtered} loading={quotations.loading} error={quotations.error} isAdmin={isAdmin}
        onAdd={() => { setEditing(null); setShowModal(true); }}
        onEdit={r => {
          setEditing(r);
          setShowModal(true);
        }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <QuotationForm
          editing={!!editing}
          initial={editing
            ? {
                number: editing.number || '', customer: String(editing.customer || ''), issue_date: editing.issue_date || today(),
                status: editing.status || 'draft', valid_until: editing.valid_until || '', notes: editing.notes || '',
                items: (editing.items || []).map((it: any) => ({ product: it.product ? String(it.product) : '', description: it.description || '', quantity: String(it.quantity), unit_price: String(it.unit_price) })),
              }
            : emptyForm(nextNumber('QT', quotations.data))}
          onClose={close}
          onSave={handleSave}
        />
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
