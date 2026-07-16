import { useState, type CSSProperties, type ReactNode } from 'react';

// ── XERXEZ brand tokens (copied verbatim per-module, see CLAUDE.md) ─────────
export const OG    = '#C9883A';
export const OG_G  = 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)';
export const DARK  = '#1a1208';
export const CREAM = '#F8F7F4';
export const WHITE = '#FFFFFF';
export const FF    = "'DM Sans',sans-serif";
export const BORDER = 'rgba(0,0,0,0.08)';
export const BCARD = '0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)';
export const BHOV  = '0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)';

export const inp: CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:FF,fontSize:13,outline:'none',boxSizing:'border-box' };
export const lbl: CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:'#6B6B6B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:FF };
export const SAVE: CSSProperties = { background:OG_G,color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:FF,fontWeight:700,fontSize:13,cursor:'pointer' };
export const CNCL: CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:FF,fontWeight:600,fontSize:13 };
export const OVR: CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
export const CRD: CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:720,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'88vh',overflowY:'auto' };

export const Card3D = ({
  children, accent = OG, style = {}, p = '20px 18px',
}: { children: ReactNode; accent?: string; style?: CSSProperties; p?: string }) => {
  const [h, setH] = useState(false);
  return (
    <div
      style={{
        background: WHITE, borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.07)',
        borderTop: `3px solid ${accent}`,
        boxShadow: h ? BHOV : BCARD,
        transform: h ? 'translateY(-7px)' : 'translateY(0)',
        transition: 'transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms cubic-bezier(0.22,1,0.36,1)',
        padding: p, cursor: 'default', position: 'relative', ...style,
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {children}
    </div>
  );
};

export function DelDlg({ onCancel, onConfirm, label = 'Delete Record?' }: { onCancel: () => void; onConfirm: () => void; label?: string }) {
  return (
    <div style={{ position:'fixed',inset:0,zIndex:1060,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#fff',borderRadius:14,padding:'24px',maxWidth:380,width:'100%',borderTop:'2px solid #ef4444',fontFamily:FF,boxShadow:'0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight:800,marginBottom:8,color:'#1A1A1A' }}>{label}</h6>
        <p style={{ fontSize:13,color:'#6B6B6B',marginBottom:20 }}>This cannot be undone.</p>
        <div style={{ display:'flex',gap:10 }}>
          <button onClick={onCancel} style={{ ...CNCL,flex:1 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1,background:'rgba(239,68,68,0.10)',border:'1px solid rgba(239,68,68,0.28)',borderRadius:9,padding:'9px',cursor:'pointer',color:'#ef4444',fontFamily:FF,fontWeight:700,fontSize:13 }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export const StatusBadge = ({ status, map }: { status: string; map: Record<string, { label: string; bg: string; color: string }> }) => {
  const m = map[status] ?? { label: status, bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ display:'inline-block',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:m.bg,color:m.color,fontFamily:FF,whiteSpace:'nowrap' }}>
      {m.label}
    </span>
  );
};

export const KpiCard = ({ icon, label, value, accent }: { icon: string; label: string; value: string | number; accent: string }) => (
  <Card3D accent={accent} p="16px 18px">
    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
      <i className={icon} style={{ color: accent, fontSize: 13 }} />
    </div>
    <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 19, color: '#1A1A1A' }}>{value}</div>
    <div style={{ fontFamily: FF, fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>{label}</div>
  </Card3D>
);

// ── Document domain types & metadata ─────────────────────────────────────────

export interface DocumentVersionT {
  id: number;
  document: number;
  version_number: string;
  file: string | null;
  file_url: string | null;
  uploaded_by: number | null;
  uploaded_by_name: string;
  notes: string;
  created_at: string;
}

export interface DocumentT {
  id: number;
  title: string;
  description: string;
  category: string;
  category_display: string;
  file: string | null;
  file_url: string | null;
  version: string;
  status: string;
  status_display: string;
  expiry_date: string | null;
  views_count: number;
  comments_count: number;
  uploaded_by: number | null;
  uploaded_by_name: string;
  approved_by: number | null;
  approved_by_name: string;
  created_at: string;
  updated_at: string;
  versions?: DocumentVersionT[];
}

export interface DocumentCommentT {
  id: number;
  document: number;
  user: number | null;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface DocumentAuditEntryT {
  id: number;
  document: number;
  user: number | null;
  user_name: string;
  action: string;
  action_display: string;
  notes: string;
  created_at: string;
}

export const CATEGORIES: { value: string; label: string }[] = [
  { value: 'engineering_drawing', label: 'Engineering Drawings' },
  { value: 'contract',            label: 'Contracts' },
  { value: 'invoice',             label: 'Invoices' },
  { value: 'hr_document',         label: 'HR' },
  { value: 'safety_qhse',         label: 'QHSE' },
  { value: 'procurement',         label: 'Procurement' },
  { value: 'project_report',      label: 'Reports' },
  { value: 'other',               label: 'Other' },
];

export const CATEGORY_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  engineering_drawing: { label: 'Engineering Drawing', bg: '#e3f2fd', color: '#1565c0' },
  contract:            { label: 'Contract',            bg: '#ede7f6', color: '#5e35b1' },
  invoice:             { label: 'Invoice',              bg: '#e8f5e9', color: '#2e7d32' },
  hr_document:         { label: 'HR Document',          bg: '#fff3e0', color: '#e65100' },
  safety_qhse:         { label: 'Safety / QHSE',        bg: '#ffebee', color: '#c62828' },
  procurement:         { label: 'Procurement',          bg: '#e0f2f1', color: '#00695c' },
  project_report:      { label: 'Project Report',       bg: '#f3e5f5', color: '#8e24aa' },
  other:               { label: 'Other',                bg: '#f5f5f5', color: '#555555' },
};

export const DOC_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  draft:        { label: 'Draft',        bg: '#f1f5f9', color: '#64748b' },
  under_review: { label: 'Under Review', bg: '#fff3e0', color: '#e65100' },
  approved:     { label: 'Approved',     bg: '#d1fae5', color: '#065f46' },
  rejected:     { label: 'Rejected',     bg: '#fee2e2', color: '#991b1b' },
};

export const CategoryBadge = ({ category }: { category: string }) => (
  <StatusBadge status={category} map={CATEGORY_BADGE} />
);

export const DocStatusBadge = ({ status }: { status: string }) => (
  <StatusBadge status={status} map={DOC_STATUS} />
);

/** Derives a file-type icon (FontAwesome class + brand color) from a filename or URL. */
export function fileIconFor(nameOrUrl?: string | null): { icon: string; color: string } {
  const ext = (nameOrUrl || '').split(/[?#]/)[0].split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return { icon: 'fas fa-file-pdf', color: '#e11d48' };
  if (['doc', 'docx'].includes(ext)) return { icon: 'fas fa-file-word', color: '#2563eb' };
  if (['xls', 'xlsx'].includes(ext)) return { icon: 'fas fa-file-excel', color: '#16a34a' };
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return { icon: 'fas fa-file-image', color: '#7c3aed' };
  if (ext === 'dwg') return { icon: 'fas fa-drafting-compass', color: '#0891b2' };
  return { icon: 'fas fa-file', color: '#6b7280' };
}

export function fmtDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtDateTime(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** Expiry status for a document's expiry_date — drives the card's expiry badge. */
export function expiryMeta(expiryDate?: string | null): { label: string; bg: string; color: string } | null {
  if (!expiryDate) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate); expiry.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((expiry.getTime() - today.getTime()) / 86400000);
  if (daysLeft < 0) return { label: 'Expired', bg: '#fee2e2', color: '#991b1b' };
  if (daysLeft <= 30) return { label: 'Expiring Soon', bg: '#ffedd5', color: '#c2410c' };
  return { label: `Valid until ${fmtDate(expiryDate)}`, bg: '#dcfce7', color: '#15803d' };
}

export const AUDIT_ACTION_META: Record<string, { icon: string; color: string }> = {
  uploaded:    { icon: 'fas fa-upload',        color: '#2563eb' },
  viewed:      { icon: 'fas fa-eye',           color: '#6b7280' },
  downloaded:  { icon: 'fas fa-download',      color: '#0891b2' },
  approved:    { icon: 'fas fa-check-circle',  color: '#16a34a' },
  rejected:    { icon: 'fas fa-times-circle',  color: '#dc2626' },
  deleted:     { icon: 'fas fa-trash',         color: '#991b1b' },
  commented:   { icon: 'fas fa-comment',       color: OG },
  new_version: { icon: 'fas fa-code-branch',   color: '#7c3aed' },
  shared:      { icon: 'fas fa-link',          color: '#0d9488' },
  edited:      { icon: 'fas fa-pen',           color: OG },
};
