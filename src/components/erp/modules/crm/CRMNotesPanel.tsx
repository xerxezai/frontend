import { useState, useEffect, useCallback } from 'react';
import { X, Trash2, StickyNote } from 'lucide-react';
import { erpFetch } from '../../../../hooks/useERPApi';
import { OG_G, DARK, FF, NOTE_TYPES, noteMeta, timeAgo, type CustomerNote } from './crmShared';

interface Props {
  target: { type: 'customer' | 'lead'; id: number; name: string };
  onClose: () => void;
  onChanged?: () => void;
}

export default function CRMNotesPanel({ target, onClose, onChanged }: Props) {
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteType, setNoteType] = useState<CustomerNote['note_type']>('general');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const basePath = target.type === 'customer' ? `crm/customers/${target.id}/notes/` : `crm/leads/${target.id}/notes/`;

  const load = useCallback(() => {
    setLoading(true);
    erpFetch(basePath)
      .then(res => setNotes(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [basePath]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const addNote = async () => {
    if (!content.trim()) { setError('Write something before saving.'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await erpFetch(basePath, { method: 'POST', body: JSON.stringify({ note_type: noteType, content }) });
      if (res?.id === undefined) { setError('Could not save this note.'); return; }
      setNotes(prev => [res, ...prev]);
      setContent('');
      onChanged?.();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: number) => {
    setRemovingId(id);
    try {
      await erpFetch(`crm/notes/${id}/`, { method: 'DELETE' });
      setTimeout(() => {
        setNotes(prev => prev.filter(n => n.id !== id));
        setRemovingId(null);
        onChanged?.();
      }, 280);
    } catch {
      setRemovingId(null);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(2px)', animation: 'crmFadeIn 0.2s ease both' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(440px, 100vw)',
        background: '#fff', zIndex: 901, boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        animation: 'crmSlideInRight 0.35s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <style>{`
          @keyframes crmFadeIn { from{opacity:0} to{opacity:1} }
          @keyframes crmSlideInRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
          @keyframes crmNoteIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
          @keyframes crmNoteOut { from{opacity:1;max-height:200px;margin-bottom:14px} to{opacity:0;max-height:0;margin-bottom:0;padding-top:0;padding-bottom:0} }
          @keyframes crmShimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div>
            <h3 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: DARK, margin: 0 }}>{target.name} — Notes</h3>
            <p style={{ fontFamily: FF, fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{notes.length} logged interaction{notes.length === 1 ? '' : 's'}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* add note form */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {NOTE_TYPES.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setNoteType(t.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 11px', borderRadius: 999, cursor: 'pointer', fontFamily: FF,
                  fontSize: 11.5, fontWeight: 700,
                  border: noteType === t.key ? `1.5px solid ${t.color}` : '1px solid rgba(0,0,0,0.10)',
                  background: noteType === t.key ? t.bg : '#fff',
                  color: noteType === t.key ? t.color : '#6B6B6B',
                }}
              >
                <i className={t.icon} style={{ fontSize: 10 }} />
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What happened? What was discussed?"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 72,
              padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.10)',
              background: '#F8F7F4', fontFamily: FF, fontSize: 13, outline: 'none', marginBottom: 10,
            }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: 12, fontFamily: FF, margin: '0 0 8px' }}>{error}</p>}
          <button
            onClick={addNote}
            disabled={saving}
            style={{
              width: '100%', background: OG_G, color: '#fff', border: 'none', borderRadius: 9,
              padding: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: FF,
              fontWeight: 700, fontSize: 13, opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Add Note'}
          </button>
        </div>

        {/* timeline */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ height: 64, borderRadius: 10, background: 'linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)', backgroundSize: '800px 100%', animation: 'crmShimmer 1.4s infinite' }} />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 12px' }}>
              <StickyNote size={34} color="#d1d5db" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontFamily: FF, fontSize: 13.5, color: '#9ca3af', margin: 0 }}>No notes yet. Log your first interaction.</p>
            </div>
          ) : (
            notes.map((n, i) => {
              const meta = noteMeta(n.note_type);
              const isRemoving = removingId === n.id;
              return (
                <div
                  key={n.id}
                  className="crm-note-row"
                  style={{
                    marginBottom: i < notes.length - 1 ? 14 : 0,
                    paddingBottom: i < notes.length - 1 ? 14 : 0,
                    borderBottom: i < notes.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    animation: isRemoving ? 'crmNoteOut 0.3s ease both' : 'crmNoteIn 0.3s ease both',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 11, fontWeight: 700, color: meta.color, background: meta.bg,
                      padding: '3px 10px', borderRadius: 999, fontFamily: FF,
                    }}>
                      <i className={meta.icon} style={{ fontSize: 10 }} />
                      {meta.label}
                    </span>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="crm-note-delete"
                      title="Delete note"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444',
                        padding: 4, opacity: 0, transition: 'opacity 0.15s ease', flexShrink: 0,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p style={{ fontSize: 13.5, color: DARK, fontFamily: FF, lineHeight: 1.6, margin: '0 0 6px', whiteSpace: 'pre-wrap' }}>
                    {n.content}
                  </p>
                  <span style={{ fontSize: 11.5, color: '#9ca3af', fontFamily: FF }}>
                    by {n.created_by_name || 'Someone'} • {timeAgo(n.created_at)}
                  </span>
                </div>
              );
            })
          )}
        </div>
        <style>{`
          .crm-note-row:hover .crm-note-delete { opacity: 1; }
        `}</style>
      </div>
    </>
  );
}
