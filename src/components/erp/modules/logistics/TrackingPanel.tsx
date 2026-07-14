import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { Card3D, FF, OG, WHITE, BORDER, inp, SHIPMENT_STATUS, StatusBadge } from './logisticsShared';

const STEP_ORDER = ['pending', 'dispatched', 'in_transit', 'delivered'];
const STEP_LABEL: Record<string, string> = { pending: 'Created', dispatched: 'Dispatched', in_transit: 'In Transit', delivered: 'Delivered' };

export default function TrackingPanel() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) { toast.error('Enter a tracking number to search.'); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await erpFetch(`logistics/shipments/?search=${encodeURIComponent(q)}`);
      const list = Array.isArray(res) ? res : res.results ?? [];
      setShipment(list[0] ?? null);
      if (!list.length) toast.error('No shipment found for that tracking number.');
    } catch (err: any) {
      toast.error(err.message || 'Search failed');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const updates: any[] = shipment?.tracking_updates ?? [];
  const currentStepIdx = shipment ? Math.max(STEP_ORDER.indexOf(shipment.status), 0) : -1;
  const isTerminalOther = shipment && !STEP_ORDER.includes(shipment.status); // returned / cancelled

  return (
    <div>
      <Card3D style={{ marginBottom: 20 }} p="20px 22px">
        <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>Track a Shipment</div>
        <form onSubmit={search} style={{ display: 'flex', gap: 10 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter tracking number…" style={{ ...inp, flex: 1 }} />
          <button type="submit" disabled={loading} style={{ background: OG, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 22px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: loading ? 'wait' : 'pointer' }}>
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'}`} style={{ marginRight: 6 }} />Track
          </button>
        </form>
      </Card3D>

      {searched && !loading && !shipment && (
        <Card3D><div style={{ textAlign: 'center', padding: '32px 0', color: '#6B6B6B', fontFamily: FF }}>No shipment found for that tracking number.</div></Card3D>
      )}

      {shipment && (
        <Card3D p="22px 24px">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A' }}>{shipment.tracking_number}</div>
            <StatusBadge status={shipment.status} map={SHIPMENT_STATUS} />
          </div>
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', marginBottom: 20 }}>
            {shipment.shipment_number} · {shipment.customer_name || '—'} · {shipment.origin || '—'} → {shipment.destination || '—'}
          </div>

          {/* Stepper for the "happy path" statuses */}
          <div style={{ display: 'flex', marginBottom: updates.length ? 28 : 4 }}>
            {STEP_ORDER.map((step, i) => {
              const done = !isTerminalOther && i <= currentStepIdx;
              const isLast = i === STEP_ORDER.length - 1;
              return (
                <div key={step} style={{ flex: isLast ? '0 0 auto' : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      background: done ? OG : '#e5e7eb', color: done ? '#fff' : '#9ca3af',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: FF, fontWeight: 800, fontSize: 11,
                    }}>
                      {done ? <i className="fas fa-check" style={{ fontSize: 10 }} /> : i + 1}
                    </div>
                    {!isLast && <div style={{ flex: 1, height: 3, background: done && i < currentStepIdx ? OG : '#e5e7eb', marginLeft: 4, marginRight: 4 }} />}
                  </div>
                  <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: done ? '#1A1A1A' : '#9ca3af', marginTop: 8, textAlign: 'center' }}>
                    {STEP_LABEL[step]}
                  </div>
                </div>
              );
            })}
          </div>

          {isTerminalOther && (
            <div style={{ marginBottom: 20, padding: '10px 14px', borderRadius: 9, background: SHIPMENT_STATUS[shipment.status]?.bg, color: SHIPMENT_STATUS[shipment.status]?.color, fontFamily: FF, fontWeight: 700, fontSize: 12.5 }}>
              This shipment is currently marked {SHIPMENT_STATUS[shipment.status]?.label ?? shipment.status}.
            </div>
          )}

          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 12 }}>Tracking History</div>
          {updates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>No updates yet.</div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: 26 }}>
              <div style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 2, background: BORDER }} />
              {updates.map((u: any, i: number) => (
                <div key={u.id ?? i} style={{ position: 'relative', paddingBottom: i === updates.length - 1 ? 0 : 20 }}>
                  <div style={{ position: 'absolute', left: -26, top: 2, width: 16, height: 16, borderRadius: '50%', background: i === 0 ? OG : WHITE, border: `2px solid ${OG}` }} />
                  <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 12.5, color: '#1A1A1A' }}>
                    {(u.status || '').toString().replace(/_/g, ' ').toUpperCase()}
                    {u.location ? <span style={{ fontWeight: 500, color: '#6B6B6B' }}> — {u.location}</span> : null}
                  </div>
                  <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginTop: 2 }}>
                    {u.occurred_at ? new Date(u.occurred_at).toLocaleString() : '—'}
                  </div>
                  {u.description && <div style={{ fontFamily: FF, fontSize: 12, color: '#374151', marginTop: 4 }}>{u.description}</div>}
                </div>
              ))}
            </div>
          )}
        </Card3D>
      )}
    </div>
  );
}
