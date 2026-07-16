import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Calendar, Briefcase } from 'lucide-react';
import { erpFetch } from '../../../../hooks/useERPApi';
import { OG, OG_G, DARK, FF, stageMeta, useFmtCurrency, type Deal } from './crmShared';
import CRMDealForm from './CRMDealForm';

interface Props {
  target: { type: 'customer' | 'lead'; id: number; name: string };
  onClose: () => void;
  onChanged?: () => void;
}

export default function CRMDealsPanel({ target, onClose, onChanged }: Props) {
  const fmtINR = useFmtCurrency();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    erpFetch(`crm/deals/?${target.type}=${target.id}`)
      .then(res => setDeals(Array.isArray(res) ? res : res?.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [target]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const totalValue = deals.filter(d => d.stage !== 'lost').reduce((s, d) => s + Number(d.value || 0), 0);

  return (
    <>
      <style>{`
        @keyframes crmFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes crmSlideInRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes crmShimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(2px)', animation: 'crmFadeIn 0.2s ease both' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(440px, 100vw)',
        background: '#fff', zIndex: 901, boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        animation: 'crmSlideInRight 0.35s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div>
            <h3 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: DARK, margin: 0 }}>{target.name} — Deals</h3>
            <p style={{ fontFamily: FF, fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
              {deals.length} deal{deals.length === 1 ? '' : 's'} · {fmtINR(totalValue)} active value
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '16px 22px 0' }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              background: OG_G, color: '#fff', border: 'none', borderRadius: 9, padding: '10px',
              cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 13,
            }}
          >
            <Plus size={15} /> Add Deal
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[0, 1].map(i => (
                <div key={i} style={{ height: 84, borderRadius: 12, background: 'linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)', backgroundSize: '800px 100%', animation: 'crmShimmer 1.4s infinite' }} />
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 12px' }}>
              <Briefcase size={34} color="#d1d5db" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontFamily: FF, fontSize: 13.5, color: '#9ca3af', margin: 0 }}>No deals yet for this {target.type}.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {deals.map(d => {
                const meta = stageMeta(d.stage);
                return (
                  <div key={d.id} style={{ background: '#F8F7F4', borderRadius: 12, padding: '14px 16px', border: `1px solid ${meta.color}22` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: DARK, fontFamily: FF }}>{d.title}</div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: meta.color, background: meta.bg, padding: '2px 9px', borderRadius: 999, fontFamily: FF, flexShrink: 0 }}>
                        {meta.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: OG, fontFamily: FF, marginBottom: 4 }}>{fmtINR(d.value)}</div>
                    {d.expected_close && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: '#9ca3af', fontFamily: FF }}>
                        <Calendar size={11} /> Expected close {new Date(d.expected_close).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <CRMDealForm
          defaultCustomerId={target.type === 'customer' ? target.id : null}
          defaultLeadId={target.type === 'lead' ? target.id : null}
          onClose={() => setShowForm(false)}
          onSaved={() => { load(); onChanged?.(); }}
        />
      )}
    </>
  );
}
