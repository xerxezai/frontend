import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, useFmtCurrency, today, ASSET_STATUS, ASSET_CATEGORY, StatusBadge, DelDlg } from './assetsShared';
import AssetForm from './AssetForm';

export default function AssetList() {
  const isAdmin = isSuperUser();
  const navigate = useNavigate();
  const fmtINR = useFmtCurrency();
  const assets = useERPList<any>('asset-management/assets/');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.data.filter((a: any) => {
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (!q) return true;
      return [a.name, a.asset_code, a.location].some((v: any) => (v || '').toLowerCase().includes(q));
    });
  }, [assets.data, search, categoryFilter, statusFilter]);

  const confirmDel = async () => {
    try { await assets.remove(delId!); toast.success('Asset deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('asset-management/assets/export-csv/', `assets-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'asset_code', label: 'Code', width: 90 },
    { key: 'name', label: 'Name', width: 160, render: (r: any) => <span onClick={() => navigate(`/erp/assets/${r.id}`)} style={{ cursor: 'pointer', color: '#C9883A', fontWeight: 700 }}>{r.name}</span> },
    { key: 'category', label: 'Category', render: (r: any) => ASSET_CATEGORY[r.category]?.label ?? r.category },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={ASSET_STATUS} /> },
    { key: 'location', label: 'Location' },
    { key: 'assigned_to_name', label: 'Assigned To', render: (r: any) => r.assigned_to_name || '—' },
    { key: 'last_maintenance', label: 'Last Maint.', render: (r: any) => r.last_maintenance || '—' },
    {
      key: 'next_maintenance', label: 'Next Maint.',
      render: (r: any) => r.next_maintenance ? (
        <span style={{ color: r.maintenance_overdue ? '#ef4444' : undefined, fontWeight: r.maintenance_overdue ? 700 : undefined }}>
          {r.maintenance_overdue && <i className="fas fa-exclamation-triangle" style={{ marginRight: 5 }} />}{r.next_maintenance}
        </span>
      ) : '—',
    },
    { key: 'current_value', label: 'Value', render: (r: any) => fmtINR(r.current_value ?? r.purchase_cost) },
    {
      key: 'quickActions', label: 'QR',
      render: (r: any) => (
        <button title="View QR" onClick={() => navigate(`/erp/assets/${r.id}`)}
          style={{ background: 'rgba(107,114,128,0.08)', color: '#374151', border: '1px solid rgba(107,114,128,0.22)', width: 28, height: 28, borderRadius: 6, cursor: 'pointer' }}>
          <i className="fas fa-qrcode" style={{ fontSize: 11 }} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code, name, location…" style={{ ...inp, width: 240, paddingLeft: 30 }} />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ ...inp, width: 150 }}>
            <option value="all">All Categories</option>
            {Object.entries(ASSET_CATEGORY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 150 }}>
            <option value="all">All Status</option>
            {Object.entries(ASSET_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Assets" columns={cols} data={filtered} loading={assets.loading} error={assets.error} isAdmin={isAdmin}
        onAdd={() => { setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && <AssetForm asset={editing} onClose={() => setShowModal(false)} onSaved={() => assets.reload()} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
