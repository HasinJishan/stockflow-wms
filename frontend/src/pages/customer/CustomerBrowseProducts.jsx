import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { useCart } from "../../context/CartContext";
import { getProductImage } from "../../assets/productImages";

const STYLES = `
  .bp * { box-sizing: border-box; }
  .bp {
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 128px); /* keeps footer pinned to bottom even with few/no products */
  }

  .bp .search-input {
    width: 100%; padding: 14px 20px; border-radius: 12px; border: 1px solid #D1D5DB;
    font-size: 14.5px; outline: none; font-family: inherit; background: #fff;
  }

  .bp .cat-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0 24px; }
  .bp .cat-btn {
    padding: 8px 16px; border-radius: 10px; border: 1px solid #D1D5DB; font-weight: 600;
    cursor: pointer; font-size: 13px; background: #fff; color: #374151; font-family: inherit;
  }
  .bp .cat-btn.active { background: #2F6FED; border-color: #2F6FED; color: #fff; }

  .bp .content-area { flex: 1; } /* grows to fill space, pushing footer down */

  .bp .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 18px; }

  .bp .card { background: #fff; border: 1px solid #E5E5E0; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }

  .bp .img-wrap { height: 150px; background: #F8FAFC; display: flex; align-items: center; justify-content: center; padding: 14px; position: relative; border-bottom: 1px solid #F1F0EA; }
  .bp .img-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }

  .bp .save-btn {
    position: absolute; top: 8px; right: 8px; width: 30px; height: 30px; border-radius: 50%;
    background: #fff; border: 1px solid #E5E5E0; display: flex; align-items: center; justify-content: center;
    cursor: pointer; padding: 0;
  }
  .bp .save-btn:disabled { cursor: not-allowed; opacity: 0.6; }

  .bp .card-body { padding: 16px; display: flex; flex-direction: column; flex: 1; }
  .bp .category { font-size: 11.5px; color: #2F6FED; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .bp .name { font-size: 14.5px; font-weight: 700; margin: 4px 0 2px; color: #111827; line-height: 1.3; }
  .bp .sku { font-size: 12px; color: #9CA3AF; }

  .bp .price-row { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; }
  .bp .price { font-size: 17px; font-weight: 700; color: #111827; }
  .bp .badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px; }

  .bp .add-btn {
    width: 100%; margin-top: 12px; padding: 11px; border: none; border-radius: 10px;
    font-weight: 600; font-size: 13.5px; cursor: pointer; font-family: inherit;
  }

  .bp .empty { text-align: center; padding: 60px 20px; color: #6B7280; grid-column: 1 / -1; }
  .bp .pager { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }
  .bp .pager-btn { padding: 7px 13px; border-radius: 8px; border: 1px solid #D1D5DB; background: #fff; color: #374151; font-weight: 600; font-size: 12.5px; cursor: pointer; font-family: inherit; }
  .bp .pager-btn.active { background: #2F6FED; border-color: #2F6FED; color: #fff; }
  .bp .pager-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .bp .app-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12.5px; color: #9CA3AF; text-align: center; }
`;

export default function CustomerBrowseProducts() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingId, setSavingId] = useState(null); // prevents double-clicks mid-request
  const perPage = 8;

  const token = localStorage.getItem("sf_token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/products", authHeader);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedIds = async () => {
      try {
        const res = await axios.get("https://stockflow-wms-backend.onrender.com/api/saved-items", authHeader);
        // The saved-items API returns each product's own fields spread in,
        // so _id here is the product's id (matches what's used elsewhere).
        setSavedIds(new Set(res.data.map((item) => item._id)));
      } catch (err) {
        console.error("Failed to fetch saved items:", err);
      }
    };

    fetchProducts();
    fetchSavedIds();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const pagedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

  const handleAddToCart = (product) => {
    addToCart({
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: getProductImage(product),
      productId: product._id
    });
    navigate("/customer/checkout");
  };

  const toggleSaved = async (e, productId) => {
    e.stopPropagation();
    if (savingId === productId) return; // request already in flight for this item
    setSavingId(productId);

    const alreadySaved = savedIds.has(productId);

    try {
      if (alreadySaved) {
        await axios.delete(`https://stockflow-wms-backend.onrender.com/api/saved-items/${productId}`, authHeader);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await axios.post("https://stockflow-wms-backend.onrender.com/api/saved-items", { productId }, authHeader);
        setSavedIds((prev) => new Set(prev).add(productId));
      }
    } catch (err) {
      console.error("Failed to update saved item:", err);
    } finally {
      setSavingId(null);
    }
  };

  const stockBadge = (status) => {
    if (status === "Out of stock") return { bg: "#fee2e2", color: "#991b1b" };
    if (status === "Low stock") return { bg: "#fef3c7", color: "#92400e" };
    return { bg: "#dcfce7", color: "#166534" };
  };

  return (
    <DashboardLayout title="Browse Products" subtitle="Explore equipment, packaging, and safety supplies.">
      <div className="bp">
        <style>{STYLES}</style>

        <input
          type="text"
          className="search-input"
          placeholder="Search by SKU or Name..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
        />

        <div className="cat-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-btn${activeCategory === cat ? " active" : ""}`}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="content-area">
          {loading ? (
            <div className="empty">Loading products…</div>
          ) : (
            <>
              <div className="grid">
                {pagedProducts.length > 0 ? (
                  pagedProducts.map((p) => {
                    const badge = stockBadge(p.status);
                    const isSaved = savedIds.has(p._id);
                    return (
                      <div key={p._id} className="card">
                        <div className="img-wrap">
                          <img src={getProductImage(p)} alt={p.name} />
                          <button
                            className="save-btn"
                            onClick={(e) => toggleSaved(e, p._id)}
                            disabled={savingId === p._id}
                            aria-label={isSaved ? "Remove from saved items" : "Save item"}
                            title={isSaved ? "Remove from saved items" : "Save item"}
                          >
                            <Heart size={15} fill={isSaved ? "#2F6FED" : "none"} color={isSaved ? "#2F6FED" : "#6B7280"} />
                          </button>
                        </div>

                        <div className="card-body">
                          <span className="category">{p.category}</span>
                          <h3 className="name">{p.name}</h3>
                          <span className="sku">SKU: {p.sku}</span>

                          <div className="price-row">
                            <span className="price">${p.price.toFixed(2)}</span>
                            <span className="badge" style={{ backgroundColor: badge.bg, color: badge.color }}>
                              {p.status === "In stock" ? "In stock" : p.status === "Low stock" ? `${p.quantity} left` : "Out of stock"}
                            </span>
                          </div>

                          <button
                            className="add-btn"
                            onClick={() => handleAddToCart(p)}
                            disabled={p.status === "Out of stock"}
                            style={{
                              background: p.status === "Out of stock" ? "#9CA3AF" : "#2F6FED",
                              color: "#fff",
                              cursor: p.status === "Out of stock" ? "not-allowed" : "pointer",
                            }}
                          >
                            {p.status === "Out of stock" ? "Out of stock" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty">
                    <h3 style={{ fontSize: "17px", marginBottom: "8px" }}>No items found matching your search.</h3>
                    <button
                      onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                      style={{ color: "#2F6FED", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="pager">
                  <button className="pager-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} className={`pager-btn${page === n ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>
                  ))}
                  <button className="pager-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer" style={{ color: "#9CA3AF" }}>Privacy Policy</a> &middot; <a href="#footer" style={{ color: "#9CA3AF" }}>Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}