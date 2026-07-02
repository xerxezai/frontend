import React from 'react';

interface Column { key: string; label: string; render?: (row: any) => React.ReactNode; }

interface Props {
  title:     string;
  columns:   Column[];
  data:      any[];
  loading:   boolean;
  error:     string | null;
  isAdmin?:  boolean;
  onAdd?:    () => void;
  onEdit?:   (row: any) => void;
  onDelete?: (id: number) => void;
}

const TH: React.CSSProperties = {
  fontSize: 10, letterSpacing: '0.6px', padding: '10px 10px',
  textTransform: 'uppercase', fontWeight: 700, color: '#6B6B6B',
  borderBottom: '1px solid rgba(0,0,0,0.07)', whiteSpace: 'nowrap',
  overflow: 'hidden', textOverflow: 'ellipsis',
};
const TD: React.CSSProperties = {
  padding: '9px 10px', verticalAlign: 'middle', color: '#333',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  maxWidth: 140, fontSize: 12.5,
};

const ERPTable = ({ title, columns, data, loading, error, isAdmin = false, onAdd, onEdit, onDelete }: Props) => {
  const showActions = isAdmin && (onEdit || onDelete);

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
      <div className="spinner-border" style={{ color: '#C9883A' }} role="status"></div>
      <p>Loading {title}…</p>
    </div>
  );
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold mb-0" style={{ color: '#1a1a2e', fontSize: 15 }}>{title}</h5>
        {isAdmin && onAdd && (
          <button
            onClick={onAdd}
            style={{ background: 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', color: '#fff', border: 'none', borderRadius: 9, padding: '7px 14px', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12, boxShadow: '0 3px 0 rgba(150,95,30,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <i className="fas fa-plus" style={{ fontSize: 10 }}></i> Add New
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm">
          <i className="fas fa-inbox text-muted" style={{ fontSize: 40, display: 'block', marginBottom: 12 }}></i>
          <p className="text-muted mb-0" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            No records found.{isAdmin && onAdd ? ' Add the first one.' : ''}
          </p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#fafaf8' }}>
                {columns.map(c => (
                  <th key={c.key} style={TH} title={c.label}>{c.label}</th>
                ))}
                {showActions && (
                  <th style={{ ...TH, width: 76, minWidth: 76 }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id ?? i}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = ''; }}>
                  {columns.map(c => {
                    const rawVal = row[c.key];
                    const plainText = !c.render && rawVal != null ? String(rawVal) : undefined;
                    return (
                      <td key={c.key} style={TD} title={plainText}>
                        {c.render ? c.render(row) : (rawVal ?? '—')}
                      </td>
                    );
                  })}
                  {showActions && (
                    <td style={{ ...TD, maxWidth: 76, width: 76, padding: '6px 10px' }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {onEdit && row.id != null && (
                          <button
                            style={{ background: 'rgba(201,136,58,0.08)', color: '#C9883A', border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}
                            onClick={() => onEdit!(row)} title="Edit"
                          >
                            <i className="fas fa-pen" style={{ fontSize: 10 }}></i>
                          </button>
                        )}
                        {onDelete && row.id != null && (
                          <button
                            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}
                            onClick={() => onDelete!(row.id)} title="Delete"
                          >
                            <i className="fas fa-trash" style={{ fontSize: 10 }}></i>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ERPTable;
