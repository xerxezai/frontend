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

export const fmtINR = (v: string | number) => `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const today = () => new Date().toISOString().slice(0, 10);
export const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

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

export function DelDlg({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position:'fixed',inset:0,zIndex:1060,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#fff',borderRadius:14,padding:'24px',maxWidth:380,width:'100%',borderTop:'2px solid #ef4444',fontFamily:FF,boxShadow:'0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight:800,marginBottom:8,color:'#1A1A1A' }}>Delete Record?</h6>
        <p style={{ fontSize:13,color:'#6B6B6B',marginBottom:20 }}>This cannot be undone.</p>
        <div style={{ display:'flex',gap:10 }}>
          <button onClick={onCancel} style={{ ...CNCL,flex:1 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1,background:'rgba(239,68,68,0.10)',border:'1px solid rgba(239,68,68,0.28)',borderRadius:9,padding:'9px',cursor:'pointer',color:'#ef4444',fontFamily:FF,fontWeight:700,fontSize:13 }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export const COMMISSION_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: '#fef3c7', color: '#92400e' },
  paid:    { label: 'Paid',    bg: '#d1fae5', color: '#065f46' },
};

export const PAYOUT_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: 'Pending',    bg: '#fef3c7', color: '#92400e' },
  processing: { label: 'Processing', bg: '#dbeafe', color: '#1d4ed8' },
  completed:  { label: 'Completed',  bg: '#d1fae5', color: '#065f46' },
};

export const DISTRIBUTOR_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  active:   { label: 'Active',   bg: '#d1fae5', color: '#065f46' },
  inactive: { label: 'Inactive', bg: '#fee2e2', color: '#991b1b' },
};

export const StatusBadge = ({ status, map }: { status: string; map: Record<string, { label: string; bg: string; color: string }> }) => {
  const m = map[status] ?? { label: status, bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ display:'inline-block',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:m.bg,color:m.color,fontFamily:FF,whiteSpace:'nowrap' }}>
      {m.label}
    </span>
  );
};

export const KpiCard = ({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) => (
  <Card3D accent={accent} p="16px 18px">
    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
      <i className={icon} style={{ color: accent, fontSize: 13 }} />
    </div>
    <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 19, color: '#1A1A1A' }}>{value}</div>
    <div style={{ fontFamily: FF, fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>{label}</div>
  </Card3D>
);
