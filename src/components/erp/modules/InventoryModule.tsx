import { useState } from 'react';
import { useERPList } from '../../../hooks/useERPApi';
import ERPTable from '../ERPTable';

const tabs = ['Products', 'Warehouses', 'Stock Movements'];

const InventoryModule = () => {
  const [tab, setTab] = useState('Products');
  const products = useERPList<any>('inventory/products/');
  const warehouses = useERPList<any>('inventory/warehouses/');
  const movements = useERPList<any>('inventory/stock-movements/');

  const productCols = [
    { key: 'code', label: 'SKU' },
    { key: 'name', label: 'Name' },
    { key: 'category_name', label: 'Category' },
    { key: 'unit', label: 'Unit' },
    { key: 'cost_price', label: 'Cost', render: (r: any) => `$${parseFloat(r.cost_price).toFixed(2)}` },
    { key: 'sale_price', label: 'Price', render: (r: any) => `$${parseFloat(r.sale_price).toFixed(2)}` },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? '✅' : '❌' },
  ];

  const warehouseCols = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? '✅' : '❌' },
  ];

  const movementCols = [
    { key: 'type', label: 'Type' },
    { key: 'product_name', label: 'Product' },
    { key: 'warehouse_name', label: 'Warehouse' },
    { key: 'quantity', label: 'Qty' },
    { key: 'reference', label: 'Reference' },
    { key: 'occurred_at', label: 'Date', render: (r: any) => new Date(r.occurred_at).toLocaleDateString() },
  ];

  return (
    <div>
      <ul className="nav nav-pills mb-3 flex-wrap gap-1">
        {tabs.map(t => (
          <li key={t} className="nav-item">
            <button className={`nav-link${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}
              style={tab === t ? { background: '#6c57d2', border: 'none' } : { border: 'none', color: '#555' }}>{t}</button>
          </li>
        ))}
      </ul>
      {tab === 'Products' && <ERPTable title="Products" columns={productCols} {...products} onDelete={products.remove} />}
      {tab === 'Warehouses' && <ERPTable title="Warehouses" columns={warehouseCols} {...warehouses} onDelete={warehouses.remove} />}
      {tab === 'Stock Movements' && <ERPTable title="Stock Movements" columns={movementCols} {...movements} />}
    </div>
  );
};

export default InventoryModule;
