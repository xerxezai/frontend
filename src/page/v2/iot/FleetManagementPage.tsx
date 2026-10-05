// FleetManagementPage.tsx
// Purpose: /iot/fleet-management-systems — fourth standalone IoT
//          Solutions detail page. Same architecture and card language as
//          SmartAssetTrackingPage.tsx (hero, white lift cards, numbered dark
//          capability cards, closing CTA).
// Used in: src/App.tsx (route: /iot/fleet-management-systems)
// Data source: original XERXEZ copy for this page (same standing allowance
//              as every other industry/solution detail page — never copied
//              from a competitor, no XERXEZ branding borrowed from any
//              reference site). No invented statistics.

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2, MapPin, Route, Gauge, Fuel, Wrench, MapPinned,
  LayoutDashboard, Truck, Users, Bell, BarChart3, Smartphone,
  Package, ShoppingBag, HardHat, Factory, Briefcase, Key,
  DollarSign, ShieldCheck, TrendingUp, Eye, Lock, Layers, PenTool, Plug, Satellite, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import {
  XerxezShell, T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IndustryHero, V2FeatureCard, DarkFeatureCard, V2_HEADER_H,
} from "../../../components/v2";

import heroImage from "../../../assets/images/iot/hero-fleet-management.jpg";
import illustrationImage from "../../../assets/images/iot/fleet-management-illustration.jpg";
import ts101basicCardImage from "../../../assets/images/iot/ts101basic-card.png";
import ux101alCardImage from "../../../assets/images/iot/ux101al-device.png";
import ux101alPlusCardImage from "../../../assets/images/iot/ux101alplus-device.png";
import bharat101plusCardImage from "../../../assets/images/iot/bharat101plus-device.png";
import bharat101irnssCardImage from "../../../assets/images/iot/bharat101irnss-device.png";
import at101CardImage from "../../../assets/images/iot/at101-device.png";

const industryPad = { padding: "60px 0" };

// Section 2 — "connect every vehicle" checklist (9 short labels).
const FLEET_DATA_POINTS = [
  "Vehicle location", "Vehicle movement", "Route history",
  "Speed & driving behavior", "Fuel consumption", "Engine performance",
  "Vehicle utilization", "Idle time", "Delivery status",
];

// Section 3 — "How It Works", 6 white lift cards.
const HOW_IT_WORKS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: MapPin,    title: "Real-Time Vehicle Tracking",  desc: "Monitor live location and movement of all vehicles through GPS-enabled tracking devices." },
  { icon: Route,     title: "Route Optimization",          desc: "Analyze routes, traffic conditions and delivery schedules to identify more efficient paths." },
  { icon: Gauge,     title: "Driver Behavior Monitoring",  desc: "Monitor speeding, harsh braking, rapid acceleration and excessive idling to improve safety." },
  { icon: Fuel,      title: "Fuel Monitoring",             desc: "Track fuel consumption patterns and identify inefficiencies across the entire fleet." },
  { icon: Wrench,    title: "Vehicle Health Monitoring",   desc: "Connect vehicle sensors to monitor engine performance and maintenance indicators." },
  { icon: MapPinned, title: "Geofencing",                  desc: "Create virtual geographic boundaries and receive alerts when vehicles enter or leave defined areas." },
];

// Section 4 — "Platform Capabilities", 9 numbered dark cards.
const CAPABILITIES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: LayoutDashboard, title: "Live Fleet Dashboard",     desc: "Monitor all vehicles on an interactive map with real-time status." },
  { icon: Truck,           title: "Vehicle Management",       desc: "Maintain vehicle profiles, documents, service history and specifications." },
  { icon: Users,           title: "Driver Management",        desc: "Manage driver profiles, assignments, performance and driving events." },
  { icon: Route,           title: "Trip & Route Management",  desc: "Plan trips, monitor routes and analyze historical journeys." },
  { icon: MapPinned,       title: "Geofencing",                desc: "Create geographic boundaries and configure automated notifications." },
  { icon: Bell,            title: "Alerts & Notifications",   desc: "Alerts for speeding, unauthorized movement, route deviations and maintenance." },
  { icon: Wrench,          title: "Maintenance Management",   desc: "Track service schedules, repairs and maintenance alerts." },
  { icon: BarChart3,       title: "Fleet Analytics",          desc: "Analyze utilization, fuel consumption, driver performance and efficiency." },
  { icon: Smartphone,      title: "Mobile Fleet Management",  desc: "Mobile access for fleet managers and field teams." },
];

// Section 5 — "Use Cases", 6 white lift cards.
const USE_CASES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Package,     title: "Logistics & Transportation", desc: "Track commercial vehicles, optimize routes and improve fleet utilization." },
  { icon: ShoppingBag, title: "E-Commerce Delivery",        desc: "Monitor last-mile delivery vehicles with real-time delivery visibility." },
  { icon: HardHat,     title: "Construction",               desc: "Monitor heavy equipment, commercial vehicles and project logistics." },
  { icon: Factory,     title: "Oil & Gas",                  desc: "Track transportation vehicles, tankers and field-service assets." },
  { icon: Briefcase,   title: "Field Services",             desc: "Track service vehicles, coordinate field teams and optimize technician routes." },
  { icon: Key,         title: "Rental & Leasing",           desc: "Monitor vehicle locations, utilization, mileage and operational activity." },
];

// Section 6 — "Benefits", 6 white lift cards.
const BENEFITS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: DollarSign,  title: "Reduce Fuel Costs",             desc: "Analyze routes, idling and driving behavior to identify fuel savings." },
  { icon: ShieldCheck, title: "Improve Fleet Safety",          desc: "Monitor driving events to encourage safer driving practices." },
  { icon: TrendingUp,  title: "Increase Vehicle Utilization",  desc: "Understand how vehicles are used and identify underutilized resources." },
  { icon: Eye,         title: "Improve Delivery Visibility",   desc: "Real-time visibility into vehicle movement and delivery progress." },
  { icon: Lock,        title: "Reduce Unauthorized Use",       desc: "Use GPS and geofencing to identify unusual vehicle movement." },
  { icon: Wrench,      title: "Improve Maintenance Planning",  desc: "Use vehicle data to identify service requirements and reduce downtime." },
];

// Section 6b — "Devices", certified GPS tracking device cards.
const TRACKING_DEVICES: {
  name: string;
  category: string;
  connectivity: string;
  certTag: string;
  certColor: string;
  specs: string[];
  features: string[];
  specTable: [string, string][];
  detailRoute?: string;
  image?: string;
}[] = [
  {
    name: "TS101Basic 4G",
    category: "Basic Tracker",
    connectivity: "4G",
    certTag: "TDRA Certified · UAE Ready",
    certColor: "#16a34a",
    specs: [
      "4G-enabled device for basic telematics applications",
      "Tracks movement, drive detection and geofencing for efficient fleet management",
      "Supports OTA/FOTA updates for easy maintenance and upgrades",
    ],
    detailRoute: "/iot/fleet-management-systems/ts101basic-4g",
    image: ts101basicCardImage,
    features: [
      "Compact telematics device", "EV compliant", "Movement & drive detection",
      "Geofencing", "Eco-driving alerts", "Multi-server communication",
    ],
    specTable: [
      ["Network", "4G LTE"], ["GNSS", "GPS + GLONASS + BeiDou"], ["Power", "9-90V DC"],
      ["SIM", "Nano SIM"], ["Storage", "20,000 records"], ["Internal Battery", "60mAh"],
      ["Operating Temp", "-25°C to +85°C"], ["Accelerometer", "Yes"], ["Configuration", "USB/SMS/TCP"],
    ],
  },
  {
    name: "UX101-AL",
    category: "ADVANCED, OEM",
    connectivity: "4G + CAN Bus",
    certTag: "TDRA Certified · UAE Ready",
    certColor: "#16a34a",
    specs: [
      "AIS-140 certified with CAN support for real-time vehicle data logging",
      "Captures CAN parameters and DM1/UDC fault codes for in-depth diagnostics",
      "Stores up to 1,00,000 records and supports VFOTA for seamless updates",
    ],
    detailRoute: "/iot/fleet-management-systems/ux101-al",
    image: ux101alCardImage,
    features: [
      "4G LTE + CAN Bus", "Driver behavior monitoring", "Fuel & engine monitoring",
      "Advanced diagnostics", "Geofencing", "OTA/FOTA updates",
    ],
    specTable: [
      ["Network", "4G LTE"], ["GNSS", "GPS + GLONASS"], ["Power", "9-90V DC"],
      ["SIM", "Nano SIM"], ["CAN Bus", "Yes"], ["RS485", "Yes"],
      ["Digital Input", "2"], ["Digital Output", "2"], ["Operating Temp", "-25°C to +85°C"],
    ],
  },
  {
    name: "UX101-AL++",
    category: "ADVANCED, OEM",
    connectivity: "4G + CAN Bus",
    certTag: "TDRA Pending · UAE",
    certColor: "#d97706",
    specs: [
      "Wi-Fi integration for seamless data transmission",
      "Dual CAN support for expanded vehicle data collection",
      "Camera integration for enhanced visual monitoring and diagnostics",
    ],
    detailRoute: "/iot/fleet-management-systems/ux101-al-plus",
    image: ux101alPlusCardImage,
    features: [
      "Advanced CAN Bus diagnostics", "Multi-sensor support", "Driver behavior analytics",
      "Fuel monitoring", "Geofencing", "OTA/FOTA updates",
    ],
    specTable: [
      ["Network", "4G LTE"], ["GNSS", "GPS + GLONASS + BeiDou"], ["Power", "9-90V DC"],
      ["SIM", "Nano SIM"], ["CAN Bus", "Yes"], ["Multi-sensor", "Yes"],
      ["Operating Temp", "-25°C to +85°C"],
    ],
  },
  {
    name: "AT101 4G",
    category: "Asset Tracking",
    connectivity: "4G",
    certTag: "TDRA Pending · UAE",
    certColor: "#d97706",
    specs: [
      "Real-time tracking for precise asset visibility.",
      "Enhanced security features for asset protection.",
      "Reliable performance across various industries for efficient asset management.",
    ],
    detailRoute: "/iot/fleet-management-systems/at101-4g",
    image: at101CardImage,
    features: [
      "Long battery life asset tracking", "Tamper detection", "Geofencing alerts",
      "Real-time location", "OTA updates", "Compact design",
    ],
    specTable: [
      ["Network", "4G LTE"], ["GNSS", "GPS + GLONASS"], ["Power", "Battery powered"],
      ["SIM", "Nano SIM"], ["Tamper Alert", "Yes"], ["Operating Temp", "-25°C to +85°C"],
    ],
  },
  {
    name: "Bharat101Plus 4G",
    category: "ADVANCED, EV",
    connectivity: "4G",
    certTag: "AIS-140 · India Ready",
    certColor: "#1d4ed8",
    specs: [
      "AIS-140 certified with 4G and CAN for compliance and advanced telematics",
      "Real-time fuel, diagnostics and driver behavior insights via CAN",
      "Compact design with remote monitoring and eco-driving support",
    ],
    detailRoute: "/iot/fleet-management-systems/bharat101plus-4g",
    image: bharat101plusCardImage,
    features: [
      "AIS-140 certified", "Emergency panic button", "India VLTD compliant",
      "Driver behavior monitoring", "Geofencing", "OTA/FOTA updates",
    ],
    specTable: [
      ["Network", "4G LTE"], ["GNSS", "GPS + GLONASS"], ["Power", "9-90V DC"],
      ["SIM", "Nano SIM"], ["AIS-140", "Certified"], ["Emergency Button", "Yes"],
      ["Operating Temp", "-25°C to +85°C"],
    ],
  },
  {
    name: "Bharat101 with IRNSS",
    category: "BASIC",
    connectivity: "4G + IRNSS",
    certTag: "AIS-140 · India Ready",
    certColor: "#1d4ed8",
    specs: [
      "AIS-140 compliant device with built-in IRNSS for accurate navigation",
      "Includes accelerometer, gyroscope and main battery removal alert for enhanced security",
      "Equipped with 1x RS232 port and IP65-rated rugged design for harsh environments",
    ],
    detailRoute: "/iot/fleet-management-systems/bharat101-irnss",
    image: bharat101irnssCardImage,
    features: [
      "AIS-140 + IRNSS navigation", "Indian NavIC GPS system", "Emergency SOS button",
      "Accelerometer + Gyroscope", "Main battery removal alert", "VLTD compliant",
    ],
    specTable: [
      ["Network", "4G LTE"], ["GNSS", "GPS + GLONASS + IRNSS/NavIC"], ["Power", "9-90V DC"],
      ["SIM", "Nano SIM"], ["AIS-140", "Certified"], ["IRNSS", "Yes"],
      ["Emergency Button", "Yes"], ["Operating Temp", "-25°C to +85°C"],
    ],
  },
];

type TrackingDevice = (typeof TRACKING_DEVICES)[number];

// Full-detail modal for a device card's "View Details" button.
const DeviceDetailsModal = ({ device, onClose }: { device: TrackingDevice; onClose: () => void }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-label={`${device.name} details`}
    onClick={onClose}
    style={{
      position: "fixed", inset: 0, background: "rgba(7,26,51,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, zIndex: 1000,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640,
        maxHeight: "88vh", overflowY: "auto", position: "relative",
        boxShadow: "0 30px 70px rgba(7,26,51,0.35)",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute", top: 18, right: 18, width: 34, height: 34,
          borderRadius: "50%", border: "1px solid #E2E8F0", background: "#F8FAFC",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 1,
        }}
      >
        <X size={16} color={T.navy} />
      </button>

      <div style={{ padding: "32px 32px 0" }}>
        <span style={{
          display: "inline-block",
          background: device.certColor + "18",
          color: device.certColor,
          border: `1px solid ${device.certColor}44`,
          borderRadius: 6, padding: "3px 10px",
          fontSize: 11, fontWeight: 700,
          fontFamily: T.fontHead, letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
        }}>
          {device.certTag}
        </span>
        <h3 style={{
          fontFamily: T.fontHead, fontWeight: 800, fontSize: "1.5rem",
          color: T.navy, margin: "12px 0 2px",
        }}>
          {device.name}
        </h3>
        <div style={{ fontFamily: T.fontBody, fontSize: 14, color: "#64748B" }}>
          {device.category}
        </div>
      </div>

      {/* image placeholder — no device photography available yet */}
      <div style={{
        margin: "22px 32px 0", height: 160, borderRadius: 12,
        background: "#EEF2F6", border: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <Satellite size={34} strokeWidth={1.5} color="#94A3B8" />
        <span style={{ fontFamily: T.fontHead, fontWeight: 700, fontSize: 13, color: "#94A3B8" }}>
          {device.name}
        </span>
      </div>

      <div style={{ padding: "26px 32px 4px" }}>
        <h4 style={{ fontFamily: T.fontHead, fontWeight: 700, fontSize: 15, color: T.navy, margin: "0 0 14px" }}>
          Key Features
        </h4>
        <ul style={{
          margin: 0, padding: 0, listStyle: "none",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px",
        }}>
          {device.features.map((f) => (
            <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <CheckCircle2 size={15} strokeWidth={2.5} color={T.red} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: T.fontBody, fontSize: 13.5, color: "#334155", lineHeight: 1.5 }}>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: "26px 32px 32px" }}>
        <h4 style={{ fontFamily: T.fontHead, fontWeight: 700, fontSize: 15, color: T.navy, margin: "0 0 14px" }}>
          Specifications
        </h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {device.specTable.map(([label, value], i) => (
              <tr key={label} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                <td style={{
                  padding: "9px 14px", fontFamily: T.fontHead, fontWeight: 600,
                  fontSize: 13, color: T.navy, width: "45%", borderBottom: "1px solid #EEF2F6",
                }}>
                  {label}
                </td>
                <td style={{
                  padding: "9px 14px", fontFamily: T.fontBody, fontSize: 13,
                  color: "#334155", borderBottom: "1px solid #EEF2F6",
                }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Section 7 — "Why XERXEZ", 6 dark cards (no numbering).
const WHY_XERXEZ: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Layers,      title: "End-to-End IoT Expertise", desc: "From strategy and architecture to device integration and ongoing support." },
  { icon: PenTool,     title: "Custom Fleet Platforms",   desc: "Built around your vehicles, drivers, workflows and logistics processes." },
  { icon: Eye,         title: "Real-Time Visibility",     desc: "Monitor vehicles through centralized web and mobile applications." },
  { icon: Layers,      title: "Scalable Architecture",    desc: "From small fleets to large distributed transportation networks." },
  { icon: Plug,        title: "Supply Chain Integration", desc: "Connect fleet data with logistics, warehouse, inventory and enterprise systems." },
  { icon: ShieldCheck, title: "Secure & Reliable",        desc: "Device authentication, access control and data protection throughout." },
];

// Closing CTA — 3 trust signals below the button.
const CTA_TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Gauge,       text: "Fast Response" },
  { icon: Layers,      text: "Custom Architecture" },
  { icon: ShieldCheck, text: "Enterprise Grade" },
];

const FleetManagementPage = () => {
  const [openDevice, setOpenDevice] = useState<string | null>(null);
  const activeDevice = TRACKING_DEVICES.find((d) => d.name === openDevice) ?? null;

  return (
  <>
  <XerxezShell>
    <SEO
      title="Fleet Management Systems | IoT Solutions | XERXEZ"
      description="Get real-time visibility into vehicle movement, driver behavior, fuel usage, maintenance, routes and delivery operations — across your entire fleet."
      canonical="/iot/fleet-management-systems"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · FLEET MANAGEMENT SYSTEMS"
      heading={<>Smarter Fleet Operations With GPS, IoT &amp; Real-Time Intelligence</>}
      subtitle={<>
        Managing a modern fleet requires more than knowing where vehicles are. Get real-time
        visibility into vehicle movement, driver behavior, fuel usage, maintenance
        requirements, route efficiency and delivery operations — across your entire fleet.
        Stop managing drivers and vehicles through phone calls, spreadsheets and manual logs.
        Give your fleet managers a single platform that monitors every vehicle, every route
        and every driver event in real time — so costs are controlled, safety is improved and
        deliveries are on time. Built for logistics, transportation and field service teams in
        UAE &amp; India.
      </>}
      heroImage={heroImage}
      ctaButtons={[
        { label: "Request a Demo", to: "/contact" },
        { label: "View Capabilities", href: "#capabilities", variant: "outline", arrow: false },
        { label: "View Devices", href: "#devices", variant: "outline", arrow: false },
      ]}
      overlayOpacity={0.70}
    />

    {/* ── What Is Fleet Management IoT — copy + checklist on the left, TALL
        image on the right (checklist sits below the paragraph, not beside
        the image). ── */}
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow>What Is Fleet Management IoT</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                lineHeight: 1.35, color: "#0F2C4D", margin: "14px 0 0",
              }}>
                Connect Every Vehicle With Real-Time Intelligence
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#0F2C4D", margin: "22px 0 0" }}>
                GPS tracking for fleet management uses GPS-enabled devices installed in vehicles to
                capture location, movement, speed, route and operational information. Combined with
                IoT technology, connected vehicles transmit real-time data to a centralized
                platform — enabling fleet managers to make faster, data-driven decisions.
              </p>
              {/* checklist — 3-column grid, directly below the paragraph */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 8px", marginTop: 32 }}>
                {FLEET_DATA_POINTS.map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <CheckCircle2 size={16} strokeWidth={2.5} color={T.red} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: T.fontHead, fontSize: 14, fontWeight: 600, color: T.headNavy, lineHeight: 1.4 }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <Reveal delay={80}>
              <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(7,26,51,0.15)" }}>
                <img
                  src={illustrationImage}
                  alt="Aerial view of a logistics yard with organized cargo containers"
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: 520, minHeight: 520, objectFit: "cover", display: "block" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── How It Works — light gray band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="How It Works" title="From Vehicle Tracking to Intelligent Fleet Operations" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {HOW_IT_WORKS.map((c, i) => (
            <div key={c.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<c.icon size={22} strokeWidth={2} />} title={c.title} desc={c.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Platform Capabilities — dark navy, 9 numbered cards, 3x3 grid. ── */}
    <section id="capabilities" style={{ ...industryPad, background: T.navy, position: "relative", overflow: "hidden", scrollMarginTop: V2_HEADER_H + 20 }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading
            align="center" dark
            eyebrow="Platform Capabilities"
            title="One Platform to Monitor Your Entire Fleet"
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {CAPABILITIES.map((c, i) => (
            <div key={c.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <DarkFeatureCard icon={c.icon} title={c.title} desc={c.desc} index={i} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Use Cases — white band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Use Cases" title="IoT-Powered Transportation for Multiple Industries" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {USE_CASES.map((u, i) => (
            <div key={u.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<u.icon size={22} strokeWidth={2} />} title={u.title} desc={u.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Benefits — light gray band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Benefits" title="Improve Fleet Performance With Real-Time Data" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<b.icon size={22} strokeWidth={2} />} title={b.title} desc={b.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Devices — certified GPS tracking hardware. ── */}
    <section id="devices" style={{ ...industryPad, background: "#fff", scrollMarginTop: V2_HEADER_H + 20 }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Devices"
            title="Certified GPS Tracking Devices"
          />
          <p style={{
            fontFamily: T.fontBody, fontSize: "1.05rem", lineHeight: 1.8,
            color: "#4B6070", textAlign: "center", maxWidth: 620, margin: "16px auto 0",
          }}>
            Every tracking device we deploy is pre-validated for our fleet management
            platform and certified for UAE and India regulatory requirements.
          </p>
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {TRACKING_DEVICES.map((d, i) => (
            <div key={d.name} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <div style={{
                  background: "#fff", borderRadius: 16,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 24px rgba(7,26,51,0.08)",
                  height: "100%", display: "flex", flexDirection: "column",
                }}>
                  {/* device image area — real photo when available, else gray placeholder */}
                  <div style={{
                    position: "relative", width: "100%", height: 200,
                    overflow: "hidden", borderRadius: "16px 16px 0 0", background: "#F1F5F9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {d.image ? (
                      <img
                        src={d.image}
                        alt={d.name}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Satellite size={38} strokeWidth={1.5} color="#94A3B8" />
                    )}
                    <span style={{
                      position: "absolute", top: 12, left: 14,
                      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20,
                      padding: "3px 10px",
                      fontFamily: T.fontHead, fontWeight: 700, fontSize: 11,
                      color: T.navy, letterSpacing: "0.02em",
                    }}>
                      {d.connectivity}
                    </span>
                  </div>

                  {/* content — cert badge, name, divider, 3 feature bullets */}
                  <div style={{ padding: 20, flex: 1 }}>
                    <span style={{
                      display: "inline-block",
                      background: d.certColor + "18",
                      color: d.certColor,
                      border: `1px solid ${d.certColor}44`,
                      borderRadius: 20, padding: "3px 10px",
                      fontSize: 11, fontWeight: 700,
                      fontFamily: T.fontHead, letterSpacing: "0.04em",
                      textTransform: "uppercase" as const,
                    }}>
                      {d.certTag}
                    </span>
                    <div style={{ fontFamily: T.fontHead, fontWeight: 700, fontSize: 18, color: T.navy, marginTop: 10 }}>
                      {d.name}
                    </div>
                    <div style={{ borderTop: "1px solid #F1F5F9", margin: "14px 0" }} />
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                      {d.specs.slice(0, 3).map((s) => (
                        <li key={s} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <CheckCircle2 size={15} strokeWidth={2.5} color={T.red} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontFamily: T.fontBody, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* footer — full-width "View Details" button, navy → red on hover */}
                  {d.detailRoute ? (
                    <Link
                      to={d.detailRoute}
                      style={{
                        display: "block", textAlign: "center", padding: 14,
                        borderRadius: "0 0 16px 16px", background: T.navy,
                        fontFamily: T.fontHead, fontWeight: 700, fontSize: 14,
                        color: "#fff", textDecoration: "none", transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = T.red; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = T.navy; }}
                    >
                      View Details <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setOpenDevice(d.name)}
                      style={{
                        display: "block", width: "100%", textAlign: "center", padding: 14,
                        borderRadius: "0 0 16px 16px", background: T.navy, border: "none",
                        fontFamily: T.fontHead, fontWeight: 700, fontSize: 14,
                        color: "#fff", cursor: "pointer", transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = T.red; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = T.navy; }}
                    >
                      View Details <span aria-hidden="true">→</span>
                    </button>
                  )}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Why XERXEZ — dark navy, 6 plain (unnumbered) dark cards. ── */}
    <section style={{ ...industryPad, background: T.navy, position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading
            align="center" dark
            eyebrow="Why XERXEZ"
            title="Build Smarter Transportation With IoT"
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {WHY_XERXEZ.map((w, i) => (
            <div key={w.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <DarkFeatureCard icon={w.icon} title={w.title} desc={w.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Closing CTA — navy band with red glow, custom copy (not the shared
        <XerxezCtaBand/>). ── */}
    <section style={{ background: T.navy, padding: "clamp(64px, 8vw, 104px) 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
        width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 68%)`, pointerEvents: "none",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <Eyebrow color={T.redLight}>Get Started</Eyebrow>
          <h2 style={{
            fontFamily: T.fontHead, fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800,
            lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "0 auto", maxWidth: 640,
          }}>
            Build Your Connected Fleet Management Solution
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 640,
          }}>
            Looking to implement GPS tracking, connect your commercial vehicles or build an
            IoT-powered fleet management platform? Our IoT specialists can help you select the
            right tracking devices, platform and integrations.
          </p>
          <Btn to="/contact">Request a Demo</Btn>

          {/* 3 trust signals — centered row below the button */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", justifyContent: "center", marginTop: 34 }}>
            {CTA_TRUST_SIGNALS.map((s) => (
              <span key={s.text} style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                <s.icon size={16} strokeWidth={2} color={T.redLight} />
                {s.text}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  </XerxezShell>

  {activeDevice && (
    <DeviceDetailsModal device={activeDevice} onClose={() => setOpenDevice(null)} />
  )}
  </>
  );
};

export default FleetManagementPage;
