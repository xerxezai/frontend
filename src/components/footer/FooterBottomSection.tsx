import { Link } from "react-router-dom";

interface Props {
  variant?: boolean;
}

const FooterBottomSection = ({ variant }: Props) => {
  return (
    <div
      className={`footer-bottom ${variant ? "bg-4" : ""}`}
      style={{
        background: "#1a2744",
        borderTop: "1px solid #243460",
      }}
    >
      <div className="container">
        <div className="footer-wrapper d-flex align-items-center justify-content-between"
          style={{ padding: "18px 0" }}
        >
          <p style={{ color: "#5a6b8a", margin: 0, fontSize: "12px" }}>
            &copy; {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
          <ul className="footer-menu" style={{ display: "flex", gap: "20px", margin: 0, padding: 0, listStyle: "none" }}>
            <li>
              <Link to="/privacy" style={{ color: "#5a6b8a", fontSize: "12px", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c8d4e8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5a6b8a")}
              >Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" style={{ color: "#5a6b8a", fontSize: "12px", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c8d4e8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5a6b8a")}
              >Terms of Use</Link>
            </li>
            <li>
              <Link to="/sitemap" style={{ color: "#5a6b8a", fontSize: "12px", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c8d4e8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5a6b8a")}
              >Site Map</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FooterBottomSection;