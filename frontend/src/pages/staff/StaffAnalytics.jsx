import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ExportModal from "../../components/ExportModal"; // Assuming you saved your modal code here
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const LEADERBOARD = [
  { rank: 1, name: "Maria K.", picks: 108, accuracy: "99.6%", time: "5.4 min" },
  { rank: 2, name: "Priya D.", picks: 96, accuracy: "99.4%", time: "5.8 min" },
  { rank: 3, name: "You", picks: 91, accuracy: "99.2%", time: "6.1 min", isUser: true },
  { rank: 4, name: "James O.", picks: 84, accuracy: "98.9%", time: "6.4 min" },
  { rank: 5, name: "Ravi T.", picks: 79, accuracy: "98.5%", time: "6.9 min" },
];

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
  .leaderboard-table tr.highlight { background: #F9FBFF; }
  
  .btn-export { height: 38px; padding: 0 16px; background: #fff; color: #111827; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .btn-export:hover { background: #F9FAFB; }
  .btn-export svg { width: 16px; height: 16px; }

  .range-tabs { display: flex; gap: 4px; background: #F1F0EA; padding: 4px; border-radius: 8px; }
  .range-tab { padding: 6px 12px; font-size: 12px; font-weight: 600; border-radius: 6px; cursor: pointer; border: none; background: transparent; color: #6B7280; }
  .range-tab.active { background: #fff; color: #2F6FED; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

  @media (max-width: 1024px) {
    .charts-row, .kpi-row { grid-template-columns: 1fr; }
  }
`;

export default function StaffAnalytics() {
  const [activeRange, setActiveRange] = useState("30D");
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const pickedChartRef = useRef(null);
  const timeChartRef = useRef(null);
  const pickedInstance = useRef(null);
  const timeInstance = useRef(null);

  useEffect(() => {
    // Orders Picked Chart (Bar)
    if (pickedInstance.current) pickedInstance.current.destroy();
    pickedInstance.current = new Chart(pickedChartRef.current, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Orders',
          data: [18, 22, 15, 24, 20, 12],
          backgroundColor: '#2F6FED',
          borderRadius: 6,
          maxBarThickness: 32,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { 
          y: { beginAtZero: true, grid: { color: '#F1F0EA' } },
          x: { grid: { display: false } }
        }
      }
    });

    // Pick Time Trend (Line)
    if (timeInstance.current) timeInstance.current.destroy();
    timeInstance.current = new Chart(timeChartRef.current, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [6.8, 6.5, 6.3, 6.1],
          borderColor: '#1F9D55',
          backgroundColor: 'rgba(31,157,85,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#1F9D55'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { 
          y: { grid: { color: '#F1F0EA' } },
          x: { grid: { display: false } }
        }
      }
    });

    return () => {
      if (pickedInstance.current) pickedInstance.current.destroy();
      if (timeInstance.current) timeInstance.current.destroy();
    };
  }, [activeRange]);

  return (
    <DashboardLayout 
      title="My analytics" 
      subtitle="Your picking performance and accuracy over time."
      actions={
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="range-tabs">
            {["7D", "30D", "90D"].map(range => (
              <button 
                key={range} 
                className={`range-tab ${activeRange === range ? 'active' : ''}`}
                onClick={() => setActiveRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="btn-export" onClick={() => setIsExportOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            <span>Export data</span>
          </button>
        </div>
      }
    >
      <div className="ana-container">
        <style>{STYLES}</style>

        {/* Export Modal Integration */}
        <ExportModal 
          open={isExportOpen} 
          onClose={() => setIsExportOpen(false)}
          title="Export analytics"
          subtitle="Download your performance data as a structured file."
          includeItems={["Pick performance stats", "Leaderboard standing", "Daily charts"]}
          filePrefix="my-analytics"
        />

        <div className="kpi-row">
          <div className="kpi-card">
            <div className="kpi-label">Orders picked ({activeRange})</div>
            <div className="kpi-value">412</div>
          </div>
          <div className="kpi-card success">
            <div className="kpi-label">Accuracy rate</div>
            <div className="kpi-value">99.2%</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg. pick time</div>
            <div className="kpi-value">6.1 min</div>
          </div>
          <div className="kpi-card warning">
            <div className="kpi-label">Team rank</div>
            <div className="kpi-value">#3 of 12</div>
          </div>
        </div>

        <div className="charts-row">
          <div className="panel">
            <div className="panel-title">Orders picked per day</div>
            <div className="chart-box">
              <canvas ref={pickedChartRef}></canvas>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">Avg. pick time trend (min)</div>
            <div className="chart-box">
              <canvas ref={timeChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Zone B team leaderboard (this week)</div>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Staff</th>
                <th>Orders picked</th>
                <th>Accuracy</th>
                <th style={{ textAlign: 'right' }}>Avg time</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((item) => (
                <tr key={item.rank} className={item.isUser ? 'highlight' : ''}>
                  <td style={{ fontWeight: 600 }}>{item.rank}</td>
                  <td style={{ fontWeight: item.isUser ? 700 : 400 }}>{item.name}</td>
                  <td>{item.picks}</td>
                  <td>{item.accuracy}</td>
                  <td style={{ textAlign: 'right' }}>{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "40px 0 20px", textAlign: "center", fontSize: "12px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
        </div>
      </div>
    </DashboardLayout>
  );
}