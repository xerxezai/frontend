import { Link } from "react-router-dom";

interface Props {
  variant?: boolean;
}

const FooterBottomSection = ({ variant }: Props) => {
  return (
    <div
      className={`footer-bottom ${variant ? "bg-4" : ""}`}
      style={{
        background: "#F2EFE9",
        
      }}
    >
      <div className="container">
        <div
          className="footer-wrapper d-flex align-items-center justify-content-between"
          style={{ padding: "16px 0" }}
        >
          <p style={{ color: "#9B9690", margin: 0, fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
            &copy; {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
          <ul style={{ display: "flex", gap: 20, margin: 0, padding: 0, listStyle: "none" }}>
            {[
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms",   label: "Terms of Use" },
              { to: "/sitemap", label: "Site Map" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  style={{ color: "#9B9690", fontSize: 12, textDecoration: "none", fontFamily: "'Inter', sans-serif" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#141413")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9B9690")}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FooterBottomSection;
