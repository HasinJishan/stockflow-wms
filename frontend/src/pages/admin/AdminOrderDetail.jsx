import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

const STYLES = `
  .od-container { font-family: 'Inter', sans-serif; color: #111827; max-width: 1200px; margin: 0 auto; }
  .od-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .od-card { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
  .card-title { font-size: 14px; font-weight: 600; margin: 0 0 12px 0; }
  
  .status-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 12px; margin-left: 8px; }
  .status-badge.Shipped { background: #DBEAFE; color: #1E40AF; }
  .status-badge.Delivered { background: #D1FAE5; color: #065F46; }
  .status-badge.Processing { background: #FEF3C7; color: #92400E; }
  .status-badge.Pending { background: #F3F4F6; color: #374151; }

  .od-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
  .od-table th { color: #6B7280; font-weight: 500; border-bottom: 1px solid #E5E7EB; padding: 8px; font-size: 11px; text-transform: uppercase; }
  .od-table td { padding: 8px; border-bottom: 1px solid #F3F4F6; }

  .summary-line { display: flex; justify-content: space-between; font-size: 13px; color: #4B5563; margin-bottom: 6px; }
  .summary-line.total { font-size: 15px; font-weight: 700; color: #111827; border-top: 1px solid #E5E7EB; padding-top: 8px; margin-top: 8px; }

  .timeline-wrapper { position: relative; padding: 12px 20px; }
  .timeline-line-bg { position: absolute; top: 25px; left: 40px; right: 40px; height: 3px; background: #E5E7EB; z-index: 1; }
  .timeline-line-fill { position: absolute; top: 25px; left: 40px; height: 3px; background: #2563EB; z-index: 2; transition: width 0.3s ease; }
  
  .timeline { display: flex; justify-content: space-between; position: relative; z-index: 3; }
  .timeline-step { display: flex; flex-direction: column; align-items: center; cursor: pointer; background: #FFF; padding: 0 4px; }
  .timeline-dot { width: 26px; height: 26px; border-radius: 50%; background: #E5E7EB; color: #6B7280; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; margin-bottom: 4px; }
  .timeline-step.active .timeline-dot { background: #2563EB; color: #FFFFFF; }
  .timeline-label { font-size: 12px; font-weight: 600; color: #374151; }

  .meta-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
  .btn-secondary { background: #FFFFFF; border: 1px solid #D1D5DB; color: #374151; padding: 6px 14px; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 13px; }
  .btn-primary { background: #2563EB; border: none; color: #FFFFFF; padding: 6px 14px; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 13px; }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 900px) { .od-grid { grid-template-columns: 1fr; } }
`;

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('sf_token');
      const res = await axios.get(`https://stockflow-wms-backend.onrender.com/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      alert("Order not found.");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('sf_token');
      const res = await axios.patch(
        `https://stockflow-wms-backend.onrender.com/api/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(res.data.order);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAdvanceStatus = () => {
    const currentIndex = STEPS.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % STEPS.length;
    handleUpdateStatus(STEPS[nextIndex]);
  };

  if (loading) {
    return (
      <DashboardLayout title="Order" subtitle="Loading…">
        <div style={{ padding: 40, fontFamily: "Inter, sans-serif" }}>Loading order…</div>
      </DashboardLayout>
    );
  }
  if (!order) return null;

  const stepIndex = STEPS.indexOf(order.status);
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const fillWidthPercent = (stepIndex / (STEPS.length - 1)) * 100;

  return (
    <DashboardLayout
      title={
        <span>
          Order #{order.orderNumber} <span className={`status-badge ${order.status}`}>{order.status}</span>
        </span>
      }
      subtitle={`Placed ${new Date(order.createdAt).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`}
      actions={
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/orders")}>Back to orders</button>
          <button type="button" className="btn-secondary" onClick={() => window.print()}>Print invoice</button>
          <button type="button" className="btn-primary" onClick={handleAdvanceStatus} disabled={updating}>
            {updating ? "Updating…" : "Advance status"}
          </button>
        </div>
      }
    >
      <div className="od-container">
        <style>{STYLES}</style>
        <div className="od-grid">

          <div>
            <div className="od-card">
              <h2 className="card-title">Order items</h2>
              <table className="od-table">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>SKU</th>
                    <th>QTY</th>
                    <th>PRICE</th>
                    <th style={{ textAlign: "right" }}>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td><strong>{item.name}</strong></td>
                      <td style={{ color: "#6B7280" }}>{item.sku}</td>
                      <td>{item.qty}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td style={{ textAlign: "right" }}>${(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #E5E7EB" }}>
                <div className="summary-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="summary-line"><span>Shipping</span><span>${order.shippingCost.toFixed(2)}</span></div>
                <div className="summary-line"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                <div className="summary-line total"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
              </div>
            </div>

            <div className="od-card">
              <h2 className="card-title">Order timeline</h2>
              <div className="timeline-wrapper">
                <div className="timeline-line-bg"></div>
                <div className="timeline-line-fill" style={{ width: `calc(${fillWidthPercent}% - 60px * ${fillWidthPercent / 100})` }}></div>
                <div className="timeline">
                  {STEPS.map((step, idx) => (
                    <div
                      key={step}
                      className={`timeline-step ${idx <= stepIndex ? "active" : ""}`}
                      onClick={() => handleUpdateStatus(step)}
                    >
                      <div className="timeline-dot">{idx <= stepIndex ? "✓" : idx + 1}</div>
                      <span className="timeline-label">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="od-card">
              <h2 className="card-title">Customer</h2>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#DBEAFE", color: "#1E40AF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "12px" }}>
                  {order.customer?.fullName?.split(" ").map(n => n[0]).join("") || "?"}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>{order.customer?.fullName || "Unknown"}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>{order.customer?.email}</div>
                </div>
              </div>
            </div>

            <div className="od-card">
              <h2 className="card-title">Shipping address</h2>
              <div style={{ fontSize: "13px", color: "#374151", lineHeight: 1.4 }}>
                {order.deliveryAddress}
              </div>
            </div>

            <div className="od-card">
              <h2 className="card-title">Payment</h2>
              <div className="meta-row"><span style={{ color: "#6B7280" }}>Method</span><span>{order.paymentMethod}</span></div>
              <div className="meta-row"><span style={{ color: "#6B7280" }}>Payment status</span><span style={{ color: "#065F46", fontWeight: 600 }}>{order.paymentStatus}</span></div>
              {order.notes && (
                <div className="meta-row"><span style={{ color: "#6B7280" }}>Notes</span><span>{order.notes}</span></div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}