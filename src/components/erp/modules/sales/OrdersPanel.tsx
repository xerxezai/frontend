import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { inp, lbl, SAVE, CNCL, fmtINR, O_STATUS, DelDlg, today, nextNumber } from './salesShared';

const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:480,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };

const defO = { number: '', customer: '', order_date: '', status: 'open', salesperson: '', notes: '' };

export default function OrdersPanel() {
  const isAdmin = isSuperUser();
  const orders = useERPList<any>('sales/orders/');
  const customers = useERPList<any>('crm/customers/');
  const salespeople = useERPList<any>('sales/orders/salespeople/');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [oF, setOF] = useState({ ...defO });
  const [savingStatus, setSavingStatus] = useState<number | null>(null);

  const close = () => { setShowModal(false); setEditing(null); };

  const saveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oF.number.trim())  { toast.error('Order number is required.'); return; }
    if (!oF.order_date)     { toast.error('Order date is required.'); return; }
    if (!oF.customer)       { toast.error('Please select a customer.'); return; }
    try {
      const body: any = {
        number: oF.number.trim(), order_date: oF.order_date, customer: Number(oF.customer),
        status: oF.status, salesperson: oF.salesperson ? Number(oF.salesperson) : null, notes: oF.notes,
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

  const changeSalesperson = async (id: number, salespersonId: string) => {
    try {
      await orders.update(id, { salesperson: salespersonId ? Number(salespersonId) : null });
      toast.success('Salesperson assigned');
    } catch (e: any) {
      toast.error(e.message || 'Could not assign salesperson');
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
        <select value={r.salesperson ?? ''} onChange={e => changeSalesperson(r.id, e.target.value)}
          style={{ border: '1px solid rgba(0,0,0,0.10)', borderRadius: 6, padding: '3px 6px', background: '#fafaf8', fontFamily: "'DM Sans',sans-serif", fontSize: 11.5 }}>
          <option value="">— Unassigned —</option>
          {salespeople.data.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      ) : (r.salesperson_name || '—'),
    },
    { key: 'invoice_number', label: 'Invoice', render: (r: any) => r.invoice_number || '—' },
    { key: 'total', label: 'Total', render: (r: any) => fmtINR(r.total) },
  ];

  return (
    <div>
      <ERPTable title="Sales Orders" columns={cols} data={orders.data} loading={orders.loading} error={orders.error} isAdmin={isAdmin}
        onAdd={() => { setOF({ ...defO, number: nextNumber('SO', orders.data), order_date: today() }); setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setOF({ number: r.number || '', customer: String(r.customer || ''), order_date: r.order_date || '', status: r.status || 'open', salesperson: r.salesperson ? String(r.salesperson) : '', notes: r.notes || '' }); setShowModal(true); }}
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
              <div><label style={lbl}>Assign Salesperson</label><select value={oF.salesperson} onChange={e => setOF(f => ({ ...f, salesperson: e.target.value }))} style={inp}>
                <option value="">— Unassigned —</option>
                {salespeople.data.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select></div>
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
