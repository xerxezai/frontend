import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCompany } from '../../../context/CompanyContext';

const OG = '#D93522';
const FF = "'DM Sans', sans-serif";

/** Header dropdown, platform admin only — switches which company's data the rest of
 * the ERP shows. "All Companies" clears the switch; picking a company sends
 * X-Active-Company-Id on every request from then on (see useERPApi.ts erpFetch). */
const CompanySwitcher = () => {
  const { isPlatformAdmin, currentCompany, allCompanies, switchCompany, isLoading } = useCompany();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!isPlatformAdmin || isLoading) return null;

  const pick = async (id: number | null) => {
    setSwitching(true);
    try {
      await switchCompany(id);
      setOpen(false);   // only close on confirmed success — a failure leaves the
                         // dropdown open so the user sees the toast and can retry,
                         // instead of it silently closing as if the switch worked.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not switch company. Please try again.');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        className="erp-topbtn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Switch company"
        disabled={switching}
        style={{
          gap: 6,
          background: open ? 'rgba(217,53,34,0.12)' : '#F8F7F4',
          borderColor: open ? 'rgba(217,53,34,0.36)' : 'rgba(0,0,0,0.08)',
          cursor: switching ? 'wait' : 'pointer',
        }}
      >
        <i className="fas fa-building" style={{ color: OG, fontSize: 12 }} />
        <span style={{ color: '#1A1A1A', fontWeight: 700, fontSize: 12.5, fontFamily: FF, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentCompany ? currentCompany.name : 'All Companies'}
        </span>
        <i className={`fas fa-chevron-${open ? 'up' : 'down'}`} style={{ color: '#6B6B6B', fontSize: 8 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 260,
          background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderTop: `2px solid ${OG}`,
          borderRadius: 12, boxShadow: '0 6px 0 rgba(0,0,0,0.04), 0 20px 48px rgba(0,0,0,0.16)',
          overflow: 'hidden', zIndex: 400, maxHeight: 340, overflowY: 'auto',
        }}>
          <button
            onClick={() => pick(null)}
            disabled={switching}
            style={{
              width: '100%', background: !currentCompany ? 'rgba(217,53,34,0.08)' : 'none',
              border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10, cursor: switching ? 'wait' : 'pointer', textAlign: 'left', minHeight: 44,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(217,53,34,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = !currentCompany ? 'rgba(217,53,34,0.08)' : 'none'; }}
          >
            <i className="fas fa-globe" style={{ color: OG, fontSize: 13, width: 16 }} />
            <span style={{ flex: 1, color: '#1A1A1A', fontWeight: 700, fontSize: 12.5, fontFamily: FF }}>All Companies</span>
            {!currentCompany && <i className="fas fa-check" style={{ color: OG, fontSize: 11 }} />}
          </button>
          {allCompanies.map(c => (
            <button
              key={c.id}
              onClick={() => pick(c.id)}
              disabled={switching}
              style={{
                width: '100%', background: currentCompany?.id === c.id ? 'rgba(217,53,34,0.08)' : 'none',
                border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10, cursor: switching ? 'wait' : 'pointer', textAlign: 'left', minHeight: 44,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(217,53,34,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = currentCompany?.id === c.id ? 'rgba(217,53,34,0.08)' : 'none'; }}
            >
              <i className="fas fa-building" style={{ color: '#6B6B6B', fontSize: 12, width: 16 }} />
              <span style={{ flex: 1, color: '#1A1A1A', fontWeight: 600, fontSize: 12.5, fontFamily: FF, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.name}
              </span>
              {currentCompany?.id === c.id && <i className="fas fa-check" style={{ color: OG, fontSize: 11 }} />}
            </button>
          ))}
          {allCompanies.length === 0 && (
            <div style={{ padding: '14px', fontSize: 12, color: '#9ca3af', fontFamily: FF, textAlign: 'center' }}>No companies yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanySwitcher;
