import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import ExportModal from "../../components/ExportModal";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const STYLES = `
  .ana-container { font-family: 'Inter', sans-serif; }
  
  .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; border: 1px solid #E5E5E0; }
  .kpi-card.success { background: #EAF6EE; border-color: #D1E7DD; }
  .kpi-card.warning { background: #FAEEDA; border-color: #F8E6C2; }
  
  .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .kpi-value { font-size: 26px; font-weight: 700; color: #111827; }
  
  .kpi-card.success .kpi-label, .kpi-card.success .kpi-value { color: #1F9D55; }
  .kpi-card.warning .kpi-label, .kpi-card.warning .kpi-value { color: #854F0B; }

  .charts-row { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; margin-bottom: 20px; }
  
  .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; }
  .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; color: #111827; }

  .chart-box { position: relative; height: 220px; width: 100%; }

  .leaderboard-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .leaderboard-table th { text-align: left; padding: 10px; border-bottom: 1px solid #E5E5E0; color: #6B7280; font-size: 12px; text-transform: uppercase; }
  .leaderboard-table td { padding: 12px 10px; border-bottom: 1px solid #F1F0EA; }
  
  .btn-export { height: 38px; padding: 0 16px; background: #fff; color: #111827; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .btn-export:hover { background: #F9FAFB; }
  .btn-export svg { width: 16px; height: 16px; }

  .empty { text-align: center; padding: 40px; color: #9CA3AF; font-size: 13px; }
  .note { font-size: 12px; color: #9CA3AF; margin-top: 10px; }

  @media (max-width: 1024px) {
    .charts-row, .kpi-row { grid-template-columns: 1fr; }
  }
`;

export default function StaffAnalytics() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const statusChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const statusInstance = useRef(null);
  const trendInstance = useRef(null);

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
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const statusCounts = { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0 };
  orders.forEach((o) => { if (statusCounts[o.status] !== undefined) statusCounts[o.status]++; });

  const trendLabels = [];
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toDateString();
    const count = orders.filter((o) => new Date(o.createdAt).toDateString() === dayStr).length;
    trendLabels.push(dayNames[d.getDay()]);
    trendData.push(count);
  }

  useEffect(() => {
    if (loading) return;

    if (statusInstance.current) statusInstance.current.destroy();
    statusInstance.current = new Chart(statusChartRef.current, {
      type: 'bar',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#9CA3AF', '#E8A93A', '#2F6FED', '#1F9D55'], borderRadius: 6, maxBarThickness: 40 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: '#F1F0EA' } }, x: { grid: { display: false } } }
      }
    });

    if (trendInstance.current) trendInstance.current.destroy();
    trendInstance.current = new Chart(trendChartRef.current, {
      type: 'line',
      data: {
        labels: trendLabels,
        datasets: [{ data: trendData, borderColor: '#1F9D55', backgroundColor: 'rgba(31,157,85,0.1)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#1F9D55' }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: '#F1F0EA' } }, x: { grid: { display: false } } }
      }
    });

    return () => {
      if (statusInstance.current) statusInstance.current.destroy();
      if (trendInstance.current) trendInstance.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, orders]);

  const totalOrders = orders.length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const pendingCount = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  const deliveryRate = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0;
  const lowStockCount = products.filter((p) => p.status === "Low stock" || p.status === "Out of stock").length;

  const exportData = {
    kpis: {
      "Total orders": totalOrders,
      "Awaiting fulfillment": pendingCount,
      "Delivered": deliveredCount,
      "Delivery rate": `${deliveryRate}%`,
      "Low stock items": lowStockCount
    },
    charts: {
      "Orders placed (last 7 days)": { labels: trendLabels, data: trendData },
      "Orders by status": { labels: Object.keys(statusCounts), data: Object.values(statusCounts) }
    }
  };

  return (
    <DashboardLayout
      title="Team analytics"
      subtitle="Order fulfillment activity across the warehouse."
      actions={
        <button className="btn-export" onClick={() => setIsExportOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          <span>Export data</span>
        </button>
      }
    >
      <div className="ana-container">
        <style>{STYLES}</style>

        <ExportModal
          open={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          title="Export team analytics"
          subtitle="Download real fulfillment data as a structured file."
          includeItems={["KPI summary", "Charts & graphs"]}
          filePrefix="staff-analytics"
          exportData={exportData}
        />

        {loading ? (
          <div className="empty">Loading analytics…</div>
        ) : (
          <>
            <div className="kpi-row">
              <div className="kpi-card">
                <div className="kpi-label">Total orders</div>
                <div className="kpi-value">{totalOrders}</div>
              </div>
              <div className="kpi-card warning">
                <div className="kpi-label">Awaiting fulfillment</div>
                <div className="kpi-value">{pendingCount}</div>
              </div>
              <div className="kpi-card success">
                <div className="kpi-label">Delivered</div>
                <div className="kpi-value">{deliveredCount}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Delivery rate</div>
                <div className="kpi-value">{deliveryRate}%</div>
              </div>
            </div>

            <div className="charts-row">
              <div className="panel">
                <div className="panel-title">Orders placed (last 7 days)</div>
                <div className="chart-box"><canvas ref={trendChartRef}></canvas></div>
              </div>
              <div className="panel">
                <div className="panel-title">Orders by status</div>
                <div className="chart-box"><canvas ref={statusChartRef}></canvas></div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Note on per-staff performance</div>
              <p className="note">
                Individual pick times and a team leaderboard would need order-to-staff assignment tracking,
                which isn't part of the current system. This page shows real, warehouse-wide fulfillment data instead.
              </p>
            </div>
          </>
        )}

        <div style={{ padding: "40px 0 20px", textAlign: "center", fontSize: "12px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved.
        </div>
      </div>
    </DashboardLayout>
  );
}