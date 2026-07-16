import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  DndContext, useDraggable, useDroppable, DragOverlay,
  PointerSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Plus, GripVertical, Calendar, TrendingUp, Trophy, XCircle, Percent, Pencil, Trash2, Check, X as XIcon, RotateCcw } from 'lucide-react';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import {
  OG, DARK, FF, BCARD, BHOV, STAGES, stageMeta, useFmtCurrency, initials,
  type Deal, type DealStage,
} from './crmShared';
import CRMDealForm from './CRMDealForm';

interface PipelineStats {
  by_stage: Record<string, { count: number; value: number }>;
  total_pipeline_value: number;
  deals_won: { count: number; value: number };
  deals_lost: { count: number; value: number };
  win_rate: number;
}

const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

// ── count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(prefersReduced ? target : 0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (prefersReduced) { setVal(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(eased * target);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

// ── gradient stat card ─────────────────────────────────────────────────────────
const GradStat = ({ label, target, format, sub, subTarget, grad, icon: Icon, index }: {
  label: string; target: number; format: (n: number) => string;
  sub?: (n: number) => string; subTarget?: number;
  grad: string; icon: React.ElementType; index: number;
}) => {
  const v = useCountUp(target);
  const sv = useCountUp(subTarget ?? 0);
  return (
    <div style={{
      background: grad, borderRadius: 16, padding: '22px 24px', color: '#fff',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 8px 28px rgba(0,0,0,0.16)',
      animation: `crmStatUp 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 0.08}s both`,
    }}>
      <div aria-hidden style={{
        position: 'absolute', right: -30, top: -30, width: 120, height: 120,
        borderRadius: '50%', background: 'rgba(255,255,255,0.10)',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, position: 'relative' }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FF, marginBottom: 10 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: FF, lineHeight: 1, letterSpacing: '-0.01em' }}>{format(v)}</div>
          {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)', fontFamily: FF, marginTop: 6, fontWeight: 600 }}>{sub(sv)}</div>}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={22} color="#fff" />
        </div>
      </div>
    </div>
  );
};

// ── delete confirmation modal ────────────────────────────────────────────────
const DeleteConfirm = ({ dealTitle, onCancel, onConfirm }: { dealTitle: string; onCancel: () => void; onConfirm: () => void }) => (
  <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 950, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'crmFadeIn 0.18s ease both' }}>
    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 380, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
      <h6 style={{ fontWeight: 800, marginBottom: 8, color: DARK, fontSize: 15 }}>Delete this deal?</h6>
      <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>“{dealTitle}” will be permanently removed. This cannot be undone.</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onCancel} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '9px', cursor: 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>Delete</button>
      </div>
    </div>
  </div>
);

// ── deal card (Card3D style, left stage border, edit/delete on hover) ────────
const DealCard = ({ deal, removing, onEdit, onDelete, onWin, onLose, onReopen }: {
  deal: Deal; removing: boolean; onEdit: () => void; onDelete: () => void;
  onWin?: () => void; onLose?: () => void; onReopen?: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: deal.id });
  const [hovered, setHovered] = useState(false);
  const fmtINR = useFmtCurrency();
  const meta = stageMeta(deal.stage);
  const name = deal.customer_name || deal.lead_name || 'Unassigned';

  const liveTransform = isDragging
    ? (transform ? `translate3d(${transform.x}px,${transform.y}px,0) scale(1.03)` : undefined)
    : (hovered ? 'translateY(-3px)' : 'translateY(0)');

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.07)',
        borderLeft: `3px solid ${meta.color}`,
        boxShadow: isDragging ? '0 18px 44px rgba(0,0,0,0.22)' : hovered ? BHOV : BCARD,
        padding: '14px 14px 12px',
        opacity: removing ? 0 : isDragging ? 0.4 : 1,
        maxHeight: removing ? 0 : 260,
        marginTop: removing ? 0 : undefined,
        marginBottom: removing ? 0 : 10,
        overflow: 'hidden',
        transform: liveTransform,
        transition: removing
          ? 'opacity 0.3s ease, max-height 0.3s ease, margin 0.3s ease, padding 0.3s ease'
          : isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease',
        cursor: 'grab', touchAction: 'none', position: 'relative',
      }}
    >
      {/* edit / delete — visible on hover */}
      <div
        onPointerDown={e => e.stopPropagation()}
        style={{
          position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4,
          opacity: hovered && !isDragging ? 1 : 0,
          transition: 'opacity 0.15s ease', pointerEvents: hovered ? 'auto' : 'none',
        }}
      >
        <button
          onClick={onEdit}
          title="Edit deal"
          style={{ background: 'rgba(201,136,58,0.10)', border: 'none', borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: OG }}
        >
          <Pencil size={11} />
        </button>
        <button
          onClick={onDelete}
          title="Delete deal"
          style={{ background: 'rgba(239,68,68,0.10)', border: 'none', borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}
        >
          <Trash2 size={11} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 6, paddingRight: 52 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: DARK, fontFamily: FF, lineHeight: 1.3 }}>{deal.title}</div>
        <span style={{ color: '#c4c4c4', flexShrink: 0, padding: 2, position: 'absolute', top: 8, right: hovered ? 60 : 8, transition: 'right 0.15s ease' }}>
          <GripVertical size={15} />
        </span>
      </div>
      <div style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, marginBottom: 8 }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: OG, fontFamily: FF }}>{fmtINR(deal.value)}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', fontFamily: FF }}>{deal.probability}% odds</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (onWin || onLose || onReopen) ? 10 : 0 }}>
        {deal.expected_close ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9ca3af', fontFamily: FF }}>
            <Calendar size={11} /> {new Date(deal.expected_close).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </span>
        ) : <span />}
        {deal.assigned_to_name && (
          <div title={deal.assigned_to_name} style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'linear-gradient(145deg,#e8a84e,#C9883A)',
            color: '#fff', fontSize: 9.5, fontWeight: 800, fontFamily: FF,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {initials(deal.assigned_to_name)}
          </div>
        )}
      </div>
      {onReopen ? (
        <div onPointerDown={e => e.stopPropagation()} style={{ display: 'flex', gap: 6 }}>
          <button onClick={onReopen} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'rgba(107,114,128,0.10)', border: '1px solid rgba(107,114,128,0.28)', borderRadius: 7, padding: '5px', cursor: 'pointer', color: '#6b7280', fontFamily: FF, fontWeight: 700, fontSize: 11 }}>
            <RotateCcw size={11} /> Reopen
          </button>
        </div>
      ) : (onWin || onLose) && (
        <div onPointerDown={e => e.stopPropagation()} style={{ display: 'flex', gap: 6 }}>
          {onWin && (
            <button onClick={onWin} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: 7, padding: '5px', cursor: 'pointer', color: '#10b981', fontFamily: FF, fontWeight: 700, fontSize: 11 }}>
              <Check size={11} /> Win
            </button>
          )}
          {onLose && (
            <button onClick={onLose} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 7, padding: '5px', cursor: 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 11 }}>
              <XIcon size={11} /> Lose
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ── kanban column (droppable, colored bg, hover glow) ────────────────────────
const Column = ({ stage, deals, removingIds, onAdd, onEdit, onDelete, onSetStage }: {
  stage: DealStage; deals: Deal[]; removingIds: Set<number>;
  onAdd: () => void; onEdit: (d: Deal) => void; onDelete: (d: Deal) => void; onSetStage: (d: Deal, stage: DealStage) => void;
}) => {
  const meta = stageMeta(stage);
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const [hovered, setHovered] = useState(false);
  const fmtINR = useFmtCurrency();
  const totalValue = deals.filter(d => !removingIds.has(d.id)).reduce((s, d) => s + Number(d.value || 0), 0);

  const glow = isOver
    ? `0 0 0 1.5px ${meta.color}, 0 10px 30px ${meta.color}33`
    : hovered
      ? `0 0 0 1px ${meta.color}55, 0 6px 22px ${meta.color}22`
      : '0 1px 2px rgba(0,0,0,0.03)';

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: meta.columnBg,
        borderRadius: 14, padding: 12, minWidth: 264, width: 264, flexShrink: 0,
        boxShadow: glow,
        transition: 'box-shadow 0.22s ease',
        display: 'flex', flexDirection: 'column', maxHeight: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, padding: '2px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: meta.color, flexShrink: 0, boxShadow: `0 0 0 3px ${meta.color}22` }} />
          <span style={{ fontSize: 13.5, fontWeight: 800, color: DARK, fontFamily: FF }}>{meta.label}</span>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: meta.color, background: '#fff', border: `1px solid ${meta.color}33`, padding: '2px 8px', borderRadius: 999, fontFamily: FF }}>
            {deals.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          title={`Add deal to ${meta.label}`}
          style={{ background: '#fff', border: `1px solid ${meta.color}33`, cursor: 'pointer', color: meta.color, width: 24, height: 24, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={15} />
        </button>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: OG, fontFamily: FF, padding: '0 4px', marginBottom: 12 }}>
        {fmtINR(totalValue)}
      </div>
      <div style={{ overflowY: 'auto', flex: 1, minHeight: 40, padding: '0 1px' }}>
        {deals.map((d, i) => (
          <div key={d.id} style={{ animation: removingIds.has(d.id) ? undefined : `crmCardUp 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.05}s both` }}>
            <DealCard
              deal={d}
              removing={removingIds.has(d.id)}
              onEdit={() => onEdit(d)}
              onDelete={() => onDelete(d)}
              onWin={stage === 'won' || stage === 'lost' ? undefined : () => onSetStage(d, 'won')}
              onLose={stage === 'won' || stage === 'lost' ? undefined : () => onSetStage(d, 'lost')}
              onReopen={stage === 'won' || stage === 'lost' ? () => onSetStage(d, 'negotiation') : undefined}
            />
          </div>
        ))}
        {deals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 8px', fontSize: 12, color: '#b0aca4', fontFamily: FF }}>
            No deals
          </div>
        )}
      </div>
    </div>
  );
};

export default function CRMPipeline() {
  const fmtINR = useFmtCurrency();
  const dealsList = useERPList<Deal>('crm/deals/');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [addPanel, setAddPanel] = useState<DealStage | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [closeFrom, setCloseFrom] = useState('');
  const [closeTo, setCloseTo] = useState('');

  useEffect(() => { setDeals(dealsList.data); }, [dealsList.data]);

  const loadStats = useCallback(() => {
    erpFetch('crm/deals/pipeline-stats/').then(setStats).catch(() => {});
  }, []);
  useEffect(() => { loadStats(); }, [loadStats, dealsList.data]);

  const byStage = useMemo(() => {
    const map: Record<DealStage, Deal[]> = { new: [], contacted: [], proposal: [], negotiation: [], won: [], lost: [] };
    deals
      .filter(d => !closeFrom || (d.expected_close && d.expected_close >= closeFrom))
      .filter(d => !closeTo || (d.expected_close && d.expected_close <= closeTo))
      .forEach(d => { if (map[d.stage]) map[d.stage].push(d); });
    return map;
  }, [deals, closeFrom, closeTo]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragStart = (e: DragStartEvent) => setActiveId(Number(e.active.id));

  const changeStage = useCallback((deal: Deal, newStage: DealStage) => {
    if (deal.stage === newStage) return;
    const prevStage = deal.stage;
    setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, stage: newStage } : d));

    erpFetch(`crm/deals/${deal.id}/stage/`, { method: 'PATCH', body: JSON.stringify({ stage: newStage }) })
      .then(() => loadStats())
      .catch(() => {
        setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, stage: prevStage } : d));
      });
  }, [loadStats]);

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const dealId = Number(active.id);
    const newStage = over.id as DealStage;
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;
    changeStage(deal, newStage);
  };

  const activeDeal = activeId ? deals.find(d => d.id === activeId) ?? null : null;

  const confirmDelete = () => {
    if (!deletingDeal) return;
    const id = deletingDeal.id;
    setDeletingDeal(null);
    setRemovingIds(prev => new Set(prev).add(id));
    erpFetch(`crm/deals/${id}/`, { method: 'DELETE' })
      .then(() => {
        setTimeout(() => {
          setDeals(prev => prev.filter(d => d.id !== id));
          setRemovingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
          loadStats();
        }, 300);
      })
      .catch(() => {
        setRemovingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      });
  };

  return (
    <div style={{ animation: 'crmFadeIn 0.3s ease both' }}>
      <style>{`
        @keyframes crmFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes crmSlideInRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes crmStatUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes crmCardUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @media (prefers-reduced-motion: reduce) {
          [style*="crmStatUp"], [style*="crmCardUp"], [style*="crmFadeIn"] { animation: none !important; }
        }
      `}</style>

      {/* pipeline stats — premium gradient cards */}
      <div className="crm-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <GradStat
          label="Total Pipeline" target={stats?.total_pipeline_value ?? 0}
          format={n => fmtINR(Math.round(n))}
          grad="linear-gradient(135deg,#C9883A,#8B5E28)" icon={TrendingUp} index={0}
        />
        <GradStat
          label="Deals Won" target={stats?.deals_won.count ?? 0}
          format={n => String(Math.round(n))}
          sub={n => fmtINR(Math.round(n))} subTarget={stats?.deals_won.value ?? 0}
          grad="linear-gradient(135deg,#16A34A,#15803D)" icon={Trophy} index={1}
        />
        <GradStat
          label="Deals Lost" target={stats?.deals_lost.count ?? 0}
          format={n => String(Math.round(n))}
          grad="linear-gradient(135deg,#DC2626,#B91C1C)" icon={XCircle} index={2}
        />
        <GradStat
          label="Win Rate" target={stats?.win_rate ?? 0}
          format={n => `${n.toFixed(1)}%`}
          grad="linear-gradient(135deg,#0D9488,#0F766E)" icon={Percent} index={3}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontFamily: FF }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expected close</span>
        <input type="date" value={closeFrom} onChange={e => setCloseFrom(e.target.value)} style={{ border: '1px solid rgba(0,0,0,0.10)', borderRadius: 8, padding: '6px 10px', fontFamily: FF, fontSize: 12.5, background: '#F8F7F4', outline: 'none' }} />
        <span style={{ color: '#9ca3af', fontSize: 12 }}>to</span>
        <input type="date" value={closeTo} onChange={e => setCloseTo(e.target.value)} style={{ border: '1px solid rgba(0,0,0,0.10)', borderRadius: 8, padding: '6px 10px', fontFamily: FF, fontSize: 12.5, background: '#F8F7F4', outline: 'none' }} />
        {(closeFrom || closeTo) && (
          <button onClick={() => { setCloseFrom(''); setCloseTo(''); }} style={{ background: 'none', border: 'none', color: OG, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: FF }}>Clear</button>
        )}
      </div>

      {/* kanban board */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, alignItems: 'flex-start' }}>
          {STAGES.map(s => (
            <Column
              key={s.key}
              stage={s.key}
              deals={byStage[s.key]}
              removingIds={removingIds}
              onAdd={() => setAddPanel(s.key)}
              onEdit={setEditingDeal}
              onDelete={setDeletingDeal}
              onSetStage={changeStage}
            />
          ))}
        </div>
        <DragOverlay>
          {activeDeal ? (
            <div style={{ width: 240, transform: 'rotate(2deg)' }}>
              <DealCard deal={activeDeal} removing={false} onEdit={() => {}} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {addPanel && (
        <CRMDealForm
          defaultStage={addPanel}
          onClose={() => setAddPanel(null)}
          onSaved={() => { dealsList.reload(); loadStats(); }}
        />
      )}

      {editingDeal && (
        <CRMDealForm
          deal={editingDeal}
          onClose={() => setEditingDeal(null)}
          onSaved={() => { dealsList.reload(); loadStats(); }}
        />
      )}

      {deletingDeal && (
        <DeleteConfirm
          dealTitle={deletingDeal.title}
          onCancel={() => setDeletingDeal(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
