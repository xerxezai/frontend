// Bharat101PlusPage.tsx
// Purpose: /iot/fleet-management-systems/bharat101plus-4g — device detail
//          page for the Bharat101Plus 4G tracker, linked from the "View
//          Details" button on its card in FleetManagementPage.tsx. Same
//          structure as UX101ALPage.tsx (hero, feature/accessory/use-case
//          cards, spec table, Get In Touch enquiry form), plus a new FAQ
//          accordion section before the spec table.
// Used in: src/App.tsx (route: /iot/fleet-management-systems/bharat101plus-4g)
// Images: locally stored under src/assets/images/iot/devices/ (downloaded
//         from Unsplash, free-to-use license) — not hotlinked.
// Enquiry form: posts to the existing POST /contact/ endpoint (same one
//               every other device detail page on this site uses) — this
//               backend is Django/DRF, not Node/Express, so there is no
//               src/routes/contact.ts or nodemailer in this codebase.

import { Fragment, useState } from "react";
import { Cpu, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import apiService from "../../../services/api";
import SEO from "../../../components/seo/SEO";
import { XerxezShell, T, Eyebrow, SectionHeading, Reveal, Btn, V2_HEADER_H } from "../../../components/v2";

import ais140ComplianceImage from "../../../assets/images/iot/devices/ais140-compliance.jpg";
import ruggedImage from "../../../assets/images/iot/devices/construction.jpg";
import motionDetectionImage from "../../../assets/images/iot/devices/ts101basic-movement.jpg";
import tamperProtectionImage from "../../../assets/images/iot/devices/tamper-protection.jpg";
import rs232Image from "../../../assets/images/iot/devices/vfota.jpg";
import remoteConfigImage from "../../../assets/images/iot/devices/vfota-ux101.jpg";
import panicButtonImage from "../../../assets/images/iot/accessory-panic-button-v2.jpg";
import fuelSensorImage from "../../../assets/images/iot/accessory-fuel-sensor-v3.jpg";
import generatorImage from "../../../assets/images/iot/devices/generator-equipment.jpg";
import constructionAssetImage from "../../../assets/images/iot/devices/mining.jpg";
import miningFleetImage from "../../../assets/images/iot/devices/oil-gas.jpg";

const KEY_FEATURES = [
  {
    image: ais140ComplianceImage,
    title: "AIS-140 CERTIFIED COMPLIANCE",
    desc: "Stay compliant with India's transport regulations with real-time GPS tracking and emergency response features that boost safety across fleets.",
  },
  {
    image: ruggedImage,
    title: "RUGGED IP65-RATED BUILD",
    desc: "Built to withstand dust, water and tough environments, ensuring uninterrupted performance in harsh operating conditions.",
  },
  {
    image: motionDetectionImage,
    title: "MOTION DETECTION & DRIVER BEHAVIOR",
    desc: "Tracks vehicle movement and driving patterns with accelerometer and gyroscope for better driver behavior analysis and operational efficiency.",
  },
  {
    image: tamperProtectionImage,
    title: "TAMPER PROTECTION & BATTERY ALERTS",
    desc: "Real-time alerts during power tampering help prevent unauthorized access and enhance fleet security at all times.",
  },
  {
    image: rs232Image,
    title: "RS232/RS485 SYSTEM INTEGRATION",
    desc: "Seamlessly integrates with vehicle systems and sensors via standard serial interfaces, ideal for advanced telematics applications.",
  },
  {
    image: remoteConfigImage,
    title: "REMOTE CONFIGURATION",
    desc: "Configure and update device settings remotely via SMS or USB, reducing manual intervention and ensuring smoother fleet operations.",
  },
];

const ACCESSORIES = [
  {
    image: panicButtonImage,
    title: "PANIC BUTTON",
    desc: "AIS-140 compliant emergency alert system enabling drivers to instantly send an SOS in case of emergencies.",
  },
  {
    image: fuelSensorImage,
    title: "FUEL SENSOR",
    desc: "Track real-time fuel level and consumption to prevent pilferage and generate detailed fuel analytics.",
  },
];

const USE_CASES = [
  {
    image: generatorImage,
    title: "GENERATOR & INDUSTRIAL EQUIPMENT",
    desc: "Real-time monitoring of generators and industrial equipment boosts efficiency and ensures emission compliance.",
  },
  {
    image: constructionAssetImage,
    title: "CONSTRUCTION ASSET TRACKING",
    desc: "Track movable and static construction assets with real-time fuel usage, movement and utilization monitoring.",
  },
  {
    image: miningFleetImage,
    title: "MINING FLEET MANAGEMENT",
    desc: "Rugged and interface-ready telematics for mining vehicles with smart tracking and operational insights.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How does the 4G GPS tracking device operate?",
    a: "The device connects to GPS satellites for location data and transmits it via 4G LTE to the fleet management platform in real time, enabling live tracking, route history and alerts.",
  },
  {
    q: "What is the warranty period for the device?",
    a: "Please contact our team for warranty details specific to your deployment and purchase agreement.",
  },
  {
    q: "Is the device compatible with industrial equipment like GENSETs and machinery?",
    a: "Yes, with wide voltage support (9-90V DC) and RS232/RS485 interfaces, the device integrates with generators, machinery and industrial equipment.",
  },
  {
    q: "Does the device support 2G fallback?",
    a: "Yes, the device supports 2G (900/1800 MHz) as a fallback network for areas with limited 4G coverage.",
  },
  {
    q: "Can the device be integrated with Dashcam or ADAS?",
    a: "Integration capabilities depend on the specific deployment. Contact our team for custom integration requirements.",
  },
  {
    q: "How many BLE devices can be connected?",
    a: "The device supports BLE 5.0 for connecting compatible peripherals and sensors.",
  },
  {
    q: "Are both eSIM and plastic SIM options available?",
    a: "The device uses eSIM (MFF2 format). Contact our team for SIM provisioning options for your region.",
  },
];

const SPEC_GROUPS: { group: string; rows: [string, string][] }[] = [
  {
    group: "Cellular",
    rows: [
      ["2G", "900/1800 MHz"],
      ["3G", "Not Available"],
      ["LTE-Cat1", "B1, B3, B5, B8, B34, B39, B40, B41"],
    ],
  },
  {
    group: "Communication Interface",
    rows: [["TCP/IP", "Yes"]],
  },
  {
    group: "Short Range",
    rows: [["BLE", "5.0"], ["WiFi", "Not Available"]],
  },
  {
    group: "Navigation",
    rows: [["GNSS", "GPS, Galileo, NavIC, BeiDou"]],
  },
  {
    group: "External Interfaces",
    rows: [
      ["Analog Input", "2 Nos"],
      ["Digital Output", "4 Nos"],
      ["Digital Input", "5 Nos"],
      ["RS232", "1 No (Either One)"],
      ["RS485", "1 No (Either One)"],
      ["CAN", "Not Available"],
      ["1Wire", "Not Available"],
      ["USB", "2.0 - For Config Purpose Only"],
    ],
  },
  {
    group: "Wake-Up Sources",
    rows: [
      ["IGN", "Yes"],
      ["Panic Button", "Yes"],
      ["Accelerometer", "Yes"],
    ],
  },
  {
    group: "General",
    rows: [
      ["Device Case Open Tamper Alert", "Yes"],
      ["LED Status Indicators", "GNSS, Process, Cellular, Power"],
      ["Power Supply", "9-90V DC"],
      ["Sleep Mode Current", "<5mA"],
      ["Internal Battery", "850mAh"],
      ["GSM / GNSS / BLE Antenna", "Internal"],
      ["Movement Sensors", "Accelerometer + Gyroscope"],
      ["SIM", "eSIM (MFF2)"],
      ["Data Storage Memory", "128MB"],
      ["Record Storage Count", "40,000"],
      ["Configuration", "USB / SMS / TCP-IP / BT"],
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
      ["Vibration", "IS9000-8"],
      ["Ingress Protection", "IP65"],
      ["Temperature Endurance", "ISO 16750-4"],
      ["Thermal Shock", "ISO 16750-4"],
      ["Mechanical Shock", "ISO 16750-3"],
      ["Electrical Load Dump", "ISO 7637-2 Pulse 5a, 5b"],
      ["EMI/EMC", "AIS-004"],
    ],
  },
  {
    group: "Dimensions & Weight",
    rows: [
      ["Certification", "AIS-140"],
      ["Dimensions (L x W x H)", "98mm x 85mm x 31mm"],
      ["Weight", "<185g"],
    ],
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

// Accordion FAQ item — only one question renders its answer at a time.
const FaqItem = ({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) => (
  <div style={{ borderBottom: "1px solid #E2E8F0" }}>
    <button
      onClick={onToggle}
      aria-expanded={open}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, background: "none", border: "none", cursor: "pointer",
        padding: "18px 4px", textAlign: "left",
      }}
    >
      <span style={{ fontFamily: T.fontHead, fontWeight: 700, fontSize: 14.5, color: T.navy }}>
        {q}
      </span>
      <ChevronDown
        size={18}
        color={T.navy}
        style={{ flexShrink: 0, transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "none" }}
      />
    </button>
    {open && (
      <p style={{
        fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.75, color: "#475569",
        margin: "0 4px 18px", maxWidth: 680,
      }}>
        {a}
      </p>
    )}
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
  name: "", company: "", email: "", phone: "", device: "Bharat101Plus 4G", message: "",
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
      // every other device detail page on this site posts to.
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
          <input type="tel" style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
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

const Bharat101PlusPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <XerxezShell>
      <SEO
        title="Bharat101Plus 4G | GPS Tracking Device | XERXEZ"
        description="Bharat101Plus 4G — a compact AIS-140 certified 4G GPS telematics device built for commercial fleets, logistics and public transport across India. Features 4G connectivity, RS232/RS485 support and IP65-rated rugged design for real-time fleet management."
        canonical="/iot/fleet-management-systems/bharat101plus-4g"
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
                  background: "#1d4ed818", color: "#60a5fa",
                  border: "1px solid #1d4ed855", borderRadius: 6, padding: "4px 11px",
                  fontSize: 11.5, fontWeight: 700, fontFamily: T.fontHead,
                  letterSpacing: "0.04em", textTransform: "uppercase" as const,
                }}>
                  AIS-140 · India Ready
                </span>
                <h1 style={{
                  fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "16px 0 0",
                }}>
                  Bharat101Plus 4G
                </h1>
                <div style={{
                  fontFamily: T.fontHead, fontWeight: 600, fontSize: 15,
                  color: "rgba(255,255,255,0.55)", marginTop: 6, letterSpacing: "0.02em",
                }}>
                  AIS-140 Certified Fleet Tracker
                </div>
                <p style={{
                  fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.8,
                  color: "rgba(255,255,255,0.72)", margin: "20px 0 0", maxWidth: 520,
                }}>
                  A compact AIS-140 certified 4G GPS telematics device built for commercial
                  fleets, logistics and public transport across India. Features 4G connectivity,
                  RS232/RS485 support and IP65-rated rugged design for real-time fleet management.
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
                    Bharat101Plus 4G
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Features — 6 image-topped cards. ── */}
      <section style={{ padding: "90px 0", background: "#fff" }}>
        <div className="container">
          <Reveal>
            <SectionHeading align="center" eyebrow="Key Features" title="Built for Indian Fleet Compliance" />
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

      {/* ── Supported Accessories — 2 image-topped cards. ── */}
      <section style={{ padding: "90px 0", background: "#F4F7FA" }}>
        <div className="container">
          <Reveal>
            <SectionHeading align="center" eyebrow="Accessories" title="Supported Accessories" />
          </Reveal>
          <div className="row g-4 justify-content-center" style={{ marginTop: 48 }}>
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
            <SectionHeading align="center" eyebrow="Use Cases" title="Where Bharat101Plus 4G Is Deployed" />
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

      {/* ── FAQ — accordion, one answer open at a time. ── */}
      <section style={{ padding: "90px 0", background: "#F4F7FA" }}>
        <div className="container">
          <Reveal>
            <SectionHeading align="center" eyebrow="FAQ" title="Frequently Asked Questions" />
          </Reveal>
          <div style={{ maxWidth: 760, margin: "48px auto 0", background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "6px 28px" }}>
            {FAQS.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Specifications — single table, full-width navy category rows. ── */}
      <section style={{ padding: "90px 0", background: "#fff" }}>
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
      <section id="enquiry-form" style={{ padding: "90px 0", background: "#F4F7FA", scrollMarginTop: V2_HEADER_H + 20 }}>
        <div className="container">
          <Reveal>
            <SectionHeading align="center" eyebrow="Get In Touch" title="Enquire About This Device" />
          </Reveal>
          <GetInTouchForm />
        </div>
      </section>
    </XerxezShell>
  );
};

export default Bharat101PlusPage;
