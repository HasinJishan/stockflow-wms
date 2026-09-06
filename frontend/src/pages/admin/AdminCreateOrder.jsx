import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

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
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 900px) {
    .co-grid { grid-template-columns: 1fr; }
    .item-table-header { display: none; }
    .item-row { grid-template-columns: 1fr 1fr; gap: 6px; }
  }
`;

export default function AdminCreateOrder() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('sf_token');
        const [usersRes, productsRes] = await Promise.all([
          axios.get('https://stockflow-wms-backend.onrender.com/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('https://stockflow-wms-backend.onrender.com/api/products', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const customerList = usersRes.data.filter(u => u.role === 'customer');
        setCustomers(customerList);

        setProducts(productsRes.data);
        if (productsRes.data.length > 0) {
          const first = productsRes.data[0];
          setItems([{ id: Date.now(), productId: first._id, name: first.name, sku: first.sku, price: first.price, qty: 1 }]);
        }
      } catch (err) {
        console.error("Failed to load customers/products:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingCost = shippingMethod === "Express" ? 15.00 : 8.00;
  const tax = subtotal * 0.064;
  const total = subtotal + shippingCost + tax;

  const handleCustomerSelect = (cust) => {
    setSelectedCustomer(cust);
    setCustomerSearch("");
    setShowCustomerDropdown(false);
  };

  const handleProductChange = (rowId, prodId) => {
    const selectedProd = products.find(p => p._id === prodId);
    if (!selectedProd) return;
    setItems(items.map(item => item.id === rowId ? { ...item, productId: selectedProd._id, name: selectedProd.name, sku: selectedProd.sku, price: selectedProd.price } : item));
  };

  const handleQtyChange = (rowId, qty) => {
    setItems(items.map(item => item.id === rowId ? { ...item, qty: Math.max(1, parseInt(qty) || 1) } : item));
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    const defaultProd = products[0];
    setItems([...items, { id: Date.now(), productId: defaultProd._id, name: defaultProd.name, sku: defaultProd.sku, price: defaultProd.price, qty: 1 }]);
  };

  const handleRemoveItem = (rowId) => {
    if (items.length === 1) return alert("Order must contain at least one item.");
    setItems(items.filter(item => item.id !== rowId));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return alert("Please select a customer.");
    if (!deliveryAddress.trim()) return alert("Please enter a delivery address.");

    setSaving(true);
    try {
      const token = localStorage.getItem('sf_token');
      const payload = {
        customer: selectedCustomer._id,
        items: items.map(({ productId, name, sku, price, qty }) => ({ product: productId, name, sku, price, qty })),
        shippingMethod,
        deliveryAddress,
        paymentMethod,
        notes: orderNotes
      };
      const res = await axios.post('https://stockflow-wms-backend.onrender.com/api/orders', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Order Created Successfully!\nTotal: $${res.data.order.total.toFixed(2)}\nCustomer: ${selectedCustomer.fullName}`);
      navigate(`/admin/orders/${res.data.order.orderNumber}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create order.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <DashboardLayout title="Create order" subtitle="Manually create an order on behalf of a customer.">
        <div style={{ padding: 40, fontFamily: "Inter, sans-serif" }}>Loading customers and products…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Create order"
      subtitle="Manually create an order on behalf of a customer."
      actions={
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/orders")}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleCreateOrder} disabled={saving}>
            {saving ? "Creating…" : "Create order"}
          </button>
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
                    {customers.length === 0 ? (
                      <div className="customer-option" style={{ color: "#9CA3AF" }}>No customers found</div>
                    ) : (
                      customers
                        .filter(c => c.fullName.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase()))
                        .map(c => (
                          <div key={c._id} className="customer-option" onClick={() => handleCustomerSelect(c)}>
                            <strong>{c.fullName}</strong> — <span style={{ color: '#6B7280' }}>{c.email}</span>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>

              {selectedCustomer && (
                <div className="customer-selected-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="avatar-badge">{selectedCustomer.fullName.split(" ").map(n => n[0]).join("")}</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600 }}>{selectedCustomer.fullName}</div>
                      <div style={{ fontSize: "11px", color: "#6B7280" }}>{selectedCustomer.email}</div>
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
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name} — ${p.price.toFixed(2)}</option>
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
                  <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Enter full delivery address" />
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
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                  <option value="Card">Card</option>
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