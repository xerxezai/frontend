import { useEffect, useState } from 'react';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';
import {
  DARK, BORDER, RED, AMBER, SectionCard, SectionHead, Skeleton, ErrorRetry, EmptyState,
  ActionBtn, CountBadge, FF, TH, TD,
} from './executiveShared';
import { daysUntil, fmtShortDate, todayISO } from './executiveData';

export default function RiskComplianceTab({ onGoToApprovals }: { onGoToApprovals: () => void }) {
  const { formatAmount } = useCurrency();
  const invoices = useERPList<any>('invoicing/invoices/');
  const bills = useERPList<any>('procurement/bills/');
  const shipments = useERPList<any>('logistics/shipments/');
  const leaves = useERPList<any>('hr/leave-requests/');
  const expenses = useERPList<any>('accounting/expenses/');
  const overtime = useERPList<any>('hr/overtime/');

  const [expiringDocs, setExpiringDocs] = useState<any[]>([]);
  const [docsState, setDocsState] = useState<'loading' | 'ok' | 'error' | 'forbidden'>('loading');
  const loadDocs = () => {
    setDocsState('loading');
    erpFetch('hr/documents/expiring/')
      .then((d: any) => { setExpiringDocs(Array.isArray(d) ? d : []); setDocsState('ok'); })
      .catch((e: any) => setDocsState(String(e.message || '').includes('Admin only') ? 'forbidden' : 'error'));
  };
  useEffect(loadDocs, []);

  const overdueInvoices = invoices.data.filter((i: any) => i.is_overdue);
  const overdueInvoicesTotal = overdueInvoices.reduce((s: number, i: any) => {
    const bal = i.balance != null ? Number(i.balance) : Math.max(Number(i.total || 0) - Number(i.amount_paid || 0), 0);
    return s + bal;
  }, 0);

  const overdueBills = bills.data.filter((b: any) => b.is_overdue);
  const overdueBillsTotal = overdueBills.reduce((s: number, b: any) => s + Number(b.amount || 0), 0);

  const overdueShipments = shipments.data.filter((s: any) =>
    !['delivered', 'cancelled', 'returned'].includes(s.status) && s.estimated_delivery && s.estimated_delivery < todayISO(),
  );

  const pendingLeaves = leaves.data.filter((l: any) => l.status === 'pending').length;
  const pendingExpenses = expenses.data.filter((e: any) => e.status === 'pending').length;
  const pendingOvertime = overtime.data.filter((o: any) => o.status === 'pending').length;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }} className="exec-kpi-grid">
        <style>{`@media (max-width:900px){ .exec-kpi-grid{grid-template-columns:1fr 1fr!important} }`}</style>
        <AlertCard title="Overdue Invoices" count={overdueInvoices.length} detail={overdueInvoices.length ? formatAmount(overdueInvoicesTotal) : undefined} tone="red" />
        <AlertCard title="Expiring Documents" count={docsState === 'ok' ? expiringDocs.length : 0} detail="Next 30 days" tone="amber" loading={docsState === 'loading'} forbidden={docsState === 'forbidden'} />
        <AlertCard title="Overdue Deliveries" count={overdueShipments.length} detail="Past expected delivery" tone="amber" loading={shipments.loading} />
        <AlertCard title="Overdue Bills" count={overdueBills.length} detail={overdueBills.length ? formatAmount(overdueBillsTotal) : undefined} tone="red" loading={bills.loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: 18 }} className="exec-3col">
        <style>{`@media (max-width:1150px){ .exec-3col{grid-template-columns:1fr 1fr!important} } @media (max-width:760px){ .exec-3col{grid-template-columns:1fr!important} }`}</style>

        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Document Expiry" subtitle="Employee documents" /></div>
          {docsState === 'loading' ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={160} /></div> : docsState === 'forbidden' ? (
            <div style={{ padding: '0 22px 22px' }}><EmptyState message="Admin access is required to view document expiry." /></div>
          ) : docsState === 'error' ? <ErrorRetry onRetry={loadDocs} /> : expiringDocs.length === 0 ? (
            <div style={{ padding: '0 22px 22px' }}><EmptyState message="No documents expiring soon." /></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#fafbfc' }}>{['Employee', 'Document', 'Expiry', 'Remaining'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  {expiringDocs.slice(0, 8).map((d: any) => {
                    const expired = d.days_until_expiry < 0;
                    return (
                      <tr key={d.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                        <td style={{ ...TD, fontWeight: 700 }}>{d.employee_name}</td>
                        <td style={TD}>{d.doc_type_label}</td>
                        <td style={TD}>{fmtShortDate(d.expiry_date)}</td>
                        <td style={{ ...TD, fontWeight: 800, color: expired ? RED : AMBER }}>
                          {expired ? `${Math.abs(d.days_until_expiry)}d overdue` : `${d.days_until_expiry}d`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Overdue Deliveries" subtitle="Past expected delivery date" /></div>
          {shipments.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={160} /></div> : shipments.error ? <ErrorRetry onRetry={shipments.reload} /> : overdueShipments.length === 0 ? (
            <div style={{ padding: '0 22px 22px' }}><EmptyState message="No overdue deliveries." /></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#fafbfc' }}>{['Shipment #', 'Customer', 'Expected', 'Days Overdue'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  {overdueShipments.slice(0, 8).map((s: any) => (
                    <tr key={s.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                      <td style={{ ...TD, fontWeight: 700 }}>{s.shipment_number}</td>
                      <td style={TD}>{s.customer_name || '—'}</td>
                      <td style={TD}>{fmtShortDate(s.estimated_delivery)}</td>
                      <td style={{ ...TD, fontWeight: 800, color: RED }}>{-(daysUntil(s.estimated_delivery) ?? 0)}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Pending Approvals" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PendingRow label="Expense approvals" count={pendingExpenses} onReview={onGoToApprovals} />
            <PendingRow label="Overtime approvals" count={pendingOvertime} onReview={onGoToApprovals} />
            <PendingRow label="Leave approvals" count={pendingLeaves} onReview={onGoToApprovals} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

const AlertCard = ({ title, count, detail, tone, loading, forbidden }: {
  title: string; count: number; detail?: string; tone: 'red' | 'amber'; loading?: boolean; forbidden?: boolean;
}) => {
  if (forbidden) {
    return (
      <div style={{ background: '#F4F7FA', borderRadius: 14, border: `1px solid ${BORDER}`, padding: '16px 18px', fontFamily: FF }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>Admin only</div>
      </div>
    );
  }
  if (!loading && count === 0) {
    return (
      <div style={{ background: 'rgba(16,185,129,0.06)', borderLeft: '4px solid #10b981', borderRadius: 10, padding: '14px 18px', fontFamily: FF }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: DARK }}>{title}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#10b981', marginTop: 4 }}>0</div>
      </div>
    );
  }
  const color = tone === 'red' ? RED : AMBER;
  return (
    <div style={{ background: tone === 'red' ? 'rgba(217,53,34,0.07)' : 'rgba(245,158,11,0.09)', borderLeft: `4px solid ${color}`, borderRadius: 10, padding: '14px 18px', fontFamily: FF }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: DARK }}>{title}</div>
      {loading ? <Skeleton h={22} w="50%" /> : (
        <>
          <div style={{ fontSize: 22, fontWeight: 900, color, marginTop: 4 }}>{count}</div>
          {detail && <div style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>{detail}</div>}
        </>
      )}
    </div>
  );
};

const PendingRow = ({ label, count, onReview }: { label: string; count: number; onReview: () => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
    <span style={{ fontFamily: FF, fontSize: 12.5, color: DARK, fontWeight: 600 }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <CountBadge n={count} />
      {count > 0 && <ActionBtn onClick={onReview}>Review</ActionBtn>}
    </div>
  </div>
);
