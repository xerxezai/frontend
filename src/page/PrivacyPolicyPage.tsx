import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";

const orange = "#C9883A";
const cream  = "#F8F7F4";
const white  = "#FFFFFF";
const dark   = "#1A1A1A";
const body   = "#555555";
const border = "rgba(0,0,0,0.08)";

const sections = [
  {
    n: "01",
    title: "Introduction",
    content: (
      <p>
        XERXEZ Solutions ("XERXEZ", "we", "us", or "our") is committed to
        protecting your privacy. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you visit{" "}
        <a href="https://xerxez.com" style={{ color: orange, textDecoration: "none", fontWeight: 600 }}>
          xerxez.com
        </a>{" "}
        or engage our services. Please read this policy carefully. If you
        disagree with its terms, please discontinue use of our site.
      </p>
    ),
  },
  {
    n: "02",
    title: "Information We Collect",
    content: (
      <>
        <p>We may collect the following categories of information:</p>
        <ul>
          <li><strong>Contact information</strong> — name, email address, phone number.</li>
          <li><strong>Company information</strong> — organisation name, job title, company size.</li>
          <li><strong>Usage data</strong> — pages visited, time spent, referral source, browser type, IP address.</li>
          <li><strong>Cookies and tracking data</strong> — session identifiers, analytics cookies, preference cookies.</li>
          <li><strong>Communication records</strong> — emails, enquiry forms, and chat transcripts when you contact us.</li>
        </ul>
        <p>
          We collect this information only when you voluntarily provide it
          (e.g. submitting a contact form) or automatically through standard
          web technologies when you browse our site.
        </p>
      </>
    ),
  },
  {
    n: "03",
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to enquiries, demo requests, and sales conversations.</li>
          <li>Provide, manage, and improve our services.</li>
          <li>Understand how visitors use our website and improve the user experience.</li>
          <li>Send relevant communications, newsletters, or service updates — only with your explicit consent.</li>
          <li>Comply with legal obligations and enforce our agreements.</li>
        </ul>
        <p>
          We do not use your data for automated decision-making or profiling
          that produces legal or similarly significant effects.
        </p>
      </>
    ),
  },
  {
    n: "04",
    title: "Data Security",
    content: (
      <>
        <p>
          We implement industry-standard technical and organisational measures
          to protect your data:
        </p>
        <ul>
          <li><strong>AES-256 encryption</strong> for data at rest and TLS 1.3 for data in transit.</li>
          <li><strong>ISO 27001-aligned processes</strong> governing access control, incident response, and change management.</li>
          <li><strong>Zero-trust network architecture</strong> — access is never assumed; every request is verified.</li>
          <li><strong>No data is sold</strong> to third parties under any circumstances.</li>
          <li>Data is stored in secure, SOC 2-compliant cloud infrastructure (AWS / Azure / GCP).</li>
        </ul>
        <p>
          Despite our precautions, no method of internet transmission is 100%
          secure. We encourage you to use strong passwords and to contact us
          immediately if you suspect any unauthorised access.
        </p>
      </>
    ),
  },
  {
    n: "05",
    title: "Your Rights",
    content: (
      <>
        <p>
          Depending on your location, you may have the following rights
          regarding your personal data:
        </p>
        <ul>
          <li><strong>Right to access</strong> — request a copy of the personal data we hold about you.</li>
          <li><strong>Right to rectification</strong> — request correction of inaccurate or incomplete data.</li>
          <li><strong>Right to erasure</strong> — request deletion of your personal data where it is no longer necessary.</li>
          <li><strong>Right to restriction</strong> — request we limit how we process your data in certain circumstances.</li>
          <li><strong>Right to data portability</strong> — receive your data in a structured, machine-readable format.</li>
          <li><strong>Right to object</strong> — object to processing based on legitimate interests or for direct marketing.</li>
        </ul>
        <p>
          <strong>GDPR (EU/UK):</strong> If you are located in the European
          Union or United Kingdom, the above rights apply to you under the
          General Data Protection Regulation.
        </p>
        <p>
          <strong>DPDP Act 2023 (India):</strong> If you are an Indian
          resident, you have equivalent rights under India's Digital Personal
          Data Protection Act, 2023, including the right to nominate a
          representative for data access.
        </p>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:info@xerxez.com" style={{ color: orange, textDecoration: "none", fontWeight: 600 }}>
            info@xerxez.com
          </a>
          . We will respond within 30 days.
        </p>
      </>
    ),
  },
  {
    n: "06",
    title: "Cookies Policy",
    content: (
      <>
        <p>
          We use a limited set of cookies to operate and improve our website:
        </p>
        <ul>
          <li>
            <strong>Essential cookies</strong> — required for the website to
            function (e.g. session management, security tokens). These cannot
            be disabled.
          </li>
          <li>
            <strong>Analytics cookies</strong> — help us understand which pages
            are most visited and how users navigate the site (e.g. Google
            Analytics, anonymised). You may opt out at any time.
          </li>
        </ul>
        <p>
          We do not use advertising, retargeting, or third-party tracking
          cookies. You can disable analytics cookies through your browser
          settings or by contacting us. Disabling essential cookies may affect
          site functionality.
        </p>
      </>
    ),
  },
  {
    n: "07",
    title: "Third-Party Services",
    content: (
      <p>
        Our website may link to third-party services (e.g. LinkedIn, GitHub).
        We are not responsible for the privacy practices of these external
        sites. We encourage you to review their privacy policies before
        providing any personal information.
      </p>
    ),
  },
  {
    n: "08",
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. The "Last
        updated" date at the top of this page reflects the most recent
        revision. Material changes will be communicated via a notice on our
        website. Continued use of the site after any changes constitutes
        acceptance of the updated policy.
      </p>
    ),
  },
  {
    n: "09",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests relating to this
          Privacy Policy, please reach out to our team:
        </p>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <i className="fas fa-envelope" style={{ color: orange, fontSize: 14, width: 18 }} />
            <a href="mailto:info@xerxez.com" style={{ color: orange, textDecoration: "none", fontWeight: 600 }}>
              info@xerxez.com
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <i className="fas fa-map-marker-alt" style={{ color: orange, fontSize: 14, width: 18 }} />
            <span>India &amp; UAE — Remote-first, Global delivery</span>
          </div>
        </div>
      </>
    ),
  },
];

const PrivacyPolicyPage = () => (
  <CustomLayout>
    {/* Hero */}
    <section style={{ background: cream, padding: "140px 0 64px", position: "relative", overflow: "hidden" }}>
      <span style={{ position: "absolute", top: -100, right: -60, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: 28 }}>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <li><Link to="/" style={{ color: "#6B6B6B", fontSize: 13, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Home</Link></li>
            <li style={{ color: "#9B9B9B", fontSize: 13 }}>/</li>
            <li style={{ color: dark, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Privacy Policy</li>
          </ol>
        </nav>

        <div style={{ display: "inline-block", background: "rgba(201,136,58,0.09)", color: orange, fontSize: 11, fontWeight: 700, padding: "5px 18px", borderRadius: 20, letterSpacing: "0.14em", textTransform: "uppercase", border: "1px solid rgba(201,136,58,0.28)", fontFamily: "'DM Sans', sans-serif", marginBottom: 18 }}>
          Legal
        </div>
        <h1 style={{ color: dark, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 52px)", lineHeight: 1.1, marginBottom: 14, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.025em" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: 15, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          Last updated: <strong>June 2026</strong>
        </p>
      </div>
    </section>

    {/* Content */}
    <section style={{ background: cream, padding: "0 0 96px" }}>
      <div className="container">
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{
            background: white,
            borderRadius: 18,
            border: `1px solid ${border}`,
            borderTop: `3px solid ${orange}`,
            boxShadow: "0 4px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}>
            {sections.map((sec, i) => (
              <div
                key={sec.n}
                style={{
                  padding: "36px 44px",
                  borderBottom: i < sections.length - 1 ? `1px solid ${border}` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
                  {/* Orange number */}
                  <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, background: "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)", boxShadow: "0 4px 0 rgba(150,95,30,0.45), 0 5px 14px rgba(201,136,58,0.28)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{sec.n}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ color: dark, fontWeight: 700, fontSize: 20, marginBottom: 14, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em" }}>
                      {sec.title}
                    </h2>
                    <div style={{ color: body, fontSize: 15.5, lineHeight: 1.82, fontFamily: "'DM Sans', sans-serif" }}>
                      {sec.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div style={{ marginTop: 32, padding: "28px 36px", background: white, borderRadius: 14, border: `1px solid ${border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ color: dark, fontWeight: 700, fontSize: 16, margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif" }}>Have a privacy concern?</p>
              <p style={{ color: "#6B6B6B", fontSize: 14, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Our team responds within 30 days to all data-related requests.</p>
            </div>
            <a
              href="mailto:info@xerxez.com?subject=Privacy Enquiry"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 24px", borderRadius: 8, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 0 rgba(150,95,30,0.45), 0 5px 14px rgba(201,136,58,0.24)", whiteSpace: "nowrap" }}
            >
              <i className="fas fa-envelope" style={{ fontSize: 13 }} />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  </CustomLayout>
);

export default PrivacyPolicyPage;
