import React from "react";
import DashboardLayout from "../../components/DashboardLayout";

const PICK_QUEUE = [
  { order: "#10432", bin: "B-14", items: 3, assigned: "Maria K.", status: "Picking" },
  { order: "#10433", bin: "A-02", items: 1, assigned: "You", status: "Packed" },
  { order: "#10434", bin: "C-08", items: 5, assigned: "—", status: "Pending" },
  { order: "#10435", bin: "B-21", items: 2, assigned: "James O.", status: "Shipped" },
  { order: "#10436", bin: "D-05", items: 4, assigned: "You", status: "Picking" },
];

const RESTOCK_ALERTS = [
  { product: "Pallet wrap 20\"", bin: "C-11", left: "3 left", level: "red" },
  { product: "Shipping labels", bin: "A-06", left: "8 left", level: "amber" },
  { product: "Packing tape", bin: "A-09", left: "18 left", level: "amber" },
];

const ZONE_ACTIVITY = [
  ["Maria K. started picking #10432", "12 min ago"],
  ["Order #10435 shipped", "40 min ago"],
  ["James O. flagged low stock, bin C-11", "1 hr ago"],
];

const BADGE_STYLE = {
  Picking: "amber",
  Packed: "blue",
  Pending: "gray",
  Shipped: "green",
};

const STYLES = `
  .sd * { box-sizing: border-box; }
  .sd { font-family: 'Inter', sans-serif; }

  .sd .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
  .sd .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .sd .kpi-card.warning { background: #FAEEDA; }
  .sd .kpi-card.success { background: #EAF6EE; }
  .sd .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .sd .kpi-card.warning .kpi-label { color: #854F0B; }
  .sd .kpi-card.success .kpi-label { color: #1F9D55; }
  .sd .kpi-value { font-size: 26px; font-weight: 700; }
  .sd .kpi-card.warning .kpi-value { color: #854F0B; }
  .sd .kpi-card.success .kpi-value { color: #1F9D55; }

  .sd .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 16px; overflow-x: auto; }
  .sd .panel:last-child { margin-bottom: 0; }
  .sd .panel-title { font-size: 15px; font-weight: 600; }
  .sd .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }

  .sd table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 480px; }
  .sd th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .sd th.num, .sd td.num { text-align: right; }
  .sd td { padding: 12px 8px; border-bottom: 1px solid #F1F0EA; }
  .sd tr:last-child td { border-bottom: none; }

  .sd .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; border: none; cursor: pointer; font-family: inherit; }
  .sd .badge.amber { background: #FAEEDA; color: #854F0B; }
  .sd .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .sd .badge.gray { background: #F1F0EA; color: #6B7280; }
  .sd .badge.green { background: #EAF6EE; color: #1F9D55; }
  .sd .badge.red { background: #FCEBEB; color: #A32D2D; }

  .sd .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .sd .app-footer { margin-top: 8px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .sd .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .sd .kpi-row { grid-template-columns: repeat(2, 1fr); }
    .sd .dash-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .sd .kpi-row { grid-template-columns: 1fr; }
  }
`;

export default function StaffDashboard() {
  return (
    <DashboardLayout title="Today's tasks" subtitle="Shift: 8:00 AM – 4:00 PM · Zone B">
      <div className="sd">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Orders to fulfill</div><div className="kpi-value">18</div></div>
          <div className="kpi-card warning"><div className="kpi-label">Items to restock</div><div className="kpi-value">7</div></div>
          <div className="kpi-card"><div className="kpi-label">Shipped today</div><div className="kpi-value">42</div></div>
          <div className="kpi-card success"><div className="kpi-label">On-time rate</div><div className="kpi-value">97%</div></div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Pick queue</div>
            <button className="badge blue" onClick={() => alert("Wire this up to the full pick queue")}>View all</button>
          </div>
          <table>
            <thead>
              <tr><th>Order</th><th>Bin</th><th>Items</th><th>Assigned</th><th className="num">Status</th></tr>
            </thead>
            <tbody>
              {PICK_QUEUE.map((r) => (
                <tr key={r.order}>
                  <td>{r.order}</td>
                  <td>{r.bin}</td>
                  <td>{r.items}</td>
                  <td>{r.assigned}</td>
                  <td className="num"><span className={`badge ${BADGE_STYLE[r.status]}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dash-grid">
          <div className="panel">
            <div className="panel-title" style={{ marginBottom: 14 }}>Restock alerts</div>
            <table>
              <thead>
                <tr><th>Product</th><th>Bin</th><th className="num">Stock left</th></tr>
              </thead>
              <tbody>
                {RESTOCK_ALERTS.map((r) => (
                  <tr key={r.product}>
                    <td>{r.product}</td>
                    <td>{r.bin}</td>
                    <td className="num"><span className={`badge ${r.level}`}>{r.left}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panel-title" style={{ marginBottom: 14 }}>Zone B activity</div>
            <table>
              <thead>
                <tr><th>Event</th><th className="num">Time</th></tr>
              </thead>
              <tbody>
                {ZONE_ACTIVITY.map(([event, time]) => (
                  <tr key={event}>
                    <td>{event}</td>
                    <td className="num">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}