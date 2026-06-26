import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface Message {
  from: "bot" | "user";
  text: string;
}

const INIT: Message[] = [
  {
    from: "bot",
    text: "Hi! 👋 I'm the XERXEZ AI assistant. Need help with ERP, MLOps, DevSecOps, or Cloud solutions? Ask away — or connect with our team directly.",
  },
];

const QUICK = [
  "What services do you offer?",
  "How long does a project take?",
  "Can I see pricing?",
];

const BOT_REPLIES: Record<string, string> = {
  "What services do you offer?":
    "We offer AI-native ERP, MLOps pipelines, DevSecOps, cloud migration, custom software, and enterprise AI training. Visit /service for the full list.",
  "How long does a project take?":
    "Most enterprise projects go live in under 6 months. Discovery + architecture takes 2–4 weeks, then we sprint in 2-week cycles. Want to schedule a discovery call?",
  "Can I see pricing?":
    "Pricing is project-specific — we offer fixed-scope, T&M, and retainer models. Drop us a message at /contact and we'll send a tailored estimate within 24h.",
};

const FloatingChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INIT);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { from: "user", text: text.trim() };
    const reply = BOT_REPLIES[text.trim()] ??
      "Great question! For a detailed answer, please contact our team at /contact — we'll respond within 24 hours.";
    setMessages((m) => [...m, userMsg, { from: "bot", text: reply }]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 20, zIndex: 1050,
          width: 320, borderRadius: 16,
          background: "#fff", boxShadow: "0 8px 48px rgba(0,0,0,0.16)",
          border: "1px solid #E5E5E5", overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{
            background: "#C9883A", padding: "14px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <i className="fas fa-robot" style={{ color: "#fff", fontSize: 16 }} />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>XERXEZ AI</div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                  <span style={{
                    display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                    background: "#4ade80", marginRight: 4,
                  }} />
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}
            >
              <i className="fas fa-times" style={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 8px",
            display: "flex", flexDirection: "column", gap: 10,
            maxHeight: 280, minHeight: 180,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.from === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "82%",
                  background: m.from === "user" ? "#C9883A" : "#F5F5F7",
                  color: m.from === "user" ? "#fff" : "#0A0A0A",
                  borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  padding: "9px 13px", fontSize: 13, lineHeight: 1.5,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div style={{ padding: "6px 14px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                style={{
                  background: "#FFF8EE", border: "1px solid rgba(201,136,58,0.20)",
                  borderRadius: 20, padding: "4px 10px",
                  fontSize: 11, color: "#C9883A", cursor: "pointer", fontWeight: 500,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: "8px 12px 12px",
            display: "flex", gap: 8, alignItems: "center",
            borderTop: "1px solid #E5E5E5",
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Type a message…"
              style={{
                flex: 1, border: "1px solid #E5E5E5", borderRadius: 8,
                padding: "8px 12px", fontSize: 13, color: "#0A0A0A",
                outline: "none", background: "#F5F5F7",
              }}
            />
            <button
              onClick={() => send(input)}
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "none",
                background: "#C9883A", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <i className="fas fa-paper-plane" style={{ fontSize: 13 }} />
            </button>
          </div>

          {/* Footer */}
          <div style={{
            padding: "8px 14px", borderTop: "1px solid #E5E5E5",
            fontSize: 11, color: "#9E9E9E", textAlign: "center",
          }}>
            For detailed help,{" "}
            <Link to="/contact" style={{ color: "#C9883A", textDecoration: "none", fontWeight: 600 }}>
              contact our team
            </Link>{" "}
            — 24h response.
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "Close chat" : "Open AI chat"}
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed", bottom: 24, right: 20, zIndex: 1050,
          width: 54, height: 54, borderRadius: "50%",
          background: "#C9883A", border: "none",
          boxShadow: "0 4px 20px rgba(201,136,58,0.40)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        <i
          className={open ? "fas fa-times" : "fas fa-comment-dots"}
          style={{ color: "#fff", fontSize: 22 }}
        />
        {!open && (
          <span style={{
            position: "absolute", top: -2, right: -2,
            width: 16, height: 16, borderRadius: "50%",
            background: "#4ade80", border: "2px solid #fff",
          }} />
        )}
      </button>
    </>
  );
};

export default FloatingChat;

