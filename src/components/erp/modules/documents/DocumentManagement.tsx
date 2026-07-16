import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  OG, FF, DARK, CREAM, inp, lbl, SAVE, CNCL, OVR, CRD, KpiCard, CATEGORIES, DelDlg,
  type DocumentT,
} from './documentsShared';
import {
  getDocuments, searchDocuments, getDocument, approveDocument, rejectDocument, uploadVersion,
  deleteDocument, submitForReview, trackDownload,
} from './documentApi';
import DocumentList from './DocumentList';
import DocumentUpload from './DocumentUpload';
import DocumentDetail from './DocumentDetail';
import EditDocumentModal from './EditDocumentModal';
import ShareLinkModal from './ShareLinkModal';
import CommentsPanel from './CommentsPanel';
import BulkUploadModal from './BulkUploadModal';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'expiring', label: 'Expiring soon' },
] as const;
type SortKey = typeof SORT_OPTIONS[number]['value'];

function sortDocuments(docs: DocumentT[], sort: SortKey): DocumentT[] {
  const copy = [...docs];
  switch (sort) {
    case 'oldest':
      return copy.sort((a, b) => a.created_at.localeCompare(b.created_at));
    case 'name_asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'name_desc':
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case 'expiring':
      return copy.sort((a, b) => {
        if (!a.expiry_date && !b.expiry_date) return 0;
        if (!a.expiry_date) return 1;
        if (!b.expiry_date) return -1;
        return a.expiry_date.localeCompare(b.expiry_date);
      });
    case 'newest':
    default:
      return copy.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
}

async function downloadFile(doc: DocumentT) {
  trackDownload(doc.id).catch(() => {});
  if (!doc.file_url) return;
  try {
    const res = await fetch(doc.file_url);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.title;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    window.open(doc.file_url, '_blank');
  }
}

function NewVersionModal({ doc, onClose, onUploaded }: { doc: DocumentT; onClose: () => void; onUploaded: () => void }) {
  const [versionNumber, setVersionNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('version_number', versionNumber.trim() || doc.version);
      formData.append('notes', notes);
      formData.append('file', file);
      await uploadVersion(doc.id, formData);
      onUploaded();
    } catch (e: any) {
      setError(e.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div style={{ ...CRD, maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', marginBottom: 16 }}>
          <i className="fas fa-code-branch" style={{ color: OG, marginRight: 8 }} />New Version — {doc.title}
        </h5>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Version Number</label>
          <input style={inp} value={versionNumber} onChange={e => setVersionNumber(e.target.value)} placeholder={`e.g. v${(parseInt(doc.version.replace(/\D/g, '')) || 1) + 1}`} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Notes</label>
          <textarea style={{ ...inp, minHeight: 60, resize: 'vertical' as const }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="What changed in this version?" />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>File *</label>
          <input type="file" style={inp} onChange={e => setFile(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.dwg" />
        </div>
        {error && <div style={{ fontFamily: FF, fontSize: 12.5, color: '#991b1b', marginBottom: 10 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button style={{ ...CNCL, flex: 1 }} onClick={onClose} disabled={busy}>Cancel</button>
          <button style={{ ...SAVE, flex: 1, opacity: file && !busy ? 1 : 0.5, cursor: file && !busy ? 'pointer' : 'not-allowed' }} onClick={submit} disabled={!file || busy}>
            {busy ? 'Uploading…' : 'Upload Version'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentManagement() {
  const [allDocs, setAllDocs] = useState<DocumentT[]>([]);
  const [displayDocs, setDisplayDocs] = useState<DocumentT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const [showUpload, setShowUpload] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocumentT | null>(null);
  const [versioningDoc, setVersioningDoc] = useState<DocumentT | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentT | null>(null);
  const [sharingDoc, setSharingDoc] = useState<DocumentT | null>(null);
  const [commentingDoc, setCommentingDoc] = useState<DocumentT | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<DocumentT | null>(null);

  const reloadStats = useCallback(() => {
    getDocuments().then(setAllDocs).catch(() => {});
  }, []);

  const reloadDisplay = useCallback(() => {
    setLoading(true);
    setError(null);
    const cat = category === 'all' ? undefined : category;
    const req = query.trim() ? searchDocuments(query.trim(), cat) : getDocuments(cat);
    req
      .then(res => setDisplayDocs(Array.isArray(res) ? res : []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [category, query]);

  useEffect(() => { reloadStats(); }, [reloadStats]);

  useEffect(() => {
    const t = setTimeout(reloadDisplay, query ? 300 : 0);
    return () => clearTimeout(t);
  }, [reloadDisplay, query]);

  const reloadAll = useCallback(() => { reloadStats(); reloadDisplay(); }, [reloadStats, reloadDisplay]);

  const sortedDocs = useMemo(() => sortDocuments(displayDocs, sort), [displayDocs, sort]);

  const stats = useMemo(() => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const in30 = new Date(now); in30.setDate(in30.getDate() + 30);
    const expiringSoon = allDocs.filter(d => {
      if (!d.expiry_date) return false;
      const exp = new Date(d.expiry_date);
      return exp >= now && exp <= in30;
    }).length;
    return {
      total: allDocs.length,
      pending: allDocs.filter(d => d.status === 'under_review').length,
      approved: allDocs.filter(d => d.status === 'approved').length,
      rejected: allDocs.filter(d => d.status === 'rejected').length,
      expiringSoon,
    };
  }, [allDocs]);

  const handleView = async (doc: DocumentT) => {
    try {
      const fresh = await getDocument(doc.id);
      setViewingDoc(fresh);
      reloadStats();
    } catch {
      setViewingDoc(doc);
    }
  };

  const handleApprove = async (doc: DocumentT) => {
    await approveDocument(doc.id);
    toast.success('Document approved');
    setViewingDoc(null);
    reloadAll();
  };

  const handleReject = async (doc: DocumentT) => {
    await rejectDocument(doc.id);
    toast.success('Document rejected');
    setViewingDoc(null);
    reloadAll();
  };

  const handleSubmitForReview = async (doc: DocumentT) => {
    try {
      await submitForReview(doc.id);
      toast.success('Submitted for review');
      reloadAll();
    } catch (e: any) {
      toast.error(e.message || 'Could not submit for review.');
    }
  };

  const confirmDelete = async () => {
    if (!deletingDoc) return;
    try {
      await deleteDocument(deletingDoc.id);
      toast.success('Document deleted');
      setDeletingDoc(null);
      setViewingDoc(null);
      reloadAll();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed.');
    }
  };

  return (
    <div style={{ fontFamily: FF }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: 20, color: DARK, margin: 0 }}>Document Management</h4>
          <p style={{ fontSize: 13, color: '#6B6B6B', margin: '4px 0 0' }}>Upload, version, review and approve project documents.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowBulkUpload(true)}
            style={{ background: '#fff', color: OG, border: '1px solid rgba(201,136,58,0.30)', borderRadius: 10, padding: '11px 18px', fontFamily: FF, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <i className="fas fa-layer-group" />Bulk Upload
          </button>
          <button
            onClick={() => setShowUpload(true)}
            style={{ background: `linear-gradient(145deg,#e8a84e 0%,${OG} 100%)`, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontFamily: FF, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <i className="fas fa-plus" />Upload Document
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 22 }}>
        <KpiCard icon="fas fa-folder" label="Total Documents" value={stats.total} accent={OG} />
        <KpiCard icon="fas fa-hourglass-half" label="Pending Approval" value={stats.pending} accent="#e65100" />
        <KpiCard icon="fas fa-check-circle" label="Approved" value={stats.approved} accent="#2e7d32" />
        <KpiCard icon="fas fa-times-circle" label="Rejected" value={stats.rejected} accent="#c62828" />
        <KpiCard icon="fas fa-clock" label="Expiring Soon" value={stats.expiringSoon} accent="#c2410c" />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 220 }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 13 }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search documents by title or description…"
            style={{ ...inp, paddingLeft: 34, background: CREAM }}
          />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value as SortKey)} style={{ ...inp, maxWidth: 180 }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 3, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9, padding: 3 }}>
          {(['grid', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '8px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 12, textTransform: 'capitalize', background: view === v ? OG : 'transparent', color: view === v ? '#fff' : '#6B6B6B' }}>
              <i className={v === 'grid' ? 'fas fa-th-large' : 'fas fa-list'} style={{ marginRight: 6 }} />{v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {[{ value: 'all', label: 'All' }, ...CATEGORIES].map(c => {
          const active = category === c.value;
          return (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              style={{
                padding: '7px 14px', borderRadius: 20, fontFamily: FF, fontWeight: 700, fontSize: 12.5,
                border: active ? 'none' : '1px solid rgba(0,0,0,0.10)',
                background: active ? `linear-gradient(145deg,#e8a84e 0%,${OG} 100%)` : '#fff',
                color: active ? '#fff' : '#4B4B4B', cursor: 'pointer',
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <DocumentList
        documents={sortedDocs}
        loading={loading}
        error={error}
        view={view}
        onView={handleView}
        onDownload={downloadFile}
        onNewVersion={setVersioningDoc}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={setDeletingDoc}
        onEdit={setEditingDoc}
        onShare={setSharingDoc}
        onComments={setCommentingDoc}
        onSubmitForReview={handleSubmitForReview}
      />

      {showUpload && (
        <DocumentUpload
          onClose={() => setShowUpload(false)}
          onUploaded={() => { setShowUpload(false); reloadAll(); }}
        />
      )}

      {showBulkUpload && (
        <BulkUploadModal
          onClose={() => setShowBulkUpload(false)}
          onUploaded={reloadAll}
        />
      )}

      {viewingDoc && (
        <DocumentDetail
          doc={viewingDoc}
          onClose={() => setViewingDoc(null)}
          onApprove={() => handleApprove(viewingDoc)}
          onReject={() => handleReject(viewingDoc)}
          onDownload={() => downloadFile(viewingDoc)}
        />
      )}

      {versioningDoc && (
        <NewVersionModal
          doc={versioningDoc}
          onClose={() => setVersioningDoc(null)}
          onUploaded={() => { setVersioningDoc(null); reloadAll(); }}
        />
      )}

      {editingDoc && (
        <EditDocumentModal
          doc={editingDoc}
          onClose={() => setEditingDoc(null)}
          onSaved={() => { setEditingDoc(null); toast.success('Document updated'); reloadAll(); }}
        />
      )}

      {sharingDoc && (
        <ShareLinkModal doc={sharingDoc} onClose={() => setSharingDoc(null)} />
      )}

      {commentingDoc && (
        <CommentsPanel doc={commentingDoc} onClose={() => setCommentingDoc(null)} onChanged={reloadAll} />
      )}

      {deletingDoc && (
        <DelDlg
          label={`Are you sure you want to delete "${deletingDoc.title}"? This cannot be undone.`}
          onCancel={() => setDeletingDoc(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
