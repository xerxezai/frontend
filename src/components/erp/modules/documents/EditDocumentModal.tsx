import { useState } from 'react';
import { OG, FF, inp, lbl, SAVE, CNCL, OVR, CRD, CATEGORIES, type DocumentT } from './documentsShared';
import { updateDocument } from './documentApi';

export default function EditDocumentModal({
  doc, onClose, onSaved,
}: {
  doc: DocumentT;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(doc.title);
  const [category, setCategory] = useState(doc.category);
  const [description, setDescription] = useState(doc.description || '');
  const [expiryDate, setExpiryDate] = useState(doc.expiry_date || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = title.trim().length > 0;

  const save = async () => {
    if (!canSave) return;
    setBusy(true);
    setError(null);
    try {
      await updateDocument(doc.id, {
        title: title.trim(), category, description, expiry_date: expiryDate || null,
      });
      onSaved();
    } catch (e: any) {
      setError(e.message || 'Update failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div style={{ ...CRD, maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', marginBottom: 18 }}>
          <i className="fas fa-pen" style={{ color: OG, marginRight: 8 }} />Edit Document
        </h5>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Title *</label>
          <input style={inp} value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Category</label>
          <select style={inp} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Description</label>
          <textarea style={{ ...inp, minHeight: 70, resize: 'vertical' as const }} value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Expiry Date (optional)</label>
          <input type="date" style={inp} value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
        </div>

        {error && <div style={{ fontFamily: FF, fontSize: 12.5, color: '#991b1b', marginTop: 10 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button style={{ ...CNCL, flex: 1 }} onClick={onClose} disabled={busy}>Cancel</button>
          <button style={{ ...SAVE, flex: 1, opacity: canSave && !busy ? 1 : 0.5, cursor: canSave && !busy ? 'pointer' : 'not-allowed' }} onClick={save} disabled={!canSave || busy}>
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
