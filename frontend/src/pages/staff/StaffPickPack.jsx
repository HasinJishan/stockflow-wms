import React, { useState, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const QUEUE = [
  { order: "#10432", bin: "B-14", items: 3, assigned: "Maria K.", status: "Picking" },
  { order: "#10434", bin: "C-08", items: 5, assigned: "—", status: "Unassigned" },
  { order: "#10436", bin: "D-05", items: 4, assigned: "You", status: "Packing" },
  { order: "#10437", bin: "A-11", items: 2, assigned: "James O.", status: "Picking" },
  { order: "#10438", bin: "B-03", items: 6, assigned: "—", status: "Unassigned" },
  { order: "#10439", bin: "C-14", items: 1, assigned: "Maria K.", status: "Packing" },
  { order: "#10440", bin: "A-04", items: 3, assigned: "—", status: "Unassigned" },
];

const PICK_LISTS = {
  "#10432": [
    { label: "Corrugated box (M) · Bin B-14 · Qty 3", checked: false },
  ],
  "#10436": [
    { label: "Barcode scanner X200 · Bin D-05 · Qty 1", checked: true },
    { label: "Packing tape (48mm) · Bin A-09 · Qty 2", checked: true },
    { label: "Warehouse gloves (L) · Bin C-02 · Qty 1", checked: false },
    { label: "Corrugated box (M) · Bin B-14 · Qty 1", checked: false },
  ],
  "#10437": [
    { label: "Shipping labels (roll) · Bin A-06 · Qty 2", checked: false },
  ],
};

const STATIONS = [
  { name: "Station 1", status: "In use", color: "amber" },
  { name: "Station 2", status: "Free", color: "green" },
  { name: "Station 3", status: "In use", color: "amber" },
];

const STATUS_COLOR = {
  Picking: "amber",
  Packing: "blue",
  Unassigned: "gray",
};

const FILTER_TABS = ["All", "Picking", "Packing"];

const STYLES = `
  .pp * { box-sizing: border-box; }
  .pp { font-family: 'Inter', sans-serif; }

  .pp .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
  .pp .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 16px; }
  .pp .kpi-card.warning { background: #FAEEDA; }
  .pp .kpi-card.success { background: #EAF6EE; }
  .pp .kpi-label { font-size: 12.5px; color: #6B7280; margin-bottom: 5px; }
  .pp .kpi-card.warning .kpi-label { color: #854F0B; }
  .pp .kpi-card.success .kpi-label { color: #1F9D55; }
  .pp .kpi-value { font-size: 24px; font-weight: 700; }
  .pp .kpi-card.warning .kpi-value { color: #854F0B; }
  .pp .kpi-card.success .kpi-value { color: #1F9D55; }

  .pp .pick-grid { display: grid; grid-template-columns: 1fr 380px; gap: 16px; align-items: start; }
  .pp .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 18px 20px; overflow-x: auto; }
  .pp .panel-title { font-size: 14.5px; font-weight: 600; }
  .pp .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 12px; flex-wrap: wrap; }

  .pp .filter-tabs { display: flex; gap: 6px; }
  .pp .filter-tab { padding: 7px 14px; border-radius: 8px; font-size: 12.5px; color: #6B7280; cursor: pointer; background: none; border: none; font-family: inherit; }
  .pp .filter-tab.active { background: #DCE9FD; color: #2F6FED; font-weight: 600; }

  .pp table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 460px; }
  .pp th { text-align: left; font-weight: 500; color: #6B7280; padding: 7px 8px; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .pp th.num, .pp td.num { text-align: right; }
  .pp td { padding: 10px 8px; border-bottom: 1px solid #F1F0EA; }
  .pp tr:last-child td { border-bottom: none; }
  .pp tr.queue-row { cursor: pointer; }
  .pp tr.queue-row.selected { background: #F3F7FF; }
  .pp tr.queue-row:hover { background: #FAFBFF; }

  .pp .badge { font-size: 11.5px; padding: 3px 11px; border-radius: 7px; font-weight: 600; display: inline-block; }
  .pp .badge.amber { background: #FAEEDA; color: #854F0B; }
  .pp .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .pp .badge.gray { background: #F1F0EA; color: #6B7280; }
  .pp .badge.green { background: #EAF6EE; color: #1F9D55; }

  .pp .checkbox-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid #F1F0EA; font-size: 13.5px; cursor: pointer; }
  .pp .checkbox-row:last-child { border-bottom: none; }
  .pp .checkbox { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #D1D5DB; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .pp .checkbox.checked { background: #2F6FED; border-color: #2F6FED; color: #FFFFFF; font-size: 11px; }

  .pp .btn-primary { width: 100%; height: 40px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; margin-top: 12px; margin-bottom: 16px; font-family: inherit; }
  .pp .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .pp .empty-list { font-size: 13px; color: #9CA3AF; padding: 16px 0; }

  .pp .app-footer { margin-top: 16px; padding-top: 14px; border-top: 1px solid #E5E5E0; font-size: 11.5px; color: #9CA3AF; text-align: center; }
  .pp .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .pp .pick-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 900px) {
    .pp .kpi-row { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .pp .kpi-row { grid-template-columns: 1fr; }
  }
`;

export default function StaffPickPack() {
  const [queue, setQueue] = useState(QUEUE);
  const [tab, setTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState("#10436");
  const [pickLists, setPickLists] = useState(PICK_LISTS);

  const filteredQueue = useMemo(
    () => (tab === "All" ? queue : queue.filter((q) => q.status === tab)),
    [queue, tab]
  );

  const currentList = pickLists[selectedOrder] || [];
  const allChecked = currentList.length > 0 && currentList.every((i) => i.checked);

  const toggleItem = (idx) => {
    setPickLists((prev) => ({
      ...prev,
      [selectedOrder]: prev[selectedOrder].map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const markPacked = () => {
    setQueue((prev) =>
      prev.map((q) => (q.order === selectedOrder ? { ...q, status: "Packing", assigned: "You" } : q))
    );
    alert(`${selectedOrder} marked as packed. Wire this up to your fulfillment API.`);
  };

  const awaitingPick = queue.filter((q) => q.status === "Unassigned").length + queue.filter((q) => q.status === "Picking").length;
  const inProgress = queue.filter((q) => q.status === "Picking").length;
  const readyToShip = 12; // static per design; wire to real ship-ready count later

  return (
    <DashboardLayout title="Pick & pack" subtitle="Work through today's picking and packing queue.">
      <div className="pp">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Awaiting pick</div><div className="kpi-value">{awaitingPick}</div></div>
          <div className="kpi-card warning"><div className="kpi-label">In progress</div><div className="kpi-value">{inProgress}</div></div>
          <div className="kpi-card success"><div className="kpi-label">Ready to ship</div><div className="kpi-value">{readyToShip}</div></div>
          <div className="kpi-card"><div className="kpi-label">Avg. pick time</div><div className="kpi-value">6.2 min</div></div>
        </div>

        <div className="pick-grid">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Queue</div>
              <div className="filter-tabs">
                {FILTER_TABS.map((t) => (
                  <button key={t} className={`filter-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <table>
              <thead>
                <tr><th>Order</th><th>Bin</th><th>Items</th><th>Assigned</th><th className="num">Status</th></tr>
              </thead>
              <tbody>
                {filteredQueue.map((q) => (
                  <tr
                    key={q.order}
                    className={`queue-row${selectedOrder === q.order ? " selected" : ""}`}
                    onClick={() => setSelectedOrder(q.order)}
                  >
                    <td>{q.order}</td>
                    <td>{q.bin}</td>
                    <td>{q.items}</td>
                    <td>{q.assigned}</td>
                    <td className="num"><span className={`badge ${STATUS_COLOR[q.status]}`}>{q.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panel-title" style={{ marginBottom: 12 }}>Order {selectedOrder} — pick list</div>
            {currentList.length === 0 ? (
              <div className="empty-list">No pick list available for this order yet.</div>
            ) : (
              currentList.map((item, idx) => (
                <div className="checkbox-row" key={item.label} onClick={() => toggleItem(idx)}>
                  <div className={`checkbox${item.checked ? " checked" : ""}`}>{item.checked && "✓"}</div>
                  {item.label}
                </div>
              ))
            )}
            <button className="btn-primary" disabled={!allChecked} onClick={markPacked}>
              Mark as packed
            </button>

            <div className="panel-title" style={{ marginBottom: 8 }}>Packing stations</div>
            <table>
              <thead>
                <tr><th>Station</th><th className="num">Status</th></tr>
              </thead>
              <tbody>
                {STATIONS.map((s) => (
                  <tr key={s.name}>
                    <td>{s.name}</td>
                    <td className="num"><span className={`badge ${s.color}`}>{s.status}</span></td>
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