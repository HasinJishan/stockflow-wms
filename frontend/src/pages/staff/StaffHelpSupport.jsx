import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const HELP_CATEGORIES = [
  { title: "Getting started", count: "9 articles", desc: "Your first shift, dashboard basics", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
  )},
  { title: "Pick & pack", count: "14 articles", desc: "Picking orders, packing stations", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  )},
  { title: "Stock updates", count: "10 articles", desc: "Logging counts, discrepancies", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  )},
  { title: "Account & access", count: "5 articles", desc: "Password, shifts, permissions", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )},
];

const POPULAR_ARTICLES = [
  {
    id: 1,
    title: "How to mark an order as packed",
    views: "412 views",
    tag: "Pick & pack",
    desc: "Open the order in Pick & pack, confirm every line item is scanned, then tap 'Mark as packed.' The order moves to Shipping automatically — you don't need to notify anyone."
  },
  {
    id: 2,
    title: "What happens after I submit a stock update",
    views: "203 views",
    tag: "Stock updates",
    desc: "Updates apply to live inventory immediately. Anything more than 10% off the expected count is queued for supervisor review before it's finalized."
  },
  {
    id: 3,
    title: "How to request a shift swap",
    views: "298 views",
    tag: "Account",
    desc: "Go to Account > Shifts and select 'Request swap' on the shift you want covered. Swaps need supervisor approval and must be requested at least 24 hours in advance."
  },
  {
    id: 4,
    title: "Understanding bin location codes",
    views: "271 views",
    tag: "Inventory",
    desc: "Codes follow Zone-Aisle-Shelf-Bin, e.g. B-04-2-11 means Zone B, Aisle 4, Shelf 2, Bin 11. The zone letter matches the colored floor markings in the warehouse."
  },
  {
    id: 5,
    title: "Resetting your password",
    views: "184 views",
    tag: "Account",
    desc: "Use 'Forgot password' on the login screen — a reset link goes to the email on file. Shared floor tablets should use a supervisor-assisted reset instead."
  }
];

const STYLES = `
  .help-page { font-family: 'Inter', sans-serif; color: #111827; }
  
  /* Search Bar */
  .search-container { width: 100%; height: 48px; background: #fff; border: 1px solid #E5E5E0; border-radius: 8px; display: flex; align-items: center; padding: 0 16px; margin-bottom: 20px; }
  .search-container input { border: none; outline: none; flex: 1; font-size: 14px; margin-left: 12px; }
  .search-container svg { width: 18px; height: 18px; stroke: #9CA3AF; }

  /* Top Stats Cards */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px; }
  .stat-card { padding: 20px; border-radius: 12px; background: #F3F2EC; position: relative; }
  .stat-card.green { background: #EAF6EE; color: #1F9D55; }
  .stat-card.tan { background: #FAEEDA; color: #854F0B; }
  .stat-label { font-size: 12px; opacity: 0.8; margin-bottom: 4px; display: block; font-weight: 500; }
  .stat-value { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  .stat-sub { font-size: 11px; opacity: 0.7; }

  /* Category Grid */
  .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .cat-card { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 16px; cursor: pointer; transition: 0.2s; }
  .cat-card:hover { border-color: #2F6FED; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .cat-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .cat-icon { width: 36px; height: 36px; background: #EFF4FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2F6FED; }
  .cat-icon svg { width: 18px; height: 18px; }
  .cat-count { font-size: 11px; color: #9CA3AF; }
  .cat-title { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
  .cat-desc { font-size: 11.5px; color: #6B7280; line-height: 1.4; }

  /* Main Layout */
  .support-content { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
  
  /* Article List */
  .articles-panel { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 24px; }
  .panel-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; }
  .panel-title { font-size: 15px; font-weight: 700; }
  .sort-text { font-size: 12px; color: #9CA3AF; }
  
  .article-item { padding: 20px 0; border-bottom: 1px solid #F1F0EA; }
  .article-item:last-child { border-bottom: none; padding-bottom: 0; }
  .article-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .article-name { font-size: 14px; font-weight: 600; color: #111827; }
  .article-stats { display: flex; align-items: center; gap: 12px; }
  .view-count { font-size: 11px; color: #9CA3AF; }
  .badge { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 6px; background: #F1F0EA; color: #6B7280; }
  .article-desc { font-size: 12.5px; color: #6B7280; line-height: 1.6; }

  /* Sidebar Panels */
  .side-panel { background: #fff; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .side-panel-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; }
  
  .contact-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F1F0EA; }
  .contact-item:last-child { border-bottom: none; }
  .contact-icon { width: 34px; height: 34px; background: #EFF4FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2F6FED; }
  .contact-icon svg { width: 16px; height: 16px; }
  .contact-info b { font-size: 13px; display: block; }
  .contact-info span { font-size: 11px; color: #6B7280; }
  .status-dot { width: 6px; height: 6px; background: #1F9D55; border-radius: 50%; display: inline-block; margin-right: 4px; }

  /* Ticket Form */
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 12px; font-weight: 500; color: #4B5563; margin-bottom: 6px; }
  .form-select, .form-textarea { width: 100%; background: #F1F0EA; border: none; border-radius: 8px; font-size: 13px; font-family: inherit; }
  .form-select { height: 40px; padding: 0 12px; }
  .form-textarea { padding: 12px; height: 80px; resize: none; }
  .btn-submit { width: 100%; height: 40px; background: #3B82F6; color: #fff; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s; }
  .btn-submit:hover { background: #2563EB; }

  @media (max-width: 1100px) {
    .stats-row, .cat-grid { grid-template-columns: repeat(2, 1fr); }
    .support-content { grid-template-columns: 1fr; }
  }
`;

export default function StaffHelp() {
  const [ticket, setTicket] = useState({ type: "Equipment problem", desc: "" });

  return (
    <DashboardLayout title="Help & support" subtitle="Find answers or get in touch with your team lead.">
      <div className="help-page">
        <style>{STYLES}</style>

        {/* Search */}
        <div className="search-container">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search help articles, e.g. 'how to update stock count'" />
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card green">
            <span className="stat-label">Live chat</span>
            <div className="stat-value">Online</div>
            <span className="stat-sub">Avg reply 5 min</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Your open tickets</span>
            <div className="stat-value">2</div>
            <span className="stat-sub">1 in progress, 1 waiting on you</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Help articles</span>
            <div className="stat-value">38</div>
            <span className="stat-sub">across 4 categories</span>
          </div>
          <div className="stat-card tan">
            <span className="stat-label">Supervisor</span>
            <div className="stat-value">On shift</div>
            <span className="stat-sub">Alex Rivera · until 6:00 PM</span>
          </div>
        </div>

        {/* Categories */}
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

        {/* Main Section */}
        <div className="support-content">
          {/* Article List */}
          <div className="articles-panel">
            <div className="panel-header">
              <h2 className="panel-title">Popular articles</h2>
              <span className="sort-text">Sorted by most viewed this month</span>
            </div>
            {POPULAR_ARTICLES.map((art) => (
              <div className="article-item" key={art.id}>
                <div className="article-top">
                  <span className="article-name">{art.title}</span>
                  <div className="article-stats">
                    <span className="view-count">{art.views}</span>
                    <span className="badge">{art.tag}</span>
                  </div>
                </div>
                <p className="article-desc">{art.desc}</p>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="side-panel">
              <h2 className="side-panel-title">Contact your team lead</h2>
              <div className="contact-item">
                <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <div className="contact-info">
                  <b>Live chat</b>
                  <span><span className="status-dot"></span>Online now · replies in ~5 min</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <div className="contact-info">
                  <b>Call supervisor</b>
                  <span>Alex Rivera · ext. 204 · on shift until 6:00 PM</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                <div className="contact-info">
                  <b>Email support</b>
                  <span>support@stockflow.com · typically 1 business day</span>
                </div>
              </div>
            </div>

            <div className="side-panel">
              <h2 className="side-panel-title">Submit a ticket</h2>
              <div className="form-group">
                <label>Issue type</label>
                <select className="form-select" value={ticket.type} onChange={(e) => setTicket({...ticket, type: e.target.value})}>
                  <option>Equipment problem</option>
                  <option>System Access</option>
                  <option>Safety Incident</option>
                </select>
              </div>
              <div className="form-group">
                <label>Describe the issue</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Brief description..."
                  value={ticket.desc}
                  onChange={(e) => setTicket({...ticket, desc: e.target.value})}
                ></textarea>
              </div>
              <button className="btn-submit" onClick={() => alert("Ticket Submitted!")}>Submit ticket</button>
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