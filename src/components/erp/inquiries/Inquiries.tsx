import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { inquiryApi, type Inquiry, type InquiryStats } from './inquiryApi';
import InquiryDetail from './InquiryDetail';
import { FF, OG, STATUS_BADGE, PRIORITY_BADGE, Badge } from './inquiryShared';

const SERVICES = [
  'AI-Powered ERP', 'DevSecOps Pipelines', 'Cloud Infrastructure', 'Software Development',
  'AI Training & Consulting', 'Become a Partner', 'Other',
];

const TH: React.CSSProperties = {
  fontSize: 10, letterSpacing: '0.6px', padding: '10px 10px',
  textTransform: 'uppercase', fontWeight: 700, color: '#6B6B6B',
  borderBottom: '1px solid rgba(0,0,0,0.07)', whiteSpace: 'nowrap', fontFamily: FF,
};
const TD: React.CSSProperties = {
  padding: '9px 10px', verticalAlign: 'middle', color: '#333',
  borderBottom: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', textOverflow: 'ellipsis',
  whiteSpace: 'nowrap', maxWidth: 160, fontSize: 12.5, fontFamily: FF,
};
const inputBox: React.CSSProperties = {
  padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)',
  fontSize: 13, fontFamily: FF, outline: 'none', boxSizing: 'border-box',
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div style={{
    background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${color}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
    padding: '16px 20px', flex: '1 1 160px',
  }}>
    <div style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', fontFamily: FF }}>{value}</div>
    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: FF, marginTop: 2 }}>{label}</div>
  </div>
);

function DelDlg({ title, message, onCancel, onConfirm, deleting }: { title: string; message: string; onCancel: () => void; onConfirm: () => void; deleting?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10050, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 380, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: '#1A1A1A' }}>{title}</h6>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={deleting} style={{ flex: 1, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 9, padding: '9px', cursor: deleting ? 'wait' : 'pointer', color: '#475569', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '9px', cursor: deleting ? 'wait' : 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

const EMPTY_FILTERS = { search: '', status: '', priority: '', service: '', date_from: '', date_to: '' };

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<InquiryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openInquiry, setOpenInquiry] = useState<Inquiry | null>(null);
  const [delTarget, setDelTarget] = useState<Inquiry | 'bulk' | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true); setError(null);
    inquiryApi.list({
      status: filters.status || undefined, priority: filters.priority || undefined,
      service: filters.service || undefined, date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined, search: filters.search || undefined,
    })
      .then((res: any) => setInquiries(Array.isArray(res) ? res : []))
      .catch((e: any) => { setError(e.message || 'Could not load inquiries'); toast.error(e.message || 'Could not load inquiries'); })
      .finally(() => setLoading(false));
  }, [filters]);

  const loadStats = useCallback(() => {
    inquiryApi.stats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadStats(); }, [loadStats]);

  // debounce search so every keystroke doesn't refetch
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchInput })), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const clearFilters = () => { setFilters(EMPTY_FILTERS); setSearchInput(''); };

  const allSelected = inquiries.length > 0 && selectedIds.length === inquiries.length;
  const toggleAll = () => setSelectedIds(allSelected ? [] : inquiries.map(i => i.id));
  const toggleOne = (id: number) => setSelectedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const refreshAll = () => { load(); loadStats(); setSelectedIds([]); };

  const bulkSetStatus = async (status: string) => {
    setBulkBusy(true);
    try {
      await Promise.all(selectedIds.map(id => inquiryApi.update(id, { status: status as Inquiry['status'] })));
      toast.success(`${selectedIds.length} inquiry(ies) marked as ${status}`);
      refreshAll();
    } catch (e: any) { toast.error(e.message || 'Bulk update failed'); }
    finally { setBulkBusy(false); }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (delTarget === 'bulk') {
        await Promise.all(selectedIds.map(id => inquiryApi.remove(id)));
        toast.success(`${selectedIds.length} inquiry(ies) deleted`);
      } else if (delTarget) {
        await inquiryApi.remove(delTarget.id);
        toast.success('Inquiry deleted');
      }
      setDelTarget(null);
      refreshAll();
    } catch (e: any) { toast.error(e.message || 'Could not delete'); }
    finally { setDeleting(false); }
  };

  const rowStyle = (r: Inquiry): React.CSSProperties => {
    if (r.priority === 'high') return { background: 'rgba(239,68,68,0.045)' };
    if (r.status === 'new') return { background: 'rgba(201,136,58,0.045)' };
    return {};
  };

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h4 style={{ fontFamily: FF, fontWeight: 800, fontSize: 19, color: '#1A1A1A', margin: 0 }}>Contact Inquiries</h4>
        <p style={{ fontFamily: FF, fontSize: 13, color: '#9b9690', margin: '3px 0 0' }}>All inquiries from xerxez.com/contact</p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard label="Total Inquiries" value={stats?.total ?? 0} color="#9b9690" />
        <StatCard label="New" value={stats?.new ?? 0} color={OG} />
        <StatCard label="Replied" value={stats?.replied ?? 0} color="#16a34a" />
        <StatCard label="This Week" value={stats?.this_week ?? 0} color="#1d4ed8" />
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <input
          value={searchInput} onChange={e => setSearchInput(e.target.value)}
          placeholder="Search by name, email, company…"
          style={{ ...inputBox, flex: '1 1 240px', minWidth: 200 }}
        />
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} style={{ ...inputBox, cursor: 'pointer' }}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))} style={{ ...inputBox, cursor: 'pointer' }}>
          <option value="">All Priorities</option>
          {Object.entries(PRIORITY_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filters.service} onChange={e => setFilters(f => ({ ...f, service: e.target.value }))} style={{ ...inputBox, cursor: 'pointer', minWidth: 160 }}>
          <option value="">All Services</option>
          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="date" value={filters.date_from} onChange={e => setFilters(f => ({ ...f, date_from: e.target.value }))} style={inputBox} aria-label="From date" />
          <span style={{ color: '#9b9690', fontFamily: FF, fontSize: 12 }}>→</span>
          <input type="date" value={filters.date_to} onChange={e => setFilters(f => ({ ...f, date_to: e.target.value }))} style={inputBox} aria-label="To date" />
        </div>
        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 8,
            padding: '9px 14px', fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: '#ef4444', cursor: 'pointer',
          }}>
            <i className="fas fa-times" style={{ fontSize: 10, marginRight: 5 }} /> Clear Filters
          </button>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          background: 'rgba(201,136,58,0.08)', border: '1px solid rgba(201,136,58,0.25)', borderRadius: 10,
          padding: '10px 16px', marginBottom: 14,
        }}>
          <span style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: '#5a5650' }}>{selectedIds.length} selected</span>
          <button disabled={bulkBusy} onClick={() => bulkSetStatus('reviewed')} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 7, padding: '6px 12px', fontFamily: FF, fontSize: 12, fontWeight: 700, color: '#1d4ed8', cursor: bulkBusy ? 'wait' : 'pointer' }}>Mark as Reviewed</button>
          <button disabled={bulkBusy} onClick={() => bulkSetStatus('replied')} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 7, padding: '6px 12px', fontFamily: FF, fontSize: 12, fontWeight: 700, color: '#16a34a', cursor: bulkBusy ? 'wait' : 'pointer' }}>Mark as Replied</button>
          <button disabled={bulkBusy} onClick={() => bulkSetStatus('closed')} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 7, padding: '6px 12px', fontFamily: FF, fontSize: 12, fontWeight: 700, color: '#64748b', cursor: bulkBusy ? 'wait' : 'pointer' }}>Mark as Closed</button>
          <button disabled={bulkBusy} onClick={() => setDelTarget('bulk')} style={{ background: '#fff', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, padding: '6px 12px', fontFamily: FF, fontSize: 12, fontWeight: 700, color: '#ef4444', cursor: bulkBusy ? 'wait' : 'pointer' }}>Delete Selected</button>
        </div>
      )}

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
          <div className="spinner-border" style={{ color: OG }} role="status"></div>
          <p>Loading inquiries…</p>
        </div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: 40, color: '#ef4444', marginBottom: 16, display: 'block' }} />
          <p style={{ color: '#ef4444', fontSize: 16, marginBottom: 16, fontFamily: FF }}>{error}</p>
          <button
            onClick={load}
            style={{ background: OG, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: FF }}
          >
            Try Again
          </button>
        </div>
      ) : inquiries.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)',
        }}>
          <i className="fas fa-inbox" style={{ fontSize: 28, color: '#c7c2ba', marginBottom: 12 }} />
          <p style={{ color: '#6B6B6B', fontFamily: FF, fontSize: 13.5, fontWeight: 600, margin: 0 }}>No inquiries found.</p>
        </div>
      ) : (
        <div style={{
          background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)', overflowX: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#fafaf8' }}>
                <th style={{ ...TH, width: 36 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor: OG, width: 15, height: 15, cursor: 'pointer' }} />
                </th>
                <th style={TH}>Name</th>
                <th style={TH}>Email</th>
                <th style={TH}>Company</th>
                <th style={TH}>Service</th>
                <th style={TH}>Industry</th>
                <th style={TH}>Priority</th>
                <th style={TH}>Status</th>
                <th style={TH}>Date</th>
                <th style={{ ...TH, width: 96 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(r => (
                <tr
                  key={r.id}
                  onClick={() => setOpenInquiry(r)}
                  style={{ cursor: 'pointer', ...rowStyle(r) }}
                >
                  <td style={{ ...TD, width: 36 }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleOne(r.id)} style={{ accentColor: OG, width: 15, height: 15, cursor: 'pointer' }} />
                  </td>
                  <td style={{ ...TD, fontWeight: 700, color: OG }}>{r.full_name}</td>
                  <td style={TD}>{r.email}</td>
                  <td style={TD}>{r.company || '—'}</td>
                  <td style={TD}>{r.service || '—'}</td>
                  <td style={TD}>{r.industry || '—'}</td>
                  <td style={TD}><Badge value={r.priority} map={PRIORITY_BADGE} /></td>
                  <td style={TD}><Badge value={r.status} map={STATUS_BADGE} /></td>
                  <td style={TD}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={{ ...TD, width: 96 }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        title="View" onClick={() => setOpenInquiry(r)}
                        style={{ background: 'rgba(29,78,216,0.08)', color: '#1d4ed8', border: '1px solid rgba(29,78,216,0.20)', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}
                      >
                        <i className="fas fa-eye" style={{ fontSize: 10 }} />
                      </button>
                      <button
                        title="Edit" onClick={() => setOpenInquiry(r)}
                        style={{ background: 'rgba(201,136,58,0.08)', color: OG, border: '1px solid rgba(201,136,58,0.22)', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}
                      >
                        <i className="fas fa-pen" style={{ fontSize: 10 }} />
                      </button>
                      <button
                        title="Delete" onClick={() => setDelTarget(r)}
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}
                      >
                        <i className="fas fa-trash" style={{ fontSize: 10 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openInquiry && (
        <InquiryDetail
          inquiry={openInquiry}
          onClose={() => setOpenInquiry(null)}
          onSaved={(updated) => { setOpenInquiry(updated); refreshAll(); }}
        />
      )}

      {delTarget && (
        <DelDlg
          title={delTarget === 'bulk' ? 'Delete Selected Inquiries?' : 'Delete Inquiry?'}
          message={delTarget === 'bulk'
            ? `This will permanently delete ${selectedIds.length} inquiry(ies). This cannot be undone.`
            : `This will permanently delete the inquiry from ${(delTarget as Inquiry).full_name}. This cannot be undone.`}
          deleting={deleting}
          onCancel={() => setDelTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
