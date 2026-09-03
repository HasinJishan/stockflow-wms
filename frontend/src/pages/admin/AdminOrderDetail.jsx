import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

// Complete Database matching all IDs in AdminOrders.jsx
const MOCK_ORDERS = {
  "10432": {
    id: "#10432",
    date: "Jul 24, 2026, 9:02 AM",
    status: "Shipped",
    stepIndex: 2,
    customer: { name: "Priya Raman", email: "priya@warehouse.com", phone: "+91 98765 43210", since: "Feb 2026", orders: 24 },
    address: "42 Race Course Road, RS Puram, Coimbatore, Tamil Nadu 641002",
    payment: { method: "Visa •••• 4242", status: "Paid", carrier: "BlueDart", tracking: "BD84920133IN" },
    items: [
      { sku: "PKG-1042", name: "Corrugated box (M)", qty: 10, price: 1.20 },
      { sku: "PKG-1098", name: "Packing tape (48mm)", qty: 2, price: 2.90 },
      { sku: "APP-3305", name: "Warehouse gloves (L)", qty: 1, price: 4.75 }
    ],
    shippingCost: 8.00,
    taxCost: 1.45
  },
  "10433": {
    id: "#10433",
    date: "Jul 24, 2026, 11:15 AM",
    status: "Processing",
    stepIndex: 1,
    customer: { name: "Daniel Osei", email: "daniel@warehouse.com", phone: "+91 98123 45678", since: "Jan 2026", orders: 12 },
    address: "121 Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004",
    payment: { method: "Mastercard •••• 8812", status: "Paid", carrier: "DHL Express", tracking: "DHL9940129IN" },
    items: [
      { sku: "ELC-0091", name: "Barcode scanner X200", qty: 1, price: 38.50 }
    ],
    shippingCost: 5.00,
    taxCost: 2.10
  },
  "10434": {
    id: "#10434",
    date: "Jul 23, 2026, 4:30 PM",
    status: "Pending",
    stepIndex: 0,
    customer: { name: "Wei Zhang", email: "wei@warehouse.com", phone: "+91 97654 32109", since: "Mar 2026", orders: 5 },
    address: "88 Trichy Road, Singanallur, Coimbatore, Tamil Nadu 641005",
    payment: { method: "UPI / NetBanking", status: "Pending", carrier: "FedEx", tracking: "PENDING_DISPATCH" },
    items: [
      { sku: "PKG-2210", name: "Pallet wrap 20\"", qty: 5, price: 8.50 },
      { sku: "PKG-1187", name: "Shipping labels (roll)", qty: 2, price: 6.10 }
    ],
    shippingCost: 12.00,
    taxCost: 3.40
  },
  "10435": {
    id: "#10435",
    date: "Jul 23, 2026, 1:15 PM",
    status: "Delivered",
    stepIndex: 3,
    customer: { name: "Amara Okafor", email: "amara@warehouse.com", phone: "+91 99887 76655", since: "Dec 2025", orders: 18 },
    address: "15 DB Road, RS Puram, Coimbatore, Tamil Nadu 641002",
    payment: { method: "Visa •••K 1102", status: "Paid", carrier: "Delhivery", tracking: "DLV99201402IN" },
    items: [
      { sku: "PKG-1187", name: "Shipping labels (roll)", qty: 2, price: 6.10 }
    ],
    shippingCost: 8.00,
    taxCost: 1.20
  },
  "10436": {
    id: "#10436",
    date: "Jul 22, 2026, 10:00 AM",
    status: "Delivered",
    stepIndex: 3,
    customer: { name: "Lucas Ferreira", email: "lucas@warehouse.com", phone: "+91 91234 56789", since: "Nov 2025", orders: 9 },
    address: "74 Palakkad Road, Ukkadam, Coimbatore, Tamil Nadu 641001",
    payment: { method: "Mastercard •••• 3341", status: "Paid", carrier: "BlueDart", tracking: "BD10049281IN" },
    items: [
      { sku: "APP-3305", name: "Warehouse gloves (L)", qty: 4, price: 4.75 }
    ],
    shippingCost: 10.00,
    taxCost: 2.80
  },
  "10437": {
    id: "#10437",
    date: "Jul 22, 2026, 3:45 PM",
    status: "Shipped",
    stepIndex: 2,
    customer: { name: "Nora Haddad", email: "nora@warehouse.com", phone: "+91 93456 78901", since: "Apr 2026", orders: 3 },
    address: "102 MTP Road, Thudiyalur, Coimbatore, Tamil Nadu 641034",
    payment: { method: "Visa •••• 9081", status: "Paid", carrier: "DTDC", tracking: "DT98412039IN" },
    items: [
      { sku: "PKG-1042", name: "Corrugated box (M)", qty: 1, price: 1.20 }
    ],
    shippingCost: 8.00,
    taxCost: 0.90
  },
  "10438": {
    id: "#10438",
    date: "Jul 21, 2026, 5:20 PM",
    status: "Pending",
    stepIndex: 0,
    customer: { name: "Kenji Sato", email: "kenji@warehouse.com", phone: "+91 94567 89012", since: "Jan 2026", orders: 15 },
    address: "55 Saravanampatti Main Rd, Coimbatore, Tamil Nadu 641035",
    payment: { method: "Cash on Delivery", status: "Pending", carrier: "Pending", tracking: "UNASSIGNED" },
    items: [
      { sku: "PKG-2210", name: "Pallet wrap 20\"", qty: 6, price: 8.50 }
    ],
    shippingCost: 15.00,
    taxCost: 4.20
  }
};

const STEPS = ["Placed", "Packed", "Shipped", "Delivered"];

const STYLES = `
  .od-container { font-family: 'Inter', sans-serif; color: #111827; max-width: 1200px; margin: 0 auto; }
  .od-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .od-card { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
  .card-title { font-size: 14px; font-weight: 600; margin: 0 0 12px 0; }
  
  .status-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 12px; margin-left: 8px; }
  .status-badge.Shipped { background: #DBEAFE; color: #1E40AF; }
  .status-badge.Delivered { background: #D1FAE5; color: #065F46; }
  .status-badge.Processing, .status-badge.Packed { background: #FEF3C7; color: #92400E; }
  .status-badge.Pending, .status-badge.Placed { background: #F3F4F6; color: #374151; }

  .od-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
  .od-table th { color: #6B7280; font-weight: 500; border-bottom: 1px solid #E5E7EB; padding: 8px; font-size: 11px; text-transform: uppercase; }
  .od-table td { padding: 8px; border-bottom: 1px solid #F3F4F6; }

  .summary-line { display: flex; justify-content: space-between; font-size: 13px; color: #4B5563; margin-bottom: 6px; }
  .summary-line.total { font-size: 15px; font-weight: 700; color: #111827; border-top: 1px solid #E5E7EB; padding-top: 8px; margin-top: 8px; }

  /* Connector line styling for timeline */
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

  @media (max-width: 900px) { .od-grid { grid-template-columns: 1fr; } }
`;

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Extract number from route parameter
  const cleanParamId = id ? id.replace(/[^0-9]/g, "") : "10432";
  
  const [order, setOrder] = useState(MOCK_ORDERS[cleanParamId] || MOCK_ORDERS["10432"]);

  useEffect(() => {
    const currentCleanId = id ? id.replace(/[^0-9]/g, "") : "10432";
    if (MOCK_ORDERS[currentCleanId]) {
      setOrder(MOCK_ORDERS[currentCleanId]);
    }
  }, [id]);

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + order.shippingCost + order.taxCost;

  const handleUpdateStatus = () => {
    const nextStep = (order.stepIndex + 1) % STEPS.length;
    setOrder({
      ...order,
      stepIndex: nextStep,
      status: STEPS[nextStep]
    });
  };

  const handleStepClick = (idx) => {
    setOrder({
      ...order,
      stepIndex: idx,
      status: STEPS[idx]
    });
  };

  const fillWidthPercent = (order.stepIndex / (STEPS.length - 1)) * 100;

  return (
    <DashboardLayout
      title={
        <span>
          Order {order.id} <span className={`status-badge ${order.status}`}>{order.status}</span>
        </span>
      }
      subtitle={`Placed ${order.date}`}
      actions={
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/orders")}>Back to orders</button>
          <button type="button" className="btn-secondary" onClick={() => window.print()}>Print invoice</button>
          <button type="button" className="btn-primary" onClick={handleUpdateStatus}>Advance status</button>
        </div>
      }
    >
      <div className="od-container">
        <style>{STYLES}</style>
        <div className="od-grid">
          
          {/* Main Content */}
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
                <div className="summary-line"><span>Tax</span><span>${order.taxCost.toFixed(2)}</span></div>
                <div className="summary-line total"><span>Total</span><span>${total.toFixed(2)}</span></div>
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
                      className={`timeline-step ${idx <= order.stepIndex ? "active" : ""}`}
                      onClick={() => handleStepClick(idx)}
                    >
                      <div className="timeline-dot">{idx <= order.stepIndex ? "✓" : idx + 1}</div>
                      <span className="timeline-label">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <div className="od-card">
              <h2 className="card-title">Customer</h2>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#DBEAFE", color: "#1E40AF", display: "flex", alignItems: "center", justify: "center", fontWeight: 600, fontSize: "12px" }}>
                  {order.customer.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>{order.customer.name}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>{order.customer.email}</div>
                </div>
              </div>
              <div className="meta-row"><span style={{ color: "#6B7280" }}>Phone</span><span>{order.customer.phone}</span></div>
              <div className="meta-row"><span style={{ color: "#6B7280" }}>Customer since</span><span>{order.customer.since}</span></div>
              <div className="meta-row"><span style={{ color: "#6B7280" }}>Total orders</span><span>{order.customer.orders}</span></div>
            </div>

            <div className="od-card">
              <h2 className="card-title">Shipping address</h2>
              <div style={{ fontSize: "13px", color: "#374151", lineHeight: 1.4 }}>
                {order.address}
              </div>
            </div>

            <div className="od-card">
              <h2 className="card-title">Payment & Carrier</h2>
              <div className="meta-row"><span style={{ color: "#6B7280" }}>Method</span><span>{order.payment.method}</span></div>
              <div className="meta-row"><span style={{ color: "#6B7280" }}>Payment status</span><span style={{ color: "#065F46", fontWeight: 600 }}>{order.payment.status}</span></div>
              <div className="meta-row"><span style={{ color: "#6B7280" }}>Carrier</span><span>{order.payment.carrier}</span></div>
              <div className="meta-row"><span style={{ color: "#6B7280" }}>Tracking ID</span><span>{order.payment.tracking}</span></div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}