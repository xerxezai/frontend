import { useEffect, useMemo, useState } from 'react';
import { Plus, Calendar, Pencil, Trash2, Download, PartyPopper, CalendarClock, Landmark } from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch, isSuperUser } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import { Card3D, FF, OG, DARK, WHITE, Skeleton, EmptyState, PageHead, inp, lbl } from './hrShared';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const TYPE_BADGE: Record<string, { label: string; hint: string; bg: string; color: string }> = {
  public:   { label: 'Public Holiday',   hint: 'Government declared holiday',            bg: '#dbeafe', color: '#1d4ed8' },
  company:  { label: 'Company Holiday',  hint: 'Company specific holiday',                bg: '#d1fae5', color: '#065f46' },
  optional: { label: 'Optional Holiday', hint: 'Employee can choose to take or not',       bg: '#ffedd5', color: '#c2410c' },
};

const COUNTRIES = [
  { value: 'india', label: 'India' },
  { value: 'uae', label: 'UAE' },
  { value: 'saudi_arabia', label: 'Saudi Arabia' },
  { value: 'uk', label: 'UK' },
];

const SAVE: React.CSSProperties = { background: 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 20px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer' };
const CNCL: React.CSSProperties = { background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 20px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 };

const defHoliday = { name: '', date: '', holiday_type: 'public', description: '', is_recurring: false };
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
};

function HolidayModal({ editing, onClose, onSaved, save }: { editing: any; onClose: () => void; onSaved: () => void; save: (id: number | null, body: any) => Promise<void> }) {
  const [form, setForm] = useState(editing
    ? { name: editing.name, date: editing.date, holiday_type: editing.holiday_type, description: editing.description || '', is_recurring: !!editing.is_recurring }
    : { ...defHoliday });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await save(editing?.id ?? null, form);
      onSaved();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: '28px 24px 24px', maxWidth: 460, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.16)', borderTop: '3px solid #C9883A' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Holiday' : 'Add Holiday'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Holiday Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Date *</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inp} required /></div>
            <div>
              <label style={lbl}>Type *</label>
              <select value={form.holiday_type} onChange={e => setForm(f => ({ ...f, holiday_type: e.target.value }))} style={inp}>
                {Object.entries(TYPE_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: MUTED, fontFamily: FF, marginTop: -8 }}>{TYPE_BADGE[form.holiday_type]?.hint}</div>
          <div><label style={lbl}>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 70 }} /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: FF, fontSize: 13, color: DARK, fontWeight: 600 }}>
            <input type="checkbox" checked={form.is_recurring} onChange={e => setForm(f => ({ ...f, is_recurring: e.target.checked }))} style={{ accentColor: OG, width: 15, height: 15 }} />
            Repeat every year
          </label>
          {form.is_recurring && (
            <div style={{ fontSize: 11.5, color: MUTED, fontFamily: FF, marginTop: -8 }}>This holiday will automatically appear every year on the same date.</div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...SAVE, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.75 : 1 }}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Holiday'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImportHolidaysModal({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
  const [country, setCountry] = useState('india');
  const [importing, setImporting] = useState(false);

  const doImport = async () => {
    setImporting(true);
    try {
      const res = await erpFetch('hr/holidays/bulk-import/', { method: 'POST', body: JSON.stringify({ country }) });
      toast.success(res.count > 0 ? `Imported ${res.count} public holiday${res.count === 1 ? '' : 's'}` : 'Those public holidays are already on the calendar');
      onImported();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: '28px 24px 24px', maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.16)', borderTop: '3px solid #C9883A' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Import Public Holidays</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 22 }}>&times;</button>
        </div>
        <label style={lbl}>Country</label>
        <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inp, marginBottom: 10 }}>
          {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <p style={{ fontSize: 11.5, color: MUTED, fontFamily: FF, margin: '0 0 18px' }}>
          Adds this country's well-known fixed-date public holidays for the current year. Movable/lunar holidays (e.g. Eid, Diwali) aren't included and should be added manually.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
          <button onClick={doImport} disabled={importing} style={{ ...SAVE, flex: 1, cursor: importing ? 'wait' : 'pointer', opacity: importing ? 0.75 : 1 }}>{importing ? 'Importing…' : 'Import'}</button>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: number | string; accent: string }) => (
  <Card3D accent={accent} p="16px 18px">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color={accent} />
      </div>
      <div>
        <div style={{ fontFamily: FF, fontSize: 20, fontWeight: 900, color: DARK, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, fontWeight: 600, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  </Card3D>
);

export default function HolidaysModule() {
  const { isCompanyAdmin, isHRManager } = useAccess();
  const isAdmin = isSuperUser() || isCompanyAdmin || isHRManager;

  const holidays = useERPList<any>('hr/holidays/');
  const [stats, setStats] = useState<{ total_this_year: number; upcoming_30_days: number; public_this_year: number } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delTarget, setDelTarget] = useState<any>(null);

  const loadStats = () => {
    erpFetch('hr/holidays/stats/').then(setStats).catch(() => setStats(null));
  };
  useEffect(loadStats, [holidays.data.length]);

  const sorted = useMemo(
    () => [...holidays.data].sort((a, b) => (a.next_occurrence || a.date).localeCompare(b.next_occurrence || b.date)),
    [holidays.data],
  );
  const upcomingThree = useMemo(() => sorted.filter((h: any) => h.days_until >= 0).slice(0, 3), [sorted]);

  const save = async (id: number | null, body: any) => {
    if (id) await holidays.update(id, body);
    else await holidays.create(body);
  };

  const confirmDel = async () => {
    try { await holidays.remove(delTarget.id); toast.success('Holiday deleted'); setDelTarget(null); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
  };

  return (
    <div>
      <PageHead
        title="Holidays"
        subtitle="Company holiday calendar for the year"
        action={isAdmin ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowImport(true)} style={{ ...CNCL, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} />Import Public Holidays
            </button>
            <button onClick={() => { setEditing(null); setShowModal(true); }} style={{ ...SAVE, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px' }}>
              <Plus size={14} />Add Holiday
            </button>
          </div>
        ) : undefined}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        <StatCard icon={Calendar} label="Total Holidays This Year" value={stats?.total_this_year ?? '—'} accent="#3b82f6" />
        <StatCard icon={CalendarClock} label="Upcoming Holidays (30 days)" value={stats?.upcoming_30_days ?? '—'} accent="#22c55e" />
        <StatCard icon={Landmark} label="Public Holidays" value={stats?.public_this_year ?? '—'} accent="#f97316" />
      </div>

      {upcomingThree.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(201,136,58,0.10), rgba(201,136,58,0.03))',
          border: `1px solid rgba(201,136,58,0.25)`, borderRadius: 14, padding: '16px 20px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <PartyPopper size={15} color={OG} />
            <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 13.5, color: DARK }}>Upcoming This Month</span>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {upcomingThree.map((h: any) => {
              const meta = TYPE_BADGE[h.holiday_type] ?? TYPE_BADGE.optional;
              return (
                <div key={h.id} style={{ background: WHITE, borderRadius: 10, padding: '10px 16px', border: `1px solid ${BORDER}`, minWidth: 180 }}>
                  <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: DARK }}>{h.name}</div>
                  <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, margin: '3px 0 6px' }}>{fmtDate(h.next_occurrence)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: meta.bg, color: meta.color }}>{meta.label}</span>
                    <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 800, color: OG }}>
                      {h.days_until === 0 ? 'Today' : h.days_until === 1 ? 'Tomorrow' : `${h.days_until} days`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {holidays.loading ? (
        <Skeleton h={240} />
      ) : sorted.length === 0 ? (
        <EmptyState icon={Calendar} message="No holidays added yet." cta={isAdmin ? <button style={SAVE} onClick={() => { setEditing(null); setShowModal(true); }}>Add Holiday</button> : undefined} />
      ) : (
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Holiday', 'Date', 'Type', 'Description', 'Days Until', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((h: any) => {
                  const meta = TYPE_BADGE[h.holiday_type] ?? TYPE_BADGE.optional;
                  const withinWeek = h.days_until >= 0 && h.days_until <= 7;
                  return (
                    <tr key={h.id} style={{ borderBottom: `1px solid ${BORDER}`, background: withinWeek ? 'rgba(34,197,94,0.07)' : undefined }}>
                      <td style={{ padding: '11px 16px', fontWeight: 700, color: DARK }}>
                        {h.name}
                        {h.is_recurring && (
                          <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 20, fontSize: 9.5, fontWeight: 800, background: '#ede9fe', color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recurring</span>
                        )}
                      </td>
                      <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{fmtDate(h.next_occurrence)}</td>
                      <td style={{ padding: '11px 16px' }}><span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: meta.bg, color: meta.color }}>{meta.label}</span></td>
                      <td style={{ padding: '11px 16px', color: MUTED, maxWidth: 260 }}>{h.description || '—'}</td>
                      <td style={{ padding: '11px 16px', fontWeight: 700, color: withinWeek ? '#16a34a' : MUTED, whiteSpace: 'nowrap' }}>
                        {h.days_until < 0 ? 'Past' : h.days_until === 0 ? 'Today' : h.days_until === 1 ? 'Tomorrow' : `${h.days_until} days`}
                      </td>
                      {isAdmin && (
                        <td style={{ padding: '11px 16px' }}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button onClick={() => { setEditing(h); setShowModal(true); }} style={{ background: 'rgba(201,136,58,0.08)', color: OG, border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}><Pencil size={12} /></button>
                            <button onClick={() => setDelTarget(h)} style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}><Trash2 size={12} /></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <HolidayModal editing={editing} save={save} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); loadStats(); toast.success(editing ? 'Holiday updated' : 'Holiday added'); }} />
      )}
      {showImport && (
        <ImportHolidaysModal onClose={() => setShowImport(false)} onImported={() => { holidays.reload(); loadStats(); }} />
      )}
      {delTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1060, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setDelTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 400, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
            <h6 style={{ fontWeight: 800, marginBottom: 8, color: '#1A1A1A' }}>Delete Holiday?</h6>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>
              Are you sure you want to delete <strong style={{ color: DARK }}>{delTarget.name}</strong> on <strong style={{ color: DARK }}>{fmtDate(delTarget.next_occurrence || delTarget.date)}</strong>?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDelTarget(null)} style={{ ...CNCL, flex: 1 }}>Cancel</button>
              <button onClick={confirmDel} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '9px', cursor: 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
