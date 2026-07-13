import { useState } from 'react';
import InventoryDashboard from './inventory/InventoryDashboard';
import ProductsPanel from './inventory/ProductsPanel';
import WarehousesPanel from './inventory/WarehousesPanel';
import CategoriesPanel from './inventory/CategoriesPanel';
import StockMovementsPanel from './inventory/StockMovementsPanel';

type Tab = 'Products' | 'Warehouses' | 'Categories' | 'Movements';

const InventoryModule = () => {
  const [tab, setTab] = useState<Tab>('Products');

  const ts = (t: Tab): React.CSSProperties => ({
    borderRadius: 8, padding: '7px 18px', cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
    background: tab === t ? '#C9883A' : 'transparent', color: tab === t ? '#fff' : '#6B6B6B',
    border: tab === t ? 'none' : '1px solid rgba(0,0,0,0.10)',
  });

  return (
    <div>
      <InventoryDashboard refreshKey={tab} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button style={ts('Products')}   onClick={() => setTab('Products')}>Products</button>
        <button style={ts('Warehouses')} onClick={() => setTab('Warehouses')}>Warehouses</button>
        <button style={ts('Categories')} onClick={() => setTab('Categories')}>Categories</button>
        <button style={ts('Movements')}  onClick={() => setTab('Movements')}>Stock Movements</button>
      </div>

      {tab === 'Products'   && <ProductsPanel />}
      {tab === 'Warehouses' && <WarehousesPanel />}
      {tab === 'Categories' && <CategoriesPanel />}
      {tab === 'Movements'  && <StockMovementsPanel />}
    </div>
  );
};

export default InventoryModule;
