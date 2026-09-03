import React from 'react';
import { useNavigate, useParams } from 'react';

export default function AdminProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock product data (replace with API fetch using id)
  const product = {
    id: id || 'PKG-1042',
    name: 'Corrugated box (M)',
    sku: 'PKG-1042',
    category: 'Packaging',
    unit: 'Each',
    addedDate: 'Mar 3, 2026',
    status: 'Low stock',
    currentStock: 15,
    reorderLevel: 25,
    maxStock: 80,
    costPrice: '0.85',
    sellingPrice: '1.20',
    description: 'Standard medium corrugated shipping box, double-wall construction. Used for packing electronics, apparel, and general merchandise up to 15kg. Flat-packed for storage efficiency.',
    supplier: 'Coimbatore Packaging Co.',
    leadTime: '5 days',
    warehouse: 'Coimbatore',
    binLocation: 'B-14',
  };

  return (
    <div style={{ padding: '24px 48px', fontFamily: 'Inter, sans-serif', color: '#111827' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>
        <span onClick={() => navigate('/admin/inventory')} style={{ color: '#2F6FED', cursor: 'pointer' }}>Inventory</span> / {product.name}
      </div>

      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{product.name}</h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0' }}>SKU: {product.sku} · {product.category}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ height: '40px', padding: '0 18px', background: '#FFF', color: '#111827', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            Archive
          </button>
          <button 
            onClick={() => navigate(`/admin/products/${product.id}/edit`)} 
            style={{ height: '40px', padding: '0 20px', background: '#2F6FED', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            Edit product
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px' }}>
        
        {/* Left Column: Summary */}
        <div>
          <div style={{ background: '#FFF', border: '1px solid #E5E5E0', borderRadius: '12px', padding: '18px', marginBottom: '14px' }}>
            <div style={{ height: '180px', background: '#EFF4FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#2F6FED" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F1F0EA', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Status</span>
              <span style={{ background: '#FAEEDA', color: '#854F0B', padding: '3px 10px', borderRadius: '7px', fontSize: '11.5px', fontWeight: '600' }}>{product.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F1F0EA', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Category</span>
              <span style={{ fontWeight: '500' }}>{product.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F1F0EA', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Unit</span>
              <span style={{ fontWeight: '500' }}>{product.unit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Added</span>
              <span style={{ fontWeight: '500' }}>{product.addedDate}</span>
            </div>
          </div>

          <div style={{ background: '#FFF', border: '1px solid #E5E5E0', borderRadius: '12px', padding: '18px', marginBottom: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Stock level</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Current stock</span>
              <span style={{ fontWeight: '600' }}>{product.currentStock} / {product.reorderLevel}</span>
            </div>
            <div style={{ width: '100%', height: '7px', background: '#F1F0EA', borderRadius: '4px', overflow: 'hidden', margin: '6px 0 10px' }}>
              <div style={{ width: `${(product.currentStock / product.reorderLevel) * 100}%`, height: '100%', background: '#E8A93A' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Reorder level</span>
              <span style={{ fontWeight: '500' }}>{product.reorderLevel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Max stock</span>
              <span style={{ fontWeight: '500' }}>{product.maxStock}</span>
            </div>
          </div>

          <div style={{ background: '#FFF', border: '1px solid #E5E5E0', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Supplier & location</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Supplier</span>
              <span style={{ fontWeight: '500' }}>{product.supplier}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Warehouse</span>
              <span style={{ fontWeight: '500' }}>{product.warehouse}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
              <span style={{ color: '#6B7280' }}>Bin location</span>
              <span style={{ fontWeight: '500' }}>{product.binLocation}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Descriptions */}
        <div>
          <div style={{ background: '#FFF', border: '1px solid #E5E5E0', borderRadius: '12px', padding: '18px', marginBottom: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Description</div>
            <p style={{ fontSize: '13.5px', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>{product.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Cost price</div>
                <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px' }}>${product.costPrice}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Selling price</div>
                <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px', color: '#2F6FED' }}>${product.sellingPrice}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}