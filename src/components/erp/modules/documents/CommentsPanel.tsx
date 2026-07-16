import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { OG, OG_G, DARK, FF, fmtDateTime, type DocumentT, type DocumentCommentT } from './documentsShared';
import { getComments, addComment } from './documentApi';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function CommentsPanel({
  doc, onClose, onChanged,
}: {
  doc: DocumentT;
  onClose: () => void;
  onChanged?: () => void;
}) {
  const [comments, setComments] = useState<DocumentCommentT[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);

  const load = () => {
    setLoading(true);
    getComments(doc.id)
      .then(res => setComments(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [doc.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      await addComment(doc.id, text.trim());
      setText('');
      load();
      onChanged?.();
      toast.success('Comment added');
    } catch (e: any) {
      toast.error(e.message || 'Could not add comment.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes docCommentsFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes docCommentsSlideIn { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1070, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)', animation: 'docCommentsFadeIn 0.2s ease both' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(350px, 100vw)',
        background: '#fff', zIndex: 1071, boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', animation: 'docCommentsSlideIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ minWidth: 0 }}>
            <h6 style={{ fontFamily: FF, fontWeight: 800, fontSize: 14, color: DARK, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Comments</h6>
            <p style={{ fontFamily: FF, fontSize: 11.5, color: '#9ca3af', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4, flexShrink: 0 }}>
            <i className="fas fa-times" style={{ fontSize: 18 }} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {loading ? (
            <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B' }}>
              <i className="fas fa-circle-notch fa-spin" style={{ marginRight: 8, color: OG }} />Loading comments…
            </div>
          ) : comments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', fontFamily: FF, fontSize: 13, padding: '30px 0' }}>No comments yet.</p>
          ) : comments.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: OG_G, color: '#fff',
                fontSize: 10.5, fontWeight: 800, fontFamily: FF, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                {initials(c.user_name || '?')}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 12.5, color: '#1A1A1A' }}>{c.user_name || 'Someone'}</span>
                  <span style={{ fontFamily: FF, fontSize: 11, color: '#9ca3af' }}>{fmtDateTime(c.created_at)}</span>
                </div>
                <p style={{ fontFamily: FF, fontSize: 12.5, color: '#4B4B4B', lineHeight: 1.5, margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{c.comment}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a comment…"
            rows={2}
            style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 50, padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.10)', background: '#F8F7F4', fontFamily: FF, fontSize: 13, outline: 'none', marginBottom: 8 }}
          />
          <button
            onClick={submit}
            disabled={posting || !text.trim()}
            style={{
              width: '100%', background: OG_G, color: '#fff', border: 'none', borderRadius: 9,
              padding: '9px', cursor: posting || !text.trim() ? 'not-allowed' : 'pointer',
              fontFamily: FF, fontWeight: 700, fontSize: 13, opacity: posting || !text.trim() ? 0.6 : 1,
            }}
          >
            {posting ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      </div>
    </>
  );
}
