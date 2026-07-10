import { useState, type CSSProperties, type ReactNode } from 'react';

// ── XERXEZ brand tokens ──────────────────────────────────────────────────────
export const OG    = '#C9883A';
export const OG_G  = 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)';
export const DARK  = '#1a1208';
export const CREAM = '#F8F7F4';
export const WHITE = '#FFFFFF';
export const FF    = "'DM Sans',sans-serif";
export const BCARD = '0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)';
export const BHOV  = '0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)';

// ── Card3D — copied exactly from AIERPPage.tsx ───────────────────────────────
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

// ── Deal types + stage metadata ──────────────────────────────────────────────
export type DealStage = 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Deal {
  id: number;
  title: string;
  customer: number | null;
  customer_name: string | null;
  lead: number | null;
  lead_name: string | null;
  value: string;
  stage: DealStage;
  assigned_to: number | null;
  assigned_to_username: string | null;
  assigned_to_name: string | null;
  expected_close: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerNote {
  id: number;
  customer: number | null;
  lead: number | null;
  note_type: 'call' | 'meeting' | 'email' | 'follow_up' | 'general';
  content: string;
  created_by: number | null;
  created_by_username: string | null;
  created_by_name: string | null;
  created_at: string;
}

export const STAGES: { key: DealStage; label: string; color: string; bg: string; columnBg: string; grad: string }[] = [
  { key: 'new',         label: 'New',          color: '#6b7280', bg: 'rgba(107,114,128,0.09)', columnBg: '#F8F9FA', grad: 'linear-gradient(135deg,#9ca3af,#6b7280)' },
  { key: 'contacted',   label: 'Contacted',     color: '#3b82f6', bg: 'rgba(59,130,246,0.09)',  columnBg: '#EFF6FF', grad: 'linear-gradient(135deg,#60a5fa,#3b82f6)' },
  { key: 'proposal',    label: 'Proposal Sent', color: OG,        bg: 'rgba(201,136,58,0.09)',  columnBg: '#FFF7ED', grad: OG_G },
  { key: 'negotiation', label: 'Negotiation',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.09)',  columnBg: '#FAF5FF', grad: 'linear-gradient(135deg,#a78bfa,#8b5cf6)' },
  { key: 'won',         label: 'Won',           color: '#10b981', bg: 'rgba(16,185,129,0.09)',  columnBg: '#F0FDF4', grad: 'linear-gradient(135deg,#34d399,#10b981)' },
  { key: 'lost',        label: 'Lost',          color: '#ef4444', bg: 'rgba(239,68,68,0.09)',   columnBg: '#FFF1F2', grad: 'linear-gradient(135deg,#f87171,#ef4444)' },
];

export const stageMeta = (stage: string) => STAGES.find(s => s.key === stage) ?? STAGES[0];

export const NOTE_TYPES: { key: CustomerNote['note_type']; label: string; icon: string; color: string; bg: string }[] = [
  { key: 'call',      label: 'Phone Call',   icon: 'fas fa-phone',        color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
  { key: 'meeting',   label: 'Meeting',      icon: 'fas fa-handshake',    color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  { key: 'email',     label: 'Email',        icon: 'fas fa-envelope',     color: '#14b8a6', bg: 'rgba(20,184,166,0.10)' },
  { key: 'follow_up', label: 'Follow Up',    icon: 'fas fa-bell',         color: OG,        bg: 'rgba(201,136,58,0.10)' },
  { key: 'general',   label: 'General',      icon: 'fas fa-sticky-note',  color: '#6b7280', bg: 'rgba(107,114,128,0.10)' },
];

export const noteMeta = (type: string) => NOTE_TYPES.find(n => n.key === type) ?? NOTE_TYPES[4];

export const fmtINR = (v: string | number) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

export const timeAgo = (iso: string): string => {
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
