import { useEffect, useRef, useState } from 'react';
import { CURRENCIES } from '../../context/CurrencyContext';
import { useCurrency } from '../context/CurrencyContext';
import { OG, FF } from '../constants';

const CURRENCY_FLAG: Record<string, string> = { AED: '🇦🇪', INR: '🇮🇳', USD: '🇺🇸' };

interface Props {
  dark?: boolean;
}

const CurrencySwitcher = ({ dark }: Props) => {
  const { selectedCurrency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Select currency"
        style={{
          display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 12px', borderRadius: 8,
          background: open ? 'rgba(201,136,58,0.12)' : (dark ? 'rgba(255,255,255,0.08)' : '#fafaf8'),
          border: `1px solid ${open ? 'rgba(201,136,58,0.36)' : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)')}`,
          cursor: 'pointer', minHeight: 44,
        }}
      >
        <span style={{ fontSize: 13, lineHeight: 1 }}>{CURRENCY_FLAG[selectedCurrency]}</span>
        <span style={{ color: dark ? '#fff' : '#141413', fontWeight: 700, fontSize: 12.5, fontFamily: FF }}>
          {selectedCurrency}
        </span>
        <i className="fas fa-chevron-down" style={{ fontSize: 9, color: dark ? 'rgba(255,255,255,0.6)' : '#9b9690' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 170,
          background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderTop: `2px solid ${OG}`,
          borderRadius: 12, boxShadow: '0 6px 0 rgba(0,0,0,0.04), 0 20px 48px rgba(0,0,0,0.16)',
          overflow: 'hidden', zIndex: 400,
        }}>
          {Object.values(CURRENCIES).map(cur => (
            <button
              key={cur.code}
              type="button"
              onClick={() => { setCurrency(cur.code); setOpen(false); }}
              style={{
                width: '100%', background: cur.code === selectedCurrency ? 'rgba(201,136,58,0.08)' : 'none',
                border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', minHeight: 44,
              }}
            >
              <span style={{ fontSize: 15 }}>{CURRENCY_FLAG[cur.code]}</span>
              <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 600, color: '#141413' }}>{cur.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
