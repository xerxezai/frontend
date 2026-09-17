import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  LogIn,
  GraduationCap,
  Building2,
  ShieldCheck,
  CalendarClock,
  PhoneCall,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-production-b9f2.up.railway.app/api/v1";

// ── v2 navy/red theme tokens ─────────────────────────────────────────────────
const RED = "#D93522";
const NAVY = "#071a33";
const NAVY_2 = "#0c294d";
const CREAM = "#F8F7F4";
const BOT_BUBBLE_BG = "#F4F7FA";
const BOT_TEXT = "#0f2c4d";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi, I'm the Xerxez AI Assistant. Ask me about our ERP, Academy, or DevSecOps & Cloud services — or use a quick option below.",
};

// Every quick reply is a direct link to a real route, each with its own icon
// for quick scanning (was icon-inconsistent — only 2 of 7 had one).
type QuickReply = { label: string; to: string; icon: LucideIcon };

const QUICK_REPLIES: QuickReply[] = [
  { label: "Tell me about ERP", to: "/services/ai-powered-erp", icon: Building2 },
  { label: "Tell me about Academy", to: "/training", icon: GraduationCap },
  { label: "DevSecOps Services", to: "/services/devsecops-mlops-solutions", icon: ShieldCheck },
  { label: "Book a Demo", to: "/contact", icon: CalendarClock },
  { label: "Talk to Sales", to: "/contact", icon: PhoneCall },
  { label: "Student Login", to: "/lma/login", icon: GraduationCap },
  { label: "ERP Login", to: "/erp/login", icon: LogIn },
];

const FloatingChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  const askAI = async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/chat/message/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history
            .filter((m) => m !== GREETING)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            data.reply ||
            "I'm having trouble responding right now. Please reach us at info@xerxez.com.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please reach us at info@xerxez.com or via xerxez.com/contact.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (qr: QuickReply) => {
    navigate(qr.to);
    setOpen(false);
  };

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    askAI(text);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: 96,
              right: 20,
              zIndex: 1050,
              width: 360,
              maxWidth: "calc(100vw - 32px)",
              // No fixed height — the panel hugs its content (greeting + quick
              // options + input) so it doesn't open with a big dead gap, and
              // only grows into a scrolling conversation once there's enough
              // messages to need it.
              maxHeight: "calc(100vh - 140px)",
              borderRadius: 20,
              background: NAVY,
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              border: `1px solid rgba(217,53,34,0.25)`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: NAVY,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid rgba(217,53,34,0.18)`,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: RED,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 10px rgba(217,53,34,0.4)",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={19} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ color: CREAM, fontWeight: 700, fontSize: 14, letterSpacing: 0.2 }}>
                    Xerxez AI Assistant
                  </div>
                  <div style={{ color: "rgba(248,247,244,0.55)", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                    {/* "Online" badge — kept as-is (green dot) */}
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#4ade80",
                      }}
                    />
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  color: CREAM,
                  cursor: "pointer",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: "1 1 auto",
                minHeight: 0,   // lets this shrink to scroll once maxHeight caps the panel, instead of forcing overflow
                overflowY: "auto",
                padding: "16px 16px 8px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "84%",
                      background: m.role === "user" ? RED : BOT_BUBBLE_BG,
                      color: m.role === "user" ? "#fff" : BOT_TEXT,
                      border: "none",
                      borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      padding: "10px 13px",
                      fontSize: 13,
                      lineHeight: 1.55,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      background: BOT_BUBBLE_BG,
                      borderRadius: "14px 14px 14px 4px",
                      padding: "11px 15px",
                      display: "flex",
                      gap: 4,
                    }}
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: RED,
                          display: "inline-block",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick replies — each navigates straight to its route */}
            <div
              style={{
                padding: "10px 14px 8px",
                borderTop: "1px solid rgba(217,53,34,0.12)",
                flexShrink: 0,
              }}
            >
              <div style={{
                fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.40)",
                letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 8,
              }}>
                Quick options
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.label}
                  onClick={() => handleQuickReply(qr)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(217,53,34,0.08)",
                    border: `1px solid rgba(217,53,34,0.25)`,
                    borderRadius: 20,
                    padding: "5px 11px",
                    fontSize: 11,
                    color: RED,
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "background 150ms ease, color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = RED;
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(217,53,34,0.08)";
                    e.currentTarget.style.color = RED;
                  }}
                >
                  <qr.icon size={11} />
                  {qr.label}
                </button>
              ))}
              </div>
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px 12px 14px",
                display: "flex",
                gap: 8,
                alignItems: "center",
                borderTop: "1px solid rgba(217,53,34,0.14)",
                flexShrink: 0,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about Xerxez…"
                style={{
                  flex: 1,
                  border: "1px solid rgba(217,53,34,0.25)",
                  borderRadius: 10,
                  padding: "9px 13px",
                  fontSize: 13,
                  color: CREAM,
                  outline: "none",
                  background: NAVY_2,
                }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "none",
                  background: RED,
                  color: "#fff",
                  cursor: loading || !input.trim() ? "default" : "pointer",
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? "Close chat" : "Open AI chat"}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 20,
          zIndex: 1050,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: RED,
          border: "none",
          boxShadow: "0 4px 22px rgba(217,53,34,0.45)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            style={{ display: "flex" }}
          >
            {open ? <X size={22} color="#fff" /> : <Sparkles size={22} color="#fff" />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "#4ade80",
              border: `2px solid ${NAVY}`,
            }}
          />
        )}
      </motion.button>
    </>
  );
};

export default FloatingChat;
