import { FF, OG, type DocumentT } from './documentsShared';
import DocumentCard from './DocumentCard';

export default function DocumentList({
  documents, loading, error, onView, onDownload, onNewVersion, onApprove, onReject, onDelete,
}: {
  documents: DocumentT[];
  loading: boolean;
  error: string | null;
  onView: (doc: DocumentT) => void;
  onDownload: (doc: DocumentT) => void;
  onNewVersion: (doc: DocumentT) => void;
  onApprove: (doc: DocumentT) => void;
  onReject: (doc: DocumentT) => void;
  onDelete: (doc: DocumentT) => void;
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
        <i className="fas fa-triangle-exclamation" style={{ fontSize: 22, marginBottom: 10, display: 'block' }} />
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
      {documents.map(doc => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          onView={() => onView(doc)}
          onDownload={() => onDownload(doc)}
          onNewVersion={() => onNewVersion(doc)}
          onApprove={() => onApprove(doc)}
          onReject={() => onReject(doc)}
          onDelete={() => onDelete(doc)}
        />
      ))}
    </div>
  );
}
