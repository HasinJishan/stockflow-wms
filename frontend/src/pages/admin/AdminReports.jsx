import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import DashboardLayout from "../../components/DashboardLayout";
import ExportModal from "../../components/ExportModal";

const SAVED_REPORTS = [
  { name: "Q2 stock turnover summary", type: "Inventory", generated: "Jul 1, 2026" },
  { name: "June order fulfillment audit", type: "Orders", generated: "Jul 3, 2026" },
  { name: "Low stock frequency report", type: "Inventory", generated: "Jul 15, 2026" },
  { name: "Warehouse comparison Q2", type: "Operations", generated: "Jul 20, 2026" },
];

const STYLES = `
  .rep * { box-sizing: border-box; }
  .rep { font-family: 'Inter', sans-serif; }

  .rep .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
  .rep .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .rep .kpi-card.warning { background: #FAEEDA; }
  .rep .kpi-card.success { background: #EAF6EE; }
  .rep .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .rep .kpi-card.warning .kpi-label { color: #854F0B; }
  .rep .kpi-card.success .kpi-label { color: #1F9D55; }
  .rep .kpi-value { font-size: 26px; font-weight: 700; }
  .rep .kpi-card.warning .kpi-value { color: #854F0B; }
  .rep .kpi-card.success .kpi-value { color: #1F9D55; }

  .rep .panels-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .rep .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; overflow-x: auto; }
  .rep .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 14px; }
  .rep .chart-box { position: relative; height: 220px; }
  .rep .chart-box.short { height: 200px; }

  .rep table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 520px; }
  .rep th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .rep td { padding: 12px 10px; border-bottom: 1px solid #F1F0EA; }
  .rep tr:last-child td { border-bottom: none; }

  .rep .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; }
  .rep .badge.blue { background: #DCE9FD; color: #2F6FED; cursor: pointer; border: none; font-family: inherit; }

  .rep .app-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .rep .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .rep .kpi-row { grid-template-columns: repeat(2, 1fr); }
    .rep .panels-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .rep .kpi-row { grid-template-columns: 1fr; }
  }
`;

const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/**
 * Small hook: creates a Chart.js chart on the given canvas ref and destroys it
 * on unmount / re-render, so charts don't duplicate under React StrictMode.
 */
function useChart(canvasRef, config) {
  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, config);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default function AdminReports() {
  const fulfillRef = useRef(null);
  const categoryRef = useRef(null);
  const warehouseCompareRef = useRef(null);
  const fulfillTimeRef = useRef(null);
  const [exportOpen, setExportOpen] = useState(false);

  useChart(fulfillRef, {
    type: "line",
    data: {
      labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [{ data: [720, 810, 790, 860, 910, 960], borderColor: "#2F6FED", backgroundColor: "rgba(47,111,237,0.1)", fill: true, tension: 0.35 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { grid: { color: "#EEEDE7" } }, x: { grid: { display: false } } },
    },
  });

  useChart(categoryRef, {
    type: "doughnut",
    data: {
      labels: ["Packaging", "Electronics", "Apparel", "Other"],
      datasets: [{ data: [38, 24, 22, 16], backgroundColor: ["#2F6FED", "#5C90F2", "#A9CBFA", "#DCE9FD"] }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } },
    },
  });

  useChart(warehouseCompareRef, {
    type: "bar",
    data: {
      labels: ["Coimbatore", "Chennai", "Bengaluru"],
      datasets: [{ data: [612, 318, 64], backgroundColor: "#2F6FED", borderRadius: 4, maxBarThickness: 36 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: "#EEEDE7" } }, x: { grid: { display: false } } },
    },
  });

  useChart(fulfillTimeRef, {
    type: "line",
    data: {
      labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [{ data: [5.2, 4.9, 4.6, 4.5, 4.3, 4.2], borderColor: "#E8A93A", backgroundColor: "rgba(232,169,58,0.12)", fill: true, tension: 0.35 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { grid: { color: "#EEEDE7" } }, x: { grid: { display: false } } },
    },
  });

  return (
    <DashboardLayout
      title="Reports"
      subtitle="Key performance indicators for warehouse efficiency."
      actions={
        <button className="topbar-btn-outline" onClick={() => setExportOpen(true)}>
          <ExportIcon /> <span className="btn-label">Export report</span>
        </button>
      }
    >
      <div className="rep">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Stock turnover rate</div><div className="kpi-value">6.4x</div></div>
          <div className="kpi-card"><div className="kpi-label">Avg. fulfillment time</div><div className="kpi-value">4.2 hrs</div></div>
          <div className="kpi-card success"><div className="kpi-label">Order accuracy</div><div className="kpi-value">98.7%</div></div>
          <div className="kpi-card warning"><div className="kpi-label">Stockout incidents</div><div className="kpi-value">7</div></div>
        </div>

        <div className="panels-row">
          <div className="panel">
            <div className="panel-title">Orders fulfilled (last 6 months)</div>
            <div className="chart-box"><canvas ref={fulfillRef} /></div>
          </div>
          <div className="panel">
            <div className="panel-title">Inventory by category</div>
            <div className="chart-box"><canvas ref={categoryRef} /></div>
          </div>
        </div>

        <div className="panels-row">
          <div className="panel">
            <div className="panel-title">Warehouse comparison &mdash; orders fulfilled</div>
            <div className="chart-box short"><canvas ref={warehouseCompareRef} /></div>
          </div>
          <div className="panel">
            <div className="panel-title">Fulfillment time trend (days)</div>
            <div className="chart-box short"><canvas ref={fulfillTimeRef} /></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Saved reports</div>
          <table>
            <thead>
              <tr><th>Report</th><th>Type</th><th>Generated</th><th></th></tr>
            </thead>
            <tbody>
              {SAVED_REPORTS.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td>{r.type}</td>
                  <td>{r.generated}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="badge blue" onClick={() => alert(`Wire this up to download "${r.name}"`)}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export report"
        filePrefix="stockflow-report"
        includeItems={["KPI summary", "Charts & graphs", "Saved reports table"]}
      />
    </DashboardLayout>
  );
}