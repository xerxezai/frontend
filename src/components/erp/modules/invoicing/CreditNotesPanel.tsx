import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency, nextNumber, today } from './invoicingShared';

const CN_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  issued:    { label: 'Issued',    bg: '#dbeafe', color: '#1d4ed8' },
  applied:   { label: 'Applied',   bg: '#d1fae5', color: '#065f46' },
  cancelled: { label: 'Cancelled', bg: '#fee2e2', color: '#991b1b' },
};

const defCN = { number: '', invoice: '', amount: '', reason: '', date: today() };

export default function CreditNotesPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const creditNotes = useERPList<any>('invoicing/credit-notes/');
  const invoices = useERPList<any>('invoicing/invoices/');

  const [showModal, setShowModal] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);
  const [cnF, setCnF] = useState({ ...defCN });
  const [applyingId, setApplyingId] = useState<number | null>(null);

  // Credit notes only make sense against an invoice that has something invoiced
  // (i.e. not draft/cancelled) — a customer can't be refunded on a bill that was never sent.
  const eligibleInvoices = useMemo(() => invoices.data.filter((i: any) => !['draft', 'cancelled'].includes(i.status)), [invoices.data]);

  const close = () => setShowModal(false);

  const saveCreditNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnF.invoice) { toast.error('Please select an invoice.'); return; }
    if (!cnF.amount || Number(cnF.amount) <= 0) { toast.error('Amount must be greater than 0.'); return; }
    try {
      await creditNotes.create({ number: cnF.number.trim(), invoice: Number(cnF.invoice), amount: Number(cnF.amount), reason: cnF.reason, date: cnF.date });
      toast.success('Credit note issued');
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await creditNotes.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const applyCreditNote = async (id: number) => {
    setApplyingId(id);
    try {
      await erpFetch(`invoicing/credit-notes/${id}/apply/`, { method: 'POST' });
      toast.success('Credit note applied — invoice balance reduced');
      creditNotes.reload();
      invoices.reload();
    } catch (err: any) {
      toast.error(err.message || 'Could not apply credit note');
    } finally {
      setApplyingId(null);
    }
  };

  const cols = [
    { key: 'number', label: 'Credit Note #', render: (r: any) => r.number || r.id },
    { key: 'invoice_number', label: 'Invoice', render: (r: any) => r.invoice_number || '—' },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'amount', label: 'Amount', render: (r: any) => fmtINR(r.amount) },
    { key: 'reason', label: 'Reason', render: (r: any) => r.reason || '—' },
    { key: 'date', label: 'Date', render: (r: any) => r.date || '—' },
    {
      key: 'status', label: 'Status', render: (r: any) => {
        const m = CN_STATUS[r.status] ?? { label: r.status, bg: '#f1f5f9', color: '#64748b' };
        return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF }}>{m.label}</span>;
      },
    },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => r.status === 'issued' ? (
        <button title="Apply to invoice" disabled={applyingId === r.id} onClick={() => applyCreditNote(r.id)}
          style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.22)', width: 28, height: 28, borderRadius: 6, cursor: applyingId === r.id ? 'wait' : 'pointer' }}>
          <i className={`fas ${applyingId === r.id ? 'fa-spinner fa-spin' : 'fa-check-circle'}`} style={{ fontSize: 10 }} />
        </button>
      ) : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>,
    },
  ];

  return (
    <div>
      <ERPTable title="Credit Notes" columns={cols} data={creditNotes.data} loading={creditNotes.loading} error={creditNotes.error} isAdmin={isAdmin}
        onAdd={() => { setCnF({ ...defCN, number: nextNumber('CN', creditNotes.data) }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Add Credit Note</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveCreditNote} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Credit Note Number</label><input value={cnF.number} onChange={e => setCnF(f => ({ ...f, number: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Invoice</label><select value={cnF.invoice} onChange={e => setCnF(f => ({ ...f, invoice: e.target.value }))} style={inp}>
                <option value="">— Select invoice —</option>
                {eligibleInvoices.map((i: any) => <option key={i.id} value={i.id}>{i.number} — {i.customer_name} ({fmtINR(i.total)})</option>)}
              </select></div>
              <div><label style={lbl}>Amount (₹) *</label><input type="number" value={cnF.amount} onChange={e => setCnF(f => ({ ...f, amount: e.target.value }))} style={inp} required step="0.01" min="0.01" /></div>
              <div><label style={lbl}>Reason</label><textarea value={cnF.reason} onChange={e => setCnF(f => ({ ...f, reason: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 70 }} placeholder="e.g. Damaged goods, billing correction…" /></div>
              <div><label style={lbl}>Date</label><input type="date" value={cnF.date} onChange={e => setCnF(f => ({ ...f, date: e.target.value }))} style={inp} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
