import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import { useCart } from "../../context/CartContext";

const STYLES = `
  .csi * { box-sizing: border-box; }
  .csi { font-family: 'Inter', sans-serif; color: #111827; }

  .csi .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .csi .kpi-card { padding: 20px; border-radius: 12px; background: #F3F2EC; border: 1px solid #E5E5E0; }
  .csi .kpi-card.green { background: #EAF6EE; border-color: #D1E7DD; }
  .csi .kpi-card.tan { background: #FAEEDA; border-color: #F8E6C2; }
  .csi .kpi-label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.025em; margin-bottom: 8px; display: block; }
  .csi .kpi-card.green .kpi-label { color: #1F9D55; }
  .csi .kpi-card.tan .kpi-label { color: #854F0B; }
  .csi .kpi-value { font-size: 24px; font-weight: 700; }

  .csi .main-layout { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }

  .csi .item-container { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 12px; }
  .csi .item-row { display: flex; align-items: center; padding: 16px; border: 1px solid #F1F0EA; border-radius: 10px; margin-bottom: 8px; transition: background 0.2s; }
  .csi .item-row:last-child { margin-bottom: 0; }
  .csi .item-row:hover { background: #FAFAFA; }

  .csi .item-icon { width: 40px; height: 40px; border-radius: 8px; background: #EFF4FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 16px; }
  .csi .item-icon svg { width: 20px; height: 20px; stroke: #2F6FED; }

  .csi .item-details { flex: 1; }
  .csi .item-name { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px; }
  .csi .item-sub { font-size: 11.5px; color: #9CA3AF; }
  .csi .stock-status.red { color: #A32D2D; }

  .csi .item-price { font-size: 15px; font-weight: 700; margin: 0 30px; }

  .csi .btn-group { display: flex; align-items: center; gap: 12px; }
  .csi .btn-outline { height: 32px; padding: 0 14px; border: 1px solid #D1D5DB; background: #fff; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; color: #374151; transition: 0.2s; }
  .csi .btn-outline:hover { background: #F9FAFB; }
  .csi .btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }
  .csi .btn-notify { height: 32px; padding: 0 14px; background: #FAEEDA; border: none; color: #854F0B; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: not-allowed; }
  .csi .btn-remove { font-size: 12px; color: #A32D2D; background: none; border: none; cursor: pointer; font-weight: 500; }
  .csi .btn-remove:hover { text-decoration: underline; }

  .csi .panel { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 18px; margin-bottom: 16px; }
  .csi .panel-title { font-size: 13.5px; font-weight: 700; margin-bottom: 14px; color: #111827; }

  .csi .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .csi .total-label { font-size: 13px; color: #6B7280; }
  .csi .total-value { font-size: 14px; font-weight: 600; color: #111827; }

  .csi .btn-primary { width: 100%; height: 40px; background: #2F6FED; color: #fff; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .csi .btn-primary:hover { background: #255BC7; }
  .csi .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .csi .empty { text-align: center; padding: 40px; color: #9CA3AF; font-size: 13px; }

  @media (max-width: 900px) {
    .csi .kpi-grid { grid-template-columns: 1fr; }
    .csi .main-layout { grid-template-columns: 1fr; }
    .csi .item-row { flex-wrap: wrap; gap: 16px; }
    .csi .item-price { margin: 0; width: 100%; order: 3; }
    .csi .btn-group { width: 100%; order: 4; justify-content: space-between; }
  }
`;

export default function CustomerSavedItems() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const token = localStorage.getItem("sf_token");
      const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/saved-items", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch saved items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("sf_token");
      await axios.delete(`https://stockflow-wms-backend.onrender.com/api/saved-items/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems((prev) => prev.filter((i) => i._id !== productId));
    } catch (err) {
      alert("Failed to remove item.");
    }
  };

  const handleAddToCart = (item) => {
    addToCart({ sku: item.sku, name: item.name, price: item.price, image: item.imageUrl });
  };

  const inStockItems = items.filter((i) => i.status === "In stock");
  const outOfStockCount = items.filter((i) => i.status === "Out of stock").length;
  const listTotal = inStockItems.reduce((sum, i) => sum + i.price, 0);

  const handleAddAllToCart = () => {
    inStockItems.forEach((item) => handleAddToCart(item));
    navigate("/customer/checkout");
  };

  return (
    <DashboardLayout title="Saved items" subtitle="Products you've bookmarked for later.">
      <div className="csi">
        <style>{STYLES}</style>

        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Saved items</span>
            <div className="kpi-value">{items.length}</div>
          </div>
          <div className="kpi-card green">
            <span className="kpi-label">In stock</span>
            <div className="kpi-value">{inStockItems.length}</div>
          </div>
          <div className="kpi-card tan">
            <span className="kpi-label">Out of stock</span>
            <div className="kpi-value">{outOfStockCount}</div>
          </div>
        </div>

        <div className="main-layout">
          <div className="item-container">
            {loading ? (
              <div className="empty">Loading saved items…</div>
            ) : items.length === 0 ? (
              <div className="empty">
                No saved items yet. Browse the catalog and save products you like for later.
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="item-row">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-sub">
                      SKU: {item.sku} ·{" "}
                      <span className={`stock-status ${item.status === "Out of stock" ? "red" : ""}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="btn-group">
                    {item.status === "Out of stock" ? (
                      <button className="btn-notify" disabled>Out of stock</button>
                    ) : (
                      <button className="btn-outline" onClick={() => handleAddToCart(item)}>Add to cart</button>
                    )}
                    <button className="btn-remove" onClick={() => handleRemove(item._id)}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="sidebar-col">
            <div className="panel">
              <h3 className="panel-title">List total</h3>
              <div className="total-row">
                <span className="total-label">{inStockItems.length} in-stock items</span>
                <span className="total-value">${listTotal.toFixed(2)}</span>
              </div>
              <button className="btn-primary" onClick={handleAddAllToCart} disabled={inStockItems.length === 0}>
                Add all to cart
              </button>
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