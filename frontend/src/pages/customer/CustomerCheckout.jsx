import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function IconWrapper({ children, size = 18, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      {children}
    </svg>
  );
}

export default function CustomerCheckout() {
  const { cart, updateQty, removeItem, clearCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? 8.0 : 0;
  const tax = subtotal * 0.064;
  const total = subtotal + shipping + tax;

  const initials = (user?.name || "PR").slice(0, 2).toUpperCase();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("sf_token");
        const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/addresses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data);
        const def = res.data.find((a) => a.isDefaultDelivery) || res.data[0];
        setSelectedAddress(def || null);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    setError("");
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!selectedAddress) {
      setError("Please add a delivery address before placing your order.");
      return;
    }

    setPlacing(true);
    try {
      const token = localStorage.getItem("sf_token");
      const deliveryAddressStr = `${selectedAddress.fullName}, ${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ", " + selectedAddress.addressLine2 : ""}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.pincode}`;

      const payload = {
        items: cart.map((item) => ({
          product: item.productId,
          name: item.name,
          sku: item.sku,
          price: item.price,
          qty: item.qty
        })),
        shippingMethod: "Standard",
        deliveryAddress: deliveryAddressStr,
        paymentMethod,
        notes: ""
      };

      const res = await axios.post("https://stockflow-wms-backend.onrender.com/api/orders/my-orders", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      clearCart();
      navigate("/customer/order-success", { state: { orderNumber: res.data.order.orderNumber, total: res.data.order.total } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Log out of StockFlow WMS?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#111827", padding: "28px 40px", boxSizing: "border-box" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "#111827" }}>Cart & checkout</h1>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0 0" }}>
            Review items and confirm shipping before placing your order.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/customer/notifications")}
            aria-label="Notifications"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", position: "relative" }}
          >
            <IconWrapper stroke="#4B5563" size={18}>
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </IconWrapper>
          </button>
          <button
            onClick={handleLogout}
            title="Log out"
            style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#DCE9FD", color: "#2F6FED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: "none" }}
          >
            {initials}
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px", alignItems: "start" }}>
        <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", border: "1px solid #E5E5E0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>Your cart</h2>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{cart.length} items</span>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "#6B7280", margin: 0, fontSize: "14px" }}>Your cart is empty.</p>
              <button
                onClick={() => navigate("/customer/browse")}
                style={{ color: "#2F6FED", fontWeight: "600", background: "none", border: "none", cursor: "pointer", marginTop: "10px", fontSize: "13px" }}
              >
                ← Continue Shopping
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "12px", paddingBottom: "10px", borderBottom: "1px solid #E5E5E0", fontSize: "11px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                <span>Item</span><span>Price</span><span style={{ textAlign: "center" }}>Qty</span><span style={{ textAlign: "right" }}>Total</span><span></span>
              </div>

              {cart.map((item) => (
                <div key={item.sku} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #F1F0EA" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "44px", height: "44px", background: "#f8fafc", borderRadius: "8px", padding: "4px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #E5E5E0", flexShrink: 0 }}>
                      {item.image ? <img src={item.image} alt={item.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : null}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "13.5px", color: "#111827" }}>{item.name}</div>
                      <div style={{ fontSize: "11.5px", color: "#6B7280" }}>SKU {item.sku}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "13.5px", fontWeight: "500" }}>${item.price.toFixed(2)}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#f8fafc", padding: "2px 6px", borderRadius: "6px", border: "1px solid #E5E5E0", width: "fit-content", margin: "0 auto" }}>
                    <button onClick={() => updateQty(item.sku, -1)} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: "bold", color: "#6B7280" }}>-</button>
                    <span style={{ minWidth: "14px", textAlign: "center", fontWeight: "600", fontSize: "12px" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.sku, 1)} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: "bold", color: "#6B7280" }}>+</button>
                  </div>
                  <div style={{ fontSize: "13.5px", fontWeight: "700", textAlign: "right" }}>${(item.price * item.qty).toFixed(2)}</div>
                  <button onClick={() => removeItem(item.sku)} style={{ color: "#DC2626", border: "none", background: "none", cursor: "pointer", fontSize: "12px", fontWeight: "500" }}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #E5E5E0" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 14px 0" }}>Order summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#6B7280" }}>
              <span>Subtotal</span><span style={{ fontWeight: "600", color: "#111827" }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#6B7280" }}>
              <span>Shipping</span><span style={{ fontWeight: "600", color: "#111827" }}>${shipping.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "13px", color: "#6B7280" }}>
              <span>Tax</span><span style={{ fontWeight: "600", color: "#111827" }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #E5E5E0" }}>
              <span style={{ fontWeight: "700", fontSize: "15px" }}>Total</span><span style={{ fontWeight: "700", fontSize: "15px" }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #E5E5E0" }}>
            <h4 style={{ fontSize: "13.5px", fontWeight: "700", margin: "0 0 10px 0" }}>Shipping to</h4>
            {loading ? (
              <p style={{ fontSize: 12.5, color: "#9CA3AF" }}>Loading…</p>
            ) : selectedAddress ? (
              <p style={{ fontSize: "12.5px", color: "#4B5563", lineHeight: "1.5", margin: "0 0 12px 0" }}>
                {selectedAddress.fullName}<br />
                {selectedAddress.addressLine1}<br />
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
              </p>
            ) : (
              <p style={{ fontSize: "12.5px", color: "#A32D2D", margin: "0 0 12px 0" }}>No address saved yet.</p>
            )}
            <button
              onClick={() => navigate("/customer/addresses")}
              style={{ padding: "5px 10px", background: "#ffffff", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "11.5px", fontWeight: "600", cursor: "pointer", color: "#111827" }}
            >
              {selectedAddress ? "Change address" : "Add address"}
            </button>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #E5E5E0" }}>
            <h4 style={{ fontSize: "13.5px", fontWeight: "700", margin: "0 0 12px 0" }}>Payment method</h4>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: "100%", height: "38px", padding: "0 10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "13px", marginBottom: "16px", fontFamily: "inherit" }}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            {error && <p style={{ color: "#DC2626", fontSize: 12.5, marginBottom: 10 }}>{error}</p>}
            <button
              onClick={handlePlaceOrder}
              disabled={placing || cart.length === 0}
              style={{ width: "100%", padding: "12px", backgroundColor: placing ? "#9CA3AF" : "#2F6FED", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: placing ? "not-allowed" : "pointer", fontSize: "13.5px" }}
            >
              {placing ? "Placing order…" : "Place order"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "60px", paddingTop: "16px", borderTop: "1px solid #E5E5E0", fontSize: "11.5px", color: "#9CA3AF", textAlign: "center" }}>
        © 2026 StockFlow WMS. All rights reserved. - <a href="#privacy" style={{ color: "#9CA3AF", textDecoration: "none" }}>Privacy Policy</a> - <a href="#terms" style={{ color: "#9CA3AF", textDecoration: "none" }}>Terms of Service</a>
      </div>
    </div>
  );
}