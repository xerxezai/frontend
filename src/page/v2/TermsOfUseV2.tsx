// TermsOfUseV2.tsx
// Purpose: /terms-of-use — v2-themed Terms of Use. Design only; every
//          section's content is copied verbatim from the existing
//          src/page/TermsPage.tsx (still live at /terms) — no wording
//          changed, only the visual theme.
// Used in: src/App.tsx (route: /terms-of-use)

import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import { XerxezShell, T, Eyebrow } from "../../components/v2";

const body = "#374151";

const sections = [
  {
    n: "01",
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing or using{" "}
        <a href="https://xerxez.com" style={{ color: T.red, textDecoration: "none", fontWeight: 600 }}>
          xerxez.com
        </a>{" "}
        (the "Website"), you confirm that you are at least 18 years of age,
        have read and understood these Terms of Use, and agree to be legally
        bound by them. If you do not agree to these terms, please do not use
        this Website. These terms apply to all visitors, users, and any other
        persons who access or use the Website.
      </p>
    ),
  },
  {
    n: "02",
    title: "Use of Website",
    content: (
      <>
        <p>You agree to use this Website only for lawful purposes. Specifically, you must not:</p>
        <ul>
          <li>Use the Website in any way that violates applicable local, national, or international laws or regulations.</li>
          <li>Attempt to gain unauthorised access to any part of the Website, its servers, or associated systems.</li>
          <li>Scrape, crawl, or extract data from this Website using automated tools without prior written consent.</li>
          <li>Transmit any unsolicited or unauthorised advertising or promotional material.</li>
          <li>Misrepresent your identity or affiliation with any person or organisation.</li>
          <li>Introduce viruses, trojans, worms, or other malicious or technologically harmful material.</li>
        </ul>
        <p>
          XERXEZ reserves the right to suspend or terminate access to the
          Website immediately and without notice if these conditions are
          breached.
        </p>
      </>
    ),
  },
  {
    n: "03",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          All content on this Website — including but not limited to text,
          graphics, logos, images, icons, software, and the overall design —
          is the exclusive property of XERXEZ Solutions and is protected by
          applicable intellectual property laws.
        </p>
        <ul>
          <li>No content may be reproduced, distributed, transmitted, displayed, or adapted without prior written permission from XERXEZ.</li>
          <li>The XERXEZ name, logo, and associated marks are trademarks of XERXEZ Solutions. Unauthorised use is strictly prohibited.</li>
          <li>You may share links to public pages on our Website for non-commercial purposes, provided no content is misrepresented.</li>
        </ul>
        <p>
          Any feedback, suggestions, or ideas you submit to XERXEZ may be
          used by us without restriction or compensation.
        </p>
      </>
    ),
  },
  {
    n: "04",
    title: "Services & Engagements",
    content: (
      <>
        <p>
          The information on this Website is provided for general informational
          purposes only and does not constitute a binding offer or contract.
          In particular:
        </p>
        <ul>
          <li>The Website describes our service capabilities but does not constitute a formal proposal or service agreement.</li>
          <li>All commercial engagements with XERXEZ are governed by separate, executed contracts that supersede any information on this Website.</li>
          <li>Pricing, timelines, and deliverables referenced on the Website are indicative only and subject to formal scoping and proposal.</li>
          <li>XERXEZ reserves the right to decline any engagement at its sole discretion.</li>
        </ul>
      </>
    ),
  },
  {
    n: "05",
    title: "Disclaimers & Limitation of Liability",
    content: (
      <>
        <p>
          This Website is provided on an "as is" and "as available" basis.
          XERXEZ makes no representations or warranties of any kind, express
          or implied, including but not limited to:
        </p>
        <ul>
          <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
          <li>Uninterrupted or error-free availability of the Website.</li>
          <li>Accuracy, completeness, or timeliness of information on the Website.</li>
        </ul>
        <p>
          To the fullest extent permitted by applicable law, XERXEZ shall not
          be liable for any indirect, incidental, special, consequential, or
          punitive damages arising from your use of — or inability to use —
          this Website or its content. Our total liability to you for any
          claim arising from use of this Website shall not exceed the amount
          paid by you to XERXEZ in the preceding twelve months.
        </p>
      </>
    ),
  },
  {
    n: "06",
    title: "Third-Party Links",
    content: (
      <p>
        This Website may contain links to third-party websites. These links
        are provided for your convenience only. XERXEZ has no control over
        the content of those sites and accepts no responsibility for them or
        for any loss or damage that may arise from your use of them. The
        inclusion of any link does not imply XERXEZ's endorsement of the
        linked site.
      </p>
    ),
  },
  {
    n: "07",
    title: "Privacy",
    content: (
      <p>
        Your use of this Website is also governed by our{" "}
        <Link to="/privacy-policy" style={{ color: T.red, textDecoration: "none", fontWeight: 600 }}>
          Privacy Policy
        </Link>
        , which is incorporated by reference into these Terms of Use. By using
        the Website, you consent to the data practices described in our
        Privacy Policy.
      </p>
    ),
  },
  {
    n: "08",
    title: "Governing Law & Disputes",
    content: (
      <>
        <p>
          These Terms of Use and any dispute or claim arising in connection
          with them shall be governed by and construed in accordance with:
        </p>
        <ul>
          <li>The laws of <strong>India</strong> (for clients and users based in South Asia and APAC regions).</li>
          <li>The laws of the <strong>United Arab Emirates</strong> (for clients and users based in the Middle East, Africa, and Europe).</li>
        </ul>
        <p>
          Any disputes arising from these Terms or your use of the Website
          that cannot be resolved amicably shall be submitted to binding
          arbitration in accordance with applicable arbitration rules. The
          seat of arbitration shall be determined based on the governing
          jurisdiction above.
        </p>
      </>
    ),
  },
  {
    n: "09",
    title: "Changes to These Terms",
    content: (
      <p>
        XERXEZ reserves the right to revise these Terms of Use at any time.
        The "Last updated" date at the top of this page reflects the most
        recent revision. Continued use of the Website after any changes
        constitutes your acceptance of the revised terms. We encourage you
        to review these terms periodically.
      </p>
    ),
  },
  {
    n: "10",
    title: "Contact Us",
    content: (
      <>
        <p>
          For any legal questions, concerns, or notices relating to these
          Terms of Use, please contact us:
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

const TermsOfUseV2 = () => (
  <XerxezShell>
    <SEO title="Terms of Use | XERXEZ" description="The terms governing your use of the XERXEZ website." canonical="/terms-of-use" />

    {/* Hero — dark navy */}
    <section style={{ background: T.navy, padding: "140px 0 56px" }}>
      <div className="container">
        <Eyebrow color={T.red}>Legal</Eyebrow>
        <h1 style={{
          color: "#ffffff", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 52px)",
          lineHeight: 1.1, margin: "0 0 14px", fontFamily: T.fontHead, letterSpacing: "-0.02em",
        }}>
          Terms of Use
        </h1>
        <p style={{ color: "rgba(255,255,255,0.70)", fontSize: 16, fontFamily: T.fontBody, margin: "0 0 10px", maxWidth: 620, lineHeight: 1.7 }}>
          The terms governing your access to and use of the XERXEZ website.
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
            <Link to="/privacy-policy" style={{ color: T.red, textDecoration: "none", fontWeight: 600 }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  </XerxezShell>
);

export default TermsOfUseV2;
