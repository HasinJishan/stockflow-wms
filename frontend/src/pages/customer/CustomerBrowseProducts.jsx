import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Bell } from "lucide-react";

// 1. IMPORT YOUR IMAGES FROM THE ASSETS FOLDER
import imgBoxes from "../../assets/Corrugated Cardboard Boxes.jpg";
import imgTape from "../../assets/Heavy Duty Packing Tape.jpg";
import imgDolly from "../../assets/Heavy Duty Warehouse Dolly.jpg";
import imgVest from "../../assets/High-Visibility Reflective Safety Vest.jpg";
import imgFirstAid from "../../assets/Industrial First Aid Kit (50 Person).jpg";
import imgShelving from "../../assets/Industrial Steel Warehouse Shelving.jpg";
import imgBubbleWrap from "../../assets/Large Bubble Wrap Roll.jpg";
import imgScanner from "../../assets/Laser Handheld Barcode Scanner.jpg";
import imgBoots from "../../assets/Steel-Toe Leather Safety Boots.jpg";
import imgPrinter from "../../assets/Thermal Label Printer.jpg";
import imgDock from "../../assets/Universal Charging Station Dock.jpg";
import imgMailers from "../../assets/White Padded Poly Mailers.jpg";

// 2. DATA ARRAY USING YOUR LOCAL IMAGES
const PRODUCTS = [
  { 
    sku: "PKG-104", name: "White Padded Poly Mailers", price: 24.99, category: "Packaging", stock: "In stock", 
    statusColor: "#dcfce7", textColor: "#166534", image: imgMailers 
  },
  { 
    sku: "ELC-331", name: "Laser Handheld Barcode Scanner", price: 89.00, category: "Electronics", stock: "In stock", 
    statusColor: "#dcfce7", textColor: "#166534", image: imgScanner 
  },
  { 
    sku: "ELC-340", name: "Thermal Label Printer", price: 199.99, category: "Electronics", stock: "In stock", 
    statusColor: "#dcfce7", textColor: "#166534", image: imgPrinter 
  },
  { 
    sku: "SFT-550", name: "High-Visibility Safety Vest", price: 14.50, category: "Safety Gear", stock: "67 left", 
    statusColor: "#fef3c7", textColor: "#92400e", image: imgVest 
  },
  { 
    sku: "PKG-778", name: "Heavy Duty Packing Tape", price: 18.00, category: "Packaging", stock: "In stock", 
    statusColor: "#dcfce7", textColor: "#166534", image: imgTape 
  },
  { 
    sku: "PKG-228", name: "Large Bubble Wrap Roll", price: 32.75, category: "Packaging", stock: "Low stock", 
    statusColor: "#fee2e2", textColor: "#991b1b", image: imgBubbleWrap 
  },
  { 
    sku: "EQU-558", name: "Steel Warehouse Shelving", price: 450.00, category: "Equipment", stock: "In stock", 
    statusColor: "#dcfce7", textColor: "#166534", image: imgShelving 
  },
  { 
    sku: "SFT-779", name: "Steel-Toe Safety Boots", price: 85.00, category: "Safety Gear", stock: "12 left", 
    statusColor: "#fef3c7", textColor: "#92400e", image: imgBoots 
  },
  { 
    sku: "EQU-901", name: "Heavy Duty Warehouse Dolly", price: 125.00, category: "Equipment", stock: "In stock", 
    statusColor: "#dcfce7", textColor: "#166534", image: imgDolly 
  },
  { 
    sku: "PKG-442", name: "Corrugated Cardboard Boxes", price: 2.50, category: "Packaging", stock: "In stock", 
    statusColor: "#dcfce7", textColor: "#166534", image: imgBoxes 
  },
  { 
    sku: "SFT-102", name: "Industrial First Aid Kit", price: 45.00, category: "Safety Gear", stock: "In stock", 
    statusColor: "#dcfce7", textColor: "#166534", image: imgFirstAid 
  },
  { 
    sku: "ELC-505", name: "Universal Charging Dock", price: 55.00, category: "Electronics", stock: "Low stock", 
    statusColor: "#fee2e2", textColor: "#991b1b", image: imgDock 
  },
];

export default function CustomerBrowseProducts() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, logout } = useAuth();

  // --- STATE FOR FILTERING ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const hasUnread = true; 
  const userInitials = (user?.name || "PR").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    if (window.confirm("Log out of your account?")) {
      logout();
    }
  };

  const categories = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/customer/checkout");
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#FAFAF8", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Header Row */}
      <div style={{ maxWidth: "1400px", margin: "0 auto 40px auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#111827", margin: 0 }}>Browse Products</h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: "4px 0 0 0" }}>Explore equipment, packaging, and safety supplies.</p>
          </div>

          {/* Action Icons Section */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            
            {/* Minimalist Bell Icon with Red Dot */}
            <button
              onClick={() => navigate("/customer/notifications")}
              title="Notifications"
              style={{
                position: "relative",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={26} color="#334155" strokeWidth={1.8} />
              {hasUnread && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "#b91c1c",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    border: "2px solid #FAFAF8",
                  }}
                />
              )}
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={handleLogout}
              title={`Logged in as ${user?.name || "User"}. Click to logout.`}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#DCE9FD",
                color: "#2563EB",
                border: "2px solid #ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {userInitials}
            </button>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input
            type="text"
            placeholder="Search by SKU or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 24px",
              borderRadius: "15px",
              border: "1px solid #d1d5db",
              fontSize: "16px",
              outline: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  backgroundColor: activeCategory === cat ? "#2563eb" : "#fff",
                  color: activeCategory === cat ? "#fff" : "#374151",
                  transition: "0.2s all",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "30px",
        }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.sku}
              style={{
                background: "#fff",
                borderRadius: "24px",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  height: "260px",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "25px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {p.category}
                  </span>
                  <h3 style={{ fontSize: "19px", fontWeight: "700", margin: "6px 0", color: "#1f2937" }}>
                    {p.name}
                  </h3>
                  <span style={{ fontSize: "13px", color: "#9ca3af" }}>ID: {p.sku}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <span style={{ fontSize: "24px", fontWeight: "800", color: "#111827" }}>
                    ${p.price.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      padding: "6px 14px",
                      borderRadius: "100px",
                      backgroundColor: p.statusColor,
                      color: p.textColor,
                    }}
                  >
                    {p.stock}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(p)}
                  style={{
                    width: "100%",
                    marginTop: "25px",
                    padding: "18px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "16px",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "100px", color: "#6b7280" }}>
            <h2 style={{ fontSize: "24px" }}>No items found matching your search.</h2>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: "600", marginTop: "10px" }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}