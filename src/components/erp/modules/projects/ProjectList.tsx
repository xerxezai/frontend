import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, useFmtCurrency, today, PROJECT_STATUS, PRIORITY_BADGE, StatusBadge, ProgressBar, DelDlg } from './projectsShared';
import ProjectForm from './ProjectForm';

export default function ProjectList() {
  const isAdmin = isSuperUser();
  const navigate = useNavigate();
  const fmtINR = useFmtCurrency();
  const projects = useERPList<any>('project-management/projects/');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.data.filter((p: any) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (!q) return true;
      return [p.name, p.project_code, p.client].some((v: any) => (v || '').toLowerCase().includes(q));
    });
  }, [projects.data, search, statusFilter]);

  const confirmDel = async () => {
    try { await projects.remove(delId!); toast.success('Project deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('project-management/projects/export-csv/', `projects-${today()}.csv`); }
    catch { toast.error('Export not available'); }
  };

  const cols = [
    { key: 'project_code', label: 'Code', width: 90 },
    { key: 'name', label: 'Name', width: 180, render: (r: any) => <span onClick={() => navigate(`/erp/projects/${r.id}`)} style={{ cursor: 'pointer', color: '#C9883A', fontWeight: 700 }}>{r.name}</span> },
    { key: 'client', label: 'Client' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={PROJECT_STATUS} /> },
    { key: 'priority', label: 'Priority', render: (r: any) => <StatusBadge status={r.priority} map={PRIORITY_BADGE} /> },
    { key: 'start_date', label: 'Start' },
    { key: 'end_date', label: 'End' },
    { key: 'budget', label: 'Budget', render: (r: any) => fmtINR(r.budget) },
    { key: 'progress', label: 'Progress', width: 110, render: (r: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1 }}><ProgressBar value={r.progress} height={6} /></div>
        <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#6B6B6B' }}>{r.progress}%</span>
      </div>
    ) },
    { key: 'manager_name', label: 'Manager', render: (r: any) => r.manager_name || '—' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code, name, client…" style={{ ...inp, width: 240, paddingLeft: 30 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 150 }}>
            <option value="all">All Status</option>
            {Object.entries(PROJECT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Projects" columns={cols} data={filtered} loading={projects.loading} error={projects.error} isAdmin={isAdmin}
        onAdd={() => { setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <ProjectForm project={editing} onClose={() => setShowModal(false)} onSaved={() => projects.reload()} />
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
