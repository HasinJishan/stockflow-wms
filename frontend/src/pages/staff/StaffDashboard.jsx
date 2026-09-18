import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const BADGE_STYLE = {
  Pending: "gray",
  Processing: "amber",
  Shipped: "blue",
  Delivered: "green",
};

const STYLES = `
  .sd * { box-sizing: border-box; }
  .sd { font-family: 'Inter', sans-serif; }

  .sd .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
  .sd .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .sd .kpi-card.warning { background: #FAEEDA; }
  .sd .kpi-card.success { background: #EAF6EE; }
  .sd .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .sd .kpi-card.warning .kpi-label { color: #854F0B; }
  .sd .kpi-card.success .kpi-label { color: #1F9D55; }
  .sd .kpi-value { font-size: 26px; font-weight: 700; }
  .sd .kpi-card.warning .kpi-value { color: #854F0B; }
  .sd .kpi-card.success .kpi-value { color: #1F9D55; }

  .sd .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 16px; overflow-x: auto; }
  .sd .panel:last-child { margin-bottom: 0; }
  .sd .panel-title { font-size: 15px; font-weight: 600; }
  .sd .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }

  .sd table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 480px; }
  .sd th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .sd th.num, .sd td.num { text-align: right; }
  .sd td { padding: 12px 8px; border-bottom: 1px solid #F1F0EA; }
  .sd tr:last-child td { border-bottom: none; }
  .sd tr.clickable { cursor: pointer; }
  .sd tr.clickable:hover { background: #F9FAFB; }

  .sd .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; border: none; cursor: pointer; font-family: inherit; }
  .sd .badge.amber { background: #FAEEDA; color: #854F0B; }
  .sd .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .sd .badge.gray { background: #F1F0EA; color: #6B7280; }
  .sd .badge.green { background: #EAF6EE; color: #1F9D55; }
  .sd .badge.red { background: #FCEBEB; color: #A32D2D; }

  .sd .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .sd .empty { text-align: center; padding: 30px; color: #9CA3AF; font-size: 13px; }

  .sd .app-footer { margin-top: 8px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .sd .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .sd .kpi-row { grid-template-columns: repeat(2, 1fr); }
    .sd .dash-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .sd .kpi-row { grid-template-columns: 1fr; }
  }
`;

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const [ordersRes, productsRes] = await Promise.all([
          axios.get("https://stockflow-wms-backend.onrender.com/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("https://stockflow-wms-backend.onrender.com/api/products", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setOrders(ordersRes.data);
        setLowStockProducts(
          productsRes.data.filter((p) => p.status === "Low stock" || p.status === "Out of stock")
        );
      } catch (err) {
        console.error("Failed to load staff dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toDateString();
  const ordersToFulfill = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  const shippedToday = orders.filter((o) => o.status === "Shipped" && new Date(o.updatedAt).toDateString() === today).length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const onTimeRate = orders.length > 0 ? Math.round((deliveredCount / orders.length) * 100) : 0;

  const pickQueue = orders
    .filter((o) => o.status === "Pending" || o.status === "Processing" || o.status === "Shipped")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <DashboardLayout title="Today's tasks" subtitle="Your current workload across pending orders and stock alerts.">
      <div className="sd">
        <style>{STYLES}</style>

        {loading ? (
          <div className="empty">Loading dashboard…</div>
        ) : (
          <>
            <div className="kpi-row">
              <div className="kpi-card"><div className="kpi-label">Orders to fulfill</div><div className="kpi-value">{ordersToFulfill}</div></div>
              <div className="kpi-card warning"><div className="kpi-label">Items to restock</div><div className="kpi-value">{lowStockProducts.length}</div></div>
              <div className="kpi-card"><div className="kpi-label">Shipped today</div><div className="kpi-value">{shippedToday}</div></div>
              <div className="kpi-card success"><div className="kpi-label">Delivered rate</div><div className="kpi-value">{onTimeRate}%</div></div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Pick queue</div>
                <button className="badge blue" onClick={() => navigate("/staff/pick-pack")}>View all</button>
              </div>
              {pickQueue.length === 0 ? (
                <div className="empty">No orders awaiting fulfillment right now.</div>
              ) : (
                <table>
                  <thead>
                    <tr><th>Order</th><th>Customer</th><th>Items</th><th className="num">Status</th></tr>
                  </thead>
                  <tbody>
                    {pickQueue.map((o) => (
                      <tr key={o._id} className="clickable" onClick={() => navigate(`/admin/orders/${o.orderNumber}`)}>
                        <td>#{o.orderNumber}</td>
                        <td>{o.customer?.fullName || "Unknown"}</td>
                        <td>{o.items.length}</td>
                        <td className="num"><span className={`badge ${BADGE_STYLE[o.status]}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="dash-grid">
              <div className="panel">
                <div className="panel-title" style={{ marginBottom: 14 }}>Restock alerts</div>
                {lowStockProducts.length === 0 ? (
                  <div className="empty">No low stock items right now.</div>
                ) : (
                  <table>
                    <thead>
                      <tr><th>Product</th><th>Bin</th><th className="num">Stock left</th></tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.slice(0, 6).map((p) => (
                        <tr key={p._id}>
                          <td>{p.name}</td>
                          <td>{p.binLocation || "—"}</td>
                          <td className="num">
                            <span className={`badge ${p.status === "Out of stock" ? "red" : "amber"}`}>
                              {p.quantity} left
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="panel">
                <div className="panel-title" style={{ marginBottom: 14 }}>Recent orders</div>
                {orders.length === 0 ? (
                  <div className="empty">No orders yet.</div>
                ) : (
                  <table>
                    <thead>
                      <tr><th>Order</th><th className="num">Placed</th></tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 6).map((o) => (
                        <tr key={o._id}>
                          <td>#{o.orderNumber} — {o.customer?.fullName || "Unknown"}</td>
                          <td className="num">{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}