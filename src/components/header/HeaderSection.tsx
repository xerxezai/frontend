import { useCustomContext } from "../../context/context";
import MainMenuSection from "./MainMenuSection";
import { Link } from "react-router-dom";
import Image from "../utils/Image";
import AnnouncementBar, { ANNOUNCE_H } from "../marketing/AnnouncementBar";

interface Props {
  variant?: boolean;
}

/** Fixed header total height = announcement bar + nav row. Pages using this
 *  header must offset content by HEADER_TOTAL_H. */
export const HEADER_TOTAL_H = 72 + ANNOUNCE_H;

const HeaderSection = ({ variant: _variant }: Props) => {
  const { toggleMobileMenu } = useCustomContext();

  return (
    <header
      className="hdr-s1"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 9999,
        height: HEADER_TOTAL_H,
        background: "rgba(16,11,6,0.96)",
        borderBottom: "1px solid rgba(201,136,58,0.16)",
        boxShadow: "0 2px 0 rgba(201,136,58,0.14), 0 6px 28px rgba(0,0,0,0.50)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
      }}
    >
      <AnnouncementBar />
      <div className="container" style={{ height: 72 }}>
        <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}>

          {/* ── Left: Logo ── */}
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Link to="/" style={{ display: "inline-block", textDecoration: "none", lineHeight: 0 }}>
              <Image
                src="/assets/img/logo/xerxez_logo.png"
                alt="XERXEZ AI ERP Logo"
                width={220}
                height={80}
                style={{ height: 100, width: "auto", display: "block" }}
              />
            </Link>
          </div>

          {/* ── Centre: Nav links ── */}
          <div className="header-main d-none d-xl-block" style={{ padding: 0, flexShrink: 0 }}>
            <MainMenuSection />
          </div>

          {/* ── Right: Actions ── */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
          }}>
            {/* Sign in */}
            <Link
              to="/erp"
              className="d-none d-xl-inline-flex"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14, fontWeight: 500,
                color: "rgba(255,255,255,0.72)",
                textDecoration: "none",
                padding: "8px 12px",
                transition: "color 150ms ease",
              }}
              onMouseOver={e => (e.currentTarget.style.color = "#C9883A")}
              onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
            >
              Sign in
            </Link>

            {/* Book Free Demo */}
            <Link
              to="/contact"
              className="d-none d-xl-inline-flex"
              style={{
                alignItems: "center",
                background: "linear-gradient(135deg, #E8A84E 0%, #C9883A 100%)",
                color: "#0a0806",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14, fontWeight: 700,
                padding: "0 22px",
                height: 40,
                borderRadius: 8,
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 3px 0 rgba(100,58,10,0.50), 0 6px 18px rgba(201,136,58,0.20)",
                transition: "opacity 150ms ease, box-shadow 150ms ease",
              }}
              onMouseOver={e => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.boxShadow = "0 1px 0 rgba(100,58,10,0.40), 0 2px 8px rgba(201,136,58,0.16)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow = "0 3px 0 rgba(100,58,10,0.50), 0 6px 18px rgba(201,136,58,0.20)";
              }}
            >
              Book Free Demo
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="d-xl-none"
              onClick={toggleMobileMenu}
              style={{
                background: "none",
                border: "1px solid rgba(201,136,58,0.30)",
                borderRadius: 8,
                padding: "8px 10px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1,
              }}
              aria-label="Open menu"
            >
              <i className="fal fa-bars" style={{ fontSize: 16 }} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
