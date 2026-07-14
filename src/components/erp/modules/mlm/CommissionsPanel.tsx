import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, fmtINR, today, COMMISSION_STATUS, StatusBadge } from './mlmShared';

export default function CommissionsPanel() {
  const isAdmin = isSuperUser();
  const commissions = useERPList<any>('mlm/commissions/');
  const distributors = useERPList<any>('mlm/distributors/');

  const [search, setSearch] = useState('');
  const [distributorFilter, setDistributorFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return commissions.data.filter((c: any) => {
      if (distributorFilter !== 'all' && String(c.distributor) !== distributorFilter) return false;
      if (levelFilter !== 'all' && String(c.level) !== levelFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      const date = (c.created_date || '').slice(0, 10);
      if (dateFrom && date < dateFrom) return false;
      if (dateTo && date > dateTo) return false;
      if (!q) return true;
      return [c.distributor_name, c.order_number].some((v: any) => (v || '').toLowerCase().includes(q));
    });
  }, [commissions.data, search, distributorFilter, levelFilter, statusFilter, dateFrom, dateTo]);

  const pendingIds = useMemo(() => filtered.filter((c: any) => c.status === 'pending').map((c: any) => c.id), [filtered]);

  const markPaid = async (ids: number[]) => {
    if (ids.length === 0) return;
    try {
      await erpFetch('mlm/commissions/bulk-approve/', { method: 'POST', body: JSON.stringify({ ids }) });
      toast.success(ids.length > 1 ? `${ids.length} commissions marked paid` : 'Commission marked paid');
      commissions.reload();
    } catch (err: any) { toast.error(err.message || 'Could not mark paid'); }
  };

  const bulkApprove = async () => {
    setBulkBusy(true);
    try { await markPaid(pendingIds); } finally { setBulkBusy(false); }
  };

  const markOne = async (id: number) => {
    setBusyId(id);
    try { await markPaid([id]); } finally { setBusyId(null); }
  };

  const exportCSV = async () => {
    try { await erpDownload('mlm/commissions/export-csv/', `commissions-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'id', label: 'Commission ID', render: (r: any) => `#${r.id}` },
    { key: 'distributor_name', label: 'Distributor', render: (r: any) => r.distributor_name || '—' },
    { key: 'order_number', label: 'Order', render: (r: any) => r.order_number || '—' },
    { key: 'level', label: 'Level', render: (r: any) => `Level ${r.level}` },
    { key: 'rate', label: 'Rate', render: (r: any) => `${r.rate}%` },
    { key: 'amount', label: 'Amount', render: (r: any) => fmtINR(r.amount) },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={COMMISSION_STATUS} /> },
    { key: 'created_date', label: 'Date', render: (r: any) => r.created_date ? new Date(r.created_date).toLocaleDateString() : '—' },
    {
      key: 'quickActions', label: 'Actions',
      render: (r: any) => r.status === 'pending' ? (
        <button title="Mark Paid" disabled={busyId === r.id} onClick={() => markOne(r.id)}
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search distributor or order…" style={{ ...inp, width: 210, paddingLeft: 30 }} />
          </div>
          <select value={distributorFilter} onChange={e => setDistributorFilter(e.target.value)} style={{ ...inp, width: 160 }}>
            <option value="all">All Distributors</option>
            {distributors.data.map((d: any) => <option key={d.id} value={d.id}>{d.distributor_id} — {d.name}</option>)}
          </select>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={{ ...inp, width: 120 }}>
            <option value="all">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 130 }}>
            <option value="all">All Status</option>
            {Object.entries(COMMISSION_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...inp, width: 140 }} title="From date" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...inp, width: 140 }} title="To date" />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin && pendingIds.length > 0 && (
            <button onClick={bulkApprove} disabled={bulkBusy} style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: bulkBusy ? 'wait' : 'pointer', color: '#059669' }}>
              <i className={`fas ${bulkBusy ? 'fa-spinner fa-spin' : 'fa-check-double'}`} style={{ marginRight: 6 }} />Bulk Approve ({pendingIds.length})
            </button>
          )}
          <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
            <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
          </button>
        </div>
      </div>

      <ERPTable title="Commissions" columns={cols} data={filtered} loading={commissions.loading || distributors.loading} error={commissions.error} isAdmin={isAdmin} />
    </div>
  );
}
