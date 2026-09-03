import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // Added useParams
import axios from "axios"; // Added Axios

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  :root{--accent:#2F6FED;--ink:#111827;--muted:#6B7280;--label:#374151;--border:#D1D5DB;--line:#E5E5E0;--faint:#9CA3AF;}
  .rp * { box-sizing: border-box; margin: 0; padding: 0; }
  .rp { background: #FAFAF8; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; font-family: 'Inter', sans-serif; color: var(--ink); }
  .rp .card { width: 100%; max-width: 480px; background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 48px 44px; text-align: center; }
  .rp .mark { width: 48px; height: 48px; background: #EAF6EE; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .rp .mark svg { width: 24px; height: 24px; stroke: #1F9D55; }
  .rp h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; }
  .rp .sub { font-size: 15px; color: var(--muted); margin-bottom: 32px; }
  .rp .field { text-align: left; margin-bottom: 20px; }
  .rp label { display: block; font-size: 14px; font-weight: 500; color: var(--label); margin-bottom: 8px; }
  .rp .pass-wrap { position: relative; }
  .rp input { width: 100%; height: 48px; padding: 0 16px; border: 1px solid var(--border); border-radius: 10px; font-family: inherit; font-size: 16px; color: var(--ink); background: #fff; }
  .rp input:focus { outline: none; border-color: var(--accent); }
  .rp .pass-wrap input { padding-right: 44px; }
  .rp .eye { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; }
  .rp .eye svg { width: 18px; height: 18px; stroke: var(--muted); }
  .rp .hint { font-size: 13px; color: var(--faint); margin-top: 8px; }
  .rp .hint.ok { color: #16A34A; }
  .rp .error { font-size: 13px; color: #DC2626; margin-top: 6px; text-align: left; }
  .rp .btn { width: 100%; height: 52px; background: var(--accent); color: #fff; border: none; border-radius: 12px; font-size: 17px; font-weight: 600; cursor: pointer; margin-top: 8px; font-family: inherit; }
  .rp .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  @media (max-width: 560px) { .rp { padding: 24px 16px; } .rp .card { padding: 36px 24px; border-radius: 18px; } .rp h1 { font-size: 22px; } }
`;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);
const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>) : (<><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>)}
  </svg>
);

const isPasswordValid = (pw) => pw.length >= 8 && /\d/.test(pw);

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // GRABS THE SECRET TOKEN FROM THE URL
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid(form.password)) {
      setError("Password must be at least 8 characters and include a number.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      // Connect to your backend PUT route
      await axios.put(`http://localhost:5000/api/auth/reset-password/${token}`, { 
        password: form.password 
      });
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Token is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rp">
        <style>{STYLES}</style>
        <div className="card">
          <div className="mark"><CheckIcon /></div>
          <h1>Password reset</h1>
          <p className="sub">Your password has been changed successfully. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  const matches = form.confirm.length > 0 && form.password === form.confirm;

  return (
    <div className="rp">
      <style>{STYLES}</style>
      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="mark"><CheckIcon /></div>
        <h1>Set a new password</h1>
        <p className="sub">Choose something strong you haven't used before.</p>

        <div className="field">
          <label htmlFor="password">New password</label>
          <div className="pass-wrap">
            <input id="password" type={showPass ? "text" : "password"} placeholder="Enter new password" value={form.password} onChange={update("password")} required />
            <button type="button" className="eye" onClick={() => setShowPass((s) => !s)}><EyeIcon open={showPass} /></button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" type={showPass ? "text" : "password"} placeholder="Re-enter new password" value={form.confirm} onChange={update("confirm")} required />
          <p className={`hint${matches ? " ok" : ""}`}>Passwords must match.</p>
          {error && <p className="error">{error}</p>}
        </div>

        <button className="btn" type="submit" disabled={loading}>{loading ? "Resetting…" : "Reset password"}</button>
      </form>
    </div>
  );
}