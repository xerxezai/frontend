import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, erpDownload } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, FF, WHITE, BORDER, fmtINR, KpiCard, StatusBadge } from './invoicingShared';

interface ReportsData {
  total_revenue_month: string;
  total_revenue_year: string;
  tax_collected_month: string;
  tax_collected_year: string;
  outstanding_invoices: any[];
  overdue_invoices: any[];
}

export default function ReportsPanel() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    erpFetch('invoicing/reports/').then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const exportCSV = async (type: 'all' | 'outstanding' | 'overdue' | 'summary') => {
    try { await erpDownload(`invoicing/reports/export-csv/?type=${type}`, `invoicing-report-${type}-${new Date().toISOString().slice(0, 10)}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const invCols = [
    { key: 'number', label: 'Number', render: (r: any) => r.number || r.id },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'issue_date', label: 'Issue Date', render: (r: any) => r.issue_date || '—' },
    { key: 'due_date', label: 'Due Date', render: (r: any) => r.due_date || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} isOverdue={r.is_overdue} /> },
    { key: 'total', label: 'Total', render: (r: any) => fmtINR(r.total) },
    { key: 'balance', label: 'Balance', render: (r: any) => fmtINR(r.balance) },
  ];

  if (loading) return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!data) return <div className="alert alert-danger">Could not load reports.</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 16 }}>
        <button onClick={() => exportCSV('all')} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: OG }} />Export All to CSV
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        <KpiCard icon="fas fa-sack-dollar" label="Revenue This Month" value={fmtINR(data.total_revenue_month)} accent={OG} />
        <KpiCard icon="fas fa-chart-line" label="Revenue This Year" value={fmtINR(data.total_revenue_year)} accent="#10b981" />
        <KpiCard icon="fas fa-percent" label="Tax Collected This Month" value={fmtINR(data.tax_collected_month)} accent="#8b5cf6" />
        <KpiCard icon="fas fa-percent" label="Tax Collected This Year" value={fmtINR(data.tax_collected_year)} accent="#6366f1" />
      </div>
      <p style={{ fontFamily: FF, fontSize: 11.5, color: '#9ca3af', marginTop: -14, marginBottom: 22 }}>
        Revenue and tax figures count only invoices marked <strong>Paid</strong> — GST hasn't actually been collected until the invoice is settled.
      </p>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 22, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Outstanding Invoices ({data.outstanding_invoices.length})</span>
          <button onClick={() => exportCSV('outstanding')} style={{ background: 'none', border: 'none', color: OG, cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 11.5 }}>
            <i className="fas fa-download" style={{ marginRight: 5 }} />CSV
          </button>
        </div>
        <ERPTable title="" columns={invCols} data={data.outstanding_invoices} loading={false} error={null} isAdmin={false} />
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Overdue Invoices ({data.overdue_invoices.length})</span>
          <button onClick={() => exportCSV('overdue')} style={{ background: 'none', border: 'none', color: OG, cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 11.5 }}>
            <i className="fas fa-download" style={{ marginRight: 5 }} />CSV
          </button>
        </div>
        <ERPTable title="" columns={invCols} data={data.overdue_invoices} loading={false} error={null} isAdmin={false} />
      </div>
    </div>
  );
}
