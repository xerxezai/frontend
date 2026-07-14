import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, today, SHIPMENT_STATUS, StatusBadge } from './logisticsShared';
import { downloadShipmentPDF } from './pdf';

const defShipment = {
  sales_order: '', customer: '', carrier: '', tracking_number: '',
  origin: '', destination: '', estimated_delivery: '', notes: '',
};

const NEXT_STATUS: Record<string, string> = {
  pending: 'dispatched', dispatched: 'in_transit', in_transit: 'delivered',
};

export default function ShipmentsPanel() {
  const isAdmin = isSuperUser();
  const shipments = useERPList<any>('logistics/shipments/');
  const salesOrders = useERPList<any>('sales/orders/');
  const customers = useERPList<any>('crm/customers/');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [sF, setSF] = useState({ ...defShipment });
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return shipments.data.filter((s: any) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (!q) return true;
      return [s.shipment_number, s.tracking_number, s.customer_name, s.carrier].some(v => (v || '').toLowerCase().includes(q));
    });
  }, [shipments.data, search, statusFilter]);

  const close = () => { setShowModal(false); setEditing(null); };

  const saveShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sF.customer) { toast.error('Please select a customer.'); return; }
    if (!sF.tracking_number.trim()) { toast.error('Tracking number is required.'); return; }
    if (!sF.destination.trim()) { toast.error('Destination is required.'); return; }
    try {
      const body: any = {
        customer: Number(sF.customer),
        sales_order: sF.sales_order ? Number(sF.sales_order) : null,
        carrier: sF.carrier, tracking_number: sF.tracking_number,
        origin: sF.origin, destination: sF.destination,
        estimated_delivery: sF.estimated_delivery || null, notes: sF.notes,
      };
      if (editing) { await shipments.update(editing.id, body); toast.success('Shipment updated'); }
      else { await shipments.create(body); toast.success('Shipment created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await shipments.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const advanceStatus = async (s: any) => {
    const next = NEXT_STATUS[s.status];
    if (!next) return;
    setBusyId(s.id);
    try {
      await erpFetch(`logistics/shipments/${s.id}/status/`, { method: 'PUT', body: JSON.stringify({ status: next }) });
      toast.success(`${s.shipment_number} marked ${next.replace(/_/g, ' ')}`);
      shipments.reload();
    } catch (err: any) { toast.error(err.message || 'Could not update status'); }
    finally { setBusyId(null); }
  };

  const downloadPDF = async (s: any) => {
    try { await downloadShipmentPDF(s); }
    catch (err: any) { toast.error(err.message || 'Could not generate PDF'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('logistics/shipments/export-csv/', `shipments-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'shipment_number', label: 'Shipment #' },
    { key: 'tracking_number', label: 'Tracking #', render: (r: any) => r.tracking_number || '—' },
    { key: 'customer_name', label: 'Customer', render: (r: any) => r.customer_name || '—' },
    { key: 'carrier', label: 'Carrier', render: (r: any) => r.carrier || '—' },
    { key: 'route', label: 'Origin → Destination', render: (r: any) => `${r.origin || '—'} → ${r.destination || '—'}` },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={SHIPMENT_STATUS} /> },
    { key: 'estimated_delivery', label: 'Est. Delivery', render: (r: any) => r.estimated_delivery || '—' },
    {
      key: 'quickActions', label: 'Quick Actions',
      render: (r: any) => (
        <div style={{ display: 'flex', gap: 5 }}>
          {NEXT_STATUS[r.status] && (
            <button title={`Mark ${NEXT_STATUS[r.status].replace(/_/g, ' ')}`} disabled={busyId === r.id} onClick={() => advanceStatus(r)}
              style={{ background: 'rgba(29,78,216,0.08)', color: '#1d4ed8', border: '1px solid rgba(29,78,216,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
              <i className={`fas ${busyId === r.id ? 'fa-spinner fa-spin' : 'fa-forward'}`} style={{ fontSize: 10 }} />
            </button>
          )}
          <button title="Download PDF" onClick={() => downloadPDF(r)}
            style={{ background: 'rgba(107,114,128,0.08)', color: '#374151', border: '1px solid rgba(107,114,128,0.22)', width: 28, height: 28, borderRadius: 6, cursor: 'pointer' }}>
            <i className="fas fa-file-pdf" style={{ fontSize: 10 }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search shipment/tracking #, customer, carrier…" style={{ ...inp, width: 260, paddingLeft: 30 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 150 }}>
            <option value="all">All Status</option>
            {Object.entries(SHIPMENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Shipments" columns={cols} data={filtered} loading={shipments.loading || customers.loading} error={shipments.error} isAdmin={isAdmin}
        onAdd={() => { setSF({ ...defShipment }); setEditing(null); setShowModal(true); }}
        onEdit={r => {
          setEditing(r);
          setSF({
            sales_order: String(r.sales_order || ''), customer: String(r.customer || ''),
            carrier: r.carrier || '', tracking_number: r.tracking_number || '',
            origin: r.origin || '', destination: r.destination || '',
            estimated_delivery: r.estimated_delivery || '', notes: r.notes || '',
          });
          setShowModal(true);
        }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 620 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Shipment' : 'Create Shipment'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveShipment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Sales Order</label>
                  <select value={sF.sales_order} onChange={e => {
                    const so = salesOrders.data.find((o: any) => String(o.id) === e.target.value);
                    setSF(f => ({ ...f, sales_order: e.target.value, customer: so ? String(so.customer) : f.customer }));
                  }} style={inp}>
                    <option value="">— None —</option>
                    {salesOrders.data.map((o: any) => <option key={o.id} value={o.id}>{o.number} — {o.customer_name}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Customer *</label>
                  <select value={sF.customer} onChange={e => setSF(f => ({ ...f, customer: e.target.value }))} style={inp} required>
                    <option value="">— Select customer —</option>
                    {customers.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Carrier</label><input value={sF.carrier} onChange={e => setSF(f => ({ ...f, carrier: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Tracking Number *</label><input value={sF.tracking_number} onChange={e => setSF(f => ({ ...f, tracking_number: e.target.value }))} style={inp} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Origin</label><input value={sF.origin} onChange={e => setSF(f => ({ ...f, origin: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Destination *</label><input value={sF.destination} onChange={e => setSF(f => ({ ...f, destination: e.target.value }))} style={inp} required /></div>
              </div>
              <div><label style={lbl}>Estimated Delivery</label><input type="date" value={sF.estimated_delivery} onChange={e => setSF(f => ({ ...f, estimated_delivery: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Notes</label><textarea value={sF.notes} onChange={e => setSF(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
