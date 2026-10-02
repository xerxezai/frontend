// UX101ALPlusPage.tsx
// Purpose: /iot/fleet-management-systems/ux101-al-plus — device detail page
//          for the UX101-AL++ tracker, linked from the "View Details" button
//          on its card in FleetManagementPage.tsx. Same structure as
//          UX101ALPage.tsx (hero, feature/accessory/use-case cards, spec
//          table, Get In Touch enquiry form).
// Used in: src/App.tsx (route: /iot/fleet-management-systems/ux101-al-plus)
// Images: locally stored under src/assets/images/iot/devices/ (downloaded
//         from Unsplash, free-to-use license) — not hotlinked.
// Enquiry form: posts to the existing POST /contact/ endpoint (same one
//               XerxezContactForm.tsx, TS101BasicPage.tsx and UX101ALPage.tsx
//               use) — this backend is Django/DRF, not Node/Express, so
//               there is no src/routes/contact.ts or nodemailer in this
//               codebase. The existing ContactMessageCreateView already has
//               the device-enquiry subject branch added for TS101BasicPage.

import { Fragment, useState } from "react";
import { Cpu } from "lucide-react";
import { toast } from "react-toastify";
import apiService from "../../../services/api";
import SEO from "../../../components/seo/SEO";
import { XerxezShell, T, Eyebrow, SectionHeading, Reveal, Btn, V2_HEADER_H } from "../../../components/v2";

import dualCanImage from "../../../assets/images/iot/devices/dual-can-new.jpg";
import vfotaImage from "../../../assets/images/iot/devices/vfota-ux101.jpg";
import wifiImage from "../../../assets/images/iot/devices/wifi.jpg";
import cameraImage from "../../../assets/images/iot/devices/panic-button.jpg";
import edgeProcessingImage from "../../../assets/images/iot/devices/edge-processing2.jpg";
import harshConditionsImage from "../../../assets/images/iot/devices/construction.jpg";
import panicButtonImage from "../../../assets/images/iot/accessory-panic-button-v2.jpg";
import fuelSensorImage from "../../../assets/images/iot/accessory-fuel-sensor-v3.jpg";
import optimizingOpsImage from "../../../assets/images/iot/devices/optimizing-operations.jpg";
import miningImage from "../../../assets/images/iot/devices/mining.jpg";
import logisticsImage from "../../../assets/images/iot/devices/logistics.jpg";

const KEY_FEATURES = [
  {
    image: dualCanImage,
    title: "DUAL CAN & SEAMLESS COMPLIANCE",
    desc: "Dual CAN interfaces deliver high-speed connectivity, advanced diagnostics, real-time tracking and rich fleet data access with full regulatory compliance.",
  },
  {
    image: vfotaImage,
    title: "VEHICLE FIRMWARE OVER-THE-AIR",
    desc: "Remote firmware updates across ECUs minimize downtime and enable real-time improvements without manual intervention.",
  },
  {
    image: wifiImage,
    title: "BUILT-IN WIFI CONNECTIVITY",
    desc: "WiFi capabilities enable wireless data offloading and local connectivity for remote diagnostics and improved vehicle communication.",
  },
  {
    image: cameraImage,
    title: "CAMERA INTEGRATION & EVENT IMAGING",
    desc: "Supports camera integration for capturing images during critical events like harsh braking or panic alerts, enhancing fleet safety documentation.",
  },
  {
    image: edgeProcessingImage,
    title: "INTELLIGENT EDGE PROCESSING",
    desc: "Modular low-memory firmware enables efficient data collection, smart ECU interaction and embedded OTA updates for scalable telematics.",
  },
  {
    image: harshConditionsImage,
    title: "BUILT FOR HARSH CONDITIONS",
    desc: "IP67-rated waterproof and dustproof enclosure built tough for demanding field environments and extreme weather conditions.",
  },
];

const ACCESSORIES = [
  {
    image: panicButtonImage,
    title: "PANIC BUTTON",
    desc: "Emergency alert system enabling drivers to instantly send an SOS signal in case of emergencies.",
  },
  {
    image: fuelSensorImage,
    title: "FUEL SENSOR",
    desc: "Track real-time fuel level and consumption to prevent pilferage and improve fleet efficiency.",
  },
];

const USE_CASES = [
  {
    image: optimizingOpsImage,
    title: "OPTIMIZING VEHICLE OPERATIONS",
    desc: "Enable connected vehicle operations with remote firmware updates, real-time diagnostics and intelligent fleet data processing.",
  },
  {
    image: miningImage,
    title: "MINING & HEAVY INDUSTRY",
    desc: "Track mining vehicles and heavy equipment with precision GPS, robust IP67 hardware and real-time fleet monitoring.",
  },
  {
    image: logisticsImage,
    title: "COMMERCIAL VEHICLE CONNECTIVITY",
    desc: "Transform commercial vehicle connectivity with deep CAN diagnostics, camera events and OTA update capabilities.",
  },
];

const SPEC_GROUPS: { group: string; rows: [string, string][] }[] = [
  {
    group: "Cellular",
    rows: [
      ["2G", "900/1800 MHz"],
      ["3G", "B1, B8"],
      ["LTE-Cat1", "B1, B3, B5, B40, B41"],
    ],
  },
  {
    group: "Communication Interface",
    rows: [["TCP/IP, HTTPS, HTTP", "Yes"]],
  },
  {
    group: "Short Range",
    rows: [["BLE", "5.0"], ["WiFi", "Single Band WiFi"]],
  },
  {
    group: "Navigation",
    rows: [["GNSS", "GPS, Galileo, NavIC, BeiDou"]],
  },
  {
    group: "External Interfaces",
    rows: [
      ["Analog Input", "3 Nos"],
      ["Digital Output", "4 Nos"],
      ["Digital Input", "7 Nos"],
      ["RS232", "1 No"],
      ["RS485", "Not Available"],
      ["CAN", "2 Channel (Dual CAN)"],
      ["1Wire", "Not Available"],
      ["USB", "Not Available"],
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
      ["LED Status Indicators", "GNSS, Process, Cellular, Power, CAN"],
      ["Power Supply", "8-36V DC"],
      ["Sleep Mode Current", "<3mA"],
      ["Internal Battery", "1000mAh"],
      ["GSM / GNSS / BLE Antenna", "Internal"],
      ["Movement Sensors", "Accelerometer + Gyroscope"],
      ["SIM", "eSIM"],
      ["Data Storage Memory", "Not Available"],
      ["Record Storage Count", "1,00,000"],
      ["Configuration", "SMS / TCP-IP"],
      ["OTA / FOTA", "Yes"],
    ],
  },
  {
    group: "Temperature",
    rows: [["Operating", "-40°C to +80°C"], ["Storage", "-40°C to +85°C"]],
  },
  {
    group: "Performance & Durability",
    rows: [
      ["Vibration", "IS9000-8"],
      ["Ingress Protection", "IP67"],
      ["Temperature Endurance", "ISO 16750-4"],
      ["Thermal Shock", "ISO 16750-4"],
      ["Mechanical Shock", "ISO 16750-3"],
      ["Electrical Load Dump", "ISO 7637-2"],
      ["EMI/EMC", "CISPR25"],
    ],
  },
  {
    group: "Dimensions & Weight",
    rows: [
      ["Certification", "AIS-140"],
      ["Dimensions (L x W x H)", "151mm x 80mm x 38mm"],
      ["Weight", "<200g"],
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
  name: "", company: "", email: "", phone: "", device: "UX101-AL++", message: "",
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
      // XerxezContactForm.tsx, TS101BasicPage.tsx and UX101ALPage.tsx post
      // to — so this device's enquiry lands in the same admin inbox and CRM
      // lead pipeline as every other enquiry on the site.
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

const UX101ALPlusPage = () => (
  <XerxezShell>
    <SEO
      title="UX101-AL++ | GPS Tracking Device | XERXEZ"
      description="UX101-AL++ — a rugged 4G telematics device with Dual CAN, built-in WiFi, camera integration and IP67 protection. Designed for demanding fleet environments with 1,00,000 record storage and intelligent edge processing."
      canonical="/iot/fleet-management-systems/ux101-al-plus"
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
                background: "#d9770618", color: "#fbbf24",
                border: "1px solid #d9770655", borderRadius: 6, padding: "4px 11px",
                fontSize: 11.5, fontWeight: 700, fontFamily: T.fontHead,
                letterSpacing: "0.04em", textTransform: "uppercase" as const,
              }}>
                TDRA Pending · UAE
              </span>
              <h1 style={{
                fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "16px 0 0",
              }}>
                UX101-AL++
              </h1>
              <div style={{
                fontFamily: T.fontHead, fontWeight: 600, fontSize: 15,
                color: "rgba(255,255,255,0.55)", marginTop: 6, letterSpacing: "0.02em",
              }}>
                Advance Logger
              </div>
              <p style={{
                fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.8,
                color: "rgba(255,255,255,0.72)", margin: "20px 0 0", maxWidth: 520,
              }}>
                A rugged 4G telematics device with Dual CAN, built-in WiFi, camera integration and
                IP67 protection. Designed for demanding fleet environments with 1,00,000 record
                storage and intelligent edge processing.
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
                  UX101-AL++
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
          <SectionHeading align="center" eyebrow="Key Features" title="Built for Demanding Fleet Environments" />
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
          <SectionHeading align="center" eyebrow="Use Cases" title="Where UX101-AL++ Is Deployed" />
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

export default UX101ALPlusPage;
