import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const STATUS_COLOR = {
  Pending: "gray",
  Processing: "amber",
  Shipped: "blue",
  Delivered: "green",
};

const FILTER_TABS = ["All", "Pending", "Processing"];

const STYLES = `
  .pp * { box-sizing: border-box; }
  .pp { font-family: 'Inter', sans-serif; }

  .pp .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 16px; }
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

  .pp table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 400px; }
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

  .pp .btn-primary { width: 100%; height: 40px; background: #2F6FED; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; margin-top: 12px; font-family: inherit; }
  .pp .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .pp .empty-list { font-size: 13px; color: #9CA3AF; padding: 16px 0; }
  .pp .empty { text-align: center; padding: 30px; color: #9CA3AF; font-size: 13px; }

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
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [checkedItems, setCheckedItems] = useState({}); // local only: { itemIndex: true/false }
  const [advancing, setAdvancing] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("sf_token");
      const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const queueOrders = res.data.filter((o) => o.status === "Pending" || o.status === "Processing");
      setOrders(queueOrders);
      if (queueOrders.length > 0 && !selectedOrder) {
        setSelectedOrder(queueOrders[0].orderNumber);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredQueue = useMemo(
    () => (tab === "All" ? orders : orders.filter((o) => o.status === tab)),
    [orders, tab]
  );

  const currentOrder = orders.find((o) => o.orderNumber === selectedOrder);
  const currentItems = currentOrder?.items || [];
  const allChecked = currentItems.length > 0 && currentItems.every((_, idx) => checkedItems[idx]);

  const toggleItem = (idx) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSelectOrder = (orderNumber) => {
    setSelectedOrder(orderNumber);
    setCheckedItems({});
  };

  const advanceStatus = async () => {
    if (!currentOrder) return;
    const nextStatus = currentOrder.status === "Pending" ? "Processing" : "Shipped";
    setAdvancing(true);
    try {
      const token = localStorage.getItem("sf_token");
      await axios.patch(
        `https://stockflow-wms-backend.onrender.com/api/orders/${currentOrder.orderNumber}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCheckedItems({});
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err) {
      alert("Failed to update order status.");
    } finally {
      setAdvancing(false);
    }
  };

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;

  return (
    <DashboardLayout title="Pick & pack" subtitle="Work through today's picking and packing queue.">
      <div className="pp">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Awaiting pick</div><div className="kpi-value">{pendingCount}</div></div>
          <div className="kpi-card warning"><div className="kpi-label">In progress</div><div className="kpi-value">{processingCount}</div></div>
          <div className="kpi-card success"><div className="kpi-label">Total in queue</div><div className="kpi-value">{orders.length}</div></div>
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
            {loading ? (
              <div className="empty">Loading queue…</div>
            ) : filteredQueue.length === 0 ? (
              <div className="empty">No orders in this queue right now.</div>
            ) : (
              <table>
                <thead>
                  <tr><th>Order</th><th>Customer</th><th>Items</th><th className="num">Status</th></tr>
                </thead>
                <tbody>
                  {filteredQueue.map((o) => (
                    <tr
                      key={o._id}
                      className={`queue-row${selectedOrder === o.orderNumber ? " selected" : ""}`}
                      onClick={() => handleSelectOrder(o.orderNumber)}
                    >
                      <td>#{o.orderNumber}</td>
                      <td>{o.customer?.fullName || "Unknown"}</td>
                      <td>{o.items.length}</td>
                      <td className="num"><span className={`badge ${STATUS_COLOR[o.status]}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="panel">
            {!currentOrder ? (
              <div className="empty-list">Select an order from the queue to see its pick list.</div>
            ) : (
              <>
                <div className="panel-title" style={{ marginBottom: 12 }}>Order #{currentOrder.orderNumber} — pick list</div>
                {currentItems.length === 0 ? (
                  <div className="empty-list">No items on this order.</div>
                ) : (
                  currentItems.map((item, idx) => (
                    <div className="checkbox-row" key={idx} onClick={() => toggleItem(idx)}>
                      <div className={`checkbox${checkedItems[idx] ? " checked" : ""}`}>{checkedItems[idx] && "✓"}</div>
                      {item.name} · SKU {item.sku} · Qty {item.qty}
                    </div>
                  ))
                )}
                <button className="btn-primary" disabled={!allChecked || advancing} onClick={advanceStatus}>
                  {advancing
                    ? "Updating…"
                    : currentOrder.status === "Pending"
                    ? "Mark as picked (→ Processing)"
                    : "Mark as packed (→ Shipped)"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}