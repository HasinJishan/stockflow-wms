import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import ExportModal from "../../components/ExportModal";

const RANGES = ["7D", "30D", "90D", "1Y"];

const STYLES = `
  .an * { box-sizing: border-box; }
  .an { font-family: 'Inter', sans-serif; }

  .an .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
  .an .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .an .kpi-card.success { background: #EAF6EE; }
  .an .kpi-card.warning { background: #FAEEDA; }
  .an .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .an .kpi-card.success .kpi-label { color: #1F9D55; }
  .an .kpi-card.warning .kpi-label { color: #854F0B; }
  .an .kpi-value { font-size: 26px; font-weight: 700; }
  .an .kpi-card.success .kpi-value { color: #1F9D55; }
  .an .kpi-card.warning .kpi-value { color: #854F0B; }

  .an .charts-row { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; margin-bottom: 16px; }
  .an .charts-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .an .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; overflow-x: auto; }
  .an .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 14px; }

  .an table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 360px; }
  .an th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .an th.num, .an td.num { text-align: right; }
  .an td { padding: 12px 10px; border-bottom: 1px solid #F1F0EA; }
  .an tr:last-child td { border-bottom: none; }

  .an .legend { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
  .an .legend-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4B5563; }
  .an .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .an .legend-value { margin-left: auto; font-weight: 600; color: #111827; }

  .an .empty { text-align: center; padding: 20px; color: #9CA3AF; font-size: 13px; }

  .an .app-footer { margin-top: 16px; padding-top: 14px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .an .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .an .kpi-row { grid-template-columns: repeat(2, 1fr); }
    .an .charts-row, .an .charts-row2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .an .kpi-row { grid-template-columns: 1fr; }
  }
`;

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function AdminAnalytics() {
  const [range, setRange] = useState("30D");
  const [exportOpen, setExportOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('sf_token');
        const res = await axios.get(`https://stockflow-wms-backend.onrender.com/api/analytics?range=${range}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [range]);

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Business performance across your warehouse network."
      actions={
        <>
          <div className="topbar-filter-tabs">
            {RANGES.map((r) => (
              <button
                key={r}
                className={`topbar-filter-tab${range === r ? " active" : ""}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="topbar-btn-outline" onClick={() => setExportOpen(true)}>
            <DownloadIcon /> <span className="btn-label">Export</span>
          </button>
        </>
      }
    >
      <div className="an">
        <style>{STYLES}</style>

        {loading ? (
          <div className="empty">Loading analytics…</div>
        ) : !data ? (
          <div className="empty">Could not load analytics data.</div>
        ) : (
          <>
            <div className="kpi-row">
              <div className="kpi-card"><div className="kpi-label">Revenue ({range.toLowerCase()})</div><div className="kpi-value">{data.kpi.revenue}</div></div>
              <div className="kpi-card success"><div className="kpi-label">Orders ({range.toLowerCase()})</div><div className="kpi-value">{data.kpi.orders.toLocaleString()}</div></div>
              <div className="kpi-card"><div className="kpi-label">Avg. order value</div><div className="kpi-value">{data.kpi.aov}</div></div>
              <div className="kpi-card warning"><div className="kpi-label">Undelivered rate</div><div className="kpi-value">{data.kpi.returnRate}</div></div>
            </div>

            <div className="charts-row">
              <div className="panel">
                <div className="panel-title">Revenue trend</div>
                {data.revenueTrend.length === 0 ? (
                  <div className="empty">No orders in this range yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={210}>
                    <LineChart data={data.revenueTrend}>
                      <CartesianGrid vertical={false} stroke="#EEEDE7" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                      <Line type="monotone" dataKey="value" stroke="#2F6FED" strokeWidth={2.5} dot={{ r: 3, fill: "#2F6FED" }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="panel">
                <div className="panel-title">Warehouse stock levels</div>
                {data.warehouseData.length === 0 ? (
                  <div className="empty">No warehouse data yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart data={data.warehouseData}>
                      <CartesianGrid vertical={false} stroke="#EEEDE7" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Bar dataKey="value" fill="#2F6FED" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="charts-row2">
              <div className="panel">
                <div className="panel-title">Top products by revenue</div>
                {data.topProducts.length === 0 ? (
                  <div className="empty">No sales in this range yet.</div>
                ) : (
                  <table>
                    <thead>
                      <tr><th>Product</th><th className="num">Units sold</th><th className="num">Revenue</th></tr>
                    </thead>
                    <tbody>
                      {data.topProducts.map((p) => (
                        <tr key={p.name}>
                          <td>{p.name}</td>
                          <td className="num">{p.units.toLocaleString()}</td>
                          <td className="num">{p.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="panel">
                <div className="panel-title">Customer segments</div>
                {data.segments.length === 0 ? (
                  <div className="empty">No customer order data yet.</div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={data.segments} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2}>
                          {data.segments.map((s) => <Cell key={s.name} fill={s.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="legend">
                      {data.segments.map((s) => (
                        <div className="legend-row" key={s.name}>
                          <span className="legend-dot" style={{ background: s.color }} />
                          {s.name}
                          <span className="legend-value">{s.value}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export analytics"
        filePrefix="stockflow-analytics"
        includeItems={["KPI summary", "Charts & graphs", "Top products & segments table"]}
        exportData={
  data && {
    kpis: data.kpi,
    charts: {
      "Revenue trend": { labels: data.revenueTrend.map(r => r.label), data: data.revenueTrend.map(r => r.value) },
      "Warehouse stock levels": { labels: data.warehouseData.map(w => w.name), data: data.warehouseData.map(w => w.value) }
    },
    savedReports: data.topProducts.map(p => ({ name: p.name, type: "Top product", generated: p.revenue }))
  }
}
      />
    </DashboardLayout>
  );
}