import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OG, DARK, PAGE_BG, WHITE, BORDER, FF, FF_TITLE, LiveBadge, injectExecutiveKeyframes,
  isExecutiveAdmin,
} from './executiveShared';
import OverviewTab from './OverviewTab';
import FinancialPerformanceTab from './FinancialPerformanceTab';
import CommercialPipelineTab from './CommercialPipelineTab';
import WorkforceTab from './WorkforceTab';
import RiskComplianceTab from './RiskComplianceTab';
import ApprovalsTab from './ApprovalsTab';

type TabKey = 'overview' | 'financial' | 'pipeline' | 'workforce' | 'risk' | 'approvals';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'financial', label: 'Financial Performance' },
  { key: 'pipeline', label: 'Commercial Pipeline' },
  { key: 'workforce', label: 'Workforce' },
  { key: 'risk', label: 'Risk & Compliance' },
  { key: 'approvals', label: 'Approvals' },
];

export default function ExecutiveOverview() {
  const navigate = useNavigate();

  // Admin-only page: aggregates every module, so it's gated on is_staff/is_superuser rather
  // than one rbacModule. Checked again here (ERPPage.tsx's route guard checks the same thing)
  // so a direct deep-link never flashes real company data before the redirect lands.
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const ok = isExecutiveAdmin();
    setAllowed(ok);
    setChecked(true);
    if (!ok) navigate('/erp/dashboard', { replace: true });
  }, [navigate]);

  const [searchParams] = useSearchParams();
  const initialTab = TABS.some(t => t.key === searchParams.get('tab')) ? (searchParams.get('tab') as TabKey) : 'overview';
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [period, setPeriod] = useState<'monthly' | 'ytd'>('monthly');
  const [updatedAt, setUpdatedAt] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setUpdatedAt(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!checked || !allowed) return null;

  return (
    <div style={{ background: PAGE_BG, minHeight: '100%' }}>
      {injectExecutiveKeyframes()}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
        <div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#9CA3AF', fontWeight: 600, marginBottom: 4 }}>Executive / Overview</div>
          <h1 style={{ fontFamily: FF_TITLE, fontWeight: 800, fontSize: 28, color: DARK, margin: 0, letterSpacing: '-0.01em' }}>
            Executive Command Center
          </h1>
          <p style={{ fontFamily: FF, fontSize: 13, color: '#6B6B6B', margin: '6px 0 0' }}>
            Real-time company performance across all modules
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4, background: WHITE, borderRadius: 10, padding: 4, border: `1px solid ${BORDER}` }}>
            {([['monthly', 'Monthly'], ['ytd', 'YTD']] as [typeof period, string][]).map(([val, label]) => (
              <button key={val} onClick={() => setPeriod(val)} style={{
                border: 'none', borderRadius: 7, padding: '7px 14px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                background: period === val ? 'linear-gradient(145deg,#D93522 0%,#D93522 100%)' : 'transparent',
                color: period === val ? '#fff' : '#6B6B6B',
              }}>{label}</button>
            ))}
          </div>

          <button onClick={() => window.print()} style={{
            background: 'linear-gradient(145deg,#D93522 0%,#D93522 100%)', color: '#fff', border: 'none', borderRadius: 10,
            padding: '9px 18px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12M6 11l6 6 6-6M5 21h14" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <LiveBadge updatedAt={updatedAt} />
      </div>

      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 22, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              padding: '10px 16px', fontFamily: FF, fontWeight: 700, fontSize: 13,
              color: tab === t.key ? OG : '#6B6B6B',
              borderBottom: tab === t.key ? `2.5px solid ${OG}` : '2.5px solid transparent',
              marginBottom: -1, transition: 'color 180ms',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div key={tab} style={{ animation: 'execTabIn 220ms ease both' }}>
        {tab === 'overview' && <OverviewTab period={period} />}
        {tab === 'financial' && <FinancialPerformanceTab period={period} />}
        {tab === 'pipeline' && <CommercialPipelineTab />}
        {tab === 'workforce' && <WorkforceTab />}
        {tab === 'risk' && <RiskComplianceTab onGoToApprovals={() => setTab('approvals')} />}
        {tab === 'approvals' && <ApprovalsTab />}
      </div>
    </div>
  );
}
