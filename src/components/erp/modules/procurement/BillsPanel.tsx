import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency, today, plusDays, BILL_STATUS, BillStatusBadge } from './procurementShared';

const defBill = { supplier: '', purchase_order: '', issue_date: today(), due_date: plusDays(30), amount: '', notes: '' };

export default function BillsPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const bills = useERPList<any>('procurement/bills/');
  const suppliers = useERPList<any>('procurement/suppliers/');
  const purchaseOrders = useERPList<any>('procurement/purchase-orders/');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);
  const [bF, setBF] = useState({ ...defBill });
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bills.data.filter((b: any) => {
      const effectiveStatus = b.is_overdue ? 'overdue' : b.status;
      if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false;
      if (!q) return true;
      return [b.bill_number, b.supplier_name, b.po_number].some((v: any) => (v || '').toLowerCase().includes(q));
    });
  }, [bills.data, search, statusFilter]);

  const close = () => setShowModal(false);

  const saveBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bF.supplier) { toast.error('Please select a supplier.'); return; }
    if (!bF.amount || Number(bF.amount) <= 0) { toast.error('Amount must be greater than 0.'); return; }
    try {
      const body: any = {
        supplier: Number(bF.supplier), issue_date: bF.issue_date, due_date: bF.due_date,
        amount: Number(bF.amount), notes: bF.notes,
      };
      if (bF.purchase_order) body.purchase_order = Number(bF.purchase_order);
      await bills.create(body);
      toast.success('Bill created');
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await bills.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const markPaid = async (bill: any) => {
    setBusyId(bill.id);
    try { await erpFetch(`procurement/bills/${bill.id}/mark-paid/`, { method: 'PUT' }); toast.success(`${bill.bill_number} marked as paid`); bills.reload(); }
    catch (err: any) { toast.error(err.message || 'Could not mark as paid'); }
    finally { setBusyId(null); }
  };

  const exportCSV = async () => {
    try { await erpDownload('procurement/bills/export-csv/', `bills-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'bill_number', label: 'Bill Number' },
    { key: 'supplier_name', label: 'Supplier', render: (r: any) => r.supplier_name || '—' },
    { key: 'po_number', label: 'PO Number', render: (r: any) => r.po_number || '—' },
    { key: 'issue_date', label: 'Issue Date' },
    { key: 'due_date', label: 'Due Date' },
    { key: 'amount', label: 'Amount', render: (r: any) => fmtINR(r.amount) },
    { key: 'status', label: 'Status', render: (r: any) => <BillStatusBadge status={r.status} isOverdue={r.is_overdue} /> },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => r.status !== 'paid' ? (
        <button title="Mark as Paid" disabled={busyId === r.id} onClick={() => markPaid(r)}
          style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
          <i className={`fas ${busyId === r.id ? 'fa-spinner fa-spin' : 'fa-check-circle'}`} style={{ fontSize: 10 }} />
        </button>
      ) : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bill #, supplier, PO…" style={{ ...inp, width: 220, paddingLeft: 30 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 140 }}>
            <option value="all">All Status</option>
            {Object.entries(BILL_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Bills" columns={cols} data={filtered} loading={bills.loading} error={bills.error} isAdmin={isAdmin}
        onAdd={() => { setBF({ ...defBill }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Add Bill</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveBill} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Supplier *</label>
                <select value={bF.supplier} onChange={e => setBF(f => ({ ...f, supplier: e.target.value }))} style={inp} required>
                  <option value="">— Select supplier —</option>
                  {suppliers.data.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Purchase Order</label>
                <select value={bF.purchase_order} onChange={e => setBF(f => ({ ...f, purchase_order: e.target.value }))} style={inp}>
                  <option value="">— None —</option>
                  {purchaseOrders.data.filter((p: any) => !bF.supplier || String(p.supplier) === bF.supplier).map((p: any) => (
                    <option key={p.id} value={p.id}>{p.po_number} ({fmtINR(p.total)})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Issue Date</label><input type="date" value={bF.issue_date} onChange={e => setBF(f => ({ ...f, issue_date: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Due Date</label><input type="date" value={bF.due_date} onChange={e => setBF(f => ({ ...f, due_date: e.target.value }))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Amount (₹) *</label><input type="number" value={bF.amount} onChange={e => setBF(f => ({ ...f, amount: e.target.value }))} style={inp} required step="0.01" min="0.01" /></div>
              <div><label style={lbl}>Notes</label><textarea value={bF.notes} onChange={e => setBF(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
