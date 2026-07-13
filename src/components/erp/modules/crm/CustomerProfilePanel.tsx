import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Calendar, Briefcase, StickyNote as StickyNoteIcon, History } from 'lucide-react';
import { erpFetch } from '../../../../hooks/useERPApi';
import {
  OG, OG_G, DARK, FF, stageMeta, fmtINR, timeAgo, noteMeta, activityTypeMeta,
  NOTE_TYPES, type Deal, type Activity, type CustomerNote,
} from './crmShared';
import CRMDealForm from './CRMDealForm';

interface Props {
  customerId: number;
  customerName: string;
  onClose: () => void;
  onChanged?: () => void;
}

type Tab = 'Deals' | 'Activities' | 'Notes';

interface HistoryData {
  deals: Deal[];
  activities: Activity[];
  notes: CustomerNote[];
}

export default function CustomerProfilePanel({ customerId, customerName, onClose, onChanged }: Props) {
  const [tab, setTab] = useState<Tab>('Deals');
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDealForm, setShowDealForm] = useState(false);
  const [noteType, setNoteType] = useState<CustomerNote['note_type']>('general');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    erpFetch(`crm/customers/${customerId}/history/`)
      .then(res => setData({ deals: res.deals ?? [], activities: res.activities ?? [], notes: res.notes ?? [] }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const addNote = async () => {
    if (!noteContent.trim()) return;
    setSavingNote(true);
    try {
      await erpFetch(`crm/customers/${customerId}/notes/`, { method: 'POST', body: JSON.stringify({ note_type: noteType, content: noteContent }) });
      setNoteContent('');
      load();
      onChanged?.();
    } catch { /* toast is unnecessary — the form stays filled so the user can retry */ }
    finally { setSavingNote(false); }
  };

  const totalDealValue = (data?.deals ?? []).filter(d => d.stage !== 'lost').reduce((s, d) => s + Number(d.value || 0), 0);

  const TABS: { key: Tab; icon: React.ElementType; count: number }[] = [
    { key: 'Deals', icon: Briefcase, count: data?.deals.length ?? 0 },
    { key: 'Activities', icon: History, count: data?.activities.length ?? 0 },
    { key: 'Notes', icon: StickyNoteIcon, count: data?.notes.length ?? 0 },
  ];

  return (
    <>
      <style>{`
        @keyframes crmFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes crmSlideInRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes crmShimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(2px)', animation: 'crmFadeIn 0.2s ease both' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(480px, 100vw)',
        background: '#fff', zIndex: 901, boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        animation: 'crmSlideInRight 0.35s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div>
            <h3 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: DARK, margin: 0 }}>{customerName}</h3>
            <p style={{ fontFamily: FF, fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{fmtINR(totalDealValue)} active deal value</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, padding: '14px 22px 0' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                border: 'none', cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 12.5,
                background: tab === t.key ? 'rgba(201,136,58,0.10)' : 'transparent',
                color: tab === t.key ? OG : '#6B6B6B',
              }}>
              <t.icon size={13} />{t.key}
              <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 999, background: tab === t.key ? 'rgba(201,136,58,0.18)' : 'rgba(0,0,0,0.06)' }}>{t.count}</span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[0, 1].map(i => (
                <div key={i} style={{ height: 74, borderRadius: 12, background: 'linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)', backgroundSize: '800px 100%', animation: 'crmShimmer 1.4s infinite' }} />
              ))}
            </div>
          ) : tab === 'Deals' ? (
            <>
              <button onClick={() => setShowDealForm(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: OG_G, color: '#fff', border: 'none', borderRadius: 9, padding: '10px', cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 13, marginBottom: 16 }}>
                <Plus size={15} /> Add Deal
              </button>
              {(data?.deals.length ?? 0) === 0 ? (
                <p style={{ textAlign: 'center', color: '#9ca3af', fontFamily: FF, fontSize: 13.5, padding: '30px 0' }}>No deals yet.</p>
              ) : data!.deals.map(d => {
                const meta = stageMeta(d.stage);
                return (
                  <div key={d.id} style={{ background: '#F8F7F4', borderRadius: 12, padding: '14px 16px', border: `1px solid ${meta.color}22`, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: DARK, fontFamily: FF }}>{d.title}</div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: meta.color, background: meta.bg, padding: '2px 9px', borderRadius: 999, fontFamily: FF, flexShrink: 0 }}>{meta.label}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: OG, fontFamily: FF, marginBottom: 4 }}>{fmtINR(d.value)} <span style={{ fontSize: 11.5, color: '#9ca3af', fontWeight: 600 }}>· {d.probability}% probability</span></div>
                    {d.expected_close && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: '#9ca3af', fontFamily: FF }}><Calendar size={11} /> Expected close {new Date(d.expected_close).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>}
                  </div>
                );
              })}
            </>
          ) : tab === 'Activities' ? (
            (data?.activities.length ?? 0) === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', fontFamily: FF, fontSize: 13.5, padding: '30px 0' }}>No activities logged yet.</p>
            ) : data!.activities.map(a => {
              const meta = activityTypeMeta(a.type);
              return (
                <div key={a.id} style={{ display: 'flex', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={meta.icon} style={{ color: meta.color, fontSize: 12 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK, fontFamily: FF }}>{a.summary}</div>
                    <div style={{ fontSize: 11.5, color: '#9ca3af', fontFamily: FF, marginTop: 2 }}>
                      {meta.label} · {timeAgo(a.occurred_at)}{a.completed && ' · Completed'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {NOTE_TYPES.map(t => (
                  <button key={t.key} type="button" onClick={() => setNoteType(t.key)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 999, cursor: 'pointer', fontFamily: FF, fontSize: 11.5, fontWeight: 700, border: noteType === t.key ? `1.5px solid ${t.color}` : '1px solid rgba(0,0,0,0.10)', background: noteType === t.key ? t.bg : '#fff', color: noteType === t.key ? t.color : '#6B6B6B' }}>
                    <i className={t.icon} style={{ fontSize: 10 }} />{t.label}
                  </button>
                ))}
              </div>
              <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="What happened? What was discussed?" rows={3}
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 64, padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.10)', background: '#F8F7F4', fontFamily: FF, fontSize: 13, outline: 'none', marginBottom: 10 }} />
              <button onClick={addNote} disabled={savingNote} style={{ width: '100%', background: OG_G, color: '#fff', border: 'none', borderRadius: 9, padding: '10px', cursor: savingNote ? 'not-allowed' : 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 13, opacity: savingNote ? 0.7 : 1, marginBottom: 18 }}>
                {savingNote ? 'Saving…' : 'Add Note'}
              </button>
              {(data?.notes.length ?? 0) === 0 ? (
                <p style={{ textAlign: 'center', color: '#9ca3af', fontFamily: FF, fontSize: 13.5, padding: '20px 0' }}>No notes yet.</p>
              ) : data!.notes.map(n => {
                const meta = noteMeta(n.note_type);
                return (
                  <div key={n.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: meta.color, background: meta.bg, padding: '3px 10px', borderRadius: 999, fontFamily: FF, marginBottom: 6 }}>
                      <i className={meta.icon} style={{ fontSize: 10 }} />{meta.label}
                    </span>
                    <p style={{ fontSize: 13.5, color: DARK, fontFamily: FF, lineHeight: 1.6, margin: '0 0 6px', whiteSpace: 'pre-wrap' }}>{n.content}</p>
                    <span style={{ fontSize: 11.5, color: '#9ca3af', fontFamily: FF }}>by {n.created_by_name || 'Someone'} · {timeAgo(n.created_at)}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {showDealForm && (
        <CRMDealForm
          defaultCustomerId={customerId}
          onClose={() => setShowDealForm(false)}
          onSaved={() => { load(); onChanged?.(); }}
        />
      )}
    </>
  );
}
