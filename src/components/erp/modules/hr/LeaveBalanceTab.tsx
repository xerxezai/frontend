import { useEffect, useState } from 'react';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';

const C = { orange: '#C9883A', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B', border: 'rgba(0,0,0,0.07)' };

// Matches LEAVE_ANNUAL_ALLOWANCE in apps/hr/views.py — the only leave types with a pooled
// yearly cap; unpaid/maternity/paternity/other are uncapped and have no "balance" to show.
const CAPPED_TYPES = [
  { key: 'annual', label: 'Annual' },
  { key: 'sick', label: 'Sick' },
  { key: 'emergency', label: 'Emergency' },
];

export default function LeaveBalanceTab() {
  const employees = useERPList<any>('hr/employees/');
  const activeEmployees = employees.data.filter((e: any) => e.status === 'active');
  const [balances, setBalances] = useState<Record<number, Record<string, any>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employees.loading) return;
    if (activeEmployees.length === 0) { setLoading(false); return; }
    setLoading(true);
    const lookups = activeEmployees.flatMap((emp: any) =>
      CAPPED_TYPES.map(t =>
        erpFetch(`hr/leave-requests/balance/?employee=${emp.id}&leave_type=${t.key}`)
          .then(res => ({ empId: emp.id, type: t.key, res }))
          .catch(() => ({ empId: emp.id, type: t.key, res: null })),
      ),
    );
    Promise.all(lookups).then(results => {
      const grouped: Record<number, Record<string, any>> = {};
      results.forEach(({ empId, type, res }) => {
        grouped[empId] = grouped[empId] || {};
        grouped[empId][type] = res;
      });
      setBalances(grouped);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees.loading, activeEmployees.length]);

  if (employees.loading || loading) {
    return <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>;
  }
  if (activeEmployees.length === 0) {
    return <div style={{ padding: 48, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>No active employees.</div>;
  }

  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
          <thead>
            <tr style={{ background: '#fafaf9' }}>
              {['Employee', ...CAPPED_TYPES.map(t => t.label)].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeEmployees.map((emp: any) => (
              <tr key={emp.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '11px 16px', fontWeight: 700, color: C.dark, whiteSpace: 'nowrap' }}>{emp.full_name}</td>
                {CAPPED_TYPES.map(t => {
                  const b = balances[emp.id]?.[t.key];
                  if (!b) return <td key={t.key} style={{ padding: '11px 16px', color: '#9ca3af' }}>—</td>;
                  const low = b.remaining <= 2;
                  return (
                    <td key={t.key} style={{ padding: '11px 16px' }}>
                      <span style={{ fontWeight: 700, color: low ? '#ef4444' : '#10b981' }}>{b.remaining}</span>
                      <span style={{ color: C.muted }}> / {b.allowance} days</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
