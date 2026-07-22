import { useState } from 'react';
import { isSuperUser } from '../../../../hooks/useERPApi';
import SalaryStructuresModule from './SalaryStructuresModule';
import GeneratePayrollModule from './GeneratePayrollModule';
import PayrollReportsModule from './PayrollReportsModule';
import MyPayslipsModule from './MyPayslipsModule';

const C = { orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B', border: 'rgba(0,0,0,0.07)' };

type Tab = 'salary' | 'generate' | 'reports' | 'payslips';

export default function PayrollHubModule() {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<Tab>(isAdmin ? 'salary' : 'payslips');

  const tabs: { key: Tab; label: string; adminOnly?: boolean }[] = [
    { key: 'salary', label: 'Salary Setup', adminOnly: true },
    { key: 'generate', label: 'Generate Payroll', adminOnly: true },
    { key: 'reports', label: 'Payroll Reports', adminOnly: true },
    { key: 'payslips', label: 'My Payslips' },
  ];
  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>Payroll</h4>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: C.white, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, width: 'fit-content', flexWrap: 'wrap' }}>
        {visibleTabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            border: 'none', borderRadius: 7, padding: '9px 18px',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
            cursor: 'pointer', transition: 'background 0.18s, color 0.18s', whiteSpace: 'nowrap',
            background: tab === t.key ? C.orangeGrad : 'transparent',
            color: tab === t.key ? '#fff' : C.muted,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'salary' && isAdmin && <SalaryStructuresModule />}
      {tab === 'generate' && isAdmin && <GeneratePayrollModule />}
      {tab === 'reports' && isAdmin && <PayrollReportsModule />}
      {tab === 'payslips' && <MyPayslipsModule />}
    </div>
  );
}
