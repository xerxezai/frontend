import { Link } from "react-router-dom";

/** Slim announcement strip rendered inside both site headers. Height must stay
 *  in sync with ANNOUNCE_H so fixed-header page offsets remain correct. */
export const ANNOUNCE_H = 34;

const AnnouncementBar = () => (
  <div style={{
    height: ANNOUNCE_H,
    background: "linear-gradient(90deg,#241708 0%,#2e1d09 50%,#241708 100%)",
    borderBottom: "1px solid rgba(201,136,58,0.28)",
    display: "flex", alignItems: "center", overflow: "hidden",
  }}>
    <div className="container" style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 10, whiteSpace: "nowrap", overflow: "hidden",
    }}>
      <i className="fas fa-rocket" style={{ color: "#E8A84E", fontSize: 11, flexShrink: 0 }} />
      <span className="d-none d-md-inline" style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 12,
        color: "rgba(255,255,255,0.78)", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        <strong style={{ color: "#E8A84E", fontWeight: 700 }}>New:</strong>
        {" "}AI Training Programs now available — 75+ professionals trained
      </span>
      <span className="d-none d-md-inline" style={{ color: "rgba(201,136,58,0.40)", fontSize: 12 }}>|</span>
      <Link
        to="/contact"
        style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700,
          color: "#E8A84E", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
          transition: "color 150ms ease",
        }}
        onMouseOver={e => (e.currentTarget.style.color = "#fff")}
        onMouseOut={e => (e.currentTarget.style.color = "#E8A84E")}
      >
        Book a Free Demo Today <i className="far fa-arrow-right" style={{ fontSize: 10 }} />
      </Link>
    </div>
  </div>
);

export default AnnouncementBar;
