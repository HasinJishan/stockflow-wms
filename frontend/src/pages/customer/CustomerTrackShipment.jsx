import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];
const STEP_LABELS = ["Order placed", "Processing", "Shipped", "Delivered"];

const BADGE_MAP = { Pending: "gray", Processing: "amber", Shipped: "blue", Delivered: "green" };

const STYLES = `
  .track * { box-sizing: border-box; }
  .track .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
  .track .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .track .kpi-card.warning { background: #FAEEDA; }
  .track .kpi-card.success { background: #EAF6EE; }
  .track .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .track .kpi-value { font-size: 26px; font-weight: 700; }
  .track .kpi-card.warning .kpi-value { color: #854F0B; }
  .track .kpi-card.success .kpi-value { color: #1F9D55; }

  .track .track-grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
  .track .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .track .panel-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }

  .track .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; }
  .track .badge.blue { background: #DCE9FD; color: #2F6FED; }
  .track .badge.amber { background: #FAEEDA; color: #854F0B; }
  .track .badge.green { background: #EAF6EE; color: #1F9D55; }
  .track .badge.gray { background: #F1F0EA; color: #6B7280; }

  .track .track-timeline { display: flex; align-items: flex-start; padding: 10px 0; margin-top: 10px; }
  .track .track-step { flex: 1; text-align: center; position: relative; }
  .track .track-dot { width: 28px; height: 28px; border-radius: 50%; background: #2F6FED; color: #FFFFFF; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 14px; position: relative; z-index: 1; }
  .track .track-dot.pending { background: #E5E5E0; color: #9CA3AF; }
  .track .track-line { position: absolute; top: 14px; left: -50%; width: 100%; height: 2px; background: #2F6FED; z-index: 0; }
  .track .track-line.pending { background: #E5E5E0; }
  .track .track-step:first-child .track-line { display: none; }
  .track .track-label { font-size: 12px; font-weight: 600; }
  .track .track-time { font-size: 11px; color: #9CA3AF; margin-top: 4px; }

  .track table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .track th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px; font-size: 12px; border-bottom: 1px solid #E5E5E0; text-transform: uppercase; }
  .track td { padding: 12px 8px; border-bottom: 1px solid #F1F0EA; cursor: pointer; }
  .track tr:hover td { background: #FAFBFF; }

  .track .empty { text-align: center; padding: 30px; color: #9CA3AF; font-size: 13px; }

  @media (max-width: 1024px) {
    .track .track-grid { grid-template-columns: 1fr; }
    .track .track-timeline { flex-direction: column; text-align: left; padding-left: 20px; }
    .track .track-line { width: 2px; height: 100%; left: 13px; top: 28px; }
    .track .track-step { padding-bottom: 20px; display: flex; gap: 15px; }
    .track .track-dot { margin: 0; }
  }
`;

export default function CustomerTrackShipment() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
        const active = res.data.find((o) => o.status !== "Delivered") || res.data[0];
        setSelectedOrder(active || null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const activeShipments = orders.filter((o) => o.status !== "Delivered").length;
  const outForDelivery = orders.filter((o) => o.status === "Shipped").length;
  const thisMonth = new Date().getMonth();
  const deliveredThisMonth = orders.filter(
    (o) => o.status === "Delivered" && new Date(o.updatedAt).getMonth() === thisMonth
  ).length;

  const stepIndex = selectedOrder ? STEPS.indexOf(selectedOrder.status) : -1;

  return (
    <DashboardLayout title="Track shipment" subtitle="Follow your orders from placement to delivery.">
      <div className="track">
        <style>{STYLES}</style>

        {loading ? (
          <div className="empty">Loading shipments…</div>
        ) : (
          <>
            <div className="kpi-row">
              <div className="kpi-card"><div className="kpi-label">Active shipments</div><div className="kpi-value">{activeShipments}</div></div>
              <div className="kpi-card warning"><div className="kpi-label">Shipped / in transit</div><div className="kpi-value">{outForDelivery}</div></div>
              <div className="kpi-card success"><div className="kpi-label">Delivered this month</div><div className="kpi-value">{deliveredThisMonth}</div></div>
            </div>

            <div className="track-grid">
              <div>
                <div className="panel">
                  {!selectedOrder ? (
                    <div className="empty">You have no orders to track yet.</div>
                  ) : (
                    <>
                      <div className="panel-title">
                        Order #{selectedOrder.orderNumber}
                        <span className={`badge ${BADGE_MAP[selectedOrder.status]}`}>{selectedOrder.status}</span>
                      </div>
                      <div className="track-timeline">
                        {STEP_LABELS.map((label, idx) => (
                          <div className="track-step" key={label}>
                            {idx > 0 && <div className={`track-line${idx > stepIndex ? " pending" : ""}`}></div>}
                            <div className={`track-dot${idx > stepIndex ? " pending" : ""}`}>
                              {idx <= stepIndex ? "✓" : idx + 1}
                            </div>
                            <div>
                              <div className="track-label" style={idx > stepIndex ? { color: "#9CA3AF" } : {}}>{label}</div>
                              <div className="track-time">
                                {idx === 0
                                  ? new Date(selectedOrder.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                                  : idx === stepIndex
                                  ? new Date(selectedOrder.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                                  : idx < stepIndex
                                  ? "Completed"
                                  : "Pending"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="panel">
                  <div className="panel-title">All orders</div>
                  {orders.length === 0 ? (
                    <div className="empty">No orders yet.</div>
                  ) : (
                    <table>
                      <thead>
                        <tr><th>Order</th><th>Items</th><th>Placed</th><th style={{ textAlign: "right" }}>Status</th></tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o._id} onClick={() => setSelectedOrder(o)}>
                            <td>#{o.orderNumber}</td>
                            <td>{o.items.length}</td>
                            <td>{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                            <td style={{ textAlign: "right" }}><span className={`badge ${BADGE_MAP[o.status]}`}>{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div>
                <div className="panel" style={{ background: "#2F6FED", color: "#fff", border: "none" }}>
                  <div className="panel-title" style={{ color: "#fff" }}>Need help?</div>
                  <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 15 }}>
                    Issue with a delivery, or a status that isn't updating?
                  </p>
                  <button
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "#fff", color: "#2F6FED", cursor: "pointer", fontWeight: 700 }}
                    onClick={() => navigate("/customer/help")}
                  >
                    Contact support
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
          &copy; 2026 StockFlow WMS. All rights reserved. · Privacy Policy · Terms of Service
        </div>
      </div>
    </DashboardLayout>
  );
}