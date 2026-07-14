import { useState } from 'react';
import { toast } from 'react-toastify';
import { useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, fmtINR, PAYMENT_METHODS, today } from './invoicingShared';

const defP = { invoice: '', amount: '', method: 'cash', paid_at: '', reference: '', notes: '' };

export default function PaymentsPanel() {
  const isAdmin = isSuperUser();
  const payments = useERPList<any>('invoicing/payments/');
  const invoices = useERPList<any>('invoicing/invoices/');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [pF, setPF] = useState({ ...defP });

  const close = () => { setShowModal(false); setEditing(null); };

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
      invoices.reload();
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      await payments.remove(delId!);
      toast.success('Deleted — invoice status recalculated'); setDelId(null);
      invoices.reload();
    } catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const cols = [
    { key: 'invoice_number', label: 'Invoice', render: (r: any) => r.invoice_number || r.invoice || '—' },
    { key: 'amount', label: 'Amount', render: (r: any) => fmtINR(r.amount) },
    { key: 'method', label: 'Method', render: (r: any) => PAYMENT_METHODS.find(m => m.key === r.method)?.label || r.method || '—' },
    { key: 'paid_at', label: 'Date', render: (r: any) => r.paid_at ? new Date(r.paid_at).toLocaleDateString('en-IN') : '—' },
    { key: 'reference', label: 'Reference', render: (r: any) => r.reference || '—' },
  ];

  return (
    <div>
      <ERPTable title="Payments" columns={cols} data={payments.data} loading={payments.loading} error={payments.error} isAdmin={isAdmin}
        onAdd={() => { setPF({ ...defP, paid_at: today() }); setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setPF({ invoice: String(r.invoice || ''), amount: String(r.amount || ''), method: r.method || 'cash', paid_at: r.paid_at ? r.paid_at.slice(0, 10) : today(), reference: r.reference || '', notes: r.notes || '' }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Payment' : 'Add Payment'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={savePayment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Invoice</label><select value={pF.invoice} onChange={e => setPF(f => ({ ...f, invoice: e.target.value }))} style={inp}>
                <option value="">— Select invoice —</option>
                {invoices.data.map((i: any) => <option key={i.id} value={i.id}>{i.number} — {i.customer_name} ({fmtINR(i.balance)} due)</option>)}
              </select></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Amount *</label><input type="number" value={pF.amount} onChange={e => setPF(f => ({ ...f, amount: e.target.value }))} style={inp} required step="0.01" min="0.01" /></div>
                <div><label style={lbl}>Payment Method</label><select value={pF.method} onChange={e => setPF(f => ({ ...f, method: e.target.value }))} style={inp}>
                  {PAYMENT_METHODS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                </select></div>
              </div>
              <div><label style={lbl}>Payment Date</label><input type="date" value={pF.paid_at} onChange={e => setPF(f => ({ ...f, paid_at: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Reference</label><input value={pF.reference} onChange={e => setPF(f => ({ ...f, reference: e.target.value }))} style={inp} placeholder="Transaction ID, cheque number…" /></div>
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
