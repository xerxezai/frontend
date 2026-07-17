import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';
import { FF, WHITE, BORDER, inp, lbl, useFmtCurrency, KpiCard, OG } from './accountingShared';
import { downloadTaxReportPDF } from './pdf';

type PeriodType = 'monthly' | 'quarterly' | 'yearly';

const now = new Date();
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function TaxReportsPanel() {
  const fmtINR = useFmtCurrency();
  const { selectedCurrency } = useCurrency();
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ period: periodType, year: String(year), month: String(month) });
      setReport(await erpFetch(`accounting/tax-report/?${params.toString()}`));
    } catch (err: any) {
      toast.error(err.message || 'Could not load tax report');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [periodType, year, month]);

  useEffect(() => { load(); }, [load]);

  const exportPDF = async () => {
    if (!report) return;
    try { await downloadTaxReportPDF(report); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 4 + i);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
          <div>
            <label style={lbl}>Period</label>
            <select value={periodType} onChange={e => setPeriodType(e.target.value as PeriodType)} style={{ ...inp, width: 140 }}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Year</label>
            <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ ...inp, width: 110 }}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {periodType === 'monthly' && (
            <div>
              <label style={lbl}>Month</label>
              <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ ...inp, width: 150 }}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
          )}
          {periodType === 'quarterly' && (
            <div>
              <label style={lbl}>Quarter</label>
              <select value={Math.ceil(month / 3)} onChange={e => setMonth((Number(e.target.value) - 1) * 3 + 1)} style={{ ...inp, width: 130 }}>
                <option value={1}>Q1 (Jan–Mar)</option>
                <option value={2}>Q2 (Apr–Jun)</option>
                <option value={3}>Q3 (Jul–Sep)</option>
                <option value={4}>Q4 (Oct–Dec)</option>
              </select>
            </div>
          )}
        </div>
        <button onClick={exportPDF} disabled={!report} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: report ? 'pointer' : 'not-allowed', color: '#1A1A1A', opacity: report ? 1 : 0.6 }}>
          <i className="fas fa-file-pdf" style={{ marginRight: 6, color: '#C9883A' }} />Export PDF
        </button>
      </div>

      {loading ? (
        <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>
      ) : !report ? (
        <div className="alert alert-danger">Could not load the tax report.</div>
      ) : (
        <>
          {selectedCurrency !== 'INR' && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14,
              background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a',
              borderRadius: 10, padding: '11px 14px', fontFamily: FF, fontSize: 12, lineHeight: 1.5,
            }}>
              <i className="fas fa-exclamation-triangle" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                Tax jurisdiction is set to <strong>India (GST @ 18%)</strong> — these figures are the real GST computation, only converted for display into <strong>{selectedCurrency}</strong>. They are not a {selectedCurrency} tax computation and should not be used for UAE VAT filing.
              </div>
            </div>
          )}
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', marginBottom: 14 }}>
            Showing India GST summary for period <strong style={{ color: '#1A1A1A' }}>{report.period}</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <KpiCard icon="fas fa-sack-dollar" label="Total Revenue" value={fmtINR(report.total_revenue)} accent={OG} />
            <KpiCard icon="fas fa-arrow-down" label="Total Tax Collected" value={fmtINR(report.total_tax_collected)} accent="#1d4ed8" />
            <KpiCard icon="fas fa-arrow-up" label="Total Tax Paid" value={fmtINR(report.total_tax_paid)} accent="#7c3aed" />
            <KpiCard icon="fas fa-balance-scale" label="Net Tax" value={fmtINR(report.net_tax)} accent={Number(report.net_tax) >= 0 ? '#10b981' : '#ef4444'} />
          </div>
          <div style={{ marginTop: 16, background: WHITE, borderRadius: 12, border: `1px solid ${BORDER}`, padding: '14px 18px', fontFamily: FF, fontSize: 11.5, color: '#6B6B6B' }}>
            <i className="fas fa-info-circle" style={{ marginRight: 6, color: OG }} />
            Tax collected reflects GST on paid invoices only. Tax paid is estimated as 18% GST backed out of purchase order totals (a simplification, since purchase orders don't track tax separately).
          </div>
        </>
      )}
    </div>
  );
}
