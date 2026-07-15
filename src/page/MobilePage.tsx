import ServicePageTemplate, { ServiceHeroCard } from "./ServicePageTemplate";
import type { ServicePageConfig } from "./ServicePageTemplate";
import SEO from "../components/seo/SEO";

const heroStats = [
  { val: "iOS & Android", label: "Native + Cross-Platform" },
  { val: "Offline-First", label: "Field-Ready Apps"        },
  { val: "<3 mo",         label: "Typical Launch Timeline" },
];

const config: ServicePageConfig = {
  seoTitle: "Mobile App Development India, Dubai & Abu Dhabi UAE — XERXEZ",
  seoDesc:  "Custom mobile application development by XERXEZ. iOS, Android and cross-platform apps for enterprises in India, Dubai & Abu Dhabi.",
  serviceName: "Mobile Application",
  badgeText: "Mobile Applications · iOS & Android",

  headline: (
    <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4.5vw,60px)", lineHeight: 1.08, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
      Enterprise Mobile Apps<br />
      <em style={{ color: "#C9883A", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
        Users Actually Love
      </em>
    </h1>
  ),
  description: "iOS, Android, and cross-platform — XERXEZ builds mobile applications that perform flawlessly, look distinctive, and launch in under 3 months.",

  heroStats: [
    { val: "iOS & Android", label: "Native + Cross-Platform" },
    { val: "Offline-First", label: "Field-Ready Apps"        },
    { val: "<3 mo",         label: "Typical Launch Timeline" },
  ],
  cascadeA: ["Native iOS","Native Android","React Native","Flutter","Cross-Platform","App Store Optimisation","Push Notifications","Offline-First","Biometric Auth"],
  cascadeB: ["Swift · SwiftUI","Kotlin · Jetpack Compose","React Native · Expo","Flutter · Dart","Firebase · Supabase","In-App Purchases","MapKit · Google Maps","Core ML · TensorFlow Lite","TestFlight · Play Console"],

  heroRight: (
    <ServiceHeroCard
      icon="fas fa-mobile-alt"
      title="Mobile Development"
      stats={heroStats}
    />
  ),

  trustBar: [
    { icon: "fab fa-apple",       label: "Native iOS & Android"     },
    { icon: "fas fa-mobile-alt",  label: "React Native & Flutter"   },
    { icon: "fas fa-shield-alt",  label: "OWASP Mobile Practices"   },
    { icon: "fas fa-wifi",        label: "Offline-First Architecture" },
    { icon: "fas fa-fingerprint", label: "Biometric Auth"           },
  ],

  featureLabel: "Development Capabilities",
  featureTitle: (
    <>Mobile That <span style={{ color: "#C9883A" }}>Performs, Everywhere</span></>
  ),
  features: [
    { icon: "fab fa-apple",       title: "Native iOS (Swift)",       desc: "SwiftUI and UIKit applications built to Apple Human Interface Guidelines. Full access to ARKit, Core ML, HealthKit, and all native iOS capabilities." },
    { icon: "fab fa-android",     title: "Native Android (Kotlin)",  desc: "Jetpack Compose and traditional View-based Android apps targeting API 26+. Material Design 3, Dynamic Colour, and full Play Services integration." },
    { icon: "fas fa-mobile-alt",  title: "Cross-Platform (RN/Flutter)", desc: "React Native and Flutter apps that share the vast majority of code across iOS and Android while delivering near-native performance and platform-appropriate UI patterns." },
    { icon: "fas fa-paint-brush", title: "Mobile UI/UX Design",      desc: "Research-led mobile design: user journey mapping, interactive prototypes, A/B testing, and accessibility compliance to WCAG 2.1 AA before a line of code is written." },
    { icon: "fas fa-server",      title: "Backend Integration",      desc: "REST and GraphQL API integration, real-time WebSocket connections, offline-first data sync, push notification infrastructure, and secure mobile authentication with biometrics." },
    { icon: "fas fa-chart-line",  title: "App Store Optimisation",   desc: "ASO strategy, screenshot design, keyword research, review management, and crash analytics to grow organic downloads sustainably." },
  ],

  processLabel: "How We Build",
  processTitle: (
    <>Concept to <span style={{ color: "#C9883A" }}>Live App in 12 Weeks</span></>
  ),
  steps: [
    { no: "01", title: "Discovery & UX Research",   dur: "Week 1 – 2",  desc: "User interviews, competitive teardowns, journey mapping, and platform strategy. We decide native vs. cross-platform based on your users' behaviour — not our tech preferences." },
    { no: "02", title: "Design & Prototype",        dur: "Week 3 – 4",  desc: "Hi-fi designs in Figma, interactive prototype for stakeholder sign-off, and design system creation. App Store review guidelines checked against every screen." },
    { no: "03", title: "Agile Development",         dur: "Week 5 – 10", desc: "2-week sprints with TestFlight/Play Console builds at every milestone. Continuous integration with automated UI tests on real device farms — not simulators." },
    { no: "04", title: "QA & Performance Testing",  dur: "Week 11",     desc: "Manual and automated testing on 25+ real device configurations. Performance profiling, battery usage optimisation, and accessibility audit." },
    { no: "05", title: "Store Submission",          dur: "Week 12",     desc: "App Store and Play Store submission management, review process handling, and phased rollout configuration. We know App Store Review Guidelines and Google Play Policies inside out — and what gets rejected and why." },
    { no: "06", title: "Post-Launch & Growth",      dur: "Ongoing",     desc: "Crash monitoring, performance analytics, feature releases on 4-week cycles, and ongoing ASO optimisation." },
  ],

  useCaseLabel: "Mobile Use Cases",
  useCaseTitle: (
    <>Apps for <span style={{ color: "#C9883A" }}>Every Enterprise Function</span></>
  ),
  useCases: [
    { icon: "fas fa-users",          label: "Field Force Management",   desc: "Mobile apps for field sales, service engineers, and inspectors with offline functionality, GPS tracking, digital forms, and real-time sync." },
    { icon: "fas fa-shopping-bag",   label: "Consumer Commerce",        desc: "Shopping apps with AR try-on, personalised recommendations, Apple Pay / Google Pay, and fast, native checkout flows that outperform the mobile web." },
    { icon: "fas fa-heartbeat",      label: "Digital Health",           desc: "HealthKit and Google Fit integrated wellness apps, remote patient monitoring platforms, and medication management tools with regulatory compliance built in." },
    { icon: "fas fa-shipping-fast",  label: "Logistics & Delivery",     desc: "Driver apps, customer tracking portals, and dispatch management systems with real-time mapping, proof of delivery, and offline route access." },
    { icon: "fas fa-graduation-cap", label: "Learning & Training",      desc: "Corporate training apps with video content, interactive assessments, progress tracking, and offline download — delivered to learners without internet access." },
    { icon: "fas fa-building",       label: "Enterprise Productivity",  desc: "Internal tooling, approval workflows, data capture apps, and dashboard companions that give your teams critical information on the device in their pocket." },
  ],

  faqTitle: "Common Mobile Development Questions",
  faqs: [
    { q: "Should we build native or cross-platform?", a: "For most enterprise applications, React Native or Flutter delivers the right balance: near-native performance, 85–92% shared code, and a single team maintaining both platforms. We recommend native Swift or Kotlin when you need deep integration with platform-specific hardware (ARKit, Core NFC, platform-specific health frameworks) or when the app is the core product rather than a feature." },
    { q: "How do you test across so many device configurations?", a: "We use real device farms (AWS Device Farm and Firebase Test Lab) covering the top 25 device and OS combinations by market share in your target market. Automated UI tests run on every build. We also test manually on the 8 most common physical devices before every release — not just in simulators." },
    { q: "Can you handle App Store and Play Store rejections?", a: "We have deep, current knowledge of App Store Review Guidelines and Google Play Policies. We design and code specifically to avoid common rejection reasons. When rejections do happen (they sometimes do), we handle the appeal process, guideline interpretation, and resubmission — it's included in our delivery process, not billed as extra." },
    { q: "What determines your app store rating targets?", a: "UX quality (apps that are genuinely intuitive), performance (crash-free sessions), and post-launch support quality — P1 bugs get resolved fast, not queued behind a backlog. We treat the store rating as a live signal, not an afterthought." },
    { q: "How do you handle app security for enterprise data?", a: "We implement OWASP Mobile Top 10 controls as standard: certificate pinning, biometric authentication, secure local storage (Keychain / EncryptedSharedPreferences), jailbreak/root detection, and obfuscation. For apps handling regulated data (healthcare, finance), we conduct a dedicated mobile security assessment before store submission." },
  ],

  ctaTitle: (
    <>Ready to Launch an App <span style={{ color: "#C9883A" }}>Users Will Actually Use?</span></>
  ),
  ctaDesc: "Tell us about your mobile product idea or internal tool requirement. XERXEZ will scope it, design it, build it, and get it live — held to the same QA rigor and store-review expertise on every project.",
  ctaTags: ["iOS & Android Native", "App Store Experts", "OWASP Mobile Security"],

  painPoints: [
    "An app that looks fine in the demo but crashes on real devices in the field?",
    "App Store rejections eating weeks off your launch timeline?",
    "Cross-platform code that quietly diverges into two apps to maintain?",
    "A 2-star average because nobody tested past the happy path?",
  ],
};

const MobilePage = () => (
  <>
    <SEO
      title="Mobile App Development India, Dubai & Abu Dhabi UAE — XERXEZ"
      description="Custom mobile application development by XERXEZ. iOS, Android and cross-platform apps for enterprises in India, Dubai & Abu Dhabi."
      canonical="/service/mobile-application"
      keywords="mobile app development India, mobile app development abu dhabi, mobile app UAE, mobile app Dubai, mobile app Abu Dhabi, enterprise mobile apps, iOS Android development India, Xerxez Solutions"
    />
    <ServicePageTemplate config={config} />
  </>
);
export default MobilePage;
