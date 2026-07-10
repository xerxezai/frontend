import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DndContext, useDraggable, useDroppable, DragOverlay,
  PointerSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Plus, GripVertical, Calendar, TrendingUp, Trophy, XCircle, Percent } from 'lucide-react';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import {
  Card3D, OG, DARK, FF, STAGES, stageMeta, fmtINR, initials,
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

// ── mini stat card ────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, icon: Icon }: { label: string; value: string; sub?: string; color: string; icon: React.ElementType }) => (
  <Card3D accent={color} p="18px 20px">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FF, marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color, fontFamily: FF, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 11.5, color: '#9ca3af', fontFamily: FF, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
    </div>
  </Card3D>
);

// ── deal card (draggable) ────────────────────────────────────────────────────
const DealCard = ({ deal }: { deal: Deal }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: deal.id });
  const name = deal.customer_name || deal.lead_name || 'Unassigned';
  return (
    <div
      ref={setNodeRef}
      style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: isDragging ? '0 16px 40px rgba(0,0,0,0.20)' : '0 1px 3px rgba(0,0,0,0.05)',
        padding: '14px 14px 12px', marginBottom: 10,
        opacity: isDragging ? 0.4 : 1,
        transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0) scale(1.03)` : undefined,
        transition: isDragging ? 'none' : 'box-shadow 0.18s ease',
        cursor: 'default', touchAction: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: DARK, fontFamily: FF, lineHeight: 1.3 }}>{deal.title}</div>
        <span {...listeners} {...attributes} style={{ cursor: 'grab', color: '#c4c4c4', flexShrink: 0, padding: 2, touchAction: 'none' }}>
          <GripVertical size={15} />
        </span>
      </div>
      <div style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, marginBottom: 8 }}>{name}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: OG, fontFamily: FF, marginBottom: 8 }}>{fmtINR(deal.value)}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
    </div>
  );
};

// ── kanban column (droppable) ────────────────────────────────────────────────
const Column = ({ stage, deals, onAdd }: { stage: DealStage; deals: Deal[]; onAdd: () => void }) => {
  const meta = stageMeta(stage);
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const totalValue = deals.reduce((s, d) => s + Number(d.value || 0), 0);

  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? meta.bg : '#F8F7F4',
        borderRadius: 14, padding: 12, minWidth: 260, width: 260, flexShrink: 0,
        border: isOver ? `1.5px dashed ${meta.color}` : '1.5px solid transparent',
        transition: 'background 0.18s ease, border-color 0.18s ease',
        display: 'flex', flexDirection: 'column', maxHeight: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, padding: '2px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
          <span style={{ fontSize: 13.5, fontWeight: 800, color: DARK, fontFamily: FF }}>{meta.label}</span>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 999, fontFamily: FF }}>
            {deals.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          title={`Add deal to ${meta.label}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: meta.color, padding: 4, borderRadius: 6, display: 'flex' }}
        >
          <Plus size={16} />
        </button>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: OG, fontFamily: FF, padding: '0 4px', marginBottom: 12 }}>
        {fmtINR(totalValue)}
      </div>
      <div style={{ overflowY: 'auto', flex: 1, minHeight: 40, padding: '0 1px' }}>
        {deals.map(d => <DealCard key={d.id} deal={d} />)}
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
  const dealsList = useERPList<Deal>('crm/deals/');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [addPanel, setAddPanel] = useState<DealStage | null>(null);

  useEffect(() => { setDeals(dealsList.data); }, [dealsList.data]);

  const loadStats = useCallback(() => {
    erpFetch('crm/deals/pipeline-stats/').then(setStats).catch(() => {});
  }, []);
  useEffect(() => { loadStats(); }, [loadStats, dealsList.data]);

  const byStage = useMemo(() => {
    const map: Record<DealStage, Deal[]> = { new: [], contacted: [], proposal: [], negotiation: [], won: [], lost: [] };
    deals.forEach(d => { if (map[d.stage]) map[d.stage].push(d); });
    return map;
  }, [deals]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragStart = (e: DragStartEvent) => setActiveId(Number(e.active.id));

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const dealId = Number(active.id);
    const newStage = over.id as DealStage;
    const deal = deals.find(d => d.id === dealId);
    if (!deal || deal.stage === newStage) return;

    const prevStage = deal.stage;
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d));

    erpFetch(`crm/deals/${dealId}/stage/`, { method: 'PATCH', body: JSON.stringify({ stage: newStage }) })
      .then(() => loadStats())
      .catch(() => {
        setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: prevStage } : d));
      });
  };

  const activeDeal = activeId ? deals.find(d => d.id === activeId) ?? null : null;

  return (
    <div style={{ animation: 'crmFadeIn 0.3s ease both' }}>
      <style>{`
        @keyframes crmFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes crmSlideInRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* pipeline stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard label="Total Pipeline Value" value={fmtINR(stats?.total_pipeline_value ?? 0)} color={OG} icon={TrendingUp} />
        <StatCard label="Deals Won" value={String(stats?.deals_won.count ?? 0)} sub={fmtINR(stats?.deals_won.value ?? 0)} color="#10b981" icon={Trophy} />
        <StatCard label="Deals Lost" value={String(stats?.deals_lost.count ?? 0)} color="#ef4444" icon={XCircle} />
        <StatCard label="Win Rate" value={`${stats?.win_rate ?? 0}%`} color={OG} icon={Percent} />
      </div>

      {/* kanban board */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, alignItems: 'flex-start' }}>
          {STAGES.map(s => (
            <Column key={s.key} stage={s.key} deals={byStage[s.key]} onAdd={() => setAddPanel(s.key)} />
          ))}
        </div>
        <DragOverlay>
          {activeDeal ? (
            <div style={{ width: 232, transform: 'rotate(2deg)' }}>
              <DealCard deal={activeDeal} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {addPanel && (
        <CRMDealForm
          defaultStage={addPanel}
          onClose={() => setAddPanel(null)}
          onCreated={() => { dealsList.reload(); loadStats(); }}
        />
      )}
    </div>
  );
}
