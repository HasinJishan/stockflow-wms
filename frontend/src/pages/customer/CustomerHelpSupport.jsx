import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const HELP_CATEGORIES = [
  { title: "Orders & shipping", count: "13 articles", desc: "Tracking, delays, delivery issues", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
  )},
  { title: "Returns & refunds", count: "10 articles", desc: "Return window, refund timing", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  )},
  { title: "Payments & billing", count: "11 articles", desc: "Cards, promo codes, receipts", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  )},
  { title: "Account & access", count: "8 articles", desc: "Password, saved items, addresses", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )},
];

const POPULAR_ARTICLES = [
  { id: 1, title: "How to track my order", views: "589 views", tag: "Orders & shipping", desc: "Go to My Orders and select the order — live tracking updates appear as soon as the carrier scans the package." },
  { id: 2, title: "How long do refunds take", views: "431 views", tag: "Returns & refunds", desc: "Refunds are issued once the return is scanned at our facility, and typically post to your original payment method within 3–5 business days." },
  { id: 3, title: "What to do if my order arrives damaged", views: "376 views", tag: "Orders & shipping", desc: "Submit a ticket with a photo of the item and packaging within 48 hours of delivery — we'll send a replacement or refund, no return needed." },
  { id: 4, title: "How to apply a promo code", views: "298 views", tag: "Payments & billing", desc: "Enter the code in the cart before checkout. Only one promo code can be applied per order, and it must be entered before payment." },
  { id: 5, title: "Updating your saved address", views: "204 views", tag: "Account & access", desc: "Go to Account > Address to add or edit saved addresses. Changes only apply to orders placed after the update." },
];

const STYLES = `
  .help-user { font-family: 'Inter', sans-serif; color: #111827; }
  
  .search-box { width: 100%; height: 48px; background: #fff; border: 1px solid #E5E5E0; border-radius: 8px; display: flex; align-items: center; padding: 0 16px; margin-bottom: 24px; }
  .search-box input { border: none; outline: none; flex: 1; font-size: 14px; margin-left: 12px; }
  .search-box svg { width: 18px; height: 18px; stroke: #9CA3AF; }

  .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card { padding: 20px; border-radius: 12px; background: #F3F2EC; border: 1px solid #E5E5E0; }
  .kpi-card.green { background: #EAF6EE; color: #1F9D55; border-color: #D1E7DD; }
  .kpi-card.tan { background: #FAEEDA; color: #854F0B; border-color: #F8E6C2; }
  .kpi-label { font-size: 11px; font-weight: 600; opacity: 0.8; margin-bottom: 6px; display: block; text-transform: capitalize; }
  .kpi-value { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
  .kpi-sub { font-size: 11px; opacity: 0.7; }

  .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .cat-card { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; cursor: pointer; transition: 0.2s; }
  .cat-card:hover { border-color: #2F6FED; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .cat-icon { width: 36px; height: 36px; background: #EFF4FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2F6FED; margin-bottom: 12px; }
  .cat-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .cat-desc { font-size: 11.5px; color: #6B7280; line-height: 1.4; }
  .cat-head { display: flex; justify-content: space-between; align-items: flex-start; }
  .cat-count { font-size: 11px; color: #9CA3AF; }

  .content-split { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
  
  .articles-panel { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 24px; }
  .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .panel-title { font-size: 16px; font-weight: 700; }
  .panel-sort { font-size: 12px; color: #9CA3AF; }

  .art-item { padding: 20px 0; border-bottom: 1px solid #F1F0EA; }
  .art-item:last-child { border-bottom: none; padding-bottom: 0; }
  .art-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .art-title { font-size: 14px; font-weight: 600; color: #111827; }
  .art-meta { display: flex; align-items: center; gap: 12px; }
  .art-views { font-size: 11px; color: #9CA3AF; }
  .tag { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 6px; background: #F1F0EA; color: #6B7280; }
  .art-desc { font-size: 13px; color: #6B7280; line-height: 1.6; }

  .side-card { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
  .side-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; }
  
  .contact-link { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid #F1F0EA; text-decoration: none; }
  .contact-link:last-child { border-bottom: none; }
  .contact-icon { width: 34px; height: 34px; background: #EFF4FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2F6FED; }
  .contact-icon svg { width: 18px; height: 18px; }
  .contact-text b { font-size: 13px; display: block; color: #111827; }
  .contact-text span { font-size: 11px; color: #6B7280; }
  .dot { width: 6px; height: 6px; background: #1F9D55; border-radius: 50%; display: inline-block; margin-right: 4px; }

  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 12px; font-weight: 600; color: #4B5563; margin-bottom: 6px; }
  .field input, .field select, .field textarea { width: 100%; background: #F1F0EA; border: none; border-radius: 8px; font-size: 13px; font-family: inherit; }
  .field input, .field select { height: 40px; padding: 0 12px; }
  .field textarea { padding: 12px; height: 80px; resize: none; }
  .btn-blue { width: 100%; height: 42px; background: #2F6FED; color: #fff; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s; }
  .btn-blue:hover { background: #255BC7; }

  @media (max-width: 1024px) {
    .kpi-row, .cat-grid { grid-template-columns: repeat(2, 1fr); }
    .content-split { grid-template-columns: 1fr; }
  }
`;

export default function CustomerHelp() {
  const [ticket, setTicket] = useState({ order: "Order #10245", type: "Missing or damaged item", desc: "" });

  return (
    <DashboardLayout title="Help & support" subtitle="Find answers about your orders, returns, and account.">
      <div className="help-user">
        <style>{STYLES}</style>

        {/* Search Bar */}
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search help articles, e.g. 'where is my order'" />
        </div>

        {/* KPI Summary Cards */}
        <div className="kpi-row">
          <div className="kpi-card green">
            <span className="kpi-label">Live chat</span>
            <div className="kpi-value">Online</div>
            <span className="kpi-sub">Avg reply 3 min</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Your open tickets</span>
            <div className="kpi-value">1</div>
            <span className="kpi-sub">Awaiting reply</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Help articles</span>
            <div className="kpi-value">42</div>
            <span className="kpi-sub">across 4 categories</span>
          </div>
          <div className="kpi-card tan">
            <span className="kpi-label">Order #10245</span>
            <div className="kpi-value">In transit</div>
            <span className="kpi-sub">Arriving in 2 days</span>
          </div>
        </div>

        {/* Category Grid */}
        <div className="cat-grid">
          {HELP_CATEGORIES.map((cat) => (
            <div className="cat-card" key={cat.title}>
              <div className="cat-head">
                <div className="cat-icon">{cat.icon}</div>
                <span className="cat-count">{cat.count}</span>
              </div>
              <div className="cat-title">{cat.title}</div>
              <div className="cat-desc">{cat.desc}</div>
            </div>
          ))}
        </div>

        {/* Main Sections */}
        <div className="content-split">
          {/* Article List */}
          <div className="articles-panel">
            <div className="panel-head">
              <h2 className="panel-title">Popular articles</h2>
              <span className="panel-sort">Sorted by most viewed this month</span>
            </div>
            {POPULAR_ARTICLES.map((art) => (
              <div className="art-item" key={art.id}>
                <div className="art-top">
                  <span className="art-title">{art.title}</span>
                  <div className="art-meta">
                    <span className="art-views">{art.views}</span>
                    <span className="tag">{art.tag}</span>
                  </div>
                </div>
                <p className="art-desc">{art.desc}</p>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="side-card">
              <h2 className="side-title">Get in touch</h2>
              <a href="#chat" className="contact-link">
                <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <div className="contact-text">
                  <b>Live chat</b>
                  <span><span className="dot"></span>Online now</span>
                </div>
              </a>
              <a href="#call" className="contact-link">
                <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <div className="contact-text">
                  <b>Call us</b>
                  <span>1-800-555-0142 · Mon–Sat, 8am–8pm</span>
                </div>
              </a>
              <a href="mailto:help@stockflow.com" className="contact-link">
                <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                <div className="contact-text">
                  <b>Email us</b>
                  <span>help@stockflow.com · reply in ~1 day</span>
                </div>
              </a>
            </div>

            <div className="side-card">
              <h2 className="side-title">Submit a ticket</h2>
              <div className="field">
                <label>Related order (optional)</label>
                <select value={ticket.order} onChange={(e) => setTicket({...ticket, order: e.target.value})}>
                  <option>Order #10245</option>
                  <option>Order #10238</option>
                  <option>Other / None</option>
                </select>
              </div>
              <div className="field">
                <label>Issue type</label>
                <select value={ticket.type} onChange={(e) => setTicket({...ticket, type: e.target.value})}>
                  <option>Missing or damaged item</option>
                  <option>Delivery delay</option>
                  <option>Refund question</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field">
                <label>Describe the issue</label>
                <textarea 
                  placeholder="Brief description..."
                  value={ticket.desc}
                  onChange={(e) => setTicket({...ticket, desc: e.target.value})}
                ></textarea>
              </div>
              <button className="btn-blue" onClick={() => alert("Ticket Submitted!")}>Submit ticket</button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "40px 0", fontSize: "11px", color: "#9CA3AF" }}>
          © 2026 StockFlow WMS. All rights reserved. · Privacy Policy · Terms of Service
        </div>
      </div>
    </DashboardLayout>
  );
}