import { useCallback, useEffect, useState } from 'react';
import {
  OG, FF, DARK, CREAM, inp, lbl, SAVE, CNCL, OVR, CRD, KpiCard, CATEGORIES,
  type DocumentT,
} from './documentsShared';
import { getDocuments, searchDocuments, approveDocument, rejectDocument, uploadVersion } from './documentApi';
import DocumentList from './DocumentList';
import DocumentUpload from './DocumentUpload';
import DocumentDetail from './DocumentDetail';

async function downloadFile(doc: DocumentT) {
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

  const [showUpload, setShowUpload] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocumentT | null>(null);
  const [versioningDoc, setVersioningDoc] = useState<DocumentT | null>(null);

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

  const stats = {
    total: allDocs.length,
    pending: allDocs.filter(d => d.status === 'under_review').length,
    approved: allDocs.filter(d => d.status === 'approved').length,
    rejected: allDocs.filter(d => d.status === 'rejected').length,
  };

  const handleApprove = async (doc: DocumentT) => {
    await approveDocument(doc.id);
    setViewingDoc(null);
    reloadAll();
  };

  const handleReject = async (doc: DocumentT) => {
    await rejectDocument(doc.id);
    setViewingDoc(null);
    reloadAll();
  };

  return (
    <div style={{ fontFamily: FF }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: 20, color: DARK, margin: 0 }}>Document Management</h4>
          <p style={{ fontSize: 13, color: '#6B6B6B', margin: '4px 0 0' }}>Upload, version, review and approve project documents.</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          style={{ background: `linear-gradient(145deg,#e8a84e 0%,${OG} 100%)`, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontFamily: FF, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <i className="fas fa-plus" />Upload Document
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 22 }}>
        <KpiCard icon="fas fa-folder" label="Total Documents" value={stats.total} accent={OG} />
        <KpiCard icon="fas fa-hourglass-half" label="Pending Approval" value={stats.pending} accent="#e65100" />
        <KpiCard icon="fas fa-check-circle" label="Approved" value={stats.approved} accent="#2e7d32" />
        <KpiCard icon="fas fa-times-circle" label="Rejected" value={stats.rejected} accent="#c62828" />
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
        documents={displayDocs}
        loading={loading}
        error={error}
        onView={setViewingDoc}
        onDownload={downloadFile}
        onNewVersion={setVersioningDoc}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {showUpload && (
        <DocumentUpload
          onClose={() => setShowUpload(false)}
          onUploaded={() => { setShowUpload(false); reloadAll(); }}
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
    </div>
  );
}
