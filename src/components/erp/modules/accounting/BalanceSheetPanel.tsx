import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, WHITE, BORDER, useFmtCurrency, Card3D, OG } from './accountingShared';
import { downloadBalanceSheetPDF } from './pdf';

const Row = ({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${BORDER}`, fontFamily: FF }}>
    <span style={{ fontSize: 13, color: bold ? '#1A1A1A' : '#6B6B6B', fontWeight: bold ? 800 : 500 }}>{label}</span>
    <span style={{ fontSize: 13, color: bold ? OG : '#1A1A1A', fontWeight: bold ? 800 : 700 }}>{value}</span>
  </div>
);

export default function BalanceSheetPanel() {
  const fmtINR = useFmtCurrency();
  const [sheet, setSheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setSheet(await erpFetch('accounting/balance-sheet/')); }
    catch (err: any) { toast.error(err.message || 'Could not load balance sheet'); setSheet(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const exportPDF = async () => {
    if (!sheet) return;
    try { await downloadBalanceSheetPDF(sheet); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  if (loading) return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!sheet) return <div className="alert alert-danger">Could not load the balance sheet.</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B' }}>
          As of <strong style={{ color: '#1A1A1A' }}>{sheet.as_of_date}</strong>
        </div>
        <button onClick={exportPDF} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-pdf" style={{ marginRight: 6, color: '#C9883A' }} />Export PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        <Card3D accent="#1d4ed8">
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 14, color: '#1A1A1A', marginBottom: 6 }}>
            <i className="fas fa-building-columns" style={{ marginRight: 8, color: '#1d4ed8' }} />Assets
          </div>
          <Row label="Accounts Receivable" value={fmtINR(sheet.assets?.accounts_receivable)} />
          <Row label="Cash & Bank" value={fmtINR(sheet.assets?.cash_and_bank)} />
          <Row label="Total Assets" value={fmtINR(sheet.assets?.total_assets)} bold />
        </Card3D>

        <Card3D accent="#ef4444">
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 14, color: '#1A1A1A', marginBottom: 6 }}>
            <i className="fas fa-file-invoice-dollar" style={{ marginRight: 8, color: '#ef4444' }} />Liabilities
          </div>
          <Row label="Accounts Payable" value={fmtINR(sheet.liabilities?.accounts_payable)} />
          <Row label="Total Liabilities" value={fmtINR(sheet.liabilities?.total_liabilities)} bold />
        </Card3D>

        <Card3D accent="#10b981">
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 14, color: '#1A1A1A', marginBottom: 6 }}>
            <i className="fas fa-balance-scale" style={{ marginRight: 8, color: '#10b981' }} />Equity
          </div>
          <Row label="Retained Earnings" value={fmtINR(sheet.equity?.retained_earnings)} />
          <Row label="Total Equity" value={fmtINR(sheet.equity?.total_equity)} bold />
        </Card3D>
      </div>

      <div style={{ marginTop: 20, background: WHITE, borderRadius: 12, border: `1px solid ${BORDER}`, padding: '14px 18px', fontFamily: FF, fontSize: 11.5, color: '#6B6B6B' }}>
        <i className="fas fa-info-circle" style={{ marginRight: 6, color: OG }} />
        This is a simplified single-entity balance sheet derived from real cross-module data (Invoicing, Procurement). Cash &amp; Bank is a proxy from total payments collected, not a true cash-position calculation, and Retained Earnings is a plug figure (Total Assets − Total Liabilities).
      </div>
    </div>
  );
}
