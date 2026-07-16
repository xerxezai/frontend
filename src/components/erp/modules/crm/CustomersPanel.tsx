import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useERPList, erpUpload, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency, type Deal } from './crmShared';
import CustomerProfilePanel from './CustomerProfilePanel';

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  VIP: { bg: 'rgba(201,136,58,0.14)', color: OG },
  Prospect: { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8' },
  Inactive: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
};
const tagColor = (t: string) => TAG_COLORS[t] ?? { bg: 'rgba(139,92,246,0.12)', color: '#7c3aed' };

const defCust = { name: '', company: '', email: '', phone: '', industry: '', source: '', city: '', country: '', tags: '', is_active: 'true' };

export default function CustomersPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const customers = useERPList<any>('crm/customers/');
  const deals = useERPList<Deal>('crm/deals/');

  const [modal, setModal] = useState<'none' | 'add' | 'edit' | 'import'>('none');
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [custF, setCustF] = useState({ ...defCust });
  const [profileTarget, setProfileTarget] = useState<{ id: number; name: string } | null>(null);

  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [importing, setImporting] = useState(false);

  const close = () => { setModal('none'); setEditing(null); };

  const dealsByCustomer = useMemo(() => {
    const map = new Map<number, { count: number; value: number }>();
    deals.data.forEach(d => {
      if (!d.customer || d.stage === 'lost') return;
      const cur = map.get(d.customer) ?? { count: 0, value: 0 };
      cur.count += 1; cur.value += Number(d.value || 0);
      map.set(d.customer, cur);
    });
    return map;
  }, [deals.data]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    customers.data.forEach((c: any) => (c.tags || []).forEach((t: string) => s.add(t)));
    return Array.from(s).sort();
  }, [customers.data]);
  const allIndustries = useMemo(() => {
    const s = new Set<string>();
    customers.data.forEach((c: any) => c.industry && s.add(c.industry));
    return Array.from(s).sort();
  }, [customers.data]);

  const filtered = useMemo(() => customers.data.filter((c: any) => {
    if (search) {
      const q = search.toLowerCase();
      if (!(c.name || '').toLowerCase().includes(q) && !(c.company || '').toLowerCase().includes(q) && !(c.email || '').toLowerCase().includes(q)) return false;
    }
    if (tagFilter && !(c.tags || []).includes(tagFilter)) return false;
    if (industryFilter && c.industry !== industryFilter) return false;
    if (activeFilter && String(c.is_active) !== activeFilter) return false;
    return true;
  }), [customers.data, search, tagFilter, industryFilter, activeFilter]);

  const saveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = {
        ...custF, is_active: custF.is_active === 'true',
        tags: custF.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editing) { await customers.update(editing.id, body); toast.success('Customer updated'); }
      else { await customers.create(body); toast.success('Customer created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await customers.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const runImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append('file', importFile);
      const res = await erpUpload('crm/customers/bulk-import/', fd, 'POST');
      setImportResult(res);
      customers.reload();
      if (res.created_count > 0) toast.success(`Imported ${res.created_count} customer(s)`);
      if (res.errors?.length) toast.error(`${res.errors.length} row(s) had errors — see details below`);
    } catch (err: any) { toast.error(err.message || 'Import failed'); }
    finally { setImporting(false); }
  };

  const exportCSV = async () => {
    try { await erpDownload('crm/customers/export-csv/', `customers-${new Date().toISOString().slice(0, 10)}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    {
      key: 'name', label: 'Name', render: (r: any) => (
        <button type="button" onClick={() => setProfileTarget({ id: r.id, name: r.name })}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: OG, fontWeight: 700, fontFamily: FF, fontSize: 12.5, textDecoration: 'underline', textDecorationColor: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.textDecorationColor = OG)}
          onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}>
          {r.name}
        </button>
      ),
    },
    { key: 'company', label: 'Company', render: (r: any) => r.company || '—' },
    { key: 'email', label: 'Email', render: (r: any) => r.email || '—' },
    { key: 'phone', label: 'Phone', render: (r: any) => r.phone || '—' },
    { key: 'industry', label: 'Industry', render: (r: any) => r.industry || '—' },
    {
      key: 'tags', label: 'Tags', render: (r: any) => (
        (r.tags || []).length === 0 ? <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span> : (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {r.tags.map((t: string) => {
              const c = tagColor(t);
              return <span key={t} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: c.bg, color: c.color, fontFamily: FF }}>{t}</span>;
            })}
          </div>
        )
      ),
    },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? '✅' : '❌' },
    {
      key: 'deals', label: 'Deals', render: (r: any) => {
        const agg = dealsByCustomer.get(r.id);
        return agg && agg.count > 0 ? (
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#141413' }}>{agg.count} deal{agg.count === 1 ? '' : 's'}</div>
            <div style={{ fontSize: 11.5, color: OG, fontWeight: 600 }}>{fmtINR(agg.value)}</div>
          </div>
        ) : <span style={{ fontSize: 12, color: '#9ca3af' }}>— none —</span>;
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, company or email…" style={{ ...inp, maxWidth: 240 }} />
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} style={{ ...inp, maxWidth: 160 }}>
          <option value="">All Tags</option>
          {allTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} style={{ ...inp, maxWidth: 180 }}>
          <option value="">All Industries</option>
          {allIndustries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={activeFilter} onChange={e => setActiveFilter(e.target.value)} style={{ ...inp, maxWidth: 150 }}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <div style={{ flex: 1 }} />
        {isAdmin && (
          <button onClick={() => { setImportFile(null); setImportResult(null); setModal('import'); }} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
            <i className="fas fa-file-import" style={{ marginRight: 6, color: OG }} />Import CSV
          </button>
        )}
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: OG }} />Export CSV
        </button>
      </div>

      <ERPTable title="Customers" columns={cols} data={filtered} loading={customers.loading} error={customers.error} isAdmin={isAdmin}
        onAdd={() => { setCustF({ ...defCust }); setEditing(null); setModal('add'); }}
        onEdit={r => { setEditing(r); setCustF({ name: r.name || '', company: r.company || '', email: r.email || '', phone: r.phone || '', industry: r.industry || '', source: r.source || '', city: r.city || '', country: r.country || '', tags: (r.tags || []).join(', '), is_active: String(r.is_active ?? true) }); setModal('edit'); }}
        onDelete={id => setDelId(id)} />

      {(modal === 'add' || modal === 'edit') && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={CRD}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Customer' : 'Add Customer'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Name *</label><input value={custF.name} onChange={e => setCustF(f => ({ ...f, name: e.target.value }))} style={inp} required /></div>
                <div><label style={lbl}>Company</label><input value={custF.company} onChange={e => setCustF(f => ({ ...f, company: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Email</label><input type="email" value={custF.email} onChange={e => setCustF(f => ({ ...f, email: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Phone</label><input value={custF.phone} onChange={e => setCustF(f => ({ ...f, phone: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Industry</label><input value={custF.industry} onChange={e => setCustF(f => ({ ...f, industry: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Source</label><select value={custF.source} onChange={e => setCustF(f => ({ ...f, source: e.target.value }))} style={inp}>
                  <option value="">— None —</option>
                  <option value="website">Website</option><option value="referral">Referral</option><option value="outbound">Outbound</option>
                  <option value="event">Event</option><option value="social">Social Media</option><option value="email">Email</option><option value="other">Other</option>
                </select></div>
                <div><label style={lbl}>City</label><input value={custF.city} onChange={e => setCustF(f => ({ ...f, city: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Country</label><input value={custF.country} onChange={e => setCustF(f => ({ ...f, country: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Active</label><select value={custF.is_active} onChange={e => setCustF(f => ({ ...f, is_active: e.target.value }))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
                <div><label style={lbl}>Tags (comma-separated)</label><input value={custF.tags} onChange={e => setCustF(f => ({ ...f, tags: e.target.value }))} style={inp} placeholder="VIP, Prospect" /></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {modal === 'import' && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Import Customers</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <p style={{ fontSize: 12.5, color: '#6B6B6B', fontFamily: FF, marginBottom: 14 }}>
              CSV columns: <code>name, company, email, phone, industry, source, city, country, tags</code>. Only <strong>name</strong> is required; <em>tags</em> is semicolon-separated (e.g. <code>VIP;Prospect</code>).
            </p>
            <input type="file" accept=".csv,text/csv" onChange={e => { setImportFile(e.target.files?.[0] ?? null); setImportResult(null); }} style={{ ...inp, padding: '6px 10px', marginBottom: 14 }} />
            {importResult && (
              <div style={{ background: '#F8F7F4', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 12.5, fontFamily: FF, maxHeight: 180, overflowY: 'auto' }}>
                <div style={{ fontWeight: 700, color: '#065f46', marginBottom: 6 }}>{importResult.created_count} customer(s) created</div>
                {importResult.errors?.length > 0 && (
                  <>
                    <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>{importResult.errors.length} error(s):</div>
                    {importResult.errors.map((e: any, i: number) => <div key={i} style={{ color: '#991b1b' }}>Row {e.row}: {e.error}</div>)}
                  </>
                )}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={close} style={CNCL}>Close</button>
              <button type="button" onClick={runImport} disabled={!importFile || importing} style={{ ...SAVE, opacity: (!importFile || importing) ? 0.6 : 1, cursor: (!importFile || importing) ? 'not-allowed' : 'pointer' }}>
                {importing ? 'Importing…' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {profileTarget && (
        <CustomerProfilePanel customerId={profileTarget.id} customerName={profileTarget.name} onClose={() => setProfileTarget(null)} onChanged={() => deals.reload()} />
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
