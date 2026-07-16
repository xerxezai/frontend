import { OG, FF, fileIconFor, fmtDate, type DocumentVersionT } from './documentsShared';

export default function DocumentVersions({ versions, loading }: { versions: DocumentVersionT[]; loading: boolean }) {
  if (loading) {
    return (
      <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', padding: '12px 0' }}>
        <i className="fas fa-circle-notch fa-spin" style={{ marginRight: 8, color: OG }} />Loading version history…
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', padding: '12px 0' }}>
        No previous versions yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {versions.map(v => {
        const { icon, color } = fileIconFor(v.file_url || v.file);
        return (
          <div key={v.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
            border: '1px solid rgba(0,0,0,0.07)', borderRadius: 10, background: '#F8F7F4',
          }}>
            <i className={icon} style={{ color, fontSize: 14 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 12.5, color: '#1A1A1A' }}>
                {v.version_number} <span style={{ color: '#6B6B6B', fontWeight: 500 }}>· {v.uploaded_by_name || '—'} · {fmtDate(v.created_at)}</span>
              </div>
              {v.notes && <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginTop: 2 }}>{v.notes}</div>}
            </div>
            {v.file_url && (
              <a href={v.file_url} target="_blank" rel="noreferrer" style={{ color: OG, fontSize: 13 }} aria-label={`Download ${v.version_number}`}>
                <i className="fas fa-download" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
