import React, { useState } from "react";
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const STYLES = `
  .ana-container { font-family: 'Inter', sans-serif; color: #111827; }

  /* KPI Section */
  .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 20px; border: 1px solid #E5E5E0; }
  .kpi-card.success { background: #EAF6EE; border-color: #D1E7DD; }
  .kpi-card.warning { background: #FAEEDA; border-color: #F8E6C2; }
  .kpi-label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.025em; margin-bottom: 8px; display: block; }
  .kpi-card.success .kpi-label { color: #1F9D55; }
  .kpi-card.warning .kpi-label { color: #854F0B; }
  .kpi-value { font-size: 24px; font-weight: 700; }

  /* Top Bar Actions (The Pill Design) */
  .filter-tabs-group {
    display: flex;
    background: #F1F0EA;
    padding: 4px;
    border-radius: 8px;
    gap: 2px;
    margin-right: 8px;
  }
  .filter-tab-btn {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    color: #6B7280;
    transition: all 0.2s;
  }
  .filter-tab-btn.active {
    background: #FFFFFF;
    color: #2F6FED;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  }
  .btn-export-top {
    height: 36px;
    padding: 0 14px;
    background: #FFFFFF;
    border: 1px solid #D1D5DB;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #374151;
  }
  .btn-export-top:hover { background: #F9FAFB; }

  /* Charts and Panels */
  .charts-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px; }
  .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .panel-title { font-size: 14px; font-weight: 700; margin-bottom: 20px; }
  .chart-box { height: 200px; position: relative; }

  /* Table */
  .ana-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .ana-table th { text-align: left; color: #9CA3AF; font-size: 11px; text-transform: uppercase; padding: 12px; border-bottom: 1px solid #F1F0EA; }
  .ana-table td { padding: 16px 12px; border-bottom: 1px solid #F1F0EA; }
  .text-right { text-align: right; }

  @media (max-width: 1024px) {
    .kpi-row { grid-template-columns: 1fr 1fr; }
    .charts-row { grid-template-columns: 1fr; }
  }
`;

export default function CustomerAnalytics() {
  const [activeRange, setActiveRange] = useState("6M");
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Line Chart Data
  const lineData = {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      data: [135, 210, 180, 260, 210, 290],
      borderColor: "#2F6FED",
      backgroundColor: "rgba(47, 111, 237, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }],
  };

  // Doughnut Chart Data
  const doughnutData = {
    labels: ["Electronics", "Packaging", "Apparel"],
    datasets: [{
      data: [58, 24, 18],
      backgroundColor: ["#2F6FED", "#5C90F2", "#DCE9FD"],
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

  return (
    <DashboardLayout
      title="My analytics"
      subtitle="Your spending and order history at a glance."
      actions={
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Pill Tabs */}
          <div className="filter-tabs-group">
            {["3M", "6M", "1Y"].map((r) => (
              <button
                key={r}
                className={`filter-tab-btn ${activeRange === r ? "active" : ""}`}
                onClick={() => setActiveRange(r)}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Export Button */}
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

        {/* Modal */}
        <ExportModal
          open={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          title="Export analytics"
          subtitle="Download your spending history and category breakdown."
          includeItems={["Monthly spending", "Category chart", "Order items list"]}
          filePrefix="user-analytics"
        />

        {/* KPIs */}
        <div className="kpi-row">
          <div className="kpi-card">
            <span className="kpi-label">Total spent ({activeRange})</span>
            <div className="kpi-value">$1,285</div>
          </div>
          <div className="kpi-card success">
            <span className="kpi-label">Orders placed</span>
            <div className="kpi-value">14</div>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Avg. order value</span>
            <div className="kpi-value">$91.80</div>
          </div>
          <div className="kpi-card warning">
            <span className="kpi-label">Loyalty points</span>
            <div className="kpi-value">1,240</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-row">
          <div className="panel">
            <h3 className="panel-title">Spending over time</h3>
            <div className="chart-box">
              <Line data={lineData} options={commonOptions} />
            </div>
          </div>
          <div className="panel">
            <h3 className="panel-title">Spending by category</h3>
            <div className="chart-box">
              <Doughnut 
                data={doughnutData} 
                options={{ 
                  ...commonOptions, 
                  plugins: { 
                    legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } 
                  },
                  scales: { x: { display: false }, y: { display: false } }
                }} 
              />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="panel">
          <h3 className="panel-title">Orders by month</h3>
          <table className="ana-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders</th>
                <th>Items</th>
                <th className="text-right">Spent</th>
              </tr>
            </thead>
            <tbody>
              {[
                { m: "July 2026", o: 3, i: 6, s: "$290.00" },
                { m: "June 2026", o: 2, i: 4, s: "$210.00" },
                { m: "May 2026", o: 3, i: 7, s: "$260.00" },
                { m: "April 2026", o: 2, i: 3, s: "$180.00" },
                { m: "March 2026", o: 2, i: 5, s: "$210.00" },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td>{row.m}</td>
                  <td>{row.o}</td>
                  <td>{row.i}</td>
                  <td className="text-right" style={{ fontWeight: 700 }}>{row.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved.
        </div>
      </div>
    </DashboardLayout>
  );
}