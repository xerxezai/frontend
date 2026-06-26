const items = [
  { icon: "fas fa-lock",          label: "SSL Encrypted",          sub: "All data protected in transit" },
  { icon: "fas fa-certificate",   label: "ISO 27001 Aligned",      sub: "Enterprise security standard" },
  { icon: "fas fa-clock",         label: "Response < 24h",         sub: "We reply every business day" },
  { icon: "fas fa-ban",           label: "No Spam, Ever",          sub: "Your email stays private" },
  { icon: "fas fa-building",      label: "100+ Enterprise Clients", sub: "Trusted globally" },
];

const ContactTrustBar = () => (
  <div style={{
    background: "#FFF8EE",
    borderTop: "1px solid rgba(201,136,58,0.12)",
    borderBottom: "1px solid rgba(201,136,58,0.12)",
    padding: "20px 0",
  }}>
    <div className="container">
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "16px 40px",
      }}>
        {items.map((item) => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "#fff",
              border: "1px solid rgba(201,136,58,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <i className={item.icon} style={{ color: "#C9883A", fontSize: 14 }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0A0A0A", lineHeight: 1.2 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 11, color: "#6B6B6B", marginTop: 2 }}>
                {item.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ContactTrustBar;

