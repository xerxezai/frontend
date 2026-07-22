import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import ERPTable from '../../ERPTable';
import { OG, FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency, today } from './invoicingShared';

const FREQ_LABEL: Record<string, string> = { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly' };

const defR = { customer: '', description: '', amount: '', frequency: 'monthly', next_due_date: today(), status: 'active', notes: '' };

export default function RecurringInvoicesPanel() {
  const { canWrite } = useAccess();
  const isAdmin = canWrite('accounting');
  const fmtINR = useFmtCurrency();
  const recurring = useERPList<any>('invoicing/recurring-invoices/');
  const customers = useERPList<any>('crm/customers/');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [rF, setRF] = useState({ ...defR });
  const [busyId, setBusyId] = useState<number | null>(null);

  const close = () => { setShowModal(false); setEditing(null); };

  const saveRecurring = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rF.customer) { toast.error('Please select a customer.'); return; }
    if (!rF.amount || Number(rF.amount) <= 0) { toast.error('Amount must be greater than 0.'); return; }
    try {
      const body: any = { customer: Number(rF.customer), description: rF.description, amount: Number(rF.amount), frequency: rF.frequency, next_due_date: rF.next_due_date, status: rF.status, notes: rF.notes };
      if (editing) { await recurring.update(editing.id, body); toast.success('Recurring invoice updated'); }
      else { await recurring.create(body); toast.success('Recurring invoice created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await recurring.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const toggleStatus = async (id: number) => {
    setBusyId(id);
    try {
      const res = await erpFetch(`invoicing/recurring-invoices/${id}/toggle-status/`, { method: 'POST' });
      toast.success(res.status === 'paused' ? 'Paused' : 'Resumed');
      recurring.reload();
    } catch (err: any) { toast.error(err.message || 'Could not update status'); }
    finally { setBusyId(null); }
  };

  const generateNow = async (id: number) => {
    setBusyId(id);
    try {
      const res = await erpFetch(`invoicing/recurring-invoices/${id}/generate-now/`, { method: 'POST' });
      toast.success(`Generated invoice ${res.invoice.number}`);
      recurring.reload();
    } catch (err: any) { toast.error(err.message || 'Could not generate invoice'); }
    finally { setBusyId(null); }
  };

  const cols = [
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'description', label: 'Description', render: (r: any) => r.description || '—' },
    { key: 'amount', label: 'Amount', render: (r: any) => fmtINR(r.amount) },
    { key: 'frequency', label: 'Frequency', render: (r: any) => FREQ_LABEL[r.frequency] || r.frequency },
    { key: 'next_due_date', label: 'Next Due', render: (r: any) => r.next_due_date || '—' },
    {
      key: 'status', label: 'Status', render: (r: any) => (
        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: FF, background: r.status === 'active' ? '#d1fae5' : '#f1f5f9', color: r.status === 'active' ? '#065f46' : '#64748b' }}>
          {r.status === 'active' ? 'Active' : 'Paused'}
        </span>
      ),
    },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => (
        <div style={{ display: 'flex', gap: 5 }}>
          <button title="Generate Invoice Now" disabled={busyId === r.id} onClick={() => generateNow(r.id)}
            style={{ background: 'rgba(201,136,58,0.08)', color: OG, border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
            <i className={`fas ${busyId === r.id ? 'fa-spinner fa-spin' : 'fa-bolt'}`} style={{ fontSize: 10 }} />
          </button>
          <button title={r.status === 'active' ? 'Pause' : 'Resume'} disabled={busyId === r.id} onClick={() => toggleStatus(r.id)}
            style={{ background: 'rgba(107,114,128,0.08)', color: '#374151', border: '1px solid rgba(107,114,128,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
            <i className={`fas ${r.status === 'active' ? 'fa-pause' : 'fa-play'}`} style={{ fontSize: 10 }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <p style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', marginBottom: 14 }}>
        Due templates generate a real draft invoice automatically whenever this tab is opened (no background scheduler exists in this deployment) — use <i className="fas fa-bolt" style={{ color: OG }} /> to generate one immediately regardless of its due date.
      </p>

      <ERPTable title="Recurring Invoices" columns={cols} data={recurring.data} loading={recurring.loading} error={recurring.error} isAdmin={isAdmin}
        onAdd={() => { setRF({ ...defR }); setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setRF({ customer: String(r.customer || ''), description: r.description || '', amount: String(r.amount || ''), frequency: r.frequency || 'monthly', next_due_date: r.next_due_date || today(), status: r.status || 'active', notes: r.notes || '' }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Recurring Invoice' : 'Add Recurring Invoice'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveRecurring} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Customer</label><select value={rF.customer} onChange={e => setRF(f => ({ ...f, customer: e.target.value }))} style={inp}>
                <option value="">— Select customer —</option>
                {customers.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
              <div><label style={lbl}>Description</label><input value={rF.description} onChange={e => setRF(f => ({ ...f, description: e.target.value }))} style={inp} placeholder="e.g. Monthly retainer" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Amount (₹, pre-tax) *</label><input type="number" value={rF.amount} onChange={e => setRF(f => ({ ...f, amount: e.target.value }))} style={inp} required step="0.01" min="0.01" /></div>
                <div><label style={lbl}>Frequency</label><select value={rF.frequency} onChange={e => setRF(f => ({ ...f, frequency: e.target.value }))} style={inp}>
                  <option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option>
                </select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Next Due Date</label><input type="date" value={rF.next_due_date} onChange={e => setRF(f => ({ ...f, next_due_date: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Status</label><select value={rF.status} onChange={e => setRF(f => ({ ...f, status: e.target.value }))} style={inp}>
                  <option value="active">Active</option><option value="paused">Paused</option>
                </select></div>
              </div>
              <div><label style={lbl}>Notes</label><textarea value={rF.notes} onChange={e => setRF(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 70 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
