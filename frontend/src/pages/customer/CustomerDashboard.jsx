import React from "react";
import { useNavigate } from "react-router-dom"; // IMPORT THIS
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const RECENT_ORDERS = [
  { order: "#10432", items: 3, total: "$142.00", date: "Jul 24", status: "Out for delivery", badge: "blue" },
  { order: "#10425", items: 2, total: "$76.50", date: "Jul 21", status: "In transit", badge: "amber" },
  { order: "#10418", items: 1, total: "$310.00", date: "Jul 19", status: "In transit", badge: "amber" },
  { order: "#10401", items: 1, total: "$52.00", date: "Jul 15", status: "Delivered", badge: "green" },
  { order: "#10388", items: 5, total: "$203.40", date: "Jul 10", status: "Delivered", badge: "green" },
  { order: "#10372", items: 2, total: "$91.00", date: "Jul 5", status: "Delivered", badge: "green" },
  { order: "#10452", items: 3, total: "$99.00", date: "Jul 4", status: "Delivered", badge: "green" },
  { order: "#10326", items: 2, total: "$71.00", date: "Jul 2", status: "Delivered", badge: "green" },
];

const SAVED_ITEMS = [
  ["Handheld RF terminal", "$310.00"],
  ["Barcode scanner X200", "$129.00"],
  ["Warehouse gloves (L)", "$4.75"],
];

const RECOMMENDED = [
  ["Corrugated box (M) · frequently bought with your orders", "$1.20"],
  ["Packing tape (48mm) · you're running low based on past orders", "$2.90"],
  ["Bubble wrap roll · pairs well with fragile items", "$5.40"],
];

const SPEND_DATA = [
  { month: "Feb", value: 140 },
  { month: "Mar", value: 210 },
  { month: "Apr", value: 180 },
  { month: "May", value: 260 },
  { month: "Jun", value: 310 },
  { month: "Jul", value: 290 },
];

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

  .cd .rec-row { display: flex; justify-content: space-between; align-items: center; font-size: 14.5px; padding: 14px 0; border-bottom: 1px solid #F1F0EA; gap: 16px; }
  .cd .rec-row:last-child { border-bottom: none; }
  .cd .rec-row span:first-child { color: #4B5563; }
  .cd .rec-row span:last-child { font-weight: 600; flex-shrink: 0; }

  .cd .addr-text { font-size: 14.5px; color: #6B7280; line-height: 1.8; }
  .cd .addr-text strong { color: #111827; font-size: 15px; }

  .cd .btn-sm { height: 38px; padding: 0 16px; border-radius: 8px; font-size: 13.5px; font-weight: 500; cursor: pointer; font-family: inherit; }
  .cd .btn-sm.outline { background: #FFFFFF; border: 1px solid #D1D5DB; color: #111827; }
  .cd .btn-primary { height: 46px; padding: 0 18px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; }

  /* New Shop Card Style */
  .cd .shop-card { background: linear-gradient(135deg, #2F6FED 0%, #1e4bb3 100%); color: white; border: none; }
  .cd .shop-card .panel-title { color: white; }
  .cd .shop-card p { opacity: 0.9; font-size: 14px; margin-bottom: 15px; }

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
  const navigate = useNavigate(); // INITIALIZE NAVIGATE
  
  const firstName = (user?.name || "there").split(/[.\s]/)[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <DashboardLayout title={`Welcome back, ${displayName}`} subtitle="Here's the status of your recent orders.">
      <div className="cd">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Active orders</div><div className="kpi-value">3</div></div>
          <div className="kpi-card success"><div className="kpi-label">Delivered this month</div><div className="kpi-value">9</div></div>
          <div className="kpi-card"><div className="kpi-label">Total spent this year</div><div className="kpi-value">$2,140</div></div>
          <div className="kpi-card warning"><div className="kpi-label">Loyalty points</div><div className="kpi-value">1,240</div></div>
        </div>

        <div className="dash-grid">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title" style={{ marginBottom: 0 }}>Recent orders</div>
              <button className="badge blue">View all</button>
            </div>
            <table>
              <thead>
                <tr><th>Order</th><th>Items</th><th>Total</th><th>Date</th><th className="num">Status</th></tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o) => (
                  <tr key={o.order}>
                    <td>{o.order}</td>
                    <td>{o.items}</td>
                    <td>{o.total}</td>
                    <td>{o.date}</td>
                    <td className="num"><span className={`badge ${o.badge}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="side-col">
            {/* NEW BROWSE PRODUCTS PANEL */}
            <div className="panel shop-card">
              <div className="panel-title">Shop our catalog</div>
              <p>Ready to place a new order? Browse our full range of inventory and warehouse supplies.</p>
              <button className="btn-sm outline" style={{ width: "100%", color: "#2F6FED", fontWeight: "700" }} onClick={() => navigate("/customer/browse")}>
                Browse Products →
              </button>
            </div>

            <div className="panel">
              <div className="panel-title">Saved for later</div>
              {SAVED_ITEMS.map(([name, price]) => (
                <div className="list-row" key={name}><span>{name}</span><span>{price}</span></div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-title">Default delivery address</div>
              <div className="addr-text">
                <strong>Home</strong><br />
                42 Race Course Road, RS Puram<br />
                Coimbatore, Tamil Nadu 641002
              </div>
              <button className="btn-sm outline" style={{ marginTop: 14 }} onClick={() => navigate("/customer/addresses")}>
                Change address
              </button>
            </div>
          </div>
        </div>

        <div className="dash-grid2">
          <div className="panel chart-panel">
            <div className="panel-title">Spending over time</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={SPEND_DATA} margin={{ right: 24 }}>
                <CartesianGrid vertical={false} stroke="#EEEDE7" />
                <XAxis dataKey="month" tick={{ fontSize: 13, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `$${v}`} />
                <Line type="monotone" dataKey="value" stroke="#2F6FED" strokeWidth={2.5} dot={{ r: 3, fill: "#2F6FED" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="panel rec-panel">
            <div className="panel-title">Recommended for you</div>
            {RECOMMENDED.map(([desc, price]) => (
              <div className="rec-row" key={desc} style={{ cursor: 'pointer' }} onClick={() => navigate("/customer/browse")}>
                <span>{desc}</span><span>{price}</span>
              </div>
            ))}
            <button className="view-more" onClick={() => navigate("/customer/browse")}>
              View more recommendations →
            </button>
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}