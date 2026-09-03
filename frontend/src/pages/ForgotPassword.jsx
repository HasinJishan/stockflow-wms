import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Added for real API calls

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  :root{--accent:#2F6FED;--accent-tint:#EFF4FF;--ink:#111827;--muted:#6B7280;--label:#374151;--border:#D1D5DB;--line:#E5E5E0;}
  .fp * { box-sizing: border-box; margin: 0; padding: 0; }
  .fp { background: #FAFAF8; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; font-family: 'Inter', sans-serif; color: var(--ink); }
  .fp .card { width: 100%; max-width: 480px; background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 48px 44px; text-align: center; }
  .fp .mark { width: 48px; height: 48px; background: var(--accent-tint); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .fp .mark svg { width: 24px; height: 24px; stroke: var(--accent); }
  .fp h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; line-height: 1.25; }
  .fp .sub { font-size: 15px; color: var(--muted); margin-bottom: 32px; }
  .fp .field { text-align: left; margin-bottom: 24px; }
  .fp label { display: block; font-size: 14px; font-weight: 500; color: var(--label); margin-bottom: 8px; }
  .fp input { width: 100%; height: 48px; padding: 0 16px; border: 1px solid var(--border); border-radius: 10px; font-family: inherit; font-size: 16px; color: var(--ink); background: #fff; }
  .fp input:focus { outline: none; border-color: var(--accent); }
  .fp .error { font-size: 13px; color: #DC2626; margin-top: 6px; text-align: left; }
  .fp .btn { width: 100%; height: 52px; background: var(--accent); color: #fff; border: none; border-radius: 12px; font-size: 17px; font-weight: 600; cursor: pointer; margin-bottom: 24px; font-family: inherit; }
  .fp .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .fp .back-link { display: inline-flex; align-items: center; justify-content: center; gap: 6px; color: var(--accent); font-size: 15px; font-weight: 500; text-decoration: none; }
  .fp .back-link svg { width: 16px; height: 16px; stroke: var(--accent); }
  .fp .success .mark { background: #DCFCE7; }
  .fp .success .mark svg { stroke: #16A34A; }
  .fp .resend { background: none; border: none; color: var(--accent); font-size: 15px; font-weight: 500; cursor: pointer; font-family: inherit; margin-bottom: 20px; }
  @media (max-width: 560px) { .fp { padding: 24px 16px; } .fp .card { padding: 36px 24px; border-radius: 18px; } .fp h1 { font-size: 22px; } }
`;

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
);
const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // Connect to your real backend endpoint
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "User not found or server error.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="fp">
        <style>{STYLES}</style>
        <div className="card success">
          <div className="mark"><MailIcon /></div>
          <h1>Check your email</h1>
          <p className="sub">We sent a password reset link to {email}.</p>
          <button className="resend" onClick={() => setSent(false)}>Use a different email</button>
          <Link className="back-link" to="/login"><BackArrow />Back to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fp">
      <style>{STYLES}</style>
      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="mark"><LockIcon /></div>
        <h1>Forgot your password?</h1>
        <p className="sub">Enter the email on your account and we'll send you a link to reset it.</p>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="name@warehouse.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && <p className="error">{error}</p>}
        </div>
        <button className="btn" type="submit" disabled={loading}>{loading ? "Sending…" : "Send reset link"}</button>
        <Link className="back-link" to="/login"><BackArrow />Back to log in</Link>
      </form>
    </div>
  );
}