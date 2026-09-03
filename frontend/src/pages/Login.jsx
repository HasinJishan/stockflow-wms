import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  :root{--accent:#2F6FED;--ink:#111827;--muted:#6B7280;--label:#374151;--border:#D1D5DB;--line:#E5E5E0;}
  .lg * { box-sizing: border-box; margin: 0; padding: 0; }
  .lg { background: #FAFAF8; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; font-family: 'Inter', sans-serif; color: var(--ink); }

  .lg .card { width: 100%; max-width: 480px; background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 48px 44px; text-align: center; }
  .lg .mark { width: 48px; height: 48px; background: var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .lg .mark svg { width: 26px; height: 26px; }
  .lg h1 { font-size: 30px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; }
  .lg .sub { font-size: 15px; color: var(--muted); margin-bottom: 32px; }
  
  .lg .field { text-align: left; margin-bottom: 20px; }
  .lg label { display: block; font-size: 14px; font-weight: 500; color: var(--label); margin-bottom: 8px; }
  .lg .pass-wrap { position: relative; }
  .lg input { width: 100%; height: 48px; padding: 0 16px; border: 1px solid var(--border); border-radius: 10px; font-family: inherit; font-size: 16px; color: var(--ink); background: #fff; }
  .lg input:focus { outline: none; border-color: var(--accent); }
  .lg .pass-wrap input { padding-right: 44px; }
  .lg .eye { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; }
  .lg .eye svg { width: 18px; height: 18px; stroke: var(--muted); }

  .lg .row-end { text-align: right; margin-bottom: 24px; }
  .lg .link { color: var(--accent); font-size: 15px; font-weight: 500; text-decoration: none; background: none; border: none; cursor: pointer; font-family: inherit; }

  .lg .btn { width: 100%; height: 52px; background: var(--accent); color: #fff; border: none; border-radius: 12px; font-size: 17px; font-weight: 600; cursor: pointer; margin-bottom: 20px; font-family: inherit; }
  .lg .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .lg .foot { font-size: 15px; color: var(--label); }
  .lg .error { font-size: 13px; color: #DC2626; margin-top: 6px; text-align: left; border: 1px solid #FCA5A5; background: #FEF2F2; padding: 8px; border-radius: 8px; }

  @media (max-width: 560px) {
    .lg { padding: 24px 16px; }
    .lg .card { padding: 36px 24px; border-radius: 18px; }
    .lg h1 { font-size: 24px; }
  }
`;

const LogoMark = () => (
  <div className="mark">
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  </div>
);

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-606M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

// Formal routes mapping - Corrected to match your App.jsx
const ROLE_HOME = { 
  admin: "/admin", 
  staff: "/staff", 
  customer: "/customer" 
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setError(""); 
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(form);
      
      // Ensure role is treated as lowercase to match ROLE_HOME keys
      const userRole = user.role.toLowerCase();
      const targetPath = ROLE_HOME[userRole] || "/";
      
      console.log(`Success! Role identified: ${userRole}. Redirecting to: ${targetPath}`);
      navigate(targetPath);
      
    } catch (err) {
      // Use err.message if it's an Error object, otherwise use err
      setError(err.message || err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg">
      <style>{STYLES}</style>
      <form className="card" onSubmit={handleSubmit} noValidate>
        <LogoMark />
        <h1>Welcome back</h1>
        <p className="sub">Log in to your StockFlow account</p>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="admin@wms.com"
            value={form.email}
            onChange={update("email")}
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="pass-wrap">
            <input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={update("password")}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="eye"
              aria-label={showPass ? "Hide password" : "Show password"}
              onClick={() => setShowPass((s) => !s)}
            >
              <EyeIcon open={showPass} />
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>

        <div className="row-end">
          <Link className="link" to="/forgot-password">Forgot password?</Link>
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Log in"}
        </button>

        <p className="foot">
          Don't have an account? <Link className="link" to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}