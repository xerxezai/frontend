import { useState } from 'react';
import { toast } from 'react-toastify';
import { OG, FF, inp, lbl, SAVE, CNCL, OVR, CRD, CATEGORIES } from './documentsShared';
import { uploadDocument } from './documentApi';

const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.dwg';

type FileStatus = 'pending' | 'uploading' | 'done' | 'error';

interface Row { file: File; status: FileStatus; error?: string; }

export default function BulkUploadModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }) {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [rows, setRows] = useState<Row[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setRows(prev => [...prev, ...Array.from(files).map(file => ({ file, status: 'pending' as FileStatus }))]);
  };

  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const uploadAll = async () => {
    if (rows.length === 0) return;
    setUploading(true);
    let successCount = 0;
    for (let i = 0; i < rows.length; i++) {
      setRows(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'uploading' } : r));
      try {
        const formData = new FormData();
        const nameWithoutExt = rows[i].file.name.replace(/\.[^/.]+$/, '');
        formData.append('title', nameWithoutExt);
        formData.append('category', category);
        formData.append('version', 'v1');
        formData.append('description', '');
        formData.append('file', rows[i].file);
        await uploadDocument(formData);
        successCount += 1;
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'done' } : r));
      } catch (e: any) {
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'error', error: e.message || 'Upload failed' } : r));
      }
    }
    setUploading(false);
    if (successCount > 0) {
      toast.success(`${successCount} document${successCount === 1 ? '' : 's'} uploaded successfully`);
      onUploaded();
    }
    if (successCount < rows.length) {
      toast.error(`${rows.length - successCount} file(s) failed to upload`);
    }
  };

  const allDone = rows.length > 0 && rows.every(r => r.status === 'done' || r.status === 'error');

  return (
    <div style={OVR} onClick={uploading ? undefined : onClose}>
      <div style={{ ...CRD, maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 17, color: '#1A1A1A', marginBottom: 18 }}>
          <i className="fas fa-layer-group" style={{ color: OG, marginRight: 8 }} />Bulk Upload Documents
        </h5>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Category (applies to all files)</label>
          <select style={inp} value={category} onChange={e => setCategory(e.target.value)} disabled={uploading}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Files *</label>
          <div
            onClick={() => document.getElementById('bulk-upload-input')?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            style={{
              border: `2px dashed ${dragging ? OG : 'rgba(0,0,0,0.15)'}`,
              borderRadius: 12, padding: '22px 16px', textAlign: 'center', cursor: 'pointer',
              background: dragging ? `${OG}0d` : '#F8F7F4', transition: 'all 160ms ease',
            }}
          >
            <input id="bulk-upload-input" type="file" multiple accept={ACCEPT} style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />
            <i className="fas fa-cloud-arrow-up" style={{ color: OG, fontSize: 20, marginBottom: 8, display: 'block' }} />
            <div style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: '#1A1A1A' }}>Click or drag multiple files here</div>
            <div style={{ fontFamily: FF, fontSize: 11, color: '#6B6B6B', marginTop: 4 }}>PDF, Word, Excel, image or DWG</div>
          </div>
        </div>

        {rows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14, maxHeight: 220, overflowY: 'auto' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.06)' }}>
                <i className="fas fa-file" style={{ color: '#9ca3af', fontSize: 12 }} />
                <span style={{ flex: 1, minWidth: 0, fontFamily: FF, fontSize: 12, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.file.name}</span>
                {r.status === 'pending' && !uploading && (
                  <button onClick={() => removeRow(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12 }}><i className="fas fa-times" /></button>
                )}
                {r.status === 'uploading' && <i className="fas fa-circle-notch fa-spin" style={{ color: OG, fontSize: 12 }} />}
                {r.status === 'done' && <i className="fas fa-check-circle" style={{ color: '#16a34a', fontSize: 12 }} />}
                {r.status === 'error' && <i className="fas fa-triangle-exclamation" style={{ color: '#ef4444', fontSize: 12 }} title={r.error} />}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button style={{ ...CNCL, flex: 1 }} onClick={onClose} disabled={uploading}>{allDone ? 'Close' : 'Cancel'}</button>
          <button
            style={{ ...SAVE, flex: 1, opacity: rows.length === 0 || uploading ? 0.5 : 1, cursor: rows.length === 0 || uploading ? 'not-allowed' : 'pointer' }}
            onClick={uploadAll}
            disabled={rows.length === 0 || uploading}
          >
            {uploading ? 'Uploading…' : `Upload All (${rows.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
