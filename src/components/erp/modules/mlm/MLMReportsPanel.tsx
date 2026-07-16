import { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { erpFetch, erpDownload } from '../../../../hooks/useERPApi';
import { OG, FF, WHITE, BORDER, useFmtCurrency, today } from './mlmShared';
import { downloadMLMReportPDF } from './pdf';
import { useCurrency } from '../../../../context/CurrencyContext';

type Period = 'monthly' | 'quarterly' | 'yearly';

interface TopPerformer { id: number; distributor_id: string; name: string; level: number; total_sales: number; total_earnings: number; }
interface DashboardData {
  top_performers: TopPerformer[];
  monthly_commissions: { month: string; total: number }[];
  commission_by_level: { level: number; total: number }[];
}

const ChartTooltip = ({ active, payload, label }: any) => {
  const fmtINR = useFmtCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} style={{ fontSize: 11.5, color: p.color ?? p.payload?.fill, fontWeight: 600 }}>{fmtINR(p.value)}</div>
      ))}
    </div>
  );
};

/** Backend only returns a trailing 6-month window, so Quarterly/Yearly views bucket that same
 *  window coarser client-side rather than requesting more history from the server. */
function bucketByPeriod(monthly: { month: string; total: number }[], period: Period) {
  if (period === 'monthly') return monthly.map(m => ({ label: m.month, total: m.total }));
  if (period === 'yearly') {
    const total = monthly.reduce((s, m) => s + m.total, 0);
    return [{ label: 'Last 6 Months', total }];
  }
  // quarterly — group the trailing 6 months into 2 buckets of 3
  const buckets: { label: string; total: number }[] = [];
  for (let i = 0; i < monthly.length; i += 3) {
    const chunk = monthly.slice(i, i + 3);
    const total = chunk.reduce((s, m) => s + m.total, 0);
    buckets.push({ label: `${chunk[0]?.month} – ${chunk[chunk.length - 1]?.month}`, total });
  }
  return buckets;
}

export default function MLMReportsPanel() {
  const fmtINR = useFmtCurrency();
  const { symbol } = useCurrency();
  const [period, setPeriod] = useState<Period>('monthly');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await erpFetch('mlm/dashboard/')); }
    catch { /* handled by empty state below */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const buckets = useMemo(() => data ? bucketByPeriod(data.monthly_commissions, period) : [], [data, period]);

  const exportCSV = async () => {
    try { await erpDownload('mlm/commissions/export-csv/', `mlm-commissions-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const exportPDF = async () => {
    if (!data) return;
    setExportingPdf(true);
    try {
      await downloadMLMReportPDF({
        periodLabel: period.charAt(0).toUpperCase() + period.slice(1),
        buckets,
        topPerformers: data.top_performers,
        commissionByLevel: data.commission_by_level,
      });
    } catch (err: any) { toast.error(err.message || 'Could not generate PDF'); }
    finally { setExportingPdf(false); }
  };

  if (loading) return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!data) return <div className="alert alert-danger">Could not load MLM reports.</div>;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-flex', gap: 3, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: 4 }}>
          {(['monthly', 'quarterly', 'yearly'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{
                borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 12.5,
                background: period === p ? OG : 'transparent', color: period === p ? '#fff' : '#6B6B6B', border: 'none', textTransform: 'capitalize',
              }}>{p}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
            <i className="fas fa-file-csv" style={{ marginRight: 6, color: OG }} />Export CSV
          </button>
          <button onClick={exportPDF} disabled={exportingPdf} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: exportingPdf ? 'wait' : 'pointer', color: '#1A1A1A' }}>
            <i className={`fas ${exportingPdf ? 'fa-spinner fa-spin' : 'fa-file-pdf'}`} style={{ marginRight: 6, color: OG }} />Export PDF
          </button>
        </div>
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 22 }}>
        <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Commission Report by Period</div>
        <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Total commission amounts, bucketed {period}</div>
        {buckets.every(b => b.total === 0) ? (
          <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No commissions yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={buckets} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${symbol}${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(201,136,58,0.06)' }} />
              <Bar dataKey="total" fill={OG} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Top Performers</span>
          </div>
          {data.top_performers.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>No data yet.</div>
          ) : data.top_performers.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderTop: i ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(201,136,58,0.10)', color: OG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF, fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ flex: 1, fontFamily: FF, fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{p.name} <span style={{ color: '#9ca3af', fontWeight: 500 }}>(L{p.level})</span></span>
              <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 800, color: OG }}>{fmtINR(p.total_earnings)}</span>
            </div>
          ))}
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Level-wise Commission Breakdown</span>
          </div>
          {data.commission_by_level.map((l, i) => (
            <div key={l.level} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderTop: i ? `1px solid ${BORDER}` : 'none' }}>
              <span style={{ flex: 1, fontFamily: FF, fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Level {l.level}</span>
              <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 800, color: OG }}>{fmtINR(l.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
