import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CustomerOrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, total } = location.state || {};

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E5E5E0", padding: "48px", maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EAF6EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 8px" }}>Order placed successfully!</h1>
        {orderNumber ? (
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 4px" }}>
            Order <strong style={{ color: "#111827" }}>#{orderNumber}</strong> has been confirmed.
          </p>
        ) : (
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 4px" }}>Your order has been confirmed.</p>
        )}
        {total !== undefined && (
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>
            Total charged: <strong style={{ color: "#111827" }}>${total.toFixed(2)}</strong>
          </p>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            onClick={() => navigate("/customer/track-shipment")}
            style={{ flex: 1, padding: "12px", background: "#2F6FED", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13.5 }}
          >
            Track order
          </button>
          <button
            onClick={() => navigate("/customer/browse")}
            style={{ flex: 1, padding: "12px", background: "#fff", color: "#111827", border: "1px solid #D1D5DB", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13.5 }}
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}