import { useState } from "react";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await signIn(email, password);
    if (err) setError("Invalid email or password.");
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f7f7f7", fontFamily: "var(--font-body)",
    }}>
      <div style={{ width: "100%", maxWidth: "380px", padding: "0 24px" }}>

        {/* Logo / brand */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "14px",
            background: "#111", display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: "16px",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7 3 3 7 3 12C3 15 4.5 17.5 7 19.5V21H17V19.5C19.5 17.5 21 15 21 12C21 7 17 3 12 3Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 21V17C9 15.3 10.3 14 12 14C13.7 14 15 15.3 15 17V21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="12" y1="3" x2="12" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="7" y1="5.5" x2="9.5" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="17" y1="5.5" x2="14.5" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "#111", letterSpacing: "-0.03em", margin: "0 0 4px" }}>
            Bays Ranch
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#999", margin: 0 }}>Sign in to continue</p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: "20px", padding: "32px",
          border: "1px solid #e5e5e5", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: "6px", letterSpacing: "0.02em" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@baysranch.com"
                required
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "10px",
                  border: "1px solid #e5e5e5", background: "#fafafa",
                  fontSize: "0.85rem", color: "#111", outline: "none",
                  fontFamily: "var(--font-body)", boxSizing: "border-box",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "#aaa")}
                onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: "6px", letterSpacing: "0.02em" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "10px",
                  border: "1px solid #e5e5e5", background: "#fafafa",
                  fontSize: "0.85rem", color: "#111", outline: "none",
                  fontFamily: "var(--font-body)", boxSizing: "border-box",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "#aaa")}
                onBlur={e => (e.currentTarget.style.borderColor = "#e5e5e5")}
              />
            </div>

            {error && (
              <div style={{
                marginBottom: "16px", padding: "10px 14px", borderRadius: "10px",
                background: "#fef2f2", border: "1px solid #fecaca",
                fontSize: "0.78rem", color: "#b91c1c", fontFamily: "var(--font-body)",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "11px", borderRadius: "10px",
                background: loading ? "#888" : "#111", color: "#fff", border: "none",
                fontSize: "0.85rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)", transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#333"; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#111"; }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#ccc", marginTop: "24px" }}>
          Toph · Field Management Platform
        </p>
      </div>
    </div>
  );
}
