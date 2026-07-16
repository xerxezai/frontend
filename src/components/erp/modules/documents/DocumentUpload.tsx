import { useState, useRef } from 'react';
import { OG, FF, inp, lbl, SAVE, CNCL, OVR, CRD, CATEGORIES } from './documentsShared';
import { uploadDocument } from './documentApi';

const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.dwg';

export default function DocumentUpload({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [version, setVersion] = useState('v1');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canSubmit = title.trim() && category && file && !uploading;

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) setFile(files[0]);
  };

  const submit = async () => {
    if (!canSubmit || !file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('version', version.trim() || 'v1');
      formData.append('description', description);
      formData.append('file', file);
      await uploadDocument(formData);
      onUploaded();
    } catch (e: any) {
      setError(e.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div style={{ ...CRD, maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 17, color: '#1A1A1A', marginBottom: 18 }}>
          <i className="fas fa-cloud-upload-alt" style={{ color: OG, marginRight: 8 }} />Upload Document
        </h5>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Title *</label>
          <input style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Foundation Layout Drawing Rev A" />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 2 }}>
            <label style={lbl}>Category *</label>
            <select style={inp} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Version</label>
            <input style={inp} value={version} onChange={e => setVersion(e.target.value)} placeholder="v1" />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Description</label>
          <textarea style={{ ...inp, minHeight: 70, resize: 'vertical' as const }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional notes about this document" />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>File *</label>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
            style={{
              border: `2px dashed ${dragging ? OG : 'rgba(0,0,0,0.15)'}`,
              borderRadius: 12, padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
              background: dragging ? `${OG}0d` : '#F8F7F4', transition: 'all 160ms ease',
            }}
          >
            <input ref={inputRef} type="file" accept={ACCEPT} style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            <i className={file ? 'fas fa-file-circle-check' : 'fas fa-cloud-arrow-up'} style={{ color: OG, fontSize: 22, marginBottom: 8, display: 'block' }} />
            <div style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>
              {file ? file.name : 'Click or drag a file here'}
            </div>
            <div style={{ fontFamily: FF, fontSize: 11, color: '#6B6B6B', marginTop: 4 }}>
              PDF, Word, Excel, image or DWG
            </div>
          </div>
        </div>

        {error && (
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#991b1b', marginBottom: 10 }}>{error}</div>
        )}

        {uploading && (
          <div style={{ fontFamily: FF, fontSize: 12.5, color: OG, marginBottom: 10 }}>
            <i className="fas fa-circle-notch fa-spin" style={{ marginRight: 6 }} />Uploading…
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button style={{ ...CNCL, flex: 1 }} onClick={onClose} disabled={uploading}>Cancel</button>
          <button style={{ ...SAVE, flex: 1, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }} onClick={submit} disabled={!canSubmit}>
            {uploading ? 'Uploading…' : 'Upload Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
