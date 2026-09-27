import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';
import {
  OG, BORDER, SectionCard, SectionHead, Skeleton, ErrorRetry, EmptyState, ActionBtn,
  CountBadge, FF, TH, TD,
} from './executiveShared';
import { fmtShortDate } from './executiveData';

export default function ApprovalsTab() {
  const { formatAmount } = useCurrency();
  const leaves = useERPList<any>('hr/leave-requests/');
  const expenses = useERPList<any>('accounting/expenses/');
  const overtime = useERPList<any>('hr/overtime/');
  const purchaseOrders = useERPList<any>('procurement/purchase-orders/');

  const [busy, setBusy] = useState<string | null>(null);

  const pendingLeaves = leaves.data.filter((l: any) => l.status === 'pending');
  const pendingExpenses = expenses.data.filter((e: any) => e.status === 'pending');
  const pendingOvertime = overtime.data.filter((o: any) => o.status === 'pending');
  const draftPOs = purchaseOrders.data.filter((p: any) => p.status === 'draft');

  const decideLeave = async (id: number, action: 'approved' | 'rejected') => {
    setBusy(`leave-${id}`);
    try {
      await erpFetch(`hr/leave-requests/${id}/approve/`, { method: 'PATCH', body: JSON.stringify({ action }) });
      toast.success(`Leave request ${action}`);
      leaves.reload();
    } catch (e: any) { toast.error(e.message || 'Could not update this leave request'); }
    finally { setBusy(null); }
  };

  const decideExpense = async (id: number, status: 'approved' | 'rejected') => {
    setBusy(`expense-${id}`);
    try {
      await erpFetch(`accounting/expenses/${id}/approve/`, { method: 'PUT', body: JSON.stringify({ status }) });
      toast.success(`Expense ${status}`);
      expenses.reload();
    } catch (e: any) { toast.error(e.message || 'Could not update this expense'); }
    finally { setBusy(null); }
  };

  const decideOvertime = async (id: number, action: 'approved' | 'rejected') => {
    setBusy(`overtime-${id}`);
    try {
      await erpFetch(`hr/overtime/${id}/approve/`, { method: 'PATCH', body: JSON.stringify({ action }) });
      toast.success(`Overtime ${action}`);
      overtime.reload();
    } catch (e: any) { toast.error(e.message || 'Could not update this overtime entry'); }
    finally { setBusy(null); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SectionCard noPad>
        <div style={{ padding: '20px 22px 4px' }}>
          <SectionHead title="Leave Requests" action={<CountBadge n={pendingLeaves.length} />} />
        </div>
        {leaves.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={120} /></div> : leaves.error ? <ErrorRetry onRetry={leaves.reload} /> : pendingLeaves.length === 0 ? (
          <div style={{ padding: '0 22px 22px' }}><EmptyState message="All caught up — no leave requests pending." /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Employee', 'Type', 'Days', 'From → To', ''].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {pendingLeaves.map((l: any) => (
                  <tr key={l.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD, fontWeight: 700 }}>{l.employee_name}</td>
                    <td style={{ ...TD, textTransform: 'capitalize' }}>{l.type}</td>
                    <td style={{ ...TD, fontWeight: 700 }}>{l.days}</td>
                    <td style={TD}>{fmtShortDate(l.from_date)} → {fmtShortDate(l.to_date)}</td>
                    <td style={TD}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <ActionBtn tone="approve" disabled={busy === `leave-${l.id}`} onClick={() => decideLeave(l.id, 'approved')}>Approve</ActionBtn>
                        <ActionBtn tone="reject" disabled={busy === `leave-${l.id}`} onClick={() => decideLeave(l.id, 'rejected')}>Reject</ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard noPad>
        <div style={{ padding: '20px 22px 4px' }}>
          <SectionHead title="Expense Claims" action={<CountBadge n={pendingExpenses.length} />} />
        </div>
        {expenses.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={120} /></div> : expenses.error ? <ErrorRetry onRetry={expenses.reload} /> : pendingExpenses.length === 0 ? (
          <div style={{ padding: '0 22px 22px' }}><EmptyState message="All caught up — no expense claims pending." /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Expense #', 'Category', 'Amount', 'Paid By', ''].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {pendingExpenses.map((e: any) => (
                  <tr key={e.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD, fontWeight: 700 }}>{e.expense_number}</td>
                    <td style={TD}>{e.category}</td>
                    <td style={{ ...TD, fontWeight: 700, color: OG }}>{formatAmount(e.amount)}</td>
                    <td style={TD}>{e.paid_by || '—'}</td>
                    <td style={TD}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <ActionBtn tone="approve" disabled={busy === `expense-${e.id}`} onClick={() => decideExpense(e.id, 'approved')}>Approve</ActionBtn>
                        <ActionBtn tone="reject" disabled={busy === `expense-${e.id}`} onClick={() => decideExpense(e.id, 'rejected')}>Reject</ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard noPad>
        <div style={{ padding: '20px 22px 4px' }}>
          <SectionHead title="Overtime Requests" action={<CountBadge n={pendingOvertime.length} />} />
        </div>
        {overtime.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={120} /></div> : overtime.error ? <ErrorRetry onRetry={overtime.reload} /> : pendingOvertime.length === 0 ? (
          <div style={{ padding: '0 22px 22px' }}><EmptyState message="All caught up — no overtime requests pending." /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Employee', 'Hours', 'Rate', 'Cost', ''].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {pendingOvertime.map((o: any) => (
                  <tr key={o.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD, fontWeight: 700 }}>{o.employee_name}</td>
                    <td style={TD}>{Number(o.extra_hours).toFixed(1)}h</td>
                    <td style={TD}>{o.rate}</td>
                    <td style={{ ...TD, fontWeight: 700, color: OG }}>{formatAmount(o.amount)}</td>
                    <td style={TD}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <ActionBtn tone="approve" disabled={busy === `overtime-${o.id}`} onClick={() => decideOvertime(o.id, 'approved')}>Approve</ActionBtn>
                        <ActionBtn tone="reject" disabled={busy === `overtime-${o.id}`} onClick={() => decideOvertime(o.id, 'rejected')}>Reject</ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard noPad>
        <div style={{ padding: '20px 22px 4px' }}>
          <SectionHead
            title="Purchase Orders Pending Review"
            subtitle="Procurement has no dedicated approval field — these are drafts not yet sent to a supplier"
            action={<CountBadge n={draftPOs.length} />}
          />
        </div>
        {purchaseOrders.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={120} /></div> : purchaseOrders.error ? <ErrorRetry onRetry={purchaseOrders.reload} /> : draftPOs.length === 0 ? (
          <div style={{ padding: '0 22px 22px' }}><EmptyState message="No draft purchase orders." /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['PO Number', 'Supplier', 'Total', ''].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {draftPOs.map((p: any) => (
                  <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD, fontWeight: 700 }}>{p.po_number}</td>
                    <td style={TD}>{p.supplier_name}</td>
                    <td style={{ ...TD, fontWeight: 700, color: OG }}>{formatAmount(p.total)}</td>
                    <td style={TD}>
                      <Link to="/erp/procurement/purchase-orders" style={{ fontFamily: FF, fontSize: 11.5, fontWeight: 700, color: OG, textDecoration: 'none' }}>Review in Procurement →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
