import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { StickyNote, ArrowRightLeft } from 'lucide-react';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency, leadScoreMeta, sourceMeta, today, type Deal } from './crmShared';
import CRMNotesPanel from './CRMNotesPanel';
import CRMDealsPanel from './CRMDealsPanel';
import PhoneInput from '../../../common/PhoneInput';

const statusColors: Record<string, { bg: string; color: string }> = {
  new: { bg: '#dbeafe', color: '#1d4ed8' }, contacted: { bg: '#fef3c7', color: '#92400e' },
  qualified: { bg: '#ede9fe', color: '#6d28d9' }, proposal: { bg: '#fef3c7', color: '#92400e' },
  won: { bg: '#d1fae5', color: '#065f46' }, lost: { bg: '#fee2e2', color: '#991b1b' },
};
const StatusBadge = ({ val }: { val: string }) => {
  const c = statusColors[val] ?? { bg: '#f1f5f9', color: '#64748b' };
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, fontFamily: FF }}>{val}</span>;
};

const defLead = { name: '', company: '', email: '', phone: '', source: 'website', score: 'warm', status: 'new', estimated_value: '', follow_up_date: '' };

export default function LeadsPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const leads = useERPList<any>('crm/leads/');
  const deals = useERPList<Deal>('crm/deals/');

  const [modal, setModal] = useState<'none' | 'add' | 'edit'>('none');
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [leadF, setLeadF] = useState({ ...defLead });
  const [converting, setConverting] = useState<number | null>(null);
  const [notesTarget, setNotesTarget] = useState<{ type: 'lead'; id: number; name: string } | null>(null);
  const [dealsTarget, setDealsTarget] = useState<{ type: 'lead'; id: number; name: string } | null>(null);

  const [scoreFilter, setScoreFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [search, setSearch] = useState('');

  const close = () => { setModal('none'); setEditing(null); };

  const dealsByLead = useMemo(() => {
    const map = new Map<number, { count: number; value: number }>();
    deals.data.forEach(d => {
      if (!d.lead || d.stage === 'lost') return;
      const cur = map.get(d.lead) ?? { count: 0, value: 0 };
      cur.count += 1; cur.value += Number(d.value || 0);
      map.set(d.lead, cur);
    });
    return map;
  }, [deals.data]);

  const filtered = useMemo(() => leads.data.filter((l: any) => {
    if (scoreFilter && l.score !== scoreFilter) return false;
    if (sourceFilter && l.source !== sourceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(l.name || '').toLowerCase().includes(q) && !(l.company || '').toLowerCase().includes(q)) return false;
    }
    return true;
  }), [leads.data, scoreFilter, sourceFilter, search]);

  const saveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { ...leadF, follow_up_date: leadF.follow_up_date || null };
      if (leadF.estimated_value) body.estimated_value = Number(leadF.estimated_value);
      else delete body.estimated_value;
      if (editing) { await leads.update(editing.id, body); toast.success('Lead updated'); }
      else { await leads.create(body); toast.success('Lead created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await leads.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const convertLead = async (id: number) => {
    setConverting(id);
    try {
      const res = await erpFetch(`crm/leads/${id}/convert/`, { method: 'POST' });
      toast.success(`Converted to customer ${res.customer.code}`);
      leads.reload();
    } catch (err: any) { toast.error(err.message || 'Conversion failed'); }
    finally { setConverting(null); }
  };

  const todayStr = today();

  const cols = [
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company', render: (r: any) => r.company || '—' },
    { key: 'email', label: 'Email', render: (r: any) => r.email || '—' },
    {
      key: 'source', label: 'Source', render: (r: any) => {
        const m = sourceMeta(r.source);
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6B6B6B', fontFamily: FF }}><i className={m.icon} style={{ fontSize: 11 }} />{m.label}</span>;
      },
    },
    {
      key: 'score', label: 'Score', render: (r: any) => {
        const m = leadScoreMeta(r.score);
        return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF }}>{m.label}</span>;
      },
    },
    {
      key: 'follow_up_date', label: 'Follow-up', render: (r: any) => {
        if (!r.follow_up_date) return '—';
        const overdue = r.follow_up_date < todayStr && !['won', 'lost'].includes(r.status);
        return <span style={{ fontSize: 12, fontWeight: overdue ? 700 : 500, color: overdue ? '#ef4444' : '#141413', fontFamily: FF }}>{overdue && <i className="fas fa-triangle-exclamation" style={{ marginRight: 4 }} />}{new Date(r.follow_up_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>;
      },
    },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge val={r.status || 'new'} /> },
    { key: 'estimated_value', label: 'Value', render: (r: any) => r.estimated_value ? fmtINR(r.estimated_value) : '—' },
    {
      key: 'deals', label: 'Deals', render: (r: any) => {
        const agg = dealsByLead.get(r.id);
        return (
          <button type="button" onClick={() => setDealsTarget({ type: 'lead', id: r.id, name: r.name })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: FF }}>
            {agg && agg.count > 0 ? <div style={{ fontSize: 12.5, fontWeight: 700 }}>{agg.count} deal{agg.count === 1 ? '' : 's'}</div> : <span style={{ fontSize: 12, color: '#9ca3af' }}>— none —</span>}
          </button>
        );
      },
    },
    {
      key: 'actions', label: 'Actions', render: (r: any) => (
        <div style={{ display: 'flex', gap: 5 }}>
          <button title="Notes" onClick={() => setNotesTarget({ type: 'lead', id: r.id, name: r.name })} style={{ background: 'rgba(201,136,58,0.08)', color: '#C9883A', border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
            <StickyNote size={13} />
          </button>
          {!r.customer && (
            <button title="Convert to Customer" disabled={converting === r.id} onClick={() => convertLead(r.id)} style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: converting === r.id ? 'wait' : 'pointer' }}>
              <ArrowRightLeft size={13} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or company…" style={{ ...inp, maxWidth: 240 }} />
        <select value={scoreFilter} onChange={e => setScoreFilter(e.target.value)} style={{ ...inp, maxWidth: 150 }}>
          <option value="">All Scores</option>
          <option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option>
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} style={{ ...inp, maxWidth: 170 }}>
          <option value="">All Sources</option>
          <option value="website">Website</option><option value="referral">Referral</option><option value="outbound">Outbound</option>
          <option value="event">Event</option><option value="social">Social Media</option><option value="email">Email</option><option value="other">Other</option>
        </select>
      </div>

      <ERPTable title="Leads" columns={cols} data={filtered} loading={leads.loading} error={leads.error} isAdmin={isAdmin}
        onAdd={() => { setLeadF({ ...defLead }); setEditing(null); setModal('add'); }}
        onEdit={r => { setEditing(r); setLeadF({ name: r.name || '', company: r.company || '', email: r.email || '', phone: r.phone || '', source: r.source || 'website', score: r.score || 'warm', status: r.status || 'new', estimated_value: r.estimated_value ? String(r.estimated_value) : '', follow_up_date: r.follow_up_date || '' }); setModal('edit'); }}
        onDelete={id => setDelId(id)} />

      {(modal === 'add' || modal === 'edit') && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={CRD}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Lead' : 'Add Lead'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveLead} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Name *</label><input value={leadF.name} onChange={e => setLeadF(f => ({ ...f, name: e.target.value }))} style={inp} required /></div>
                <div><label style={lbl}>Company</label><input value={leadF.company} onChange={e => setLeadF(f => ({ ...f, company: e.target.value }))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Email</label><input type="email" value={leadF.email} onChange={e => setLeadF(f => ({ ...f, email: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Phone</label><PhoneInput value={leadF.phone} onChange={v => setLeadF(f => ({ ...f, phone: v }))} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Source</label><select value={leadF.source} onChange={e => setLeadF(f => ({ ...f, source: e.target.value }))} style={inp}>
                  <option value="website">Website</option><option value="referral">Referral</option><option value="outbound">Outbound</option>
                  <option value="social">Social Media</option><option value="event">Event</option><option value="email">Email</option><option value="other">Other</option>
                </select></div>
                <div><label style={lbl}>Score</label><select value={leadF.score} onChange={e => setLeadF(f => ({ ...f, score: e.target.value }))} style={inp}>
                  <option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option>
                </select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Status</label><select value={leadF.status} onChange={e => setLeadF(f => ({ ...f, status: e.target.value }))} style={inp}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="proposal">Proposal Sent</option><option value="won">Won</option><option value="lost">Lost</option></select></div>
                <div><label style={lbl}>Follow-up Date</label><input type="date" value={leadF.follow_up_date} onChange={e => setLeadF(f => ({ ...f, follow_up_date: e.target.value }))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Estimated Value (₹)</label><input type="number" value={leadF.estimated_value} onChange={e => setLeadF(f => ({ ...f, estimated_value: e.target.value }))} style={inp} step="0.01" min="0" /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {notesTarget && <CRMNotesPanel target={notesTarget} onClose={() => setNotesTarget(null)} />}
      {dealsTarget && <CRMDealsPanel target={dealsTarget} onClose={() => setDealsTarget(null)} onChanged={() => deals.reload()} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
