// TS101BasicPage.tsx
// Purpose: /iot/fleet-management-systems/ts101basic-4g — device detail page
//          for the TS101Basic 4G tracker, linked from the "View Details"
//          button on its card in FleetManagementPage.tsx. Same structure as
//          TS101PlusPage.tsx (hero, feature/accessory/use-case cards, spec
//          table) plus a "Get In Touch" device enquiry form at the bottom.
// Used in: src/App.tsx (route: /iot/fleet-management-systems/ts101basic-4g)
// Images: locally stored under src/assets/images/iot/devices/ (downloaded
//         from Unsplash, free-to-use license) — not hotlinked.
// Enquiry form: posts to the existing POST /contact/ endpoint (same one
//               XerxezContactForm.tsx uses) rather than a new backend route —
//               this backend is Django/DRF, not Node/Express, so there is no
//               src/routes/contact.ts or nodemailer in this codebase. The
//               existing ContactMessageCreateView already emails ADMIN_EMAIL
//               (info@xerxez.com) and auto-replies to the enquirer; a small
//               device-enquiry branch was added there (apps/contact/views.py)
//               so the subject lines match this form's wording exactly.

import { Fragment, useState } from "react";
import { Cpu } from "lucide-react";
import { toast } from "react-toastify";
import apiService from "../../../services/api";
import SEO from "../../../components/seo/SEO";
import { XerxezShell, T, Eyebrow, SectionHeading, Reveal, Btn, V2_HEADER_H } from "../../../components/v2";

import evCompliantImage from "../../../assets/images/iot/devices/ts101basic-ev-compliant.jpg";
import movementImage from "../../../assets/images/iot/devices/ts101basic-movement.jpg";
import geofencingImage from "../../../assets/images/iot/devices/geofencing-v2.jpg";
import panicButtonImage from "../../../assets/images/iot/accessory-panic-button-v2.jpg";
import fuelSensorImage from "../../../assets/images/iot/accessory-fuel-sensor-v3.jpg";
import externalAntennaImage from "../../../assets/images/iot/devices/external-antenna.jpg";
import logisticsImage from "../../../assets/images/iot/devices/logistics.jpg";
import constructionImage from "../../../assets/images/iot/devices/mining.jpg";
import oilGasImage from "../../../assets/images/iot/devices/oil-gas.jpg";

const KEY_FEATURES = [
  {
    image: evCompliantImage,
    title: "COMPACT EV-COMPLIANT CONNECTIVITY",
    desc: "Supports 9-90V DC wide power range, fully EV compliant for electric and conventional vehicles across all fleet types.",
  },
  {
    image: movementImage,
    title: "ACCURATE MOVEMENT & DRIVE DETECTION",
    desc: "Smart motion detection ensures real-time tracking and drive behavior insights for better route planning and vehicle utilization.",
  },
  {
    image: geofencingImage,
    title: "SMART GEOFENCING & ECO-DRIVING",
    desc: "Set virtual boundaries and receive alerts. Eco-driving monitoring promotes fuel efficiency and responsible driving behavior.",
  },
];

const ACCESSORIES = [
  {
    image: panicButtonImage,
    title: "PANIC BUTTON",
    desc: "Emergency alert system enabling drivers to instantly send SOS in unsafe situations.",
  },
  {
    image: fuelSensorImage,
    title: "FUEL SENSOR",
    desc: "Track real-time fuel level and consumption to prevent pilferage and improve efficiency.",
  },
  {
    image: externalAntennaImage,
    title: "EXTERNAL ANTENNA",
    desc: "Enhances GPS and GSM signal in weak connectivity areas like basements and tunnels.",
  },
];

const USE_CASES = [
  {
    image: logisticsImage,
    title: "LOGISTICS & TRANSPORTATION",
    desc: "Track commercial vehicles, optimize delivery routes and monitor driver behavior across logistics fleets.",
  },
  {
    image: constructionImage,
    title: "CONSTRUCTION & HEAVY EQUIPMENT",
    desc: "Monitor construction vehicles and site logistics with real-time GPS tracking and geofencing.",
  },
  {
    image: oilGasImage,
    title: "OIL & GAS FIELD OPERATIONS",
    desc: "Track tankers and field-service vehicles across remote oil and gas operations.",
  },
];

const SPEC_GROUPS: { group: string; rows: [string, string][] }[] = [
  {
    group: "Cellular",
    rows: [
      ["2G", "Not Available"],
      ["3G", "Not Available"],
      ["LTE-Cat1", "B1, B3, B5, B8, B34, B38, B39, B40, B41"],
    ],
  },
  {
    group: "Communication Interface",
    rows: [["TCP/IP", "Yes"]],
  },
  {
    group: "Short Range",
    rows: [["BLE", "Not Available"], ["WiFi", "Not Available"]],
  },
  {
    group: "Navigation",
    rows: [["GNSS", "GPS, GLONASS, BeiDou"]],
  },
  {
    group: "External Interfaces",
    rows: [
      ["Analog Input", "Not Available"],
      ["Digital Output", "1 No"],
      ["Digital Input", "1 No"],
      ["RS232", "Not Available"],
      ["RS485", "1 No (optional)"],
      ["CAN", "1 No (optional)"],
      ["1Wire", "Not Available"],
      ["USB", "2.0 - For Config Purpose Only"],
    ],
  },
  {
    group: "Wake-Up Sources",
    rows: [
      ["IGN", "Yes"],
      ["Panic Button", "Not Available"],
      ["Accelerometer", "Yes"],
    ],
  },
  {
    group: "General",
    rows: [
      ["Device Case Open Tamper Alert", "Not Available"],
      ["LED Status Indicators", "Not Available"],
      ["Power Supply", "9-90V DC"],
      ["Sleep Mode Current", "Not Available"],
      ["Internal Battery", "60mAh"],
      ["GSM / GNSS / BLE Antenna", "Internal"],
      ["Movement Sensors", "Accelerometer"],
      ["SIM", "Nano SIM"],
      ["Data Storage Memory", "16 MB"],
      ["Record Storage Count", "20,000"],
      ["Configuration", "USB / SMS / TCP-IP"],
      ["OTA / FOTA", "Yes"],
    ],
  },
  {
    group: "Temperature",
    rows: [["Operating", "-25°C to +85°C"], ["Storage", "-40°C to +85°C"]],
  },
  {
    group: "Performance & Durability",
    rows: [
      ["Vibration", "Not Available"],
      ["Ingress Protection", "Not Available"],
      ["Temperature Endurance", "Not Available"],
      ["Thermal Shock", "Not Available"],
      ["Mechanical Shock", "Not Available"],
      ["Electrical Load Dump", "Not Available"],
      ["EMI/EMC", "Not Available"],
    ],
  },
  {
    group: "Dimensions & Weight",
    rows: [["Dimensions (L x W x H)", "TBD"], ["Weight", "TBD"]],
  },
];

const notAvailableColor = "#94A3B8";

const DEVICE_OPTIONS = [
  "TS101Basic 4G", "UX101-AL", "UX101-AL++", "AT101 4G", "Bharat101Plus 4G", "Bharat101 with IRNSS",
];

// Shared image-topped card used by Key Features, Accessories and Use Cases.
const FeatureCard = ({ image, title, desc }: { image: string; title: string; desc: string }) => (
  <div style={{
    background: "#F8FAFC", borderRadius: 16, border: "1px solid #E2E8F0",
    boxShadow: "0 4px 18px rgba(7,26,51,0.07)", overflow: "hidden", height: "100%",
  }}>
    <img
      src={image}
      alt={title}
      loading="lazy"
      decoding="async"
      style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
    />
    <div style={{ padding: "22px 24px 26px" }}>
      <div style={{
        fontFamily: T.fontHead, fontWeight: 800, fontSize: 14,
        letterSpacing: "0.03em", color: T.red, textTransform: "uppercase" as const,
      }}>
        {title}
      </div>
      <p style={{ fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.75, color: "#475569", margin: "10px 0 0" }}>
        {desc}
      </p>
    </div>
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #D1DAE3",
  fontFamily: T.fontBody, fontSize: 14, color: T.navy, background: "#fff",
  outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: T.fontHead, fontWeight: 700, fontSize: 12.5,
  color: T.navy, letterSpacing: "0.03em", marginBottom: 7,
};

type EnquiryForm = {
  name: string; company: string; email: string; phone: string; device: string; message: string;
};
const EMPTY_FORM: EnquiryForm = {
  name: "", company: "", email: "", phone: "", device: "TS101Basic 4G", message: "",
};

const GetInTouchForm = () => {
  const [form, setForm] = useState<EnquiryForm>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof EnquiryForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSending(true);
    try {
      // Reuses the existing /contact/ endpoint (apps/contact) — same one
      // XerxezContactForm.tsx posts to — rather than a new device-enquiry
      // route, so the device's interest still lands in the same admin inbox
      // and CRM lead pipeline as every other enquiry on the site.
      const result = await apiService.post("/contact/", {
        full_name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        service: form.device,
        subject: `Device Enquiry - ${form.device}`,
        message: form.message.trim() || `Device enquiry for ${form.device} — no additional message provided.`,
      });
      if ((result as { success?: boolean }).success) {
        setSent(true);
        setForm(EMPTY_FORM);
        toast.success("Enquiry sent! We'll get back to you shortly.");
      } else {
        const msg = (result as { message?: string }).message || "Could not send your enquiry. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    } catch {
      setError("Could not send your enquiry. Please try again.");
      toast.error("Could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{
        maxWidth: 560, margin: "48px auto 0", textAlign: "center",
        background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "48px 32px",
      }}>
        <h3 style={{ fontFamily: T.fontHead, fontWeight: 800, fontSize: 20, color: T.navy, margin: 0 }}>
          Thank you — your enquiry was sent
        </h3>
        <p style={{ fontFamily: T.fontBody, fontSize: 14.5, color: "#64748B", margin: "10px 0 0" }}>
          Our team will get back to you shortly. A confirmation has been sent to your email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{
      maxWidth: 760, margin: "48px auto 0", background: "#fff",
      border: "1px solid #E2E8F0", borderRadius: 16, padding: "36px 32px",
    }}>
      <div className="row g-4">
        <div className="col-md-6">
          <label style={labelStyle}>Full Name *</label>
          <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" />
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Company *</label>
          <input style={inputStyle} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Your company name" />
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Email *</label>
          <input type="email" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" />
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Phone Number *</label>
          <input type="tel" style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+971 5X XXX XXXX" />
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Device Interest</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.device} onChange={(e) => set("device", e.target.value)}>
            {DEVICE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label style={labelStyle}>Message (optional)</label>
          <textarea
            style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us about your fleet size, deployment timeline or any specific requirements..."
          />
        </div>
      </div>

      {error && (
        <p style={{ color: "#DC2626", fontFamily: T.fontBody, fontSize: 13, marginTop: 16, marginBottom: 0 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        style={{
          marginTop: 24, background: T.red, color: "#fff", border: "none",
          borderRadius: 10, padding: "14px 32px", fontFamily: T.fontHead,
          fontWeight: 700, fontSize: 14.5, cursor: sending ? "wait" : "pointer",
          opacity: sending ? 0.75 : 1,
        }}
      >
        {sending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
};

const TS101BasicPage = () => (
  <XerxezShell>
    <SEO
      title="TS101Basic 4G | GPS Tracking Device | XERXEZ"
      description="TS101Basic 4G — a compact 4G LTE telematics device built for commercial fleet management in UAE. TDRA certified, EV compliant, with movement detection, geofencing, eco-driving alerts and OTA updates."
      canonical="/iot/fleet-management-systems/ts101basic-4g"
      noIndex
    />

    {/* ── Hero — device name, badge, description, CTAs, icon placeholder. ── */}
    <section style={{ padding: "120px 0 70px", background: T.navy, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow color="rgba(255,255,255,0.65)">XERXEZ · GPS TRACKING DEVICE</Eyebrow>
              <span style={{
                display: "inline-block", marginTop: 14,
                background: "#16a34a18", color: "#4ade80",
                border: "1px solid #16a34a55", borderRadius: 6, padding: "4px 11px",
                fontSize: 11.5, fontWeight: 700, fontFamily: T.fontHead,
                letterSpacing: "0.04em", textTransform: "uppercase" as const,
              }}>
                TDRA Certified · UAE Ready
              </span>
              <h1 style={{
                fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "16px 0 0",
              }}>
                TS101Basic 4G
              </h1>
              <p style={{
                fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.8,
                color: "rgba(255,255,255,0.72)", margin: "20px 0 0", maxWidth: 520,
              }}>
                A compact 4G LTE telematics device built for commercial fleet management in UAE.
                TDRA certified, EV compliant, with movement detection, geofencing, eco-driving
                alerts and OTA updates.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 32 }}>
                <Btn href="#enquiry-form">Request a Quote</Btn>
                <button
                  disabled
                  title="Coming soon"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    fontFamily: T.fontHead, fontSize: 15, fontWeight: 600,
                    padding: "15px 28px", borderRadius: T.rx,
                    background: "transparent", color: "rgba(255,255,255,0.4)",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    cursor: "not-allowed",
                  }}
                >
                  Download Datasheet
                </button>
              </div>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <Reveal delay={80}>
              <div style={{
                height: 340, borderRadius: 16, background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
              }}>
                <Cpu size={56} strokeWidth={1.3} color="rgba(255,255,255,0.35)" />
                <span style={{
                  fontFamily: T.fontHead, fontWeight: 700, fontSize: 14,
                  color: "rgba(255,255,255,0.35)",
                }}>
                  TS101Basic 4G
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Key Features — 3 image-topped cards. ── */}
    <section style={{ padding: "90px 0", background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Key Features" title="Built for Commercial Fleet Operations" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {KEY_FEATURES.map((f, i) => (
            <div key={f.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <FeatureCard {...f} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Supported Accessories — 3 image-topped cards. ── */}
    <section style={{ padding: "90px 0", background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Accessories" title="Supported Accessories" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {ACCESSORIES.map((a, i) => (
            <div key={a.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <FeatureCard {...a} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Use Cases — 3 image-topped cards. ── */}
    <section style={{ padding: "90px 0", background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Use Cases" title="Where TS101Basic 4G Is Deployed" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {USE_CASES.map((u, i) => (
            <div key={u.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <FeatureCard {...u} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Product Specifications — single table, full-width navy category rows. ── */}
    <section style={{ padding: "90px 0", background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Specifications" title="Product Specifications" />
        </Reveal>
        <div style={{ margin: "48px auto 0", background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{
                  padding: "12px 20px", fontFamily: T.fontHead, fontWeight: 700, fontSize: 12.5,
                  color: "#64748B", textAlign: "left", letterSpacing: "0.06em",
                  textTransform: "uppercase" as const, borderBottom: "1px solid #E2E8F0", width: "45%",
                }}>
                  Feature
                </th>
                <th style={{
                  padding: "12px 20px", fontFamily: T.fontHead, fontWeight: 700, fontSize: 12.5,
                  color: "#64748B", textAlign: "left", letterSpacing: "0.06em",
                  textTransform: "uppercase" as const, borderBottom: "1px solid #E2E8F0",
                }}>
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {SPEC_GROUPS.map((g) => (
                <Fragment key={g.group}>
                  <tr>
                    <td colSpan={2} style={{
                      background: T.navy, padding: "10px 20px",
                      fontFamily: T.fontHead, fontWeight: 700, fontSize: 12.5,
                      color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" as const,
                    }}>
                      {g.group}
                    </td>
                  </tr>
                  {g.rows.map(([label, value], i) => (
                    <tr key={`${g.group}-${label}`} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                      <td style={{
                        padding: "10px 20px", fontFamily: T.fontHead, fontWeight: 600,
                        fontSize: 13, color: T.navy, borderBottom: "1px solid #EEF2F6",
                      }}>
                        {label}
                      </td>
                      <td style={{
                        padding: "10px 20px", fontFamily: T.fontBody, fontSize: 13,
                        color: value === "Not Available" ? notAvailableColor : T.navy,
                        borderBottom: "1px solid #EEF2F6",
                      }}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* ── Get In Touch — device enquiry form. ── */}
    <section id="enquiry-form" style={{ padding: "90px 0", background: "#fff", scrollMarginTop: V2_HEADER_H + 20 }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Get In Touch" title="Enquire About This Device" />
        </Reveal>
        <GetInTouchForm />
      </div>
    </section>
  </XerxezShell>
);

export default TS101BasicPage;
