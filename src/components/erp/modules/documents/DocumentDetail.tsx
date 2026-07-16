import { useEffect, useState } from 'react';
import {
  OG, FF, OVR, SAVE, CNCL, CategoryBadge, DocStatusBadge, fileIconFor, fmtDate, fmtDateTime,
  AUDIT_ACTION_META, type DocumentT, type DocumentVersionT, type DocumentAuditEntryT,
} from './documentsShared';
import { getVersions, getAuditTrail } from './documentApi';
import DocumentVersions from './DocumentVersions';

type Tab = 'details' | 'audit';

export default function DocumentDetail({
  doc, onClose, onApprove, onReject, onDownload,
}: {
  doc: DocumentT;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDownload: () => void;
}) {
  const [tab, setTab] = useState<Tab>('details');
  const [versions, setVersions] = useState<DocumentVersionT[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(true);
  const [auditTrail, setAuditTrail] = useState<DocumentAuditEntryT[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(true);
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

  useEffect(() => {
    if (tab !== 'audit') return;
    let cancelled = false;
    setLoadingAudit(true);
    getAuditTrail(doc.id)
      .then(res => { if (!cancelled) setAuditTrail(Array.isArray(res) ? res : []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingAudit(false); });
    return () => { cancelled = true; };
  }, [doc.id, tab]);

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
      <div
        style={{
          background: '#fff', borderRadius: 14, padding: 0, maxWidth: 900, width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.16)', borderTop: '3px solid #C9883A',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '22px 26px 0' }}>
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
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 20, padding: 4, lineHeight: 1 }}>
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '14px 26px 0', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          {([
            { key: 'details' as const, label: 'Details' },
            { key: 'audit' as const, label: 'Audit Trail' },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: '8px 14px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer',
                fontFamily: FF, fontWeight: 700, fontSize: 12.5,
                background: tab === t.key ? 'rgba(201,136,58,0.10)' : 'transparent',
                color: tab === t.key ? OG : '#6B6B6B',
                borderBottom: tab === t.key ? '2px solid #C9883A' : '2px solid transparent',
                marginBottom: -1,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body (scrollable) */}
        <div style={{ padding: '20px 26px', overflowY: 'auto', flex: 1 }}>
          {tab === 'details' ? (
            <>
              {doc.description && (
                <p style={{ fontFamily: FF, fontSize: 13, color: '#4B4B4B', marginTop: 0, marginBottom: 0, lineHeight: 1.6 }}>
                  {doc.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontFamily: FF, fontSize: 12, color: '#6B6B6B', marginTop: 14 }}>
                <div><strong style={{ color: '#1A1A1A' }}>Uploaded by:</strong> {doc.uploaded_by_name || '—'}</div>
                <div><strong style={{ color: '#1A1A1A' }}>Uploaded on:</strong> {fmtDate(doc.created_at)}</div>
                {doc.approved_by_name && <div><strong style={{ color: '#1A1A1A' }}>Reviewed by:</strong> {doc.approved_by_name}</div>}
                {doc.expiry_date && <div><strong style={{ color: '#1A1A1A' }}>Expires:</strong> {fmtDate(doc.expiry_date)}</div>}
                <div><strong style={{ color: '#1A1A1A' }}>Views:</strong> {doc.views_count}</div>
              </div>

              <div style={{ marginTop: 18, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: '#F8F7F4', minHeight: 120 }}>
                {isPdf && doc.file_url && (
                  <iframe src={doc.file_url} title={doc.title} style={{ width: '100%', height: 600, border: 'none' }} />
                )}
                {isImage && doc.file_url && (
                  <img src={doc.file_url} alt={doc.title} style={{ width: '100%', maxWidth: '100%', maxHeight: 600, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                )}
                {!isPdf && !isImage && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 0', fontFamily: FF, color: '#6B6B6B', textAlign: 'center' }}>
                    <i className={icon} style={{ color, fontSize: 30, marginBottom: 10 }} />
                    Preview not available. Please download to view this file type.
                  </div>
                )}
              </div>

              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 12, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Version History
                </div>
                <DocumentVersions versions={versions} loading={loadingVersions} />
              </div>
            </>
          ) : (
            loadingAudit ? (
              <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', padding: '12px 0' }}>
                <i className="fas fa-circle-notch fa-spin" style={{ marginRight: 8, color: OG }} />Loading audit trail…
              </div>
            ) : auditTrail.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', fontFamily: FF, fontSize: 13.5, padding: '30px 0' }}>No activity recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {auditTrail.map(entry => {
                  const meta = AUDIT_ACTION_META[entry.action] ?? { icon: 'fas fa-circle', color: '#6b7280' };
                  return (
                    <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 4px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={meta.icon} style={{ color: meta.color, fontSize: 11 }} />
                      </div>
                      <div style={{ fontFamily: FF, fontSize: 12.5, color: '#1A1A1A' }}>
                        <strong>{entry.action_display}</strong> by {entry.user_name || 'System'} on {fmtDateTime(entry.created_at)}
                        {entry.notes && <span style={{ color: '#6B6B6B' }}> — {entry.notes}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, padding: '16px 26px', borderTop: '1px solid rgba(0,0,0,0.07)', flexWrap: 'wrap' }}>
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
