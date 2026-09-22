import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import ExportModal from "../../components/ExportModal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Title, Tooltip, Legend);

const RANGE_MONTHS = { "3M": 3, "6M": 6, "1Y": 12 };

const STYLES = `
  .ana-container { font-family: 'Inter', sans-serif; color: #111827; }

  .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 20px; border: 1px solid #E5E5E0; }
  .kpi-card.success { background: #EAF6EE; border-color: #D1E7DD; }
  .kpi-card.warning { background: #FAEEDA; border-color: #F8E6C2; }
  .kpi-label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.025em; margin-bottom: 8px; display: block; }
  .kpi-card.success .kpi-label { color: #1F9D55; }
  .kpi-card.warning .kpi-label { color: #854F0B; }
  .kpi-value { font-size: 24px; font-weight: 700; }

  .filter-tabs-group { display: flex; background: #F1F0EA; padding: 4px; border-radius: 8px; gap: 2px; margin-right: 8px; }
  .filter-tab-btn { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; background: transparent; color: #6B7280; transition: all 0.2s; }
  .filter-tab-btn.active { background: #FFFFFF; color: #2F6FED; box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
  .btn-export-top { height: 36px; padding: 0 14px; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; color: #374151; }
  .btn-export-top:hover { background: #F9FAFB; }

  .charts-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px; }
  .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .panel-title { font-size: 14px; font-weight: 700; margin-bottom: 20px; }
  .chart-box { height: 200px; position: relative; }

  .ana-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .ana-table th { text-align: left; color: #9CA3AF; font-size: 11px; text-transform: uppercase; padding: 12px; border-bottom: 1px solid #F1F0EA; }
  .ana-table td { padding: 16px 12px; border-bottom: 1px solid #F1F0EA; }
  .text-right { text-align: right; }

  .empty { text-align: center; padding: 30px; color: #9CA3AF; font-size: 13px; }

  @media (max-width: 1024px) {
    .kpi-row { grid-template-columns: 1fr 1fr; }
    .charts-row { grid-template-columns: 1fr; }
  }
`;

export default function CustomerAnalytics() {
  const [activeRange, setActiveRange] = useState("6M");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders for analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const months = RANGE_MONTHS[activeRange];
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  const ordersInRange = orders.filter((o) => new Date(o.createdAt) >= cutoff);

  const totalSpent = ordersInRange.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = ordersInRange.length > 0 ? totalSpent / ordersInRange.length : 0;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const spendLabels = [];
  const spendValues = [];
  const monthlyBreakdown = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthOrders = orders.filter((o) => {
      const od = new Date(o.createdAt);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    });
    const monthTotal = monthOrders.reduce((sum, o) => sum + o.total, 0);
    const itemCount = monthOrders.reduce((sum, o) => sum + o.items.length, 0);
    spendLabels.push(monthNames[d.getMonth()]);
    spendValues.push(Math.round(monthTotal));
    monthlyBreakdown.unshift({
      month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      orders: monthOrders.length,
      items: itemCount,
      spent: monthTotal
    });
  }

  // Category breakdown — derived from order item SKUs matched against categories isn't
  // available on order items directly (they only store name/sku/price/qty), so we group
  // by product name prefix isn't reliable either. Instead, show spend by top products.
  const productTotals = {};
  ordersInRange.forEach((o) => {
    o.items.forEach((item) => {
      productTotals[item.name] = (productTotals[item.name] || 0) + item.price * item.qty;
    });
  });
  const topProducts = Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const lineData = {
    labels: spendLabels,
    datasets: [{
      data: spendValues,
      borderColor: "#2F6FED",
      backgroundColor: "rgba(47, 111, 237, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }],
  };

  const doughnutData = {
    labels: topProducts.map(([name]) => name),
    datasets: [{
      data: topProducts.map(([, val]) => val),
      backgroundColor: ["#2F6FED", "#5C90F2", "#8FB4F7", "#B8D0FA", "#DCE9FD"],
      borderWidth: 0,
    }],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: "#F1F0EA" }, border: { display: false } },
      x: { grid: { display: false } },
    },
  };

  const exportData = {
    kpis: {
      [`Total spent (${activeRange})`]: `$${totalSpent.toFixed(2)}`,
      "Orders placed": ordersInRange.length,
      "Avg. order value": `$${avgOrderValue.toFixed(2)}`
    },
    charts: {
      "Spending over time": { labels: spendLabels, data: spendValues },
      "Top products": { labels: topProducts.map(([n]) => n), data: topProducts.map(([, v]) => Math.round(v)) }
    },
    savedReports: monthlyBreakdown.map((r) => ({ name: r.month, type: `${r.orders} orders`, generated: `$${r.spent.toFixed(2)}` }))
  };

  return (
    <DashboardLayout
      title="My analytics"
      subtitle="Your spending and order history at a glance."
      actions={
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="filter-tabs-group">
            {["3M", "6M", "1Y"].map((r) => (
              <button key={r} className={`filter-tab-btn ${activeRange === r ? "active" : ""}`} onClick={() => setActiveRange(r)}>
                {r}
              </button>
            ))}
          </div>
          <button className="btn-export-top" onClick={() => setIsExportOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      }
    >
      <div className="ana-container">
        <style>{STYLES}</style>

        <ExportModal
          open={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          title="Export analytics"
          subtitle="Download your spending history and category breakdown."
          includeItems={["KPI summary", "Charts & graphs", "Saved reports table"]}
          filePrefix="user-analytics"
          exportData={exportData}
        />

        {loading ? (
          <div className="empty">Loading your analytics…</div>
        ) : (
          <>
            <div className="kpi-row">
              <div className="kpi-card">
                <span className="kpi-label">Total spent ({activeRange})</span>
                <div className="kpi-value">${totalSpent.toFixed(2)}</div>
              </div>
              <div className="kpi-card success">
                <span className="kpi-label">Orders placed</span>
                <div className="kpi-value">{ordersInRange.length}</div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Avg. order value</span>
                <div className="kpi-value">${avgOrderValue.toFixed(2)}</div>
              </div>
              <div className="kpi-card warning">
                <span className="kpi-label">Total orders (all time)</span>
                <div className="kpi-value">{orders.length}</div>
              </div>
            </div>

            <div className="charts-row">
              <div className="panel">
                <h3 className="panel-title">Spending over time</h3>
                <div className="chart-box"><Line data={lineData} options={commonOptions} /></div>
              </div>
              <div className="panel">
                <h3 className="panel-title">Top products by spend</h3>
                {topProducts.length === 0 ? (
                  <div className="empty">No purchases in this range yet.</div>
                ) : (
                  <div className="chart-box">
                    <Doughnut
                      data={doughnutData}
                      options={{
                        ...commonOptions,
                        plugins: { legend: { display: true, position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } },
                        scales: { x: { display: false }, y: { display: false } }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <h3 className="panel-title">Orders by month</h3>
              {monthlyBreakdown.length === 0 ? (
                <div className="empty">No order history yet.</div>
              ) : (
                <table className="ana-table">
                  <thead>
                    <tr><th>Month</th><th>Orders</th><th>Items</th><th className="text-right">Spent</th></tr>
                  </thead>
                  <tbody>
                    {monthlyBreakdown.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{row.orders}</td>
                        <td>{row.items}</td>
                        <td className="text-right" style={{ fontWeight: 700 }}>${row.spent.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved.
        </div>
      </div>
    </DashboardLayout>
  );
}