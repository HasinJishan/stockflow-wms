import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const ROLE_FILTERS = ["All roles", "Admin", "Manager", "Warehouse staff", "Customer"];

const STATUS_BADGE = { Active: "green", Invited: "gray", Suspended: "red" };

const slugify = (name) => name.toLowerCase().replace(/\s+/g, "-");
const initials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

const STYLES = `
  .au * { box-sizing: border-box; }
  .au { font-family: 'Inter', sans-serif; }

  .au .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
  .au .kpi-card { background: #F3F2EC; border-radius: 12px; padding: 18px; }
  .au .kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 6px; }
  .au .kpi-value { font-size: 26px; font-weight: 700; }

  .au .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
  .au .search-box { display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 8px; padding: 0 14px; height: 40px; width: 320px; max-width: 100%; }
  .au .search-box svg { width: 16px; height: 16px; stroke: #9CA3AF; flex-shrink: 0; }
  .au .search-box input { border: none; outline: none; font-family: inherit; font-size: 14px; width: 100%; }
  .au .filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
  .au .filter-tab { padding: 8px 16px; border-radius: 8px; font-size: 13px; color: #6B7280; cursor: pointer; background: none; border: none; font-family: inherit; white-space: nowrap; }
  .au .filter-tab.active { background: #DCE9FD; color: #2F6FED; font-weight: 600; }

  .au .panel { background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 12px; padding: 20px; overflow: visible; }
  .au .table-scroll { overflow-x: auto; }
  .au table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 640px; }
  .au th { text-align: left; font-weight: 500; color: #6B7280; padding: 8px 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #E5E5E0; }
  .au td { padding: 12px 10px; border-bottom: 1px solid #F1F0EA; vertical-align: middle; }
  .au tr:last-child td { border-bottom: none; }

  .au .cell-user { display: flex; align-items: center; gap: 10px; }
  .au .avatar-sm { width: 30px; height: 30px; flex-shrink: 0; border-radius: 50%; background: #DCE9FD; color: #2F6FED; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; }
  .au .cell-user .name { font-weight: 500; }
  .au .cell-user .meta { font-size: 12px; color: #6B7280; }

  .au .badge { font-size: 12px; padding: 4px 12px; border-radius: 8px; font-weight: 600; display: inline-block; }
  .au .badge.green { background: #EAF6EE; color: #1F9D55; }
  .au .badge.gray { background: #F1F0EA; color: #6B7280; }
  .au .badge.red { background: #FCEBEB; color: #A32D2D; }

  .au .menu-cell { position: relative; text-align: right; }
  .au .menu-btn { background: none; border: none; cursor: pointer; font-size: 16px; color: #6B7280; padding: 4px 8px; border-radius: 6px; letter-spacing: 1px; }
  .au .menu-btn:hover { background: #F3F2EC; }
  .au .menu-dropdown { position: absolute; right: 0; top: calc(100% + 4px); background: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); min-width: 180px; z-index: 20; overflow: hidden; text-align: left; }
  .au .menu-item { display: block; width: 100%; padding: 10px 14px; font-size: 13.5px; color: #111827; background: none; border: none; cursor: pointer; text-align: left; font-family: inherit; }
  .au .menu-item:hover { background: #F3F2EC; }
  .au .menu-item.danger { color: #A32D2D; }

  .au .empty { text-align: center; padding: 48px 20px; color: #6B7280; font-size: 14px; }

  .au .app-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E5E0; font-size: 12px; color: #9CA3AF; text-align: center; }
  .au .app-footer a { color: #9CA3AF; text-decoration: none; }

  @media (max-width: 1100px) {
    .au .kpi-row { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .au .kpi-row { grid-template-columns: 1fr; }
    .au .search-box { width: 100%; }
  }
`;

function RowMenu({ user, onUpdateRole, onToggleStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="menu-cell" ref={ref}>
      <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Row actions">•••</button>
      {open && (
        <div className="menu-dropdown">
          <button className="menu-item" onClick={() => { setOpen(false); onUpdateRole(user); }}>
            Update role
          </button>
          {user.status === "Invited" && (
            <button className="menu-item" onClick={() => { setOpen(false); alert(`Resent invite to ${user.email}`); }}>
              Resend invite
            </button>
          )}
          {user.status !== "Invited" && (
            <button className="menu-item" onClick={() => { setOpen(false); onToggleStatus(user); }}>
              {user.status === "Suspended" ? "Reactivate" : "Suspend"}
            </button>
          )}
          <button className="menu-item danger" onClick={() => { setOpen(false); onDelete(user); }}>
            Delete user
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('sf_token');
        const res = await axios.get('https://stockflow-wms-backend.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const mapped = res.data.map(u => ({
          id: u._id,
          name: u.fullName,
          email: u.email,
          role: u.role === 'staff' ? 'Warehouse staff' : u.role.charAt(0).toUpperCase() + u.role.slice(1),
          status: u.isVerified ? "Active" : "Invited",
          lastActive: "—"
        }));
        setUsers(mapped);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesQuery =
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === "All roles" || u.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, query, roleFilter]);

  const counts = useMemo(() => ({
    total: users.length,
    admins: users.filter((u) => u.role === "Admin").length,
    staff: users.filter((u) => u.role === "Warehouse staff").length,
    customers: users.filter((u) => u.role === "Customer").length,
  }), [users]);

  const handleUpdateRole = (user) => navigate(`/admin/users/${slugify(user.name)}/role`);

  const handleToggleStatus = (user) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: u.status === "Suspended" ? "Active" : "Suspended" } : u
      )
    );
  };

  const handleDelete = (user) => {
    if (window.confirm(`Delete ${user.name}? This cannot be undone.`)) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
  };

  return (
    <DashboardLayout
      title="Users"
      subtitle="Manage team members and their access levels."
      actions={
        <button className="topbar-btn" onClick={() => navigate("/admin/users/add")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="btn-label">Add user</span>
        </button>
      }
    >
      <div className="au">
        <style>{STYLES}</style>

        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Total users</div><div className="kpi-value">{counts.total}</div></div>
          <div className="kpi-card"><div className="kpi-label">Admins</div><div className="kpi-value">{counts.admins}</div></div>
          <div className="kpi-card"><div className="kpi-label">Warehouse staff</div><div className="kpi-value">{counts.staff}</div></div>
          <div className="kpi-card"><div className="kpi-label">Customers</div><div className="kpi-value">{counts.customers}</div></div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input placeholder="Search users…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {ROLE_FILTERS.map((r) => (
              <button
                key={r}
                className={`filter-tab${roleFilter === r ? " active" : ""}`}
                onClick={() => setRoleFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="table-scroll">
            {loading ? (
              <div className="empty">Loading users…</div>
            ) : filtered.length === 0 ? (
              <div className="empty">No users match your search or filter.</div>
            ) : (
              <table>
                <thead>
                  <tr><th>User</th><th>Role</th><th>Status</th><th>Last active</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="cell-user">
                          <div className="avatar-sm">{initials(u.name)}</div>
                          <div>
                            <div className="name">{u.name}</div>
                            <div className="meta">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{u.role}</td>
                      <td><span className={`badge ${STATUS_BADGE[u.status]}`}>{u.status}</span></td>
                      <td>{u.lastActive}</td>
                      <td>
                        <RowMenu
                          user={u}
                          onUpdateRole={handleUpdateRole}
                          onToggleStatus={handleToggleStatus}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="app-footer">
          &copy; 2026 StockFlow WMS. All rights reserved. &middot; <a href="#footer">Privacy Policy</a> &middot; <a href="#footer">Terms of Service</a>
        </div>
      </div>
    </DashboardLayout>
  );
}