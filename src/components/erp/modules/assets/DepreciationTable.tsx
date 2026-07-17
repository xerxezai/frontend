import { FF, useFmtCurrency } from './assetsShared';

export default function DepreciationTable({ entries, loading }: { entries: any[]; loading: boolean }) {
  const fmtINR = useFmtCurrency();
  if (loading) return <div className="d-flex justify-content-center py-4"><div className="spinner-border" style={{ color: '#C9883A' }} /></div>;
  if (entries.length === 0) return <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>No depreciation data — set a depreciation rate on this asset.</div>;

  const currentYear = new Date().getFullYear();

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FF, fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: '#fafaf8' }}>
            {['Year', 'Opening Value', 'Depreciation', 'Closing Value'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '9px 10px', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B6B6B', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map(e => {
            const isCurrent = e.year === currentYear;
            return (
              <tr key={e.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: isCurrent ? 'rgba(201,136,58,0.06)' : undefined }}>
                <td style={{ padding: '9px 10px', fontWeight: isCurrent ? 800 : 500 }}>{e.year}{isCurrent ? ' (current)' : ''}</td>
                <td style={{ padding: '9px 10px' }}>{fmtINR(e.opening_value)}</td>
                <td style={{ padding: '9px 10px', color: '#ef4444' }}>-{fmtINR(e.depreciation_amount)}</td>
                <td style={{ padding: '9px 10px', fontWeight: isCurrent ? 800 : 700, color: isCurrent ? '#C9883A' : '#1A1A1A' }}>{fmtINR(e.closing_value)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
