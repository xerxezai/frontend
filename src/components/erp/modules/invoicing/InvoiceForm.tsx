import { useState } from 'react';
import { toast } from 'react-toastify';
import { useERPList } from '../../../../hooks/useERPApi';
import { OG, inp, lbl, SAVE, CNCL, fmtINR, calcTotals, type InvoiceItemRow } from './invoicingShared';

const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:720,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'88vh',overflowY:'auto' };

export interface InvoiceFormValues {
  number: string; customer: string; issue_date: string; due_date: string;
  status: string; notes: string;
  items: InvoiceItemRow[];
}

const emptyItem: InvoiceItemRow = { product: '', description: '', quantity: '1', unit_price: '' };

export default function InvoiceForm({ initial, editing, onClose, onSave }: {
  initial: InvoiceFormValues;
  editing: boolean;
  onClose: () => void;
  onSave: (values: InvoiceFormValues) => Promise<void>;
}) {
  const customers = useERPList<any>('crm/customers/');
  const products  = useERPList<any>('inventory/products/');
  const [f, setF] = useState<InvoiceFormValues>(initial);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof InvoiceFormValues, v: any) => setF(p => ({ ...p, [k]: v }));

  const setItem = (i: number, patch: Partial<InvoiceItemRow>) =>
    setF(p => ({ ...p, items: p.items.map((it, idx) => idx === i ? { ...it, ...patch } : it) }));

  const addItem = () => setF(p => ({ ...p, items: [...p.items, { ...emptyItem }] }));
  const removeItem = (i: number) => setF(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  const onProductPick = (i: number, productId: string) => {
    const prod = products.data.find((p: any) => String(p.id) === productId);
    setItem(i, { product: productId, unit_price: prod ? String(prod.sale_price) : f.items[i].unit_price, description: prod?.name ?? f.items[i].description });
  };

  const { subtotal, tax, total } = calcTotals(f.items);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.number.trim())  { toast.error('Invoice number is required.'); return; }
    if (!f.issue_date)     { toast.error('Issue date is required.'); return; }
    if (!f.due_date)       { toast.error('Due date is required.'); return; }
    if (!f.customer)       { toast.error('Please select a customer.'); return; }
    setSaving(true);
    try {
      await onSave(f);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={CRD}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
          <h5 style={{ fontFamily:'DM Sans,sans-serif',fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0 }}>{editing ? 'Edit Invoice' : 'Add Invoice'}</h5>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22 }}>&times;</button>
        </div>

        <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <div className="row g-3" style={{ margin: 0 }}>
            <div className="col-md-6" style={{ padding: '0 8px 0 0' }}>
              <label style={lbl}>Invoice Number</label>
              <input type="text" value={f.number} onChange={e => set('number', e.target.value)} style={inp} />
            </div>
            <div className="col-md-6" style={{ padding: 0 }}>
              <label style={lbl}>Customer</label>
              <select value={f.customer} onChange={e => set('customer', e.target.value)} style={inp}>
                <option value="">— Select customer —</option>
                {customers.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-6" style={{ padding: '12px 8px 0 0' }}>
              <label style={lbl}>Issue Date</label>
              <input type="date" value={f.issue_date} onChange={e => set('issue_date', e.target.value)} style={inp} />
            </div>
            <div className="col-md-6" style={{ padding: '12px 0 0' }}>
              <label style={lbl}>Due Date</label>
              <input type="date" value={f.due_date} onChange={e => set('due_date', e.target.value)} style={inp} />
            </div>
            <div className="col-md-6" style={{ padding: '12px 8px 0 0' }}>
              <label style={lbl}>Status</label>
              <select value={f.status} onChange={e => set('status', e.target.value)} style={inp}>
                <option value="draft">Draft</option><option value="sent">Sent</option>
                <option value="partial">Partially Paid</option><option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* line items */}
          <div>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8 }}>
              <label style={{ ...lbl, marginBottom: 0 }}>Line Items</label>
              <button type="button" onClick={addItem} style={{ background:'rgba(201,136,58,0.10)',color:OG,border:'1px solid rgba(201,136,58,0.28)',borderRadius:7,padding:'5px 12px',fontFamily:'DM Sans,sans-serif',fontWeight:700,fontSize:11.5,cursor:'pointer' }}>
                <i className="fas fa-plus" style={{ fontSize: 9, marginRight: 5 }} />Add Item
              </button>
            </div>
            <div style={{ border:'1px solid rgba(0,0,0,0.08)', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: 'DM Sans,sans-serif' }}>
                <thead>
                  <tr style={{ background: '#fafaf8' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, color: '#6B6B6B', fontWeight: 700, textTransform: 'uppercase' }}>Product</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', fontSize: 10, color: '#6B6B6B', fontWeight: 700, textTransform: 'uppercase', width: 90 }}>Qty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', fontSize: 10, color: '#6B6B6B', fontWeight: 700, textTransform: 'uppercase', width: 110 }}>Unit Price</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', fontSize: 10, color: '#6B6B6B', fontWeight: 700, textTransform: 'uppercase', width: 110 }}>Line Total</th>
                    <th style={{ width: 34 }} />
                  </tr>
                </thead>
                <tbody>
                  {f.items.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: '16px 10px', textAlign: 'center', color: '#9b9690' }}>No items — add at least one, or leave empty for a blank invoice.</td></tr>
                  )}
                  {f.items.map((it, i) => {
                    const lineTotal = (Number(it.quantity) || 0) * (Number(it.unit_price) || 0);
                    return (
                      <tr key={i} style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '6px 8px' }}>
                          <select value={it.product} onChange={e => onProductPick(i, e.target.value)} style={{ ...inp, padding: '6px 8px', fontSize: 12.5 }}>
                            <option value="">— Product —</option>
                            {products.data.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input type="number" min="0" step="0.01" value={it.quantity} onChange={e => setItem(i, { quantity: e.target.value })} style={{ ...inp, padding: '6px 8px', fontSize: 12.5, textAlign: 'right' }} />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input type="number" min="0" step="0.01" value={it.unit_price} onChange={e => setItem(i, { unit_price: e.target.value })} style={{ ...inp, padding: '6px 8px', fontSize: 12.5, textAlign: 'right' }} />
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700, color: '#1A1A1A' }}>{fmtINR(lineTotal)}</td>
                        <td style={{ padding: '6px 6px', textAlign: 'center' }}>
                          <button type="button" onClick={() => removeItem(i)} style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', borderRadius: 6, width: 24, height: 24, cursor: 'pointer' }}>
                            <i className="fas fa-times" style={{ fontSize: 10 }} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* totals */}
          <div style={{ marginLeft: 'auto', width: 260, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: '#6B6B6B' }}>
              <span>Subtotal</span><span>{fmtINR(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: '#6B6B6B' }}>
              <span>Tax (18% GST)</span><span>{fmtINR(tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans,sans-serif', fontSize: 15, fontWeight: 800, color: OG, borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 6 }}>
              <span>Grand Total</span><span>{fmtINR(total)}</span>
            </div>
          </div>

          <div><label style={lbl}>Notes</label><textarea value={f.notes} onChange={e => set('notes', e.target.value)} style={{ ...inp, resize: 'vertical', minHeight: 70 }} /></div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
