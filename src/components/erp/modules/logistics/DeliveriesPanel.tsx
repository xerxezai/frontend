import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, today, DELIVERY_STATUS, StatusBadge } from './logisticsShared';

const defDelivery = { shipment: '', delivery_date: today(), delivered_by: '', notes: '', status: 'delivered' };

export default function DeliveriesPanel() {
  const isAdmin = isSuperUser();
  const deliveries = useERPList<any>('logistics/deliveries/');
  const shipments = useERPList<any>('logistics/shipments/');

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [dF, setDF] = useState({ ...defDelivery });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return deliveries.data;
    return deliveries.data.filter((d: any) =>
      [d.shipment_number, d.tracking_number, d.customer_name, d.carrier, d.delivered_by].some(v => (v || '').toLowerCase().includes(q))
    );
  }, [deliveries.data, search]);

  const close = () => { setShowModal(false); setEditing(null); };

  const saveDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dF.shipment) { toast.error('Please select a shipment.'); return; }
    try {
      const body: any = { ...dF, shipment: Number(dF.shipment) };
      if (editing) { await deliveries.update(editing.id, body); toast.success('Delivery updated'); }
      else { await deliveries.create(body); toast.success('Delivery recorded'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await deliveries.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const cols = [
    { key: 'shipment_number', label: 'Shipment #', render: (r: any) => r.shipment_number || '—' },
    { key: 'tracking_number', label: 'Tracking #', render: (r: any) => r.tracking_number || '—' },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'carrier', label: 'Carrier', render: (r: any) => r.carrier || '—' },
    { key: 'delivery_date', label: 'Delivery Date', render: (r: any) => r.delivery_date || '—' },
    { key: 'delivered_by', label: 'Delivered By', render: (r: any) => r.delivered_by || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={DELIVERY_STATUS} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracking # or delivered by…" style={{ ...inp, width: 260, paddingLeft: 30 }} />
        </div>
      </div>

      <ERPTable title="Deliveries" columns={cols} data={filtered} loading={deliveries.loading || shipments.loading} error={deliveries.error} isAdmin={isAdmin}
        onAdd={() => { setDF({ ...defDelivery }); setEditing(null); setShowModal(true); }}
        onEdit={r => {
          setEditing(r);
          setDF({ shipment: String(r.shipment || ''), delivery_date: r.delivery_date || today(), delivered_by: r.delivered_by || '', notes: r.notes || '', status: r.status || 'delivered' });
          setShowModal(true);
        }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Delivery' : 'Record Delivery'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveDelivery} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Shipment *</label>
                <select value={dF.shipment} onChange={e => setDF(f => ({ ...f, shipment: e.target.value }))} style={inp} required>
                  <option value="">— Select shipment —</option>
                  {shipments.data.map((s: any) => <option key={s.id} value={s.id}>{s.tracking_number}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Delivery Date</label><input type="date" value={dF.delivery_date} onChange={e => setDF(f => ({ ...f, delivery_date: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Delivered By</label><input value={dF.delivered_by} onChange={e => setDF(f => ({ ...f, delivered_by: e.target.value }))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Status</label>
                <select value={dF.status} onChange={e => setDF(f => ({ ...f, status: e.target.value }))} style={inp}>
                  {Object.entries(DELIVERY_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Notes</label><textarea value={dF.notes} onChange={e => setDF(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
