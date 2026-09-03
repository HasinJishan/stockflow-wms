import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const AVAILABLE_PRODUCTS = [
  { id: "p1", name: "Corrugated box (M)", price: 1.20, sku: "PKG-1042" },
  { id: "p2", name: "Packing tape (48mm)", price: 2.90, sku: "PKG-1098" },
  { id: "p3", name: "Warehouse gloves (L)", price: 4.75, sku: "APP-3305" },
  { id: "p4", name: "Pallet wrap 20\"", price: 8.50, sku: "PKG-2210" },
  { id: "p5", name: "Shipping labels (roll)", price: 6.10, sku: "PKG-1187" },
];

const CUSTOMERS = [
  { id: "c1", name: "Priya Raman", email: "priya@warehouse.com", orders: 24, phone: "+91 98765 43210", address: "Home — 42 Race Course Road, RS Puram, Coimbatore" },
  { id: "c2", name: "Daniel Osei", email: "daniel@warehouse.com", orders: 12, phone: "+91 98123 45678", address: "Office — 121 Avinashi Road, Peelamedu, Coimbatore" },
  { id: "c3", name: "Wei Zhang", email: "wei@warehouse.com", orders: 5, phone: "+91 97654 32109", address: "88 Trichy Road, Singanallur, Coimbatore" }
];

const STYLES = `
  .co-container { font-family: 'Inter', sans-serif; color: #111827; max-width: 1200px; margin: 0 auto; }
  .co-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .co-card { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
  .card-title { font-size: 14px; font-weight: 600; margin: 0 0 12px 0; }
  .form-group { margin-bottom: 12px; position: relative; }
  label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 4px; }
  input, select, textarea { width: 100%; padding: 8px 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 13px; outline: none; box-sizing: border-box; }
  input:focus, select:focus, textarea:focus { border-color: #2563EB; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1); }
  
  .customer-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #FFF; border: 1px solid #D1D5DB; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 10; max-height: 180px; overflow-y: auto; }
  .customer-option { padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #F3F4F6; font-size: 13px; }
  .customer-option:hover { background: #EFF6FF; }

  .customer-selected-card { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
  .avatar-badge { width: 28px; height: 28px; border-radius: 50%; background: #DBEAFE; color: #1E40AF; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 11px; }
  
  .item-table-header { display: grid; grid-template-columns: 2fr 1fr 1fr 32px; gap: 8px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; margin-bottom: 6px; }
  .item-row { display: grid; grid-template-columns: 2fr 1fr 1fr 32px; gap: 8px; align-items: center; margin-bottom: 8px; }
  
  .btn-remove { background: none; border: 1px solid #FCA5A5; color: #DC2626; border-radius: 6px; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .btn-add-item { background: none; border: none; color: #2563EB; font-size: 13px; font-weight: 600; cursor: pointer; padding: 4px 0; }
  
  .summary-row { display: flex; justify-content: space-between; font-size: 13px; color: #4B5563; margin-bottom: 6px; }
  .summary-row.total { font-size: 15px; font-weight: 700; color: #111827; border-top: 1px solid #E5E7EB; padding-top: 8px; margin-bottom: 0; }
  
  .status-toggle { display: flex; background: #F3F4F6; border-radius: 6px; padding: 2px; gap: 4px; }
  .status-btn { flex: 1; padding: 6px; border: none; background: transparent; border-radius: 4px; font-size: 12px; font-weight: 500; color: #4B5563; cursor: pointer; }
  .status-btn.active { background: #2563EB; color: #FFFFFF; }
  
  .btn-secondary { background: #FFFFFF; border: 1px solid #D1D5DB; color: #374151; padding: 6px 14px; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 13px; }
  .btn-primary { background: #2563EB; border: none; color: #FFFFFF; padding: 6px 14px; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 13px; }

  @media (max-width: 900px) {
    .co-grid { grid-template-columns: 1fr; }
    .item-table-header { display: none; }
    .item-row { grid-template-columns: 1fr 1fr; gap: 6px; }
  }
`;

export default function AdminCreateOrder() {
  const navigate = useNavigate();
  
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMERS[0]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Confirmed");
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [deliveryAddress, setDeliveryAddress] = useState(CUSTOMERS[0].address);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Charge saved card — Visa •••• 4242");
  
  const [items, setItems] = useState([
    { id: 1, productId: "p1", name: "Corrugated box (M)", price: 1.20, qty: 10 },
    { id: 2, productId: "p2", name: "Packing tape (48mm)", price: 2.90, qty: 2 },
    { id: 3, productId: "p3", name: "Warehouse gloves (L)", price: 4.75, qty: 1 }
  ]);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingCost = shippingMethod === "Express" ? 15.00 : 8.00;
  const tax = subtotal * 0.064;
  const total = subtotal + shippingCost + tax;

  const handleCustomerSelect = (cust) => {
    setSelectedCustomer(cust);
    setCustomerSearch("");
    setDeliveryAddress(cust.address);
    setShowCustomerDropdown(false);
  };

  const handleProductChange = (rowId, prodId) => {
    const selectedProd = AVAILABLE_PRODUCTS.find(p => p.id === prodId);
    if (!selectedProd) return;
    setItems(items.map(item => item.id === rowId ? { ...item, productId: selectedProd.id, name: selectedProd.name, price: selectedProd.price } : item));
  };

  const handleQtyChange = (rowId, qty) => {
    setItems(items.map(item => item.id === rowId ? { ...item, qty: Math.max(1, parseInt(qty) || 1) } : item));
  };

  const handleAddItem = () => {
    const defaultProd = AVAILABLE_PRODUCTS[0];
    setItems([...items, { id: Date.now(), productId: defaultProd.id, name: defaultProd.name, price: defaultProd.price, qty: 1 }]);
  };

  const handleRemoveItem = (rowId) => {
    if (items.length === 1) return alert("Order must contain at least one item.");
    setItems(items.filter(item => item.id !== rowId));
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    alert(`Order Created Successfully!\nTotal: $${total.toFixed(2)}\nCustomer: ${selectedCustomer.name}`);
    navigate("/admin/orders/10432");
  };

  return (
    <DashboardLayout
      title="Create order"
      subtitle="Manually create an order on behalf of a customer."
      actions={
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/orders")}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleCreateOrder}>Create order</button>
        </div>
      }
    >
      <div className="co-container">
        <style>{STYLES}</style>
        <form onSubmit={handleCreateOrder} className="co-grid">
          
          <div>
            <div className="co-card">
              <h2 className="card-title">Customer</h2>
              <div className="form-group">
                <label>Search by name or email</label>
                <input 
                  type="text" 
                  value={customerSearch} 
                  onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  placeholder="Type to search..."
                />
                {showCustomerDropdown && (
                  <div className="customer-dropdown">
                    {CUSTOMERS.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                      <div key={c.id} className="customer-option" onClick={() => handleCustomerSelect(c)}>
                        <strong>{c.name}</strong> — <span style={{ color: '#6B7280' }}>{c.email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedCustomer && (
                <div className="customer-selected-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="avatar-badge">{selectedCustomer.name.split(" ").map(n => n[0]).join("")}</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600 }}>{selectedCustomer.name}</div>
                      <div style={{ fontSize: "11px", color: "#6B7280" }}>{selectedCustomer.email} · {selectedCustomer.orders} previous orders</div>
                    </div>
                  </div>
                  <button type="button" className="btn-secondary" style={{ padding: "2px 8px", fontSize: "11px" }} onClick={() => setShowCustomerDropdown(true)}>Change</button>
                </div>
              )}
            </div>

            <div className="co-card">
              <h2 className="card-title">Order items</h2>
              <div className="item-table-header">
                <div>PRODUCT</div>
                <div>QTY</div>
                <div>PRICE</div>
                <div></div>
              </div>

              {items.map((item) => (
                <div className="item-row" key={item.id}>
                  <div>
                    <select value={item.productId} onChange={(e) => handleProductChange(item.id, e.target.value)}>
                      {AVAILABLE_PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — ${p.price.toFixed(2)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input type="number" min="1" value={item.qty} onChange={(e) => handleQtyChange(item.id, e.target.value)} />
                  </div>
                  <div>
                    <input type="text" value={`$${(item.price * item.qty).toFixed(2)}`} readOnly style={{ background: "#F9FAFB" }} />
                  </div>
                  <button type="button" className="btn-remove" onClick={() => handleRemoveItem(item.id)}>×</button>
                </div>
              ))}

              <button type="button" className="btn-add-item" onClick={handleAddItem}>+ Add another item</button>
            </div>

            <div className="co-card">
              <h2 className="card-title">Shipping & notes</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="form-group">
                <div>
                  <label>Delivery address</label>
                  <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
                </div>
                <div>
                  <label>Shipping method</label>
                  <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                    <option value="Standard">Standard (3–5 days) — $8.00</option>
                    <option value="Express">Express (1–2 days) — $15.00</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Order notes (optional)</label>
                <textarea rows={2} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="e.g., Customer requested gift wrap" />
              </div>
            </div>
          </div>

          <div>
            <div className="co-card">
              <h2 className="card-title">Order status</h2>
              <div className="status-toggle">
                <button type="button" className={`status-btn ${orderStatus === "Draft" ? "active" : ""}`} onClick={() => setOrderStatus("Draft")}>Draft</button>
                <button type="button" className={`status-btn ${orderStatus === "Confirmed" ? "active" : ""}`} onClick={() => setOrderStatus("Confirmed")}>Confirmed</button>
              </div>
            </div>

            <div className="co-card">
              <h2 className="card-title">Order summary</h2>
              <div className="summary-row"><span>Subtotal ({items.length} items)</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
              <div className="summary-row"><span>Tax (6.4%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>

            <div className="co-card">
              <h2 className="card-title">Payment</h2>
              <div className="form-group">
                <label>Payment method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="Charge saved card — Visa •••• 4242">Charge saved card — Visa •••• 4242</option>
                  <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}