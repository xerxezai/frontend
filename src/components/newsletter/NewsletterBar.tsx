import { useState } from "react";
import { toast } from "react-toastify";

const NewsletterBar = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      toast.success("You're subscribed! Watch your inbox for insights.");
    }, 1500);
  };

  return (
    <section style={{
      background: "linear-gradient(135deg, #5a47c0 0%, #6c57d2 60%, #8b73ff 100%)",
      padding: "56px 0",
    }}>
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{
                background: "rgba(255,255,255,0.18)", borderRadius: 20,
                padding: "4px 14px", fontSize: 12, fontWeight: 700,
                color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                <i className="fas fa-envelope" style={{ marginRight: 6 }} />
                Newsletter
              </span>
              <span style={{
                background: "rgba(74,222,128,0.20)", borderRadius: 20,
                padding: "4px 12px", fontSize: 11, fontWeight: 600, color: "#4ade80",
              }}>
                Join 2,000+ engineers
              </span>
            </div>
            <h2 style={{
              color: "#fff", fontWeight: 800, fontSize: 30, margin: 0, lineHeight: 1.25,
            }}>
              Stay Ahead in Tech
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.78)", marginTop: 10, fontSize: 15, marginBottom: 0,
            }}>
              Weekly insights on AI, ERP, MLOps, and cloud engineering.
              No fluff — just what enterprise teams actually use.
            </p>
          </div>

          <div className="col-lg-6">
            <form onSubmit={handleSubmit}>
              <div style={{
                display: "flex", gap: 0,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.25)",
                overflow: "hidden",
                backdropFilter: "blur(8px)",
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  disabled={loading}
                  style={{
                    flex: 1, border: "none", background: "transparent",
                    padding: "16px 20px", fontSize: 14,
                    color: "#fff", outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#fff", border: "none",
                    padding: "16px 24px", cursor: "pointer",
                    fontWeight: 700, fontSize: 14, color: "#6c57d2",
                    whiteSpace: "nowrap", flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#F0EEFF")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#fff")}
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin" />
                  ) : (
                    <>Subscribe <i className="far fa-arrow-right" style={{ marginLeft: 6 }} /></>
                  )}
                </button>
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 10, marginBottom: 0 }}>
                <i className="fas fa-lock" style={{ marginRight: 5 }} />
                No spam. Unsubscribe any time.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterBar;
