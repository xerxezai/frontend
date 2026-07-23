import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FileText, Upload, Download, Trash2, File, FileImage, FileCheck2, Search, AlertTriangle,
  CheckCircle2, XCircle, Clock, ShieldCheck, BadgeCheck, Plane, GraduationCap, HeartPulse,
  Lock, Briefcase, Plus, X as XIcon, CreditCard, Car, Landmark, Receipt, UserCheck, Eye,
  Maximize2, Files,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch, erpUpload, isSuperUser } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import { Card3D, Skeleton, PageHead, EmptyState, SlidePanel, OG, DARK, WHITE, CREAM, FF, inp, lbl } from './hrShared';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const DOC_TYPES: { key: string; label: string; icon: React.ElementType }[] = [
  { key: 'aadhar_card', label: 'Aadhaar Card', icon: CreditCard },
  { key: 'pan_card', label: 'PAN Card', icon: CreditCard },
  { key: 'passport', label: 'Passport', icon: BadgeCheck },
  { key: 'driving_license', label: 'Driving License', icon: Car },
  { key: 'emirates_id', label: 'Emirates ID', icon: CreditCard },
  { key: 'visa', label: 'Visa', icon: Plane },
  { key: 'employment_contract', label: 'Employment Contract', icon: Briefcase },
  { key: 'offer_letter', label: 'Offer Letter', icon: FileText },
  { key: 'appointment_letter', label: 'Appointment Letter', icon: FileText },
  { key: 'experience_certificate', label: 'Experience Letter', icon: Briefcase },
  { key: 'relieving_letter', label: 'Relieving Letter', icon: FileText },
  { key: 'educational_certificate', label: 'Educational Certificate', icon: GraduationCap },
  { key: 'degree_certificate', label: 'Degree Certificate', icon: GraduationCap },
  { key: 'marksheet', label: 'Marksheet', icon: GraduationCap },
  { key: 'medical_certificate', label: 'Medical Certificate', icon: HeartPulse },
  { key: 'insurance', label: 'Insurance Document', icon: ShieldCheck },
  { key: 'bank_account_details', label: 'Bank Account Details', icon: Landmark },
  { key: 'cancelled_cheque', label: 'Cancelled Cheque', icon: Receipt },
  { key: 'salary_slip', label: 'Salary Slip', icon: Receipt },
  { key: 'background_verification', label: 'Background Verification', icon: UserCheck },
  { key: 'nda', label: 'NDA', icon: Lock },
  { key: 'other', label: 'Other', icon: File },
];
const DOC_TYPE_MAP = Object.fromEntries(DOC_TYPES.map(d => [d.key, d]));

const EXPIRY_META: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  valid: { label: 'Valid', bg: '#d1fae5', color: '#065f46', icon: CheckCircle2 },
  expiring_soon: { label: 'Expiring Soon', bg: '#ffedd5', color: '#c2410c', icon: AlertTriangle },
  expired: { label: 'Expired', bg: '#fee2e2', color: '#991b1b', icon: XCircle },
};

// Verification/expiry combined status shown in the table — expiry takes priority since it's
// the more urgent signal; only once a document is neither expired nor expiring soon does
// whether it's been verified become the headline state.
function combinedStatus(d: any): { label: string; bg: string; color: string; icon: React.ElementType } {
  if (d.expiry_status === 'expired') return EXPIRY_META.expired;
  if (d.expiry_status === 'expiring_soon') return EXPIRY_META.expiring_soon;
  if (d.is_verified) return { label: 'Verified', bg: '#d1fae5', color: '#065f46', icon: CheckCircle2 };
  return { label: 'Pending', bg: '#f1f5f9', color: '#64748b', icon: Clock };
}

const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_HINT = 'PDF, JPG, PNG or DOCX';
const MAX = 5 * 1024 * 1024;

const extOf = (name: string) => name.split('.').pop()?.toLowerCase() || '';
const isPreviewable = (name: string) => ['pdf', 'jpg', 'jpeg', 'png'].includes(extOf(name));

const fileIcon = (name: string) => {
  const ext = extOf(name);
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return FileImage;
  if (ext === 'pdf') return FileCheck2;
  return File;
};

const fmtDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const StatusBadge = ({ status }: { status: { label: string; bg: string; color: string; icon: React.ElementType } }) => {
  const Icon = status.icon;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: status.bg, color: status.color, fontFamily: FF }}>
      <Icon size={11} />{status.label}
    </span>
  );
};

function StatCard({ label, val, icon: Icon, color }: { label: string; val: number; icon: React.ElementType; color: string }) {
  return (
    <Card3D accent={color} p="16px 18px">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={17} color={color} />
        </div>
        <div>
          <div style={{ fontFamily: FF, fontSize: 20, fontWeight: 900, color: DARK, lineHeight: 1.1 }}>{val}</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, fontWeight: 600, marginTop: 2 }}>{label}</div>
        </div>
      </div>
    </Card3D>
  );
}

// ── Searchable employee combobox — used by both the single and bulk upload panels ─────
function EmployeeSearchSelect({ employees, value, onChange, placeholder }: {
  employees: any[]; value: string; onChange: (id: string) => void; placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const selected = employees.find((e: any) => String(e.id) === value);
  const filtered = useMemo(
    () => employees.filter((e: any) => e.full_name.toLowerCase().includes(query.toLowerCase())),
    [employees, query],
  );

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={open ? query : (selected ? selected.full_name : '')}
        onFocus={() => { setOpen(true); setQuery(''); }}
        onChange={e => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder || 'Search employee by name…'}
        style={inp}
      />
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 9, maxHeight: 220, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', marginTop: 4 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 12px', fontSize: 12, color: MUTED, fontFamily: FF }}>No employees match.</div>
          ) : filtered.map((e: any) => (
            <div key={e.id} onMouseDown={() => { onChange(String(e.id)); setOpen(false); }}
              style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 12.5, fontFamily: FF, color: DARK, borderBottom: `1px solid ${BORDER}` }}>
              {e.full_name} <span style={{ color: MUTED }}>({e.code})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Local-file preview (before upload) — object URL, never leaves the browser ─────────
function LocalFilePreviewModal({ file, onClose }: { file: File; onClose: () => void }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  const previewable = isPreviewable(file.name);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1070, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 700, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: DARK }}>{file.name}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 20 }}>&times;</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!previewable ? (
            <div style={{ padding: 48, textAlign: 'center', color: MUTED, fontFamily: FF, fontSize: 13 }}>
              Preview isn't available for this file type — it will still upload normally.
            </div>
          ) : extOf(file.name) === 'pdf' ? (
            <iframe src={url} title="Preview" style={{ width: '100%', height: '70vh', border: 'none' }} />
          ) : (
            <img src={url} alt={file.name} style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Saved-document preview (real file_url) and details modals ─────────────────────────
function DocumentPreviewModal({ doc, onClose }: { doc: any; onClose: () => void }) {
  const previewable = isPreviewable(doc.name || doc.file_url || '');
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1070, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 700, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: DARK }}>{doc.name}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 20 }}>&times;</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!previewable || !doc.file_url ? (
            <div style={{ padding: 48, textAlign: 'center', color: MUTED, fontFamily: FF, fontSize: 13 }}>
              DOCX files can't be previewed in the browser — use Download instead.
            </div>
          ) : extOf(doc.name) === 'pdf' ? (
            <iframe src={doc.file_url} title="Preview" style={{ width: '100%', height: '70vh', border: 'none' }} />
          ) : (
            <img src={doc.file_url} alt={doc.name} style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentDetailModal({ doc, onClose }: { doc: any; onClose: () => void }) {
  const status = combinedStatus(doc);
  const typeMeta = DOC_TYPE_MAP[doc.doc_type];
  const rows: [string, string][] = [
    ['Employee', doc.employee_name],
    ['Document Type', typeMeta?.label || doc.doc_type_label],
    ['Document Name', doc.name],
    ['Document Number', doc.document_number || '—'],
    ['Issue Date', fmtDate(doc.issue_date)],
    ['Expiry Date', fmtDate(doc.expiry_date)],
    ['Uploaded', doc.uploaded_by_username ? `By ${doc.uploaded_by_username} on ${fmtDate(doc.uploaded_at)}` : fmtDate(doc.uploaded_at)],
    ['Verified', doc.verified_by_username ? `By ${doc.verified_by_username} on ${fmtDate(doc.verified_at)}` : 'Not verified yet'],
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1070, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 480, boxShadow: '0 24px 70px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 15, color: DARK }}>Document Details</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 20 }}>&times;</button>
        </div>
        <div style={{ padding: '18px 22px' }}>
          <div style={{ marginBottom: 14 }}><StatusBadge status={status} /></div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FF }}>
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '7px 0', fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', verticalAlign: 'top', width: '42%' }}>{k}</td>
                  <td style={{ padding: '7px 0', fontSize: 13, color: DARK }}>{v}</td>
                </tr>
              ))}
              {doc.notes && (
                <tr>
                  <td style={{ padding: '7px 0', fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', verticalAlign: 'top' }}>Notes</td>
                  <td style={{ padding: '7px 0', fontSize: 13, color: DARK }}>{doc.notes}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const emptyForm = {
  employee: '', doc_type: '', name: '', document_number: '', issue_date: '', expiry_date: '', notes: '',
};

// ── Upload Document panel ────────────────────────────────────────────────────
function UploadDocumentPanel({ employees, onClose, onUploaded }: {
  employees: any[]; onClose: () => void; onUploaded: () => void;
}) {
  const [form, setForm] = useState({ ...emptyForm });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const daysUntilExpiry = form.expiry_date
    ? Math.round((new Date(form.expiry_date).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000)
    : null;

  const pickFile = (f: File | null) => {
    if (!f) { setFile(null); return; }
    if (!ALLOWED.includes(f.type)) { toast.error(`Only ${ALLOWED_HINT} allowed`); if (fileRef.current) fileRef.current.value = ''; return; }
    if (f.size > MAX) { toast.error('File too large. Maximum size is 5MB'); if (fileRef.current) fileRef.current.value = ''; return; }
    setFile(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employee || !form.doc_type || !form.name || !file) { toast.error('Please fill all required fields and attach a file.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('doc_type', form.doc_type);
      fd.append('name', form.name);
      if (form.document_number) fd.append('document_number', form.document_number);
      if (form.issue_date) fd.append('issue_date', form.issue_date);
      if (form.expiry_date) fd.append('expiry_date', form.expiry_date);
      if (form.notes) fd.append('notes', form.notes);
      fd.append('file', file);
      await erpUpload(`hr/employees/${form.employee}/documents/`, fd);
      toast.success('Document uploaded');
      onUploaded();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SlidePanel title="Upload Document" subtitle="Add a document to an employee's file" width={460} onClose={onClose}
      footer={(
        <>
          <button type="button" onClick={onClose} style={{ flex: 1, background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '10px 0', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13, color: MUTED }}>Cancel</button>
          <button type="submit" form="doc-upload-form" disabled={saving} style={{ flex: 1, background: 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 0', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Uploading…' : 'Upload Document'}
          </button>
        </>
      )}
    >
      <form id="doc-upload-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={lbl}>Employee *</label>
          <EmployeeSearchSelect employees={employees} value={form.employee} onChange={v => setForm(f => ({ ...f, employee: v }))} />
        </div>
        <div>
          <label style={lbl}>Document Type *</label>
          <select value={form.doc_type} onChange={e => setForm(f => ({ ...f, doc_type: e.target.value }))} style={inp} required>
            <option value="" disabled>-- Select Document Type --</option>
            {DOC_TYPES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Document Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Passport — John Doe" style={inp} required />
        </div>
        <div>
          <label style={lbl}>Document Number</label>
          <input value={form.document_number} onChange={e => setForm(f => ({ ...f, document_number: e.target.value }))} placeholder="Passport / visa number, etc." style={inp} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lbl}>Issue Date</label>
            <input type="date" value={form.issue_date} onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))} style={inp} />
          </div>
          <div>
            <label style={lbl}>Expiry Date</label>
            <input type="date" value={form.expiry_date} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} style={inp} />
          </div>
        </div>
        {daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: daysUntilExpiry < 0 ? 'rgba(239,68,68,0.08)' : 'rgba(249,115,22,0.08)', border: `1px solid ${daysUntilExpiry < 0 ? 'rgba(239,68,68,0.25)' : 'rgba(249,115,22,0.25)'}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: FF, color: daysUntilExpiry < 0 ? '#991b1b' : '#c2410c', fontWeight: 600 }}>
            <AlertTriangle size={13} />
            {daysUntilExpiry < 0 ? 'This document has already expired.' : `This document expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}.`}
          </div>
        )}
        <div>
          <label style={lbl}>Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} />
        </div>
        <div>
          <label style={lbl}>File *</label>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8, border: `1.5px dashed ${file ? OG : 'rgba(201,136,58,0.35)'}`,
            borderRadius: 9, padding: '10px 12px', cursor: 'pointer', background: file ? 'rgba(201,136,58,0.05)' : '#fff',
          }}>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" style={{ display: 'none' }}
              onChange={e => pickFile(e.target.files?.[0] || null)} />
            <Upload size={15} color={OG} />
            <span style={{ fontSize: 12.5, fontFamily: FF, color: file ? DARK : MUTED, fontWeight: file ? 700 : 500 }}>
              {file ? file.name : `Choose a ${ALLOWED_HINT} file`}
            </span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: FF }}>Max 5MB.</span>
            {file && (
              <button type="button" onClick={() => setPreviewing(true)}
                style={{ background: 'none', border: 'none', color: OG, fontSize: 11.5, fontWeight: 700, fontFamily: FF, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Maximize2 size={11} />Preview
              </button>
            )}
          </div>
        </div>
      </form>
      {previewing && file && <LocalFilePreviewModal file={file} onClose={() => setPreviewing(false)} />}
    </SlidePanel>
  );
}

// ── Bulk Upload panel — one employee, many files, each with its own document type ─────
type BulkRow = { id: number; file: File | null; doc_type: string; name: string };

function BulkUploadPanel({ employees, onClose, onUploaded }: {
  employees: any[]; onClose: () => void; onUploaded: () => void;
}) {
  const [employee, setEmployee] = useState('');
  const [rows, setRows] = useState<BulkRow[]>([{ id: 1, file: null, doc_type: '', name: '' }]);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const addRow = () => setRows(r => [...r, { id: Date.now(), file: null, doc_type: '', name: '' }]);
  const removeRow = (id: number) => setRows(r => r.filter(x => x.id !== id));
  const updateRow = (id: number, patch: Partial<BulkRow>) => setRows(r => r.map(x => x.id === id ? { ...x, ...patch } : x));

  const pickFile = (id: number, f: File | null) => {
    if (!f) { updateRow(id, { file: null }); return; }
    if (!ALLOWED.includes(f.type)) { toast.error(`Only ${ALLOWED_HINT} allowed`); return; }
    if (f.size > MAX) { toast.error('File too large. Maximum size is 5MB'); return; }
    updateRow(id, { file: f, name: rows.find(r => r.id === id)?.name || f.name.replace(/\.[^.]+$/, '') });
  };

  const submit = async () => {
    if (!employee) { toast.error('Select an employee first.'); return; }
    const valid = rows.filter(r => r.file && r.doc_type && r.name.trim());
    if (valid.length === 0) { toast.error('Add at least one file with a document type and name.'); return; }
    setSaving(true);
    setProgress({ done: 0, total: valid.length });
    let failed = 0;
    for (const r of valid) {
      try {
        const fd = new FormData();
        fd.append('doc_type', r.doc_type);
        fd.append('name', r.name);
        fd.append('file', r.file as File);
        await erpUpload(`hr/employees/${employee}/documents/`, fd);
      } catch {
        failed += 1;
      }
      setProgress(p => ({ ...p, done: p.done + 1 }));
    }
    setSaving(false);
    if (failed === 0) toast.success(`${valid.length} document${valid.length === 1 ? '' : 's'} uploaded`);
    else toast.error(`${valid.length - failed} uploaded, ${failed} failed`);
    onUploaded();
    onClose();
  };

  return (
    <SlidePanel title="Bulk Upload" subtitle="Upload multiple documents for one employee at once" width={520} onClose={onClose}
      footer={(
        <>
          <button type="button" onClick={onClose} style={{ flex: 1, background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '10px 0', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13, color: MUTED }}>Cancel</button>
          <button type="button" onClick={submit} disabled={saving} style={{ flex: 1, background: 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 0', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? `Uploading ${progress.done}/${progress.total}…` : 'Upload All'}
          </button>
        </>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={lbl}>Employee *</label>
          <EmployeeSearchSelect employees={employees} value={employee} onChange={setEmployee} />
        </div>

        <label style={lbl}>Files</label>
        {rows.map((r, i) => (
          <div key={r.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, fontFamily: FF, textTransform: 'uppercase', letterSpacing: '0.05em' }}>File {i + 1}</span>
              {rows.length > 1 && (
                <button type="button" onClick={() => removeRow(r.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><XIcon size={13} /></button>
              )}
            </div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8, border: `1.5px dashed ${r.file ? OG : 'rgba(201,136,58,0.35)'}`,
              borderRadius: 8, padding: '8px 10px', cursor: 'pointer', background: r.file ? 'rgba(201,136,58,0.05)' : '#fff',
            }}>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" style={{ display: 'none' }}
                onChange={e => pickFile(r.id, e.target.files?.[0] || null)} />
              <Upload size={13} color={OG} />
              <span style={{ fontSize: 12, fontFamily: FF, color: r.file ? DARK : MUTED, fontWeight: r.file ? 700 : 500 }}>
                {r.file ? r.file.name : `Choose a ${ALLOWED_HINT} file`}
              </span>
            </label>
            <select value={r.doc_type} onChange={e => updateRow(r.id, { doc_type: e.target.value })} style={{ ...inp, padding: '7px 10px' }}>
              <option value="" disabled>-- Select Document Type --</option>
              {DOC_TYPES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
            <input value={r.name} onChange={e => updateRow(r.id, { name: e.target.value })} placeholder="Document name" style={{ ...inp, padding: '7px 10px' }} />
          </div>
        ))}
        <button type="button" onClick={addRow}
          style={{ background: 'rgba(201,136,58,0.08)', border: '1px solid rgba(201,136,58,0.25)', borderRadius: 9, padding: '9px 0', color: OG, fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Plus size={13} />Add Another File
        </button>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: FF }}>Max 5MB per file · {ALLOWED_HINT}.</div>
      </div>
    </SlidePanel>
  );
}

// ── Delete confirmation ───────────────────────────────────────────────────────
function DeleteDlg({ doc, busy, onCancel, onConfirm }: { doc: any; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1060, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 400, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: DARK }}>Delete Document?</h6>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: DARK }}>{doc.name}</strong> for <strong style={{ color: DARK }}>{doc.employee_name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={busy} style={{ flex: 1, background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 9, padding: 9, cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13, color: MUTED }}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: 9, cursor: busy ? 'wait' : 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

type StatusFilter = 'all' | 'valid' | 'expiring_soon' | 'expired';

export default function HRDocumentsPage() {
  const { isCompanyAdmin, isHRManager } = useAccess();
  // Company Admin / HR Manager (and Super Admin) can upload, verify, and delete documents;
  // Regular User / Read Only can only view+download their own — matches the backend's
  // _is_hr_privileged gate on the documents endpoints exactly, including HR Manager now
  // being allowed to delete (not just verify).
  const isAdmin = isSuperUser() || isCompanyAdmin || isHRManager;

  const employees = useERPList<any>('hr/employees/');
  const documents = useERPList<any>('hr/documents/');

  const [stats, setStats] = useState<{ total: number; expiring_soon: number; expired: number; verified: number } | null>(null);
  const [expiringAlerts, setExpiringAlerts] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [deleting, setDeleting] = useState<any>(null);
  const [viewing, setViewing] = useState<any>(null);
  const [previewingDoc, setPreviewingDoc] = useState<any>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const loadStats = () => erpFetch('hr/documents/stats/').then(setStats).catch(() => setStats(null));
  useEffect(() => { loadStats(); }, [documents.data.length]);

  useEffect(() => {
    if (!isAdmin) return;
    erpFetch('hr/documents/expiring/').then(setExpiringAlerts).catch(() => setExpiringAlerts([]));
  }, [isAdmin, documents.data.length]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return documents.data
      .filter((d: any) => {
        if (s && !(d.employee_name?.toLowerCase().includes(s) || d.name?.toLowerCase().includes(s))) return false;
        if (typeFilter !== 'all' && d.doc_type !== typeFilter) return false;
        if (statusFilter !== 'all' && d.expiry_status !== statusFilter) return false;
        return true;
      })
      .sort((a: any, b: any) => {
        if (!a.expiry_date && !b.expiry_date) return 0;
        if (!a.expiry_date) return 1;
        if (!b.expiry_date) return -1;
        return a.expiry_date.localeCompare(b.expiry_date);
      });
  }, [documents.data, search, typeFilter, statusFilter]);

  const verify = async (id: number) => {
    setBusyId(id);
    try {
      await erpFetch(`hr/documents/${id}/verify/`, { method: 'PATCH', body: JSON.stringify({}) });
      await documents.reload();
      toast.success('Document verified');
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify document');
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    setBusyId(deleting.id);
    try {
      await documents.remove(deleting.id);
      toast.success('Document deleted');
      setDeleting(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete document');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
      <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}`}</style>

      <PageHead
        title="Employee Documents"
        subtitle={isAdmin ? 'Upload and manage HR paperwork for every employee' : 'Your documents on file'}
        action={isAdmin ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowBulkUpload(true)}
              style={{ background: CREAM, color: DARK, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 18px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Files size={15} />Bulk Upload
            </button>
            <button onClick={() => setShowUpload(true)}
              style={{ background: 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 3px 0 rgba(150,95,30,0.5)' }}>
              <Plus size={15} />Upload Document
            </button>
          </div>
        ) : undefined}
      />

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
        <StatCard label="Total Documents" val={stats?.total ?? 0} icon={FileText} color="#3b82f6" />
        <StatCard label="Expiring Soon" val={stats?.expiring_soon ?? 0} icon={AlertTriangle} color="#f97316" />
        <StatCard label="Expired" val={stats?.expired ?? 0} icon={XCircle} color="#ef4444" />
        <StatCard label="Verified Documents" val={stats?.verified ?? 0} icon={ShieldCheck} color="#22c55e" />
      </div>

      {/* Expiry alerts — admin/HR manager only */}
      {isAdmin && expiringAlerts.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.09), rgba(249,115,22,0.03))', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 14, padding: '16px 20px', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={15} color="#c2410c" />
            <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 13.5, color: DARK }}>Documents Expiring Soon</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {expiringAlerts.map((d: any) => (
              <div key={d.id} style={{ background: WHITE, borderRadius: 10, padding: '10px 16px', border: `1px solid ${BORDER}`, minWidth: 200 }}>
                <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: DARK }}>{d.employee_name}</div>
                <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, margin: '3px 0 6px' }}>{DOC_TYPE_MAP[d.doc_type]?.label || d.doc_type_label} · {fmtDate(d.expiry_date)}</div>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 800, color: '#c2410c' }}>
                  {d.days_until_expiry === 0 ? 'Today' : d.days_until_expiry === 1 ? 'Tomorrow' : `${d.days_until_expiry} days remaining`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: 11, color: MUTED }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by employee or document name…" style={{ ...inp, paddingLeft: 32 }} />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ ...inp, width: 'auto' }}>
          <option value="all">All Document Types</option>
          {DOC_TYPES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)} style={{ ...inp, width: 'auto' }}>
          <option value="all">All Status</option>
          <option value="valid">Valid</option>
          <option value="expiring_soon">Expiring Soon</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Documents table */}
      {documents.loading ? (
        <Skeleton h={240} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileText} message={documents.data.length === 0 ? 'No documents uploaded yet.' : 'No documents match your search.'} cta={isAdmin && documents.data.length === 0 ? <button onClick={() => setShowUpload(true)} style={{ background: 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 18px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Upload Document</button> : undefined} />
      ) : (
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Employee', 'Type', 'Document', 'Number', 'Issue Date', 'Expiry Date', 'Status', 'Audit Trail', ''].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d: any) => {
                  const typeMeta = DOC_TYPE_MAP[d.doc_type];
                  const Icon = typeMeta?.icon || fileIcon(d.name);
                  const status = combinedStatus(d);
                  const previewable = isPreviewable(d.name);
                  return (
                    <tr key={d.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: '11px 16px', fontWeight: 600, color: DARK, whiteSpace: 'nowrap' }}>{d.employee_name}</td>
                      <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: MUTED }}>
                          <Icon size={13} color={OG} />{typeMeta?.label || d.doc_type_label}
                        </span>
                      </td>
                      <td style={{ padding: '11px 16px', color: DARK }}>{d.name}</td>
                      <td style={{ padding: '11px 16px', color: MUTED }}>{d.document_number || '—'}</td>
                      <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{fmtDate(d.issue_date)}</td>
                      <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{fmtDate(d.expiry_date)}</td>
                      <td style={{ padding: '11px 16px' }}><StatusBadge status={status} /></td>
                      <td style={{ padding: '11px 16px', minWidth: 190 }}>
                        <div style={{ fontSize: 11.5, color: MUTED }}>Uploaded by {d.uploaded_by_username || '—'} on {fmtDate(d.uploaded_at)}</div>
                        <div style={{ fontSize: 11, color: d.verified_by_username ? '#059669' : MUTED, marginTop: 2 }}>
                          {d.verified_by_username ? `Verified by ${d.verified_by_username} on ${fmtDate(d.verified_at)}` : 'Not verified'}
                        </div>
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button onClick={() => setViewing(d)} title="View Details"
                            style={{ background: CREAM, color: DARK, border: `1px solid ${BORDER}`, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                            <Eye size={12} />
                          </button>
                          {previewable && d.file_url && (
                            <button onClick={() => setPreviewingDoc(d)} title="Preview"
                              style={{ background: 'rgba(59,130,246,0.08)', color: '#2563eb', border: '1px solid rgba(59,130,246,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                              <Maximize2 size={12} />
                            </button>
                          )}
                          {d.file_url && (
                            <a href={d.file_url} target="_blank" rel="noopener noreferrer" title="Download"
                              style={{ background: 'rgba(201,136,58,0.08)', color: OG, border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
                              <Download size={12} />
                            </a>
                          )}
                          {isAdmin && !d.is_verified && (
                            <button onClick={() => verify(d.id)} disabled={busyId === d.id} title="Verify"
                              style={{ background: 'rgba(34,197,94,0.08)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                              <CheckCircle2 size={12} />
                            </button>
                          )}
                          {isAdmin && (
                            <button onClick={() => setDeleting(d)} title="Delete"
                              style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showUpload && (
        <UploadDocumentPanel employees={employees.data} onClose={() => setShowUpload(false)} onUploaded={() => { documents.reload(); loadStats(); }} />
      )}
      {showBulkUpload && (
        <BulkUploadPanel employees={employees.data} onClose={() => setShowBulkUpload(false)} onUploaded={() => { documents.reload(); loadStats(); }} />
      )}
      {deleting && (
        <DeleteDlg doc={deleting} busy={busyId === deleting.id} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />
      )}
      {viewing && (
        <DocumentDetailModal doc={viewing} onClose={() => setViewing(null)} />
      )}
      {previewingDoc && (
        <DocumentPreviewModal doc={previewingDoc} onClose={() => setPreviewingDoc(null)} />
      )}
      {!isAdmin && documents.data.length === 0 && !documents.loading && (
        <div style={{ marginTop: 12, fontFamily: FF, fontSize: 12.5, color: MUTED }}>
          <XIcon size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />No employee profile linked, or no documents uploaded for you yet.
        </div>
      )}
    </div>
  );
}
