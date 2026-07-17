import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, today, SEVERITY_BADGE, INCIDENT_STATUS, StatusBadge, DelDlg } from './qhseShared';
import IncidentForm from './IncidentForm';

const TYPE_LABEL: Record<string, string> = {
  near_miss: 'Near Miss', first_aid: 'First Aid', medical_treatment: 'Medical Treatment', lost_time: 'Lost Time',
  fatality: 'Fatality', environmental: 'Environmental', property_damage: 'Property Damage', security: 'Security',
};

export default function IncidentList() {
  const isAdmin = isSuperUser();
  const incidents = useERPList<any>('qhse/incidents/');

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return incidents.data.filter((i: any) => {
      if (severityFilter !== 'all' && i.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (!q) return true;
      return [i.incident_number, i.title, i.location].some((v: any) => (v || '').toLowerCase().includes(q));
    });
  }, [incidents.data, search, severityFilter, statusFilter]);

  const confirmDel = async () => {
    try { await incidents.remove(delId!); toast.success('Incident deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('qhse/incidents/export-csv/', `incidents-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'incident_number', label: 'Number', width: 90 },
    { key: 'title', label: 'Title', width: 180 },
    { key: 'incident_type', label: 'Type', render: (r: any) => TYPE_LABEL[r.incident_type] ?? r.incident_type },
    { key: 'severity', label: 'Severity', render: (r: any) => <StatusBadge status={r.severity} map={SEVERITY_BADGE} /> },
    { key: 'date', label: 'Date' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={INCIDENT_STATUS} /> },
    { key: 'reported_by_name', label: 'Reported By', render: (r: any) => r.reported_by_name || '—' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search number, title, location…" style={{ ...inp, width: 250, paddingLeft: 30 }} />
          </div>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} style={{ ...inp, width: 140 }}>
            <option value="all">All Severity</option>
            {Object.entries(SEVERITY_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 160 }}>
            <option value="all">All Status</option>
            {Object.entries(INCIDENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Incidents" columns={cols} data={filtered} loading={incidents.loading} error={incidents.error} isAdmin={isAdmin}
        onAdd={() => { setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && <IncidentForm incident={editing} onClose={() => setShowModal(false)} onSaved={() => incidents.reload()} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
