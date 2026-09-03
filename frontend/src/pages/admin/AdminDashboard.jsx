import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const WEEK_DATA = [
  { day: "Mon", orders: 62 },
  { day: "Tue", orders: 74 },
  { day: "Wed", orders: 58 },
  { day: "Thu", orders: 81 },
  { day: "Fri", orders: 96 },
  { day: "Sat", orders: 40 },
  { day: "Sun", orders: 22 },
];

const LOW_STOCK = [
  ["Pallet wrap 20\"", "3 left", "danger"],
  ["Shipping labels", "8 left", "danger"],
  ["Corrugated boxes M", "15 left", "warning"],
  ["Packing tape", "18 left", "warning"],
];

const ACTIVITY = [
  ["blue", <><b>Maria K.</b> restocked Pallet wrap 20"</>, "12 min ago"],
  ["green", <>Order <b>#10432</b> shipped</>, "40 min ago"],
  ["amber", <><b>James O.</b> flagged low stock on 3 SKUs</>, "1 hr ago"],
  ["blue", <>New user <b>Priya R.</b> invited</>, "2 hr ago"],
];

const ORDERS = [
  { id: "#10432", customer: "Priya Raman", items: 3, total: "$142.00", date: "Jul 24", status: "Shipped", badge: "blue" },
  { id: "#10433", customer: "Daniel Osei", items: 1, total: "$38.50", date: "Jul 24", status: "Processing", badge: "amber" },
  { id: "#10434", customer: "Wei Zhang", items: 5, total: "$276.20", date: "Jul 23", status: "Pending", badge: "gray" },
  { id: "#10435", customer: "Amara Okafor", items: 2, total: "$91.00", date: "Jul 23", status: "Delivered", badge: "green" },
];

const STYLES = `
  .ad * { box-sizing: border-box; }
  .ad { font-family: 'Inter', sans-serif; }

  .ad .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
  .ad .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .ad .kpi-card.danger { background: #FCEBEB; }
  .ad .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .ad .kpi-card.danger .kpi-label { color: #A32D2D; }
  .ad .kpi-value { font-size: 26px; font-weight: 700; }
  .ad .kpi-card.danger .kpi-value { color: #A32D2D; }

  .ad .panels-row { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .ad .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; }
  .ad .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 14px; }
  .ad .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }

  .ad .stock-row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #F1F0EA; }
  .ad .stock-row:last-child { border-bottom: none; }
  .ad .stock-row .qty.danger { color: #A32D2D; font-weight: 600; }
  .ad .stock-row .qty.warning { color: #854F0B; font-weight: 600; }

  .ad .activity-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F1F0EA; font-size: 13px; }
  .ad .activity-item:last-child { border-bottom: none; }
  .ad .activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .ad .activity-dot.blue { background: #2F6FED; }
  .ad .activity-dot.green { background: #1F9D55; }
  .ad .activity-dot.amber { background: #854F0B; }
  .ad .activity-time { color: #9CA3AF; font-size: 12px; margin-top: 2px; }

  .ad table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .ad th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .ad td { padding: 12px 10px; border-bottom: 1px solid #F1F0EA; }
  .ad tr:last-child td { border-bottom: none; }

  .ad .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; cursor: default; border: none; font-family: inherit; }
  .ad .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .ad .badge.green { background: #EAF6EE; color: #1F9D55; }
  .ad .badge.amber { background: #FAEEDA; color: #854F0B; }
  .ad .badge.gray { background: #F1F0EA; color: #6B7280; }

  .ad .app-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .ad .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .ad .kpi-row { grid-template-columns: repeat(2, 1fr); }
    .ad .panels-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .ad .kpi-row { grid-template-columns: 1fr; }
    .ad .panel { overflow-x: auto; }
    .ad table { min-width: 480px; }
  }
`;

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title="Admin dashboard"
      subtitle={`Welcome back${user?.name ? `, ${user.name}` : ""}, here's what's happening today.`}
    >
      <div className="ad">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Total products</div><div className="kpi-value">1,284</div></div>
          <div className="kpi-card"><div className="kpi-label">Orders today</div><div className="kpi-value">96</div></div>
          <div className="kpi-card danger"><div className="kpi-label">Low stock items</div><div className="kpi-value">14</div></div>
          <div className="kpi-card"><div className="kpi-label">Active users</div><div className="kpi-value">37</div></div>
        </div>

        <div className="panels-row">
          <div className="panel">
            <div className="panel-title">Orders this week</div>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={WEEK_DATA}>
                <CartesianGrid vertical={false} stroke="#EEEDE7" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Bar dataKey="orders" fill="#2F6FED" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="panel">
            <div className="panel-title">Low stock alerts</div>
            {LOW_STOCK.map(([name, qty, level]) => (
              <div className="stock-row" key={name}>
                <span>{name}</span>
                <span className={`qty ${level}`}>{qty}</span>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-title">Recent activity</div>
            {ACTIVITY.map(([color, text, time], i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-dot ${color}`} />
                <div>
                  <div>{text}</div>
                  <div className="activity-time">{time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title" style={{ marginBottom: 0 }}>Recent orders</div>
            <button className="badge blue">View all</button>
          </div>
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.items}</td>
                  <td>{o.total}</td>
                  <td>{o.date}</td>
                  <td><span className={`badge ${o.badge}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}