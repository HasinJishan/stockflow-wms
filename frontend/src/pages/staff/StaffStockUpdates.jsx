// src/pages/staff/StaffStockUpdates.jsx
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";

const UPDATES = [
  { product: "Pallet wrap 20\"", bin: "C-11", change: -17, by: "You", status: "Pending" },
  { product: "Corrugated box (M)", bin: "B-14", change: -10, by: "Maria K.", status: "Approved" },
  { product: "Barcode scanner X200", bin: "D-05", change: 12, by: "James O.", status: "Approved" },
  { product: "Shipping labels (roll)", bin: "A-06", change: -22, by: "You", status: "Pending" },
  { product: "Warehouse gloves (L)", bin: "C-02", change: 50, by: "Maria K.", status: "Approved" },
  { product: "Hi-vis safety vest", bin: "C-05", change: -15, by: "You", status: "Rejected" },
  { product: "Bubble wrap roll", bin: "A-12", change: 18, by: "James O.", status: "Approved" },
  { product: "Stretch film dispenser", bin: "B-07", change: -4, by: "Maria K.", status: "Pending" },
];

const BADGE_STYLE = {
  Pending: "amber",
  Approved: "green",
  Rejected: "red",
};

const STYLES = `
  .su * { box-sizing: border-box; }
  .su { font-family: 'Inter', sans-serif; }

  .su .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
  .su .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .su .kpi-card.warning { background: #FAEEDA; }
  .su .kpi-card.success { background: #EAF6EE; }
  .su .kpi-card.danger { background: #FCEBEB; }
  .su .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .su .kpi-card.warning .kpi-label { color: #854F0B; }
  .su .kpi-card.success .kpi-label { color: #1F9D55; }
  .su .kpi-card.danger .kpi-label { color: #A32D2D; }
  .su .kpi-value { font-size: 24px; font-weight: 700; }
  .su .kpi-card.warning .kpi-value { color: #854F0B; }
  .su .kpi-card.success .kpi-value { color: #1F9D55; }
  .su .kpi-card.danger .kpi-value { color: #A32D2D; }

  .su .grid { display: grid; grid-template-columns: 1fr 360px; gap: 16px; }

  .su .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .su .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 14px; }

  .su table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 460px; }
  .su th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; white-space: nowrap; }
  .su th.num, .su td.num { text-align: right; }
  .su td { padding: 12px 8px; border-bottom: 1px solid #F1F0EA; white-space: nowrap; }
  .su tr:last-child td { border-bottom: none; }
  .su .change.up { color: #1F9D55; font-weight: 600; }
  .su .change.down { color: #A32D2D; font-weight: 600; }

  .su .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; }
  .su .badge.amber { background: #FAEEDA; color: #854F0B; }
  .su .badge.green { background: #EAF6EE; color: #1F9D55; }
  .su .badge.red { background: #FCEBEB; color: #A32D2D; }

  .su .form-row { margin-bottom: 14px; }
  .su .form-row label { display: block; font-size: 12.5px; font-weight: 500; color: #374151; margin-bottom: 6px; }
  .su .form-row input, .su .form-row select { width: 100%; height: 38px; padding: 0 12px; border: 1px solid #D1D5DB; border-radius: 7px; font-family: inherit; font-size: 13.5px; background: #FFFFFF; }

  .su .submit-btn { width: 100%; height: 40px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 4px; }
  .su .submit-btn:hover { background: #255BC7; }
  .su .submit-btn:active { background: #1E4FB8; }

  .su .app-footer { margin-top: 20px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .su .app-footer a { color: #9CA3AF; text-decoration: none; }

  /* Tablet */
  @media (max-width: 1100px) {
    .su .kpi-row { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .su .grid { grid-template-columns: 1fr; }
  }

  /* Mobile */
  @media (max-width: 640px) {
    .su .kpi-row { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
    .su .kpi-card { padding: 14px; border-radius: 10px; }
    .su .kpi-label { font-size: 12px; margin-bottom: 4px; }
    .su .kpi-value { font-size: 19px; }

    .su .grid { gap: 12px; }
    .su .panel { padding: 14px; border-radius: 10px; }
    .su .panel-title { font-size: 14px; }

    .su table { min-width: 400px; font-size: 13px; }
    .su td, .su th { padding: 10px 6px; }

    .su .submit-btn { height: 44px; font-size: 14px; }
  }

  @media (max-width: 380px) {
    .su .kpi-row { grid-template-columns: 1fr; }
  }
`;

export default function StaffStockUpdates() {
  return (
    <DashboardLayout title="Stock updates" subtitle="Log stock adjustments and view recent changes.">
      <div className="su">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Updates today</div><div className="kpi-value">23</div></div>
          <div className="kpi-card warning"><div className="kpi-label">Pending review</div><div className="kpi-value">4</div></div>
          <div className="kpi-card success"><div className="kpi-label">Approved this week</div><div className="kpi-value">86</div></div>
          <div className="kpi-card danger"><div className="kpi-label">Rejected this week</div><div className="kpi-value">2</div></div>
        </div>

        <div className="grid">
          <div className="panel">
            <div className="panel-title">Recent updates</div>
            <table>
              <thead>
                <tr><th>Product</th><th>Bin</th><th>Change</th><th>By</th><th className="num">Status</th></tr>
              </thead>
              <tbody>
                {UPDATES.map((u, i) => (
                  <tr key={i}>
                    <td>{u.product}</td>
                    <td>{u.bin}</td>
                    <td className={`change ${u.change > 0 ? "up" : "down"}`}>{u.change > 0 ? `+${u.change}` : u.change}</td>
                    <td>{u.by}</td>
                    <td className="num"><span className={`badge ${BADGE_STYLE[u.status]}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panel-title">Log a new update</div>
            <div className="form-row">
              <label>Product</label>
              <select>
                <option>Pallet wrap 20"</option>
                <option>Corrugated box (M)</option>
                <option>Shipping labels (roll)</option>
              </select>
            </div>
            <div className="form-row">
              <label>Bin location</label>
              <input placeholder="e.g. C-11" />
            </div>
            <div className="form-row">
              <label>Adjustment type</label>
              <select>
                <option>Remove stock</option>
                <option>Add stock</option>
              </select>
            </div>
            <div className="form-row">
              <label>Quantity</label>
              <input placeholder="e.g. 5" />
            </div>
            <div className="form-row">
              <label>Reason</label>
              <select>
                <option>Damaged</option>
                <option>Recount correction</option>
                <option>Received shipment</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <label>Notes (optional)</label>
              <input placeholder="e.g. Torn during transit" />
            </div>
            <button className="submit-btn">Submit update</button>
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}