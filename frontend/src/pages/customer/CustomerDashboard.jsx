import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const BADGE_MAP = { Pending: "amber", Processing: "amber", Shipped: "blue", Delivered: "green" };

const STYLES = `
  .cd * { box-sizing: border-box; }
  .cd { font-family: 'Inter', sans-serif; }

  .cd .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 22px; }
  .cd .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 20px; }
  .cd .kpi-card.warning { background: #FAEEDA; }
  .cd .kpi-card.success { background: #EAF6EE; }
  .cd .kpi-label { font-size: 13.5px; color: #6B7280; margin-bottom: 8px; }
  .cd .kpi-card.warning .kpi-label { color: #854F0B; }
  .cd .kpi-card.success .kpi-label { color: #1F9D55; }
  .cd .kpi-value { font-size: 27px; font-weight: 700; }
  .cd .kpi-card.warning .kpi-value { color: #854F0B; }
  .cd .kpi-card.success .kpi-value { color: #1F9D55; }

  .cd .dash-grid { display: grid; grid-template-columns: 1fr 360px; gap: 22px; margin-bottom: 22px; align-items: start; }
  .cd .dash-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; align-items: start; }
  .cd .chart-panel, .cd .rec-panel { min-height: 344px; box-sizing: border-box; }
  .cd .rec-panel { display: flex; flex-direction: column; }
  .cd .view-more { margin-top: auto; padding-top: 16px; background: none; border: none; color: #2F6FED; font-weight: 600; font-size: 13.5px; cursor: pointer; text-align: left; font-family: inherit; }
  .cd .view-more:hover { text-decoration: underline; }
  .cd .side-col { display: flex; flex-direction: column; gap: 22px; min-width: 0; }

  .cd .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 14px; padding: 26px 28px; overflow-x: auto; }
  .cd .panel-title { font-size: 17px; font-weight: 700; margin-bottom: 18px; }
  .cd .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }

  .cd table { width: 100%; border-collapse: collapse; font-size: 15px; min-width: 420px; }
  .cd th { text-align: left; font-weight: 500; color: #6B7280; padding: 10px 8px; font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .cd th.num, .cd td.num { text-align: right; }
  .cd td { padding: 16px 8px; border-bottom: 1px solid #F1F0EA; }
  .cd tr:last-child td { border-bottom: none; }

  .cd .badge { font-size: 12.5px; padding: 5px 13px; border-radius: 7px; font-weight: 600; display: inline-block; border: none; cursor: pointer; font-family: inherit; }
  .cd .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .cd .badge.green { background: #EAF6EE; color: #1F9D55; }
  .cd .badge.amber { background: #FAEEDA; color: #854F0B; }

  .cd .list-row { display: flex; justify-content: space-between; align-items: center; font-size: 14.5px; padding: 12px 0; border-bottom: 1px solid #F1F0EA; }
  .cd .list-row:last-child { border-bottom: none; }
  .cd .list-row span:last-child { font-weight: 600; }

  .cd .addr-text { font-size: 14.5px; color: #6B7280; line-height: 1.8; }
  .cd .addr-text strong { color: #111827; font-size: 15px; }

  .cd .btn-sm { height: 38px; padding: 0 16px; border-radius: 8px; font-size: 13.5px; font-weight: 500; cursor: pointer; font-family: inherit; }
  .cd .btn-sm.outline { background: #FFFFFF; border: 1px solid #D1D5DB; color: #111827; }

  .cd .shop-card { background: linear-gradient(135deg, #2F6FED 0%, #1e4bb3 100%); color: white; border: none; }
  .cd .shop-card .panel-title { color: white; }
  .cd .shop-card p { opacity: 0.9; font-size: 14px; margin-bottom: 15px; }

  .cd .empty { text-align: center; padding: 30px; color: #9CA3AF; font-size: 13.5px; }

  .cd .app-footer { margin-top: 24px; padding-top: 18px; border-top: 1px solid #E5E5E0; font-size: 12.5px; color: #9CA3AF; text-align: center; }
  .cd .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .cd .dash-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .cd .kpi-row { grid-template-columns: 1fr 1fr; }
  }
`;

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = (user?.name || "there").split(/[.\s]/)[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("sf_token");

      // Use allSettled instead of all: if one request fails, the other
      // should still populate state instead of both being discarded.
      const [ordersResult, addressesResult] = await Promise.allSettled([
        axios.get("https://stockflow-wms-backend.onrender.com/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("https://stockflow-wms-backend.onrender.com/api/addresses", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (ordersResult.status === "fulfilled") {
        setOrders(ordersResult.value.data);
      } else {
        console.error("Failed to load orders:", ordersResult.reason);
      }

      if (addressesResult.status === "fulfilled") {
        setAddresses(addressesResult.value.data);
      } else {
        console.error("Failed to load addresses:", addressesResult.reason);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const activeOrders = orders.filter((o) => o.status !== "Delivered").length;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const deliveredThisMonth = orders.filter(
    (o) => o.status === "Delivered" && new Date(o.updatedAt).getMonth() === thisMonth && new Date(o.updatedAt).getFullYear() === thisYear
  ).length;

  const totalSpentThisYear = orders
    .filter((o) => new Date(o.createdAt).getFullYear() === thisYear)
    .reduce((sum, o) => sum + o.total, 0);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const spendData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthTotal = orders
      .filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      })
      .reduce((sum, o) => sum + o.total, 0);
    spendData.push({ month: monthNames[d.getMonth()], value: Math.round(monthTotal) });
  }

  const defaultAddress = addresses.find((a) => a.isDefaultDelivery) || addresses[0];
  const recentOrders = orders.slice(0, 8);

  return (
    <DashboardLayout title={`Welcome back, ${displayName}`} subtitle="Here's the status of your recent orders.">
      <div className="cd">
        <style>{STYLES}</style>

        {loading ? (
          <div className="empty">Loading dashboard…</div>
        ) : (
          <>
            <div className="kpi-row">
              <div className="kpi-card"><div className="kpi-label">Active orders</div><div className="kpi-value">{activeOrders}</div></div>
              <div className="kpi-card success"><div className="kpi-label">Delivered this month</div><div className="kpi-value">{deliveredThisMonth}</div></div>
              <div className="kpi-card"><div className="kpi-label">Total spent this year</div><div className="kpi-value">${totalSpentThisYear.toFixed(2)}</div></div>
              <div className="kpi-card warning"><div className="kpi-label">Total orders</div><div className="kpi-value">{orders.length}</div></div>
            </div>

            <div className="dash-grid">
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title" style={{ marginBottom: 0 }}>Recent orders</div>
                  <button className="badge blue" onClick={() => navigate("/customer")}>View all</button>
                </div>
                {recentOrders.length === 0 ? (
                  <div className="empty">You haven't placed any orders yet.</div>
                ) : (
                  <table>
                    <thead>
                      <tr><th>Order</th><th>Items</th><th>Total</th><th>Date</th><th className="num">Status</th></tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td>#{o.orderNumber}</td>
                          <td>{o.items.length}</td>
                          <td>${o.total.toFixed(2)}</td>
                          <td>{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                          <td className="num"><span className={`badge ${BADGE_MAP[o.status] || "amber"}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="side-col">
                <div className="panel shop-card">
                  <div className="panel-title">Shop our catalog</div>
                  <p>Ready to place a new order? Browse our full range of inventory and warehouse supplies.</p>
                  <button className="btn-sm outline" style={{ width: "100%", color: "#2F6FED", fontWeight: "700" }} onClick={() => navigate("/customer/browse")}>
                    Browse Products →
                  </button>
                </div>

                <div className="panel">
                  <div className="panel-title">Default delivery address</div>
                  {defaultAddress ? (
                    <div className="addr-text">
                      <strong>{defaultAddress.type}</strong><br />
                      {defaultAddress.addressLine1}<br />
                      {defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}
                    </div>
                  ) : (
                    <div className="addr-text">No address saved yet.</div>
                  )}
                  <button className="btn-sm outline" style={{ marginTop: 14 }} onClick={() => navigate("/customer/addresses")}>
                    {defaultAddress ? "Change address" : "Add address"}
                  </button>
                </div>
              </div>
            </div>

            <div className="dash-grid2">
              <div className="panel chart-panel">
                <div className="panel-title">Spending over time</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={spendData} margin={{ right: 24 }}>
                    <CartesianGrid vertical={false} stroke="#EEEDE7" />
                    <XAxis dataKey="month" tick={{ fontSize: 13, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 13, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => `$${v}`} />
                    <Line type="monotone" dataKey="value" stroke="#2F6FED" strokeWidth={2.5} dot={{ r: 3, fill: "#2F6FED" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="panel rec-panel">
                <div className="panel-title">Order status breakdown</div>
                {["Pending", "Processing", "Shipped", "Delivered"].map((status) => {
                  const count = orders.filter((o) => o.status === status).length;
                  return (
                    <div className="list-row" key={status}>
                      <span>{status}</span><span>{count}</span>
                    </div>
                  );
                })}
                <button className="view-more" onClick={() => navigate("/customer/browse")}>
                  Browse more products →
                </button>
              </div>
            </div>
          </>
        )}

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. · Privacy Policy · Terms of Service
        </div>
      </div>
    </DashboardLayout>
  );
}