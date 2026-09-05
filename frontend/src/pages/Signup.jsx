import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios"; // Import axios

const STYLES = `
  /* ... keeping your existing styles ... */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  :root{--accent:#2F6FED;--ink:#111827;--muted:#6B7280;--label:#374151;--border:#D1D5DB;--line:#E5E5E0;--faint:#9CA3AF;}
  .su * { box-sizing: border-box; margin: 0; padding: 0; }
  .su { background: #FAFAF8; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; font-family: 'Inter', sans-serif; color: var(--ink); }
  .su .card { width: 100%; max-width: 500px; background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 44px; text-align: center; }
  .su .mark { width: 48px; height: 48px; background: var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .su .mark svg { width: 26px; height: 26px; }
  .su h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; }
  .su .sub { font-size: 15px; color: var(--muted); margin-bottom: 28px; }
  .su .field { text-align: left; margin-bottom: 18px; }
  .su label { display: block; font-size: 14px; font-weight: 500; color: var(--label); margin-bottom: 8px; }
  .su input, .su select { width: 100%; height: 48px; padding: 0 16px; border: 1px solid var(--border); border-radius: 10px; font-family: inherit; font-size: 16px; color: var(--ink); background: #fff; appearance: none; }
  .su input:focus, .su select:focus { outline: none; border-color: var(--accent); }
  .su .select-wrap { position: relative; }
  .su .select-wrap svg { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; pointer-events: none; stroke: var(--ink); }
  .su .pass-wrap { position: relative; }
  .su .pass-wrap input { padding-right: 44px; }
  .su .eye { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; }
  .su .eye svg { width: 18px; height: 18px; stroke: var(--muted); }
  .su .hint { font-size: 13px; color: var(--faint); margin-top: 8px; }
  .su .hint.ok { color: #16A34A; }
  .su .error { font-size: 13px; color: #DC2626; margin-top: 6px; text-align: left; }
  .su .btn { width: 100%; height: 52px; background: var(--accent); color: #fff; border: none; border-radius: 12px; font-size: 17px; font-weight: 600; cursor: pointer; margin: 24px 0 20px; font-family: inherit; }
  .su .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .su .link { color: var(--accent); font-size: 15px; font-weight: 500; text-decoration: none; }
  .su .foot { font-size: 15px; color: var(--label); }
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
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
    ) : (
      <><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
    )}
  </svg>
);

const isPasswordValid = (pw) => pw.length >= 8 && /\d/.test(pw);

export default function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", role: "staff", password: "" }); // Renamed 'name' to 'fullName'
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For redirecting

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email) {
      setError("Please fill in your name and email.");
      return;
    }
    if (!isPasswordValid(form.password)) {
      setError("Password must be at least 8 characters and include a number.");
      return;
    }

    setLoading(true);
    try {
      // API call to your backend
      const res = await axios.post('https://stockflow-wms-backend.onrender.com/api/auth/register', form);
      
      if (res.status === 201) {
        alert("Account created! You can now log in.");
        navigate("/login"); // Go to login page
      }
    } catch (err) {
      // Display the specific message from backend (e.g., "User already exists")
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const passwordTouched = form.password.length > 0;

  return (
    <div className="su">
      <style>{STYLES}</style>
      <form className="card" onSubmit={handleSubmit} noValidate>
        <LogoMark />
        <h1>Create your account</h1>
        <p className="sub">Start managing your warehouse today</p>

        <div className="field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            placeholder="Alex Rivera"
            value={form.fullName} // Changed
            onChange={update("fullName")} // Changed
            autoComplete="name"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            type="email"
            placeholder="name@warehouse.com"
            value={form.email}
            onChange={update("email")}
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="role">Role</label>
          <div className="select-wrap">
            <select id="role" value={form.role} onChange={update("role")}>
              <option value="staff">Warehouse staff</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="pass-wrap">
            <input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="Create a password"
              value={form.password}
              onChange={update("password")}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="eye"
              onClick={() => setShowPass((s) => !s)}
            >
              <EyeIcon open={showPass} />
            </button>
          </div>
          <p className={`hint${passwordTouched && isPasswordValid(form.password) ? " ok" : ""}`}>
            At least 8 characters, one number.
          </p>
          {error && <p className="error">{error}</p>}
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="foot">
          Already have an account? <Link className="link" to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}