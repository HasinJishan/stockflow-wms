import './AuthLayout.css';

export function AuthCard({ icon, iconBg = 'var(--color-accent)', title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon" style={{ background: iconBg }}>
          {icon}
        </div>
        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

export function FormField({ label, type = 'text', placeholder, hint, ...rest }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input type={type} placeholder={placeholder} {...rest} />
      {hint && <p className="form-hint">{hint}</p>}
    </div>
  );
}

export function SelectField({ label, children, ...rest }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <select {...rest}>{children}</select>
    </div>
  );
}
