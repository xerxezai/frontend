// Pure data-shaping helpers shared across Executive Overview tabs — every input here comes
// straight from an existing ERP list endpoint (invoices/bills/shipments/etc.), never mocked.

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function daysUntil(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export function fmtShortDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Builds a rolling last-N-months bucket keyed 'YYYY-MM', pre-seeded with zeros so months
 * with no records still render (avoids gaps/misleading flat lines in the chart). */
export function seedMonthBuckets(n: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    out.push({ key, label: `${MONTH_LABELS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}` });
  }
  return out;
}

export interface InvoiceMonthPoint { month: string; invoiced: number; collected: number; outstanding: number; collectionRate: number; }

/** Aggregates a raw invoices list (number/total/amount_paid/balance/issue_date/status) into a
 * 12-month trend. `total`/`amount_paid` are the same fields InvoicesPanel.tsx already renders. */
export function buildInvoiceMonthlySeries(invoices: any[], months = 12): InvoiceMonthPoint[] {
  const buckets = seedMonthBuckets(months);
  const byKey: Record<string, { invoiced: number; collected: number }> = {};
  buckets.forEach(b => { byKey[b.key] = { invoiced: 0, collected: 0 }; });

  invoices.forEach((inv: any) => {
    if (!inv.issue_date) return;
    const d = new Date(inv.issue_date);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byKey[key]) return;
    const total = Number(inv.total || 0);
    const paid = Number(inv.amount_paid || 0);
    if (inv.status !== 'cancelled') byKey[key].invoiced += total;
    byKey[key].collected += paid;
  });

  return buckets.map(b => {
    const { invoiced, collected } = byKey[b.key];
    const outstanding = Math.max(invoiced - collected, 0);
    return { month: b.label, invoiced, collected, outstanding, collectionRate: invoiced > 0 ? (collected / invoiced) * 100 : 0 };
  });
}

/** Groups invoices by customer and sums their outstanding balance — powers "Receivables by
 * client" and "Top 5 Customers by Revenue" without a dedicated backend aggregation endpoint. */
export function topCustomersByRevenue(invoices: any[], n = 5): { name: string; value: number }[] {
  const map = new Map<string, number>();
  invoices.forEach((inv: any) => {
    if (inv.status === 'cancelled') return;
    const name = inv.customer_name || 'Unknown';
    map.set(name, (map.get(name) || 0) + Number(inv.total || 0));
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

export function topOutstandingByClient(invoices: any[], n = 5): { name: string; value: number }[] {
  const map = new Map<string, number>();
  invoices.forEach((inv: any) => {
    const balance = inv.balance != null ? Number(inv.balance) : Math.max(Number(inv.total || 0) - Number(inv.amount_paid || 0), 0);
    if (balance <= 0) return;
    const name = inv.customer_name || 'Unknown';
    map.set(name, (map.get(name) || 0) + balance);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

export interface AgeingBucket { label: string; value: number; count: number; }

/** 0-30 / 31-60 / 61-90 / 90+ ageing buckets off each invoice's days-overdue, computed from
 * due_date — the same is_overdue signal InvoicesPanel/StatusBadge already key off. */
export function buildReceivablesAgeing(invoices: any[]): AgeingBucket[] {
  const buckets: AgeingBucket[] = [
    { label: '0-30 days', value: 0, count: 0 },
    { label: '31-60 days', value: 0, count: 0 },
    { label: '61-90 days', value: 0, count: 0 },
    { label: '90+ days', value: 0, count: 0 },
  ];
  invoices.forEach((inv: any) => {
    const balance = inv.balance != null ? Number(inv.balance) : Math.max(Number(inv.total || 0) - Number(inv.amount_paid || 0), 0);
    if (balance <= 0 || !inv.due_date) return;
    const overdue = -1 * (daysUntil(inv.due_date) ?? 0);
    if (overdue <= 0) return;
    const idx = overdue <= 30 ? 0 : overdue <= 60 ? 1 : overdue <= 90 ? 2 : 3;
    buckets[idx].value += balance;
    buckets[idx].count += 1;
  });
  return buckets;
}

export function sumBy<T>(arr: T[], fn: (item: T) => number): number {
  return arr.reduce((s, item) => s + (fn(item) || 0), 0);
}
