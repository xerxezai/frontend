export const FF = "'DM Sans',sans-serif";
export const OG = '#C9883A';

export const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  new:      { label: 'New',      bg: '#fff3e0', color: '#e65100' },
  reviewed: { label: 'Reviewed', bg: '#dbeafe', color: '#1d4ed8' },
  replied:  { label: 'Replied',  bg: '#d1fae5', color: '#065f46' },
  closed:   { label: 'Closed',   bg: '#f1f5f9', color: '#64748b' },
};
export const PRIORITY_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  high:   { label: 'High',   bg: '#fee2e2', color: '#991b1b' },
  medium: { label: 'Medium', bg: '#fff3e0', color: '#e65100' },
  low:    { label: 'Low',    bg: '#d1fae5', color: '#065f46' },
};

export const Badge = ({ value, map }: { value: string; map: Record<string, { label: string; bg: string; color: string }> }) => {
  const m = map[value] ?? { label: value || '—', bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF, whiteSpace: 'nowrap' }}>
      {m.label}
    </span>
  );
};
