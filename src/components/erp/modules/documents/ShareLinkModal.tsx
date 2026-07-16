import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { OG, FF, CNCL, OVR, CRD, type DocumentT } from './documentsShared';
import { generateShareLink } from './documentApi';

export default function ShareLinkModal({
  doc, onClose,
}: {
  doc: DocumentT;
  onClose: () => void;
}) {
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    generateShareLink(doc.id)
      .then(res => { if (!cancelled) setShareUrl(res.share_url); })
      .catch(e => { if (!cancelled) setError(e.message || 'Could not generate a share link.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [doc.id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link — please copy it manually.');
    }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div style={{ ...CRD, maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', marginBottom: 8 }}>
          <i className="fas fa-link" style={{ color: OG, marginRight: 8 }} />Share "{doc.title}"
        </h5>
        <p style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', marginBottom: 16 }}>
          Anyone with this link can download this document.
        </p>

        {loading ? (
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', padding: '10px 0' }}>
            <i className="fas fa-circle-notch fa-spin" style={{ marginRight: 8, color: OG }} />Generating link…
          </div>
        ) : error ? (
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#991b1b' }}>{error}</div>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 12px' }}>
            <span style={{ flex: 1, minWidth: 0, fontFamily: FF, fontSize: 12.5, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {shareUrl}
            </span>
            <button onClick={copyLink} style={{ background: OG, color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontFamily: FF, fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
              <i className="fas fa-copy" style={{ marginRight: 6 }} />Copy Link
            </button>
          </div>
        )}

        <div style={{ display: 'flex', marginTop: 18 }}>
          <button style={{ ...CNCL, flex: 1 }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
