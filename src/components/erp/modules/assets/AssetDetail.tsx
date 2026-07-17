import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, OG, BORDER, useFmtCurrency, ASSET_STATUS, ASSET_CATEGORY, StatusBadge, Card3D } from './assetsShared';
import MaintenanceHistory from './MaintenanceHistory';
import DepreciationTable from './DepreciationTable';
import QRCodeDisplay from './QRCodeDisplay';

const TABS = ['Details', 'Maintenance History', 'Depreciation', 'QR Code'] as const;

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fmtINR = useFmtCurrency();
  const [tab, setTab] = useState<typeof TABS[number]>('Details');
  const [asset, setAsset] = useState<any>(null);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [depreciation, setDepreciation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);

  const loadAsset = useCallback(() => {
    erpFetch(`asset-management/assets/${id}/`).then(setAsset).finally(() => setLoading(false));
  }, [id]);

  const loadSub = useCallback(() => {
    setSubLoading(true);
    Promise.all([
      erpFetch(`asset-management/assets/${id}/maintenance/`),
      erpFetch(`asset-management/assets/${id}/depreciation/`),
    ]).then(([m, d]) => { setMaintenance(m); setDepreciation(d); }).finally(() => setSubLoading(false));
  }, [id]);

  useEffect(() => { loadAsset(); loadSub(); }, [loadAsset, loadSub]);

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!asset) return <div className="alert alert-danger">Asset not found.</div>;

  return (
    <div>
      <button onClick={() => navigate('/erp/assets/list')} style={{ background: 'none', border: 'none', color: '#6B6B6B', fontFamily: FF, fontSize: 12.5, cursor: 'pointer', marginBottom: 14, padding: 0 }}>
        <i className="fas fa-arrow-left" style={{ marginRight: 6 }} />Back to Assets
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#9ca3af', fontWeight: 700 }}>{asset.asset_code} · {ASSET_CATEGORY[asset.category]?.label ?? asset.category}</div>
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 21, color: '#1A1A1A' }}>{asset.name}</div>
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', marginTop: 4 }}>{asset.location}</div>
        </div>
        <StatusBadge status={asset.status} map={ASSET_STATUS} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5,
            color: tab === t ? OG : '#6B6B6B', borderBottom: tab === t ? `2px solid ${OG}` : '2px solid transparent', marginBottom: -1,
          }}>
            {t}
            {t === 'Maintenance History' && asset.maintenance_overdue && (
              <span style={{ marginLeft: 6, background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>!</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'Details' && (
        <Card3D>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, fontFamily: FF, fontSize: 12.5 }}>
            <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{asset.department || '—'}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{asset.assigned_to_name || '—'}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purchase Date</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{asset.purchase_date}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purchase Cost</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{fmtINR(asset.purchase_cost)}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Value</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{asset.current_value != null ? fmtINR(asset.current_value) : '—'}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Depreciation Rate</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{asset.depreciation_rate}% / yr</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Maintenance</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{asset.last_maintenance || '—'}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Maintenance</div><div style={{ fontWeight: 700, color: asset.maintenance_overdue ? '#ef4444' : '#1A1A1A' }}>{asset.next_maintenance || '—'}{asset.maintenance_overdue ? ' (overdue)' : ''}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Maintenance Interval</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{asset.maintenance_interval_days} days</div></div>
          </div>
          {asset.notes && (
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
              <div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, fontFamily: FF }}>Notes</div>
              <div style={{ fontFamily: FF, fontSize: 12.5, color: '#374151' }}>{asset.notes}</div>
            </div>
          )}
        </Card3D>
      )}
      {tab === 'Maintenance History' && <MaintenanceHistory assetId={Number(id)} records={maintenance} loading={subLoading} onReload={() => { loadSub(); loadAsset(); }} />}
      {tab === 'Depreciation' && <DepreciationTable entries={depreciation} loading={subLoading} />}
      {tab === 'QR Code' && <QRCodeDisplay asset={asset} onGenerated={loadAsset} />}
    </div>
  );
}
