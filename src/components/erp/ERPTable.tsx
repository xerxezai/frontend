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
        <h5 className="fw-bold mb-0" style={{ color: '#1a1a2e' }}>{title}</h5>
        {isAdmin && onAdd && (
          <button
            className="btn btn-sm d-flex align-items-center gap-2"
            onClick={onAdd}
            style={{ background: 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', color: '#fff', border: 'none', borderRadius: 9, padding: '7px 16px', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, boxShadow: '0 3px 0 rgba(150,95,30,0.40)' }}
          >
            <i className="fas fa-plus" style={{ fontSize: 11 }}></i> Add New
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm">
          <i className="fas fa-inbox text-muted" style={{ fontSize: 44, display: 'block', marginBottom: 12 }}></i>
          <p className="text-muted mb-0" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            No records found.{isAdmin && onAdd ? ' Add the first one.' : ''}
          </p>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded-3 shadow-sm">
          <table className="table table-hover mb-0" style={{ fontSize: 13.5 }}>
            <thead className="table-light">
              <tr>
                {columns.map(c => (
                  <th key={c.key}
                    style={{ fontSize: 10.5, letterSpacing: '0.5px', padding: '11px 16px', textTransform: 'uppercase', fontWeight: 700, color: '#6B6B6B', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                    {c.label}
                  </th>
                ))}
                {showActions && (
                  <th style={{ fontSize: 10.5, letterSpacing: '0.5px', padding: '11px 16px', textTransform: 'uppercase', fontWeight: 700, color: '#6B6B6B', borderBottom: '1px solid rgba(0,0,0,0.07)', width: 90 }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id ?? i}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = ''; }}>
                  {columns.map(c => (
                    <td key={c.key} style={{ padding: '11px 16px', verticalAlign: 'middle', color: '#333', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      {c.render ? c.render(row) : (row[c.key] ?? '—')}
                    </td>
                  ))}
                  {showActions && (
                    <td style={{ padding: '8px 16px', verticalAlign: 'middle', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {onEdit && (
                          <button
                            style={{ background: 'rgba(201,136,58,0.08)', color: '#C9883A', border: '1px solid rgba(201,136,58,0.22)', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}
                            onClick={() => onEdit(row)} title="Edit"
                          >
                            <i className="fas fa-pen" style={{ fontSize: 11 }}></i>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}
                            onClick={() => onDelete(row.id)} title="Delete"
                          >
                            <i className="fas fa-trash" style={{ fontSize: 11 }}></i>
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


