import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import DashboardLayout from "../../components/DashboardLayout";
import ExportModal from "../../components/ExportModal";

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

  .rep .empty { text-align: center; padding: 20px; color: #9CA3AF; font-size: 13px; }

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

function useChart(canvasRef, config, deps) {
  useEffect(() => {
    if (!canvasRef.current || !config) return;
    const chart = new Chart(canvasRef.current, config);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function AdminReports() {
  const fulfillRef = useRef(null);
  const categoryRef = useRef(null);
  const warehouseCompareRef = useRef(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('sf_token');
        const res = await axios.get('https://stockflow-wms-backend.onrender.com/api/reports/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useChart(
    fulfillRef,
    data && {
      type: "line",
      data: {
        labels: data.fulfillmentChart.labels,
        datasets: [{ data: data.fulfillmentChart.data, borderColor: "#2F6FED", backgroundColor: "rgba(47,111,237,0.1)", fill: true, tension: 0.35 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { grid: { color: "#EEEDE7" } }, x: { grid: { display: false } } },
      },
    },
    [data]
  );

  useChart(
    categoryRef,
    data && {
      type: "doughnut",
      data: {
        labels: data.categoryChart.labels,
        datasets: [{ data: data.categoryChart.data, backgroundColor: ["#2F6FED", "#5C90F2", "#A9CBFA", "#DCE9FD", "#B8C4D9"] }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } },
      },
    },
    [data]
  );

  useChart(
    warehouseCompareRef,
    data && {
      type: "bar",
      data: {
        labels: data.warehouseChart.labels,
        datasets: [{ data: data.warehouseChart.data, backgroundColor: "#2F6FED", borderRadius: 4, maxBarThickness: 36 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: "#EEEDE7" } }, x: { grid: { display: false } } },
      },
    },
    [data]
  );

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

        {loading ? (
          <div className="empty">Loading reports…</div>
        ) : !data ? (
          <div className="empty">Could not load report data.</div>
        ) : (
          <>
            <div className="kpi-row">
              <div className="kpi-card"><div className="kpi-label">Total orders</div><div className="kpi-value">{data.kpis.totalOrders}</div></div>
              <div className="kpi-card"><div className="kpi-label">Delivered orders</div><div className="kpi-value">{data.kpis.deliveredOrders}</div></div>
              <div className="kpi-card success"><div className="kpi-label">Order completion rate</div><div className="kpi-value">{data.kpis.orderAccuracy}</div></div>
              <div className="kpi-card warning"><div className="kpi-label">Stockout products</div><div className="kpi-value">{data.kpis.stockoutCount}</div></div>
            </div>

            <div className="panels-row">
              <div className="panel">
                <div className="panel-title">Orders placed (last 6 months)</div>
                <div className="chart-box"><canvas ref={fulfillRef} /></div>
              </div>
              <div className="panel">
                <div className="panel-title">Inventory by category</div>
                <div className="chart-box"><canvas ref={categoryRef} /></div>
              </div>
            </div>

            <div className="panels-row">
              <div className="panel">
                <div className="panel-title">Warehouse stock comparison</div>
                <div className="chart-box short"><canvas ref={warehouseCompareRef} /></div>
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
  title="Export report"
  filePrefix="stockflow-report"
  includeItems={["KPI summary", "Charts & graphs"]}
  exportData={
    data && {
      kpis: data.kpis,
      charts: {
        "Orders placed (last 6 months)": data.fulfillmentChart,
        "Inventory by category": data.categoryChart,
        "Warehouse stock comparison": data.warehouseChart
      }
    }
  }
/>
    </DashboardLayout>
  );
}