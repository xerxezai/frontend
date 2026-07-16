import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, erpUpload, useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency, today, EXPENSE_STATUS, StatusBadge } from './accountingShared';

const defExpense = { category: '', amount: '', date: today(), description: '', paid_by: '' };

export default function ExpensesPanel() {
  const isAdmin = isSuperUser();
  const expenses = useERPList<any>('accounting/expenses/');
  const fmtINR = useFmtCurrency();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);
  const [eF, setEF] = useState({ ...defExpense });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const categories = useMemo(() => Array.from(new Set(expenses.data.map((e: any) => e.category).filter(Boolean))), [expenses.data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses.data.filter((e: any) => {
      if (categoryFilter && e.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (!q) return true;
      return [e.expense_number, e.category, e.description, e.paid_by].some((v: any) => (v || '').toLowerCase().includes(q));
    });
  }, [expenses.data, search, categoryFilter, statusFilter]);

  const close = () => { setShowModal(false); setReceiptFile(null); };

  const saveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eF.category.trim()) { toast.error('Category is required.'); return; }
    if (!eF.amount || Number(eF.amount) <= 0) { toast.error('Amount must be greater than 0.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('category', eF.category);
      fd.append('amount', String(Number(eF.amount) || 0));
      fd.append('date', eF.date);
      fd.append('description', eF.description);
      fd.append('paid_by', eF.paid_by);
      if (receiptFile) fd.append('receipt_image', receiptFile);
      await erpUpload('accounting/expenses/', fd, 'POST');
      toast.success('Expense created');
      expenses.reload();
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const confirmDel = async () => {
    try { await expenses.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const setApproval = async (expense: any, status: 'approved' | 'rejected') => {
    setBusyId(expense.id);
    try {
      await erpFetch(`accounting/expenses/${expense.id}/approve/`, { method: 'PUT', body: JSON.stringify({ status }) });
      toast.success(`${expense.expense_number} ${status}`);
      expenses.reload();
    } catch (err: any) { toast.error(err.message || 'Could not update status'); }
    finally { setBusyId(null); }
  };

  const exportCSV = async () => {
    try { await erpDownload('accounting/expenses/export-csv/', `expenses-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'expense_number', label: 'Expense #' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount', render: (r: any) => fmtINR(r.amount) },
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description', render: (r: any) => r.description || '—' },
    { key: 'paid_by', label: 'Paid By', render: (r: any) => r.paid_by || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={EXPENSE_STATUS} /> },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => r.status === 'pending' ? (
        <div style={{ display: 'flex', gap: 5 }}>
          <button title="Approve" disabled={busyId === r.id} onClick={() => setApproval(r, 'approved')}
            style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
            <i className={`fas ${busyId === r.id ? 'fa-spinner fa-spin' : 'fa-check-circle'}`} style={{ fontSize: 10 }} />
          </button>
          <button title="Reject" disabled={busyId === r.id} onClick={() => setApproval(r, 'rejected')}
            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
            <i className="fas fa-times-circle" style={{ fontSize: 10 }} />
          </button>
        </div>
      ) : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expense #, category, notes…" style={{ ...inp, width: 240, paddingLeft: 30 }} />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ ...inp, width: 160 }}>
            <option value="">All Categories</option>
            {categories.map((c: any) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 140 }}>
            <option value="all">All Status</option>
            {Object.entries(EXPENSE_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Expenses" columns={cols} data={filtered} loading={expenses.loading} error={expenses.error} isAdmin={isAdmin}
        onAdd={() => { setEF({ ...defExpense }); setReceiptFile(null); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Add Expense</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveExpense} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Category *</label><input value={eF.category} onChange={e => setEF(f => ({ ...f, category: e.target.value }))} style={inp} placeholder="e.g. Travel, Office Supplies" required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Amount (₹) *</label><input type="number" value={eF.amount} onChange={e => setEF(f => ({ ...f, amount: e.target.value }))} style={inp} required step="0.01" min="0.01" /></div>
                <div><label style={lbl}>Date</label><input type="date" value={eF.date} onChange={e => setEF(f => ({ ...f, date: e.target.value }))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Description</label><textarea value={eF.description} onChange={e => setEF(f => ({ ...f, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
              <div><label style={lbl}>Paid By</label><input value={eF.paid_by} onChange={e => setEF(f => ({ ...f, paid_by: e.target.value }))} style={inp} placeholder="Name of payer" /></div>
              <div>
                <label style={lbl}>Receipt Image</label>
                <input type="file" accept="image/*" onChange={e => setReceiptFile(e.target.files?.[0] ?? null)} style={{ ...inp, padding: '6px 10px' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={close} style={CNCL}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
