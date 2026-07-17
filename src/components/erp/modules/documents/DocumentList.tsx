import { FF, OG, DARK, CategoryBadge, DocStatusBadge, fileIconFor, fmtDate, expiryMeta, type DocumentT } from './documentsShared';
import DocumentCard from './DocumentCard';

interface Handlers {
  onView: (doc: DocumentT) => void;
  onDownload: (doc: DocumentT) => void;
  onNewVersion: (doc: DocumentT) => void;
  onApprove: (doc: DocumentT) => void;
  onReject: (doc: DocumentT) => void;
  onDelete: (doc: DocumentT) => void;
  onEdit: (doc: DocumentT) => void;
  onShare: (doc: DocumentT) => void;
  onComments: (doc: DocumentT) => void;
  onSubmitForReview: (doc: DocumentT) => void;
}

export default function DocumentList({
  documents, loading, error, view = 'grid', ...handlers
}: Handlers & {
  documents: DocumentT[];
  loading: boolean;
  error: string | null;
  view?: 'grid' | 'list';
}) {
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', fontFamily: FF, color: '#6B6B6B' }}>
        <i className="fas fa-circle-notch fa-spin" style={{ marginRight: 10, color: OG, fontSize: 18 }} />
        Loading documents…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', fontFamily: FF, color: '#991b1b' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: 22, marginBottom: 10, display: 'block' }} />
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '70px 20px', fontFamily: FF }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: `${OG}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <i className="fas fa-folder-open" style={{ color: OG, fontSize: 22 }} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, color: '#1A1A1A', marginBottom: 4 }}>No documents found</div>
        <div style={{ fontSize: 13, color: '#6B6B6B' }}>Upload a document to get started.</div>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FF, fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: '#fafaf8' }}>
              {['Title', 'Category', 'Version', 'Status', 'Expiry', 'Uploaded By', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => {
              const { icon, color } = fileIconFor(doc.file_url || doc.file || doc.title);
              const expiry = expiryMeta(doc.expiry_date);
              return (
                <tr key={doc.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '10px 14px', color: DARK, fontWeight: 600 }}>
                    <i className={icon} style={{ color, marginRight: 8 }} />{doc.title}
                  </td>
                  <td style={{ padding: '10px 14px' }}><CategoryBadge category={doc.category} /></td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{doc.version}</td>
                  <td style={{ padding: '10px 14px' }}><DocStatusBadge status={doc.status} /></td>
                  <td style={{ padding: '10px 14px' }}>
                    {expiry ? <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: expiry.bg, color: expiry.color }}>{expiry.label}</span> : <span style={{ color: '#9ca3af' }}>—</span>}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{doc.uploaded_by_name || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{fmtDate(doc.created_at)}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[
                        { icon: 'fas fa-eye', title: 'View', onClick: () => handlers.onView(doc), color: '#1A1A1A' },
                        { icon: 'fas fa-download', title: 'Download', onClick: () => handlers.onDownload(doc), color: '#1A1A1A' },
                        { icon: 'fas fa-pen', title: 'Edit', onClick: () => handlers.onEdit(doc), color: OG },
                        { icon: 'fas fa-link', title: 'Share', onClick: () => handlers.onShare(doc), color: '#6b7280' },
                        { icon: 'fas fa-comment', title: 'Comments', onClick: () => handlers.onComments(doc), color: '#6b7280' },
                        { icon: 'fas fa-trash', title: 'Delete', onClick: () => handlers.onDelete(doc), color: '#ef4444' },
                      ].map(a => (
                        <button key={a.title} title={a.title} onClick={a.onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: a.color, width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={a.icon} style={{ fontSize: 11 }} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
      {documents.map(doc => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          onView={() => handlers.onView(doc)}
          onDownload={() => handlers.onDownload(doc)}
          onNewVersion={() => handlers.onNewVersion(doc)}
          onApprove={() => handlers.onApprove(doc)}
          onReject={() => handlers.onReject(doc)}
          onDelete={() => handlers.onDelete(doc)}
          onEdit={() => handlers.onEdit(doc)}
          onShare={() => handlers.onShare(doc)}
          onComments={() => handlers.onComments(doc)}
          onSubmitForReview={() => handlers.onSubmitForReview(doc)}
        />
      ))}
    </div>
  );
}
