import { useState, useEffect, useCallback, useRef } from 'react';
import { FileText, Upload, Download, Trash2, File, FileImage, FileCheck2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch, erpUpload } from '../../../../hooks/useERPApi';
import { Card3D, Skeleton, PageHead, EmptyState, OG, DARK, FF, inp, lbl } from './hrShared';

interface Doc {
  id: number; employee: number; doc_type: string; doc_type_label: string;
  name: string; file_url: string | null; uploaded_at: string;
}

const DOC_TYPES = [
  { key: 'offer_letter', label: 'Offer Letter' }, { key: 'id_proof', label: 'ID Proof' },
  { key: 'contract', label: 'Contract' }, { key: 'certificate', label: 'Certificate' }, { key: 'other', label: 'Other' },
];
const ALLOWED = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
const MAX = 10 * 1024 * 1024;

const docIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return FileImage;
  if (ext === 'pdf') return FileCheck2;
  return File;
};

export default function HRDocumentsPage() {
  const employees = useERPList<any>('hr/employees/');
  const [empId, setEmpId] = useState<string>('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState('other');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    if (!empId) { setDocs([]); return; }
    setLoading(true);
    erpFetch(`hr/documents/?employee=${empId}`)
      .then(res => setDocs(Array.isArray(res) ? res : res?.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [empId]);
  useEffect(() => { load(); }, [load]);

  const doUpload = async (file: File) => {
    if (!empId) { toast.error('Select an employee first'); return; }
    if (!ALLOWED.includes(file.type)) { toast.error('Only PDF, DOC, JPG or PNG allowed'); return; }
    if (file.size > MAX) { toast.error('File must be under 10MB'); return; }
    setUploading(true);
    setProgress(0);
    const timer = setInterval(() => setProgress(p => Math.min(p + 12, 88)), 120);
    try {
      const fd = new FormData();
      fd.append('doc_type', docType);
      fd.append('name', file.name);
      fd.append('file', file);
      await erpUpload(`hr/employees/${empId}/documents/`, fd);
      clearInterval(timer); setProgress(100);
      toast.success('Document uploaded');
      setTimeout(() => { setUploading(false); setProgress(0); }, 400);
      load();
    } catch (e: any) {
      clearInterval(timer); setUploading(false); setProgress(0);
      toast.error(e.message || 'Upload failed');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const del = async (id: number) => {
    try { await erpFetch(`hr/documents/${id}/`, { method: 'DELETE' }); toast.success('Document deleted'); load(); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
  };

  const empName = employees.data.find((e: any) => String(e.id) === empId)?.full_name;

  return (
    <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
      <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <PageHead title="Employee Documents" subtitle="Upload and manage HR paperwork per employee" />

      {/* selectors */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 240 }}>
          <label style={lbl}>Employee</label>
          <select style={inp} value={empId} onChange={e => setEmpId(e.target.value)}>
            <option value="">— Select employee —</option>
            {employees.data.map((e: any) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 200 }}>
          <label style={lbl}>Document Type</label>
          <select style={inp} value={docType} onChange={e => setDocType(e.target.value)}>
            {DOC_TYPES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
        </div>
      </div>

      {/* dropzone */}
      {empId && (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) doUpload(e.dataTransfer.files[0]); }}
          style={{
            border: `2px dashed ${dragOver ? OG : 'rgba(201,136,58,0.35)'}`,
            background: dragOver ? 'rgba(201,136,58,0.06)' : '#fff',
            borderRadius: 16, padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
            marginBottom: 22, transition: 'border-color 0.18s ease, background 0.18s ease',
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) doUpload(e.target.files[0]); }} />
          <Upload size={30} color={OG} style={{ margin: '0 auto 10px', display: 'block' }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>Drag & drop a file, or click to browse</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>PDF, DOC, JPG or PNG · up to 10MB</div>
          {uploading && (
            <div style={{ maxWidth: 340, margin: '16px auto 0' }}>
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#e8a84e,#C9883A)', borderRadius: 4, transition: 'width 0.15s ease' }} />
              </div>
              <div style={{ fontSize: 11.5, color: OG, fontWeight: 700, marginTop: 6 }}>Uploading… {progress}%</div>
            </div>
          )}
        </div>
      )}

      {/* documents */}
      {!empId ? (
        <EmptyState icon={FileText} message="Select an employee to view and upload their documents." />
      ) : loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>{[0, 1, 2].map(i => <Skeleton key={i} h={110} />)}</div>
      ) : docs.length === 0 ? (
        <EmptyState icon={FileText} message={`No documents uploaded for ${empName || 'this employee'} yet.`} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
          {docs.map(d => {
            const Icon = docIcon(d.name);
            return (
              <Card3D key={d.id} accent={OG} p="16px 18px">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(201,136,58,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={OG} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{d.doc_type_label} · {new Date(d.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  {d.file_url && (
                    <a href={d.file_url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(201,136,58,0.10)', color: OG, borderRadius: 8, padding: '7px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                      <Download size={13} /> Download
                    </a>
                  )}
                  <button onClick={() => del(d.id)} style={{ background: 'rgba(239,68,68,0.10)', border: 'none', borderRadius: 8, width: 34, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={13} /></button>
                </div>
              </Card3D>
            );
          })}
        </div>
      )}
    </div>
  );
}
