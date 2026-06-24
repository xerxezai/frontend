interface Column { key: string; label: string; render?: (row: any) => React.ReactNode; }

interface Props {
  title: string;
  columns: Column[];
  data: any[];
  loading: boolean;
  error: string | null;
  onAdd?: () => void;
  onDelete?: (id: number) => void;
}

const ERPTable = ({ title, columns, data, loading, error, onAdd, onDelete }: Props) => {
  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
      <div className="spinner-border text-primary" role="status"></div>
      <p>Loading {title}...</p>
    </div>
  );
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold mb-0" style={{ color: '#1a1a2e' }}>{title}</h5>
        {onAdd && (
          <button className="btn btn-sm btn-primary d-flex align-items-center gap-2" onClick={onAdd}
            style={{ background: '#6c57d2', borderColor: '#6c57d2' }}>
            <i className="fas fa-plus"></i> Add New
          </button>
        )}
      </div>
      {data.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm">
          <i className="fas fa-inbox text-muted" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}></i>
          <p className="text-muted mb-0">No records found. Add the first one.</p>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded-3 shadow-sm">
          <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
            <thead className="table-light">
              <tr>
                {columns.map(c => (
                  <th key={c.key} className="text-uppercase fw-semibold text-muted border-bottom"
                    style={{ fontSize: 11, letterSpacing: '0.5px', padding: '12px 16px' }}>
                    {c.label}
                  </th>
                ))}
                {onDelete && <th className="text-uppercase fw-semibold text-muted border-bottom" style={{ fontSize: 11, letterSpacing: '0.5px', padding: '12px 16px' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map(c => (
                    <td key={c.key} style={{ padding: '12px 16px', verticalAlign: 'middle', color: '#333' }}>
                      {c.render ? c.render(row) : (row[c.key] ?? '—')}
                    </td>
                  ))}
                  {onDelete && (
                    <td style={{ padding: '8px 16px', verticalAlign: 'middle' }}>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: 30, height: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}
                        onClick={() => onDelete(row.id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash" style={{ fontSize: 12 }}></i>
                      </button>
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

