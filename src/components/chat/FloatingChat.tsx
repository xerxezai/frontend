import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Mail,
  MessageCircle,
  LogIn,
  GraduationCap,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-production-b9f2.up.railway.app/api/v1";

const GOLD = "#C9883A";
const GOLD_LIGHT = "#e8a84e";
const DARK = "#1a1208";
const DARK_2 = "#241a0d";
const CREAM = "#F8F7F4";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi, I'm the Xerxez AI Assistant. Ask me about our ERP, Academy, or DevSecOps & Cloud services — or use a quick option below.",
};

type QuickReply = {
  label: string;
  action: "ask" | "navigate" | "sales" | "demo";
  payload?: string;
};

const QUICK_REPLIES: QuickReply[] = [
  { label: "Tell me about ERP", action: "ask", payload: "Tell me about the ERP product." },
  { label: "Tell me about Academy", action: "ask", payload: "Tell me about LMA Academy." },
  { label: "DevSecOps Services", action: "ask", payload: "Tell me about your DevSecOps & Cloud services." },
  { label: "Book a Demo", action: "demo" },
  { label: "Talk to Sales", action: "sales" },
  { label: "Student Login", action: "navigate", payload: "/lma/login" },
  { label: "ERP Login", action: "navigate", payload: "/erp" },
];

const FloatingChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSalesOptions, setShowSalesOptions] = useState(false);
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
    setShowSalesOptions(false);
    if (qr.action === "navigate" && qr.payload) {
      navigate(qr.payload);
      setOpen(false);
      return;
    }
    if (qr.action === "demo") {
      setMessages((m) => [
        ...m,
        { role: "user", content: qr.label },
        {
          role: "assistant",
          content:
            "I'd love to set that up. Fill in the short form on our contact page and our team will confirm a demo slot within 24 hours.",
        },
      ]);
      setTimeout(() => navigate("/contact"), 900);
      return;
    }
    if (qr.action === "sales") {
      setMessages((m) => [
        ...m,
        { role: "user", content: qr.label },
        {
          role: "assistant",
          content: "You can reach our sales team directly — pick whichever is easiest:",
        },
      ]);
      setShowSalesOptions(true);
      return;
    }
    if (qr.action === "ask" && qr.payload) {
      askAI(qr.payload);
    }
  };

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setShowSalesOptions(false);
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
              height: 520,
              maxHeight: "calc(100vh - 140px)",
              borderRadius: 20,
              background: DARK,
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              border: `1px solid rgba(201,136,58,0.25)`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${DARK} 0%, #0f0a05 100%)`,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid rgba(201,136,58,0.18)`,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `linear-gradient(145deg, ${GOLD_LIGHT}, ${GOLD})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 10px rgba(201,136,58,0.4)",
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
                flex: 1,
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
                      background:
                        m.role === "user" ? `linear-gradient(145deg, ${GOLD_LIGHT}, ${GOLD})` : DARK_2,
                      color: m.role === "user" ? "#fff" : CREAM,
                      border: m.role === "user" ? "none" : "1px solid rgba(201,136,58,0.16)",
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
                      background: DARK_2,
                      border: "1px solid rgba(201,136,58,0.16)",
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
                          background: GOLD,
                          display: "inline-block",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {showSalesOptions && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a
                    href="mailto:info@xerxez.com"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: DARK_2,
                      border: `1px solid ${GOLD}`,
                      borderRadius: 10,
                      padding: "8px 12px",
                      fontSize: 12,
                      color: GOLD_LIGHT,
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <Mail size={13} /> Email Sales
                  </a>
                  <a
                    href="https://wa.me/971567867451"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: DARK_2,
                      border: `1px solid ${GOLD}`,
                      borderRadius: 10,
                      padding: "8px 12px",
                      fontSize: 12,
                      color: GOLD_LIGHT,
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div
              style={{
                padding: "8px 14px",
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                borderTop: "1px solid rgba(201,136,58,0.12)",
                flexShrink: 0,
              }}
            >
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.label}
                  onClick={() => handleQuickReply(qr)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(201,136,58,0.10)",
                    border: `1px solid rgba(201,136,58,0.30)`,
                    borderRadius: 20,
                    padding: "5px 11px",
                    fontSize: 11,
                    color: GOLD_LIGHT,
                    cursor: "pointer",
                    fontWeight: 500,
                    marginTop: 6,
                  }}
                >
                  {qr.action === "navigate" && qr.payload === "/erp" && <LogIn size={11} />}
                  {qr.action === "navigate" && qr.payload === "/lma/login" && <GraduationCap size={11} />}
                  {qr.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px 12px 14px",
                display: "flex",
                gap: 8,
                alignItems: "center",
                borderTop: "1px solid rgba(201,136,58,0.14)",
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
                  border: "1px solid rgba(201,136,58,0.25)",
                  borderRadius: 10,
                  padding: "9px 13px",
                  fontSize: 13,
                  color: CREAM,
                  outline: "none",
                  background: DARK_2,
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
                  background: `linear-gradient(145deg, ${GOLD_LIGHT}, ${GOLD})`,
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
          background: `linear-gradient(145deg, ${GOLD_LIGHT}, ${GOLD})`,
          border: "none",
          boxShadow: "0 4px 22px rgba(201,136,58,0.45)",
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
              border: `2px solid ${DARK}`,
            }}
          />
        )}
      </motion.button>
    </>
  );
};

export default FloatingChat;
