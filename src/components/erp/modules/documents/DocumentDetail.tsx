import { useEffect, useState } from 'react';
import {
  FF, OVR, CRD, SAVE, CNCL, CategoryBadge, DocStatusBadge, fileIconFor, fmtDate,
  type DocumentT, type DocumentVersionT,
} from './documentsShared';
import { getVersions } from './documentApi';
import DocumentVersions from './DocumentVersions';

export default function DocumentDetail({
  doc, onClose, onApprove, onReject, onDownload,
}: {
  doc: DocumentT;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDownload: () => void;
}) {
  const [versions, setVersions] = useState<DocumentVersionT[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingVersions(true);
    getVersions(doc.id)
      .then(res => { if (!cancelled) setVersions(Array.isArray(res) ? res : []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingVersions(false); });
    return () => { cancelled = true; };
  }, [doc.id]);

  const { icon, color } = fileIconFor(doc.file_url || doc.file || doc.title);
  const ext = (doc.file_url || doc.file || '').split(/[?#]/)[0].split('.').pop()?.toLowerCase() || '';
  const isPdf = ext === 'pdf';
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext);

  const runAction = async (fn: () => void) => {
    setBusy(true);
    try { await fn(); } finally { setBusy(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div style={{ ...CRD, maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className={icon} style={{ color, fontSize: 17 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{doc.title}</h5>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              <CategoryBadge category={doc.category} />
              <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#f1f5f9', color: '#475569', fontFamily: FF }}>
                {doc.version}
              </span>
              <DocStatusBadge status={doc.status} />
            </div>
          </div>
        </div>

        {doc.description && (
          <p style={{ fontFamily: FF, fontSize: 13, color: '#4B4B4B', marginTop: 12, marginBottom: 0, lineHeight: 1.6 }}>
            {doc.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontFamily: FF, fontSize: 12, color: '#6B6B6B', marginTop: 14 }}>
          <div><strong style={{ color: '#1A1A1A' }}>Uploaded by:</strong> {doc.uploaded_by_name || '—'}</div>
          <div><strong style={{ color: '#1A1A1A' }}>Uploaded on:</strong> {fmtDate(doc.created_at)}</div>
          {doc.approved_by_name && <div><strong style={{ color: '#1A1A1A' }}>Reviewed by:</strong> {doc.approved_by_name}</div>}
        </div>

        <div style={{ marginTop: 18, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: '#F8F7F4', minHeight: 120 }}>
          {isPdf && doc.file_url && (
            <iframe src={doc.file_url} title={doc.title} style={{ width: '100%', height: 420, border: 'none' }} />
          )}
          {isImage && doc.file_url && (
            <img src={doc.file_url} alt={doc.title} style={{ width: '100%', maxHeight: 420, objectFit: 'contain', display: 'block' }} />
          )}
          {!isPdf && !isImage && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 0', fontFamily: FF, color: '#6B6B6B' }}>
              <i className={icon} style={{ color, fontSize: 30, marginBottom: 10 }} />
              No inline preview available for this file type.
            </div>
          )}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 12, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Version History
          </div>
          <DocumentVersions versions={versions} loading={loadingVersions} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
          <button style={{ ...CNCL, flex: 1 }} onClick={onClose}>Close</button>
          <button style={{ ...SAVE, flex: 1 }} onClick={onDownload}>
            <i className="fas fa-download" style={{ marginRight: 8 }} />Download
          </button>
          {doc.status === 'under_review' && (
            <>
              <button
                disabled={busy}
                onClick={() => runAction(onApprove)}
                style={{ flex: 1, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: 9, padding: '9px 20px', cursor: busy ? 'default' : 'pointer', color: '#065f46', fontFamily: FF, fontWeight: 700, fontSize: 13, opacity: busy ? 0.6 : 1 }}
              >
                <i className="fas fa-check" style={{ marginRight: 8 }} />Approve
              </button>
              <button
                disabled={busy}
                onClick={() => runAction(onReject)}
                style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '9px 20px', cursor: busy ? 'default' : 'pointer', color: '#991b1b', fontFamily: FF, fontWeight: 700, fontSize: 13, opacity: busy ? 0.6 : 1 }}
              >
                <i className="fas fa-times" style={{ marginRight: 8 }} />Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
