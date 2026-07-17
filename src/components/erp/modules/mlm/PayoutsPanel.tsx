import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, useFmtCurrency, today, PAYOUT_STATUS, StatusBadge } from './mlmShared';
import { useCurrency } from '../../../../context/CurrencyContext';

const defPayout = { distributor: '', amount: '', payout_date: today(), method: 'bank', reference_number: '' };

export default function PayoutsPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const { symbol } = useCurrency();
  const payouts = useERPList<any>('mlm/payouts/');
  const distributors = useERPList<any>('mlm/distributors/');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [pF, setPF] = useState({ ...defPayout });
  const [filling, setFilling] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<{ order: string; amount: number }[]>([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payouts.data.filter((p: any) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (!q) return true;
      return [p.distributor_name, p.reference_number].some((v: any) => (v || '').toLowerCase().includes(q));
    });
  }, [payouts.data, search, statusFilter]);

  const close = () => setShowModal(false);

  const fillFromPending = async () => {
    if (!pF.distributor) { toast.error('Select a distributor first.'); return; }
    setFilling(true);
    try {
      const pending = await erpFetch(`mlm/commissions/?distributor=${pF.distributor}&status=pending`);
      const list = (Array.isArray(pending) ? pending : pending.results ?? [])
        // Zero-amount commissions shouldn't exist going forward (see the backend's
        // zero-total guard), but excluded defensively here too since old data may linger.
        .filter((c: any) => Number(c.amount || 0) > 0);
      const total = list.reduce((s: number, c: any) => s + Number(c.amount || 0), 0);
      setPF(f => ({ ...f, amount: total.toFixed(2) }));
      setBreakdown(list.map((c: any) => ({ order: c.order_number || (c.order ? `Order #${c.order}` : 'Manual commission'), amount: Number(c.amount || 0) })));
      toast.success(`Filled from ${list.length} pending commission${list.length === 1 ? '' : 's'}`);
    } catch (err: any) { toast.error(err.message || 'Could not fetch pending commissions'); }
    finally { setFilling(false); }
  };

  const savePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pF.distributor) { toast.error('Please select a distributor.'); return; }
    if (!pF.amount || Number(pF.amount) <= 0) { toast.error('Amount must be greater than 0.'); return; }
    try {
      await payouts.create({
        distributor: Number(pF.distributor), amount: Number(pF.amount), payout_date: pF.payout_date,
        method: pF.method, reference_number: pF.reference_number,
      });
      toast.success('Payout created');
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const processPayout = async (payout: any) => {
    setBusyId(payout.id);
    try { await erpFetch(`mlm/payouts/${payout.id}/process/`, { method: 'PUT' }); toast.success(`Payout #${payout.id} advanced`); payouts.reload(); }
    catch (err: any) { toast.error(err.message || 'Could not process payout'); }
    finally { setBusyId(null); }
  };

  const exportCSV = async () => {
    try { await erpDownload('mlm/payouts/export-csv/', `payouts-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'id', label: 'Payout ID', render: (r: any) => `#${r.id}` },
    { key: 'distributor_name', label: 'Distributor', render: (r: any) => r.distributor_name || '—' },
    { key: 'commission', label: 'Commission', render: (r: any) => r.commission ? `#${r.commission}${r.commission_order_number ? ` (${r.commission_order_number})` : ''}` : '—' },
    { key: 'amount', label: 'Amount', render: (r: any) => fmtINR(r.amount) },
    { key: 'payout_date', label: 'Date' },
    { key: 'method', label: 'Method', render: (r: any) => (r.method || '').toUpperCase() },
    { key: 'reference_number', label: 'Reference', render: (r: any) => r.reference_number || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={PAYOUT_STATUS} /> },
    {
      key: 'quickActions', label: 'Actions',
      render: (r: any) => r.status !== 'completed' ? (
        <button title="Pay — advances this payout toward Paid" disabled={busyId === r.id} onClick={() => processPayout(r)}
          style={{ background: 'rgba(29,78,216,0.08)', color: '#1d4ed8', border: '1px solid rgba(29,78,216,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
          <i className={`fas ${busyId === r.id ? 'fa-spinner fa-spin' : 'fa-hand-holding-usd'}`} style={{ fontSize: 10 }} />
        </button>
      ) : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search distributor or reference…" style={{ ...inp, width: 220, paddingLeft: 30 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 150 }}>
            <option value="all">All Status</option>
            {Object.entries(PAYOUT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Payouts" columns={cols} data={filtered} loading={payouts.loading} error={payouts.error} isAdmin={isAdmin}
        onAdd={() => { setPF({ ...defPayout }); setBreakdown([]); setShowModal(true); }} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Add Payout</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={savePayout} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Distributor *</label>
                <select value={pF.distributor} onChange={e => { setPF(f => ({ ...f, distributor: e.target.value })); setBreakdown([]); }} style={inp} required>
                  <option value="">— Select distributor —</option>
                  {distributors.data.map((d: any) => <option key={d.id} value={d.id}>{d.distributor_id} — {d.name}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Amount ({symbol}) *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="number" value={pF.amount} onChange={e => setPF(f => ({ ...f, amount: e.target.value }))} style={inp} required step="0.01" min="0.01" />
                  <button type="button" onClick={fillFromPending} disabled={filling}
                    style={{ background: 'rgba(201,136,58,0.08)', border: '1px solid rgba(201,136,58,0.22)', borderRadius: 9, padding: '0 12px', fontFamily: FF, fontWeight: 700, fontSize: 11.5, cursor: filling ? 'wait' : 'pointer', color: '#C9883A', whiteSpace: 'nowrap' }}>
                    {filling ? 'Filling…' : 'Fill from pending'}
                  </button>
                </div>
                {breakdown.length > 0 && (
                  <div style={{ marginTop: 8, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9, padding: '8px 12px' }}>
                    <div style={{ fontFamily: FF, fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Included commissions</div>
                    {breakdown.map((b, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FF, fontSize: 12, color: '#1A1A1A', padding: '2px 0' }}>
                        <span>{b.order}</span><span style={{ fontWeight: 700 }}>{fmtINR(b.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Date</label><input type="date" value={pF.payout_date} onChange={e => setPF(f => ({ ...f, payout_date: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Method</label>
                  <select value={pF.method} onChange={e => setPF(f => ({ ...f, method: e.target.value }))} style={inp}>
                    <option value="bank">Bank</option><option value="upi">UPI</option><option value="cash">Cash</option>
                  </select>
                </div>
              </div>
              <div><label style={lbl}>Reference Number</label><input value={pF.reference_number} onChange={e => setPF(f => ({ ...f, reference_number: e.target.value }))} style={inp} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
