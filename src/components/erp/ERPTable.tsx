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
  if (loading) return <div className="erp-loading"><div className="erp-spinner"></div><p>Loading {title}...</p></div>;
  if (error) return <div className="erp-alert erp-alert-error">{error}</div>;

  return (
    <div className="erp-module">
      <div className="erp-module-header">
        <h2 className="erp-page-title">{title}</h2>
        {onAdd && (
          <button className="erp-btn erp-btn-primary" onClick={onAdd}>
            <i className="fas fa-plus"></i> Add New
          </button>
        )}
      </div>
      {data.length === 0 ? (
        <div className="erp-empty">
          <i className="fas fa-inbox"></i>
          <p>No records found. Add the first one.</p>
        </div>
      ) : (
        <div className="erp-table-wrapper">
          <table className="erp-table">
            <thead>
              <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}{onDelete && <th>Actions</th>}</tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map(c => (
                    <td key={c.key}>{c.render ? c.render(row) : (row[c.key] ?? '—')}</td>
                  ))}
                  {onDelete && (
                    <td>
                      <button className="erp-btn-icon erp-btn-danger" onClick={() => onDelete(row.id)} title="Delete">
                        <i className="fas fa-trash"></i>
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
