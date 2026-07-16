import {
  OG, FF, Card3D, CategoryBadge, DocStatusBadge, fileIconFor, fmtDate,
  type DocumentT,
} from './documentsShared';

export default function DocumentCard({
  doc, onView, onDownload, onNewVersion, onApprove, onReject,
}: {
  doc: DocumentT;
  onView: () => void;
  onDownload: () => void;
  onNewVersion: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { icon, color } = fileIconFor(doc.file_url || doc.file || doc.title);

  return (
    <Card3D accent={OG} p="18px 18px 16px">
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10, background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <i className={icon} style={{ color, fontSize: 18 }} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 14, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.title}>
            {doc.title}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            <CategoryBadge category={doc.category} />
            <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#f1f5f9', color: '#475569', fontFamily: FF }}>
              {doc.version}
            </span>
            <DocStatusBadge status={doc.status} />
          </div>
        </div>
      </div>

      <div style={{ fontFamily: FF, fontSize: 12, color: '#6B6B6B', marginTop: 12 }}>
        Uploaded by <strong style={{ color: '#1A1A1A' }}>{doc.uploaded_by_name || '—'}</strong> on {fmtDate(doc.created_at)}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        <button onClick={onView} style={btnStyle('#F8F7F4', '#1A1A1A')}>
          <i className="fas fa-eye" style={{ marginRight: 6 }} />View
        </button>
        <button onClick={onDownload} style={btnStyle('#F8F7F4', '#1A1A1A')}>
          <i className="fas fa-download" style={{ marginRight: 6 }} />Download
        </button>
        <button onClick={onNewVersion} style={btnStyle('#F8F7F4', '#1A1A1A')}>
          <i className="fas fa-code-branch" style={{ marginRight: 6 }} />New Version
        </button>
      </div>

      {doc.status === 'under_review' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={onApprove} style={btnStyle('rgba(16,185,129,0.10)', '#065f46', '1px solid rgba(16,185,129,0.28)')}>
            <i className="fas fa-check" style={{ marginRight: 6 }} />Approve
          </button>
          <button onClick={onReject} style={btnStyle('rgba(239,68,68,0.10)', '#991b1b', '1px solid rgba(239,68,68,0.28)')}>
            <i className="fas fa-times" style={{ marginRight: 6 }} />Reject
          </button>
        </div>
      )}
    </Card3D>
  );
}

function btnStyle(bg: string, color: string, border = '1px solid rgba(0,0,0,0.08)') {
  return {
    flex: 1, minWidth: 90, background: bg, color, border, borderRadius: 8,
    padding: '7px 10px', fontFamily: FF, fontWeight: 700, fontSize: 11.5,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  } as const;
}
