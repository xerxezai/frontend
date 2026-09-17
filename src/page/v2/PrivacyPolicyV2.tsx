// PrivacyPolicyV2.tsx
// Purpose: /privacy-policy — v2-themed Privacy Policy. Design only; every
//          section's content is copied verbatim from the existing
//          src/page/PrivacyPolicyPage.tsx (still live at /privacy) — no
//          wording changed, only the visual theme.
// Used in: src/App.tsx (route: /privacy-policy)

import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import { XerxezShell, T, Eyebrow } from "../../components/v2";

const body = "#374151";

const sections = [
  {
    n: "01",
    title: "Introduction",
    content: (
      <p>
        XERXEZ Solutions ("XERXEZ", "we", "us", or "our") is committed to
        protecting your privacy. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you visit{" "}
        <a href="https://xerxez.com" style={{ color: T.red, textDecoration: "none", fontWeight: 600 }}>
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
          <a href="mailto:info@xerxez.com" style={{ color: T.red, textDecoration: "none", fontWeight: 600 }}>
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
            <i className="fas fa-envelope" style={{ color: T.red, fontSize: 14, width: 18 }} />
            <a href="mailto:info@xerxez.com" style={{ color: T.red, textDecoration: "none", fontWeight: 600 }}>
              info@xerxez.com
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <i className="fas fa-map-marker-alt" style={{ color: T.red, fontSize: 14, width: 18 }} />
            <span>India &amp; UAE — Remote-first, Global delivery</span>
          </div>
        </div>
      </>
    ),
  },
];

const PrivacyPolicyV2 = () => (
  <XerxezShell>
    <SEO title="Privacy Policy | XERXEZ" description="How XERXEZ collects, uses, and protects your data." canonical="/privacy-policy" />

    {/* Hero — dark navy */}
    <section style={{ background: T.navy, padding: "140px 0 56px" }}>
      <div className="container">
        <Eyebrow color={T.red}>Legal</Eyebrow>
        <h1 style={{
          color: "#ffffff", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 52px)",
          lineHeight: 1.1, margin: "0 0 14px", fontFamily: T.fontHead, letterSpacing: "-0.02em",
        }}>
          Privacy Policy
        </h1>
        <p style={{ color: "rgba(255,255,255,0.70)", fontSize: 16, fontFamily: T.fontBody, margin: "0 0 10px", maxWidth: 620, lineHeight: 1.7 }}>
          How XERXEZ collects, uses, discloses, and safeguards your information.
        </p>
        <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 14, fontFamily: T.fontBody, margin: 0 }}>
          Last updated: <strong style={{ color: "rgba(255,255,255,0.75)" }}>June 2026</strong>
        </p>
      </div>
    </section>

    {/* Content — white, 800px, Inter 16px/1.8 */}
    <section style={{ background: "#ffffff", padding: "64px 0 96px" }}>
      <div className="container">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {sections.map((sec) => (
            <div key={sec.n} style={{ marginBottom: 40 }}>
              <h2 style={{
                color: T.headNavy, fontWeight: 700, fontSize: 20,
                fontFamily: T.fontHead, margin: "0 0 14px", letterSpacing: "-0.01em",
              }}>
                {sec.n} — {sec.title}
              </h2>
              <div style={{ color: body, fontSize: 16, lineHeight: 1.8, fontFamily: T.fontBody }}>
                {sec.content}
              </div>
            </div>
          ))}

          <p style={{ textAlign: "center", marginTop: 8, color: "#9ca3af", fontSize: 13, fontFamily: T.fontBody }}>
            Also read our{" "}
            <Link to="/terms-of-use" style={{ color: T.red, textDecoration: "none", fontWeight: 600 }}>
              Terms of Use
            </Link>
          </p>
        </div>
      </div>
    </section>
  </XerxezShell>
);

export default PrivacyPolicyV2;
