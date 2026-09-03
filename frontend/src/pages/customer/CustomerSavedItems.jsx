import React from "react";
import DashboardLayout from "../../components/DashboardLayout";

const SAVED_ITEMS_DATA = [
  { id: 1, name: "Handheld RF terminal", sku: "ELC-0104", stock: "In stock", price: "310.00", outOfStock: false },
  { id: 2, name: "Barcode scanner X200", sku: "ELC-0091", stock: "In stock", price: "129.00", outOfStock: false },
  { id: 3, name: "Hi-vis safety vest", sku: "APP-3312", stock: "Out of stock", price: "11.20", outOfStock: true },
  { id: 4, name: "Warehouse gloves (L)", sku: "APP-3305", stock: "In stock", price: "4.75", outOfStock: false },
  { id: 5, name: "Packing tape (48mm)", sku: "PKG-1098", stock: "In stock", price: "2.90", outOfStock: false },
];

const STYLES = `
  .csi * { box-sizing: border-box; }
  .csi { font-family: 'Inter', sans-serif; color: #111827; }

  /* KPI Section */
  .csi .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .csi .kpi-card { padding: 20px; border-radius: 12px; background: #F3F2EC; border: 1px solid #E5E5E0; }
  .csi .kpi-card.green { background: #EAF6EE; border-color: #D1E7DD; }
  .csi .kpi-card.tan { background: #FAEEDA; border-color: #F8E6C2; }
  .csi .kpi-label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.025em; margin-bottom: 8px; display: block; }
  .csi .kpi-card.green .kpi-label { color: #1F9D55; }
  .csi .kpi-card.tan .kpi-label { color: #854F0B; }
  .csi .kpi-value { font-size: 24px; font-weight: 700; }

  /* Layout */
  .csi .main-layout { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }

  /* Item List Container */
  .csi .item-container { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 12px; }
  .csi .item-row { display: flex; align-items: center; padding: 16px; border: 1px solid #F1F0EA; border-radius: 10px; margin-bottom: 8px; transition: background 0.2s; }
  .csi .item-row:last-child { margin-bottom: 0; }
  .csi .item-row:hover { background: #FAFAFA; }

  .csi .item-icon { width: 40px; height: 40px; border-radius: 8px; background: #EFF4FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 16px; }
  .csi .item-icon svg { width: 20px; height: 20px; stroke: #2F6FED; }

  .csi .item-details { flex: 1; }
  .csi .item-name { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px; }
  .csi .item-sub { font-size: 11.5px; color: #9CA3AF; }
  .csi .stock-status { color: #9CA3AF; }
  .csi .stock-status.red { color: #A32D2D; }

  .csi .item-price { font-size: 15px; font-weight: 700; margin: 0 30px; }

  /* Buttons */
  .csi .btn-group { display: flex; align-items: center; gap: 12px; }
  .csi .btn-outline { height: 32px; padding: 0 14px; border: 1px solid #D1D5DB; background: #fff; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; color: #374151; transition: 0.2s; }
  .csi .btn-outline:hover { background: #F9FAFB; }
  .csi .btn-notify { height: 32px; padding: 0 14px; background: #FAEEDA; border: none; color: #854F0B; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
  .csi .btn-remove { font-size: 12px; color: #A32D2D; background: none; border: none; cursor: pointer; font-weight: 500; }
  .csi .btn-remove:hover { text-decoration: underline; }

  /* Right Sidebar */
  .csi .panel { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 18px; margin-bottom: 16px; }
  .csi .panel-title { font-size: 13.5px; font-weight: 700; margin-bottom: 14px; color: #111827; }
  
  .csi .rv-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 12.5px; }
  .csi .rv-name { color: #4B5563; }
  .csi .rv-price { font-weight: 700; }

  .csi .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .csi .total-label { font-size: 13px; color: #6B7280; }
  .csi .total-value { font-size: 14px; font-weight: 600; color: #9CA3AF; }

  .csi .btn-primary { width: 100%; height: 40px; background: #2F6FED; color: #fff; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .csi .btn-primary:hover { background: #255BC7; }

  @media (max-width: 900px) {
    .csi .kpi-grid { grid-template-columns: 1fr; }
    .csi .main-layout { grid-template-columns: 1fr; }
    .csi .item-row { flex-wrap: wrap; gap: 16px; }
    .csi .item-price { margin: 0; width: 100%; order: 3; }
    .csi .btn-group { width: 100%; order: 4; justify-content: space-between; }
  }
`;

export default function CustomerSavedItems() {
  return (
    <DashboardLayout title="Saved items" subtitle="Products you've bookmarked for later.">
      <div className="csi">
        <style>{STYLES}</style>

        {/* Top KPI row */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Saved items</span>
            <div className="kpi-value">6</div>
          </div>
          <div className="kpi-card green">
            <span className="kpi-label">In stock</span>
            <div className="kpi-value">5</div>
          </div>
          <div className="kpi-card tan">
            <span className="kpi-label">Back-in-stock alerts</span>
            <div className="kpi-value">1</div>
          </div>
        </div>

        {/* Main layout */}
        <div className="main-layout">
          {/* List of items */}
          <div className="item-container">
            {SAVED_ITEMS_DATA.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-sub">
                    SKU: {item.sku} · <span className={`stock-status ${item.outOfStock ? 'red' : ''}`}>{item.stock}</span>
                  </div>
                </div>
                <div className="item-price">${item.price}</div>
                <div className="btn-group">
                  {item.outOfStock ? (
                    <button className="btn-notify">Notify me</button>
                  ) : (
                    <button className="btn-outline">Add to cart</button>
                  )}
                  <button className="btn-remove">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="sidebar-col">
            <div className="panel">
              <h3 className="panel-title">Recently viewed</h3>
              <div className="rv-row">
                <span className="rv-name">Pallet wrap 20"</span>
                <span className="rv-price">$8.50</span>
              </div>
              <div className="rv-row">
                <span className="rv-name">Corrugated box (M)</span>
                <span className="rv-price">$1.20</span>
              </div>
              <div className="rv-row" style={{ marginBottom: 0 }}>
                <span className="rv-name">Shipping labels (roll)</span>
                <span className="rv-price">$6.10</span>
              </div>
            </div>

            <div className="panel">
              <h3 className="panel-title">List total</h3>
              <div className="total-row">
                <span className="total-label">5 in-stock items</span>
                <span className="total-value">$576.65</span>
              </div>
              <button className="btn-primary">Add all to cart</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved. · Privacy Policy · Terms of Service
        </div>
      </div>
    </DashboardLayout>
  );
}