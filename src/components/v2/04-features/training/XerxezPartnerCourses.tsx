// XerxezPartnerCourses.tsx
// Purpose: Training page "Courses from Our Partners" section — external
//          courses (Linux Foundation, Coursera, Udemy, AWS, …) that enroll
//          on the partner's own site via an affiliate link, not the LMA.
//          Mirrors XerxezCourses.tsx's card look for visual consistency
//          with the section directly above it.
// Used in: page/v2/TrainingV2.tsx
// Data source: GET {V2_API_BASE}/partner-courses/ — public, active courses only.

import { useEffect, useState } from "react";
import { BookOpen, Clock, ExternalLink, X, Copy, Check, Tag } from "lucide-react";
import { T, SectionHeading, Reveal, sectionPad, V2_API_BASE } from "../../01-core/v2theme";

interface PartnerCourse {
  id: number;
  partner_name: string;
  partner_logo: string | null;
  partner_website: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: string;
  thumbnail: string | null;
  affiliate_link: string;
  affiliate_code: string;
  is_featured: boolean;
}

// ── Pre-redirect coupon modal — shown before the student leaves for the
//    partner's site, so they see (and can copy) the discount code first. ──
const RedirectModal = ({ course, onClose }: { course: PartnerCourse; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(course.affiliate_code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const continueToPartner = () => {
    window.open(course.affiliate_link, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(7,26,51,0.60)", zIndex: 2000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 18, maxWidth: 420, width: "100%",
          overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.30)",
          animation: "xpc-pop 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <style>{`@keyframes xpc-pop { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

        <div style={{ padding: "24px 26px 0", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button" onClick={onClose} aria-label="Close"
            style={{ background: T.lightAlt, border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.muted }}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: "6px 32px 30px", textAlign: "center" }}>
          {course.partner_logo && (
            <img src={course.partner_logo} alt={course.partner_name} style={{ height: 28, width: "auto", objectFit: "contain", margin: "0 auto 16px", display: "block" }} />
          )}
          <h3 style={{ fontFamily: T.fontHead, fontSize: 19, fontWeight: 700, color: T.headNavy, margin: "0 0 8px" }}>
            You're going to {course.partner_name}
          </h3>
          <p style={{ fontFamily: T.fontBody, fontSize: 13.5, color: T.muted, lineHeight: 1.6, margin: "0 0 22px" }}>
            {course.title}
          </p>

          {course.affiliate_code && (
            <div style={{
              background: T.lightAlt, border: `1.5px dashed ${T.red}`, borderRadius: 12,
              padding: "16px 18px", marginBottom: 22,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: T.fontBody, fontSize: 12, color: T.muted, marginBottom: 8 }}>
                <Tag size={13} color={T.red} /> Use coupon code for a discount
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{ fontFamily: T.fontHead, fontSize: 20, fontWeight: 800, color: T.headNavy, letterSpacing: "0.04em" }}>
                  {course.affiliate_code}
                </span>
                <button
                  type="button" onClick={copyCode}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: copied ? "#16a34a" : "#fff", color: copied ? "#fff" : T.headNavy,
                    border: `1.5px solid ${copied ? "#16a34a" : T.border}`,
                    borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700,
                    fontFamily: T.fontHead, cursor: "pointer", transition: "all 0.15s ease",
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          <button
            type="button" onClick={continueToPartner}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: T.red, color: "#fff",
              fontFamily: T.fontHead, fontSize: 14, fontWeight: 600,
              padding: "13px 18px", borderRadius: T.rx, border: "none", cursor: "pointer",
            }}
          >
            Continue to {course.partner_name} <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "#16a34a", Intermediate: T.red, Advanced: "#e11d2e",
};

const PartnerCourseCard = ({ c, onEnroll }: { c: PartnerCourse; onEnroll: (c: PartnerCourse) => void }) => {
  const [hover, setHover] = useState(false);
  const levelColor = LEVEL_COLOR[c.level] ?? T.red;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", display: "flex", flexDirection: "column",
        background: "#fff", borderRadius: 16,
        overflow: "hidden", position: "relative",
        borderTop: `3px solid ${hover ? T.red : "transparent"}`,
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover
          ? "0 25px 50px rgba(7,26,51,0.22)"
          : "0 2px 6px rgba(7,26,51,0.05), 0 12px 28px rgba(7,26,51,0.09)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      {c.is_featured && (
        <span style={{
          position: "absolute", top: 16, right: 16,
          background: T.red, color: "#fff",
          fontFamily: T.fontHead, fontSize: 10, fontWeight: 700,
          padding: "4px 12px", borderRadius: 999,
          letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Featured
        </span>
      )}

      {/* thumbnail (or a pale placeholder banner if none set) */}
      <div style={{
        height: 150, background: c.thumbnail ? `url(${c.thumbnail}) center/cover` : T.lightAlt,
        display: "flex", alignItems: "flex-end", padding: 16, position: "relative",
      }}>
        {!c.thumbnail && (
          <BookOpen size={40} strokeWidth={1.5} color={T.border} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        )}
        {/* partner logo, top-left */}
        <span style={{
          position: "absolute", top: 14, left: 14,
          background: "#fff", borderRadius: 10, padding: "5px 10px",
          display: "flex", alignItems: "center", gap: 6,
          boxShadow: "0 4px 12px rgba(7,26,51,0.14)", maxWidth: "70%",
        }}>
          {c.partner_logo && (
            <img src={c.partner_logo} alt={c.partner_name} style={{ height: 16, width: "auto", objectFit: "contain" }} />
          )}
          <span style={{ fontFamily: T.fontHead, fontSize: 10.5, fontWeight: 700, color: T.headNavy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {c.partner_name}
          </span>
        </span>
      </div>

      <div style={{ padding: "20px 28px 16px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <span style={{
            fontFamily: T.fontHead, fontSize: 11, fontWeight: 700, color: T.red,
            background: "rgba(217,53,34,0.08)", padding: "3px 10px", borderRadius: 6,
          }}>
            {c.category}
          </span>
          <span style={{
            fontFamily: T.fontHead, fontSize: 10.5, fontWeight: 700, color: levelColor,
            background: `${levelColor}14`, padding: "3px 10px", borderRadius: 999,
            flexShrink: 0,
          }}>
            {c.level}
          </span>
        </div>
        <h3 style={{ fontFamily: T.fontHead, fontSize: 19, fontWeight: 700, color: T.headNavy, margin: "0 0 10px", lineHeight: 1.3 }}>
          {c.title}
        </h3>
        <p style={{
          fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.7, color: T.muted, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
        }}>
          {c.description}
        </p>
      </div>

      <div style={{ padding: "14px 28px 24px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: T.fontBody, fontSize: 12.5, color: "#5b6b7c", marginBottom: 14 }}>
          {c.duration && (<><Clock size={13} color={T.red} /> {c.duration}</>)}
          {c.duration && c.price && <span style={{ color: T.border }}>·</span>}
          {c.price && <span style={{ fontWeight: 700, color: T.headNavy }}>{c.price}</span>}
        </div>
        <button type="button" onClick={() => onEnroll(c)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: T.red, color: "#fff",
          fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 600,
          padding: "12px 18px", borderRadius: T.rx, border: "none", cursor: "pointer",
        }}>
          Enroll Now <ExternalLink size={14} />
        </button>
        <p style={{ fontFamily: T.fontBody, fontSize: 11, color: T.muted, textAlign: "center", margin: "9px 0 0" }}>
          You'll be redirected to {c.partner_name}
        </p>
      </div>
    </div>
  );
};

const XerxezPartnerCourses = () => {
  const [courses, setCourses] = useState<PartnerCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [redirectCourse, setRedirectCourse] = useState<PartnerCourse | null>(null);

  useEffect(() => {
    fetch(`${V2_API_BASE}/partner-courses/`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d) => setCourses(Array.isArray(d) ? d : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // Fixed tab set per spec — anything outside the first four named
  // categories collapses under "Other" so the filter row never grows
  // unbounded as more partners are added.
  const KNOWN_CATEGORIES = ["AI & ML", "DevSecOps", "Cloud", "Linux"];
  const categories = ["All", ...KNOWN_CATEGORIES, "Other"];

  const shown = activeCategory === "All"
    ? courses
    : activeCategory === "Other"
      ? courses.filter((c) => !KNOWN_CATEGORIES.includes(c.category))
      : courses.filter((c) => c.category === activeCategory);

  // Nothing to show at all (no partner courses added yet) — hide the whole
  // section rather than displaying an empty state on the public site.
  if (!loading && courses.length === 0) return null;

  return (
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Partner Courses"
            title="Learn from World-Class Partners"
            subtitle="Curated courses from leading technology organizations — enroll directly on their platform."
          />
        </Reveal>

        {!loading && courses.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 32 }}>
            {categories.map((cat) => {
              const sel = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    fontFamily: T.fontHead, fontSize: 12.5, fontWeight: 600,
                    padding: "8px 18px", borderRadius: 999, cursor: "pointer",
                    border: `1.5px solid ${sel ? T.red : T.border}`,
                    background: sel ? T.red : "#fff",
                    color: sel ? "#fff" : T.headNavy,
                    transition: "all 0.18s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 40 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 30, height: 30, margin: "0 auto",
                border: `3px solid ${T.border}`, borderTopColor: T.red,
                borderRadius: "50%", animation: "v2spin 0.8s linear infinite",
              }} />
              <style>{`@keyframes v2spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : shown.length === 0 ? (
            <p style={{ textAlign: "center", fontFamily: T.fontBody, fontSize: 14, color: T.muted }}>
              No partner courses in this category yet.
            </p>
          ) : (
            <div className="row g-4 justify-content-center">
              {shown.map((c, i) => (
                <div key={c.id} className="col-lg-4 col-md-6">
                  <Reveal delay={(i % 3) * 60} fill><PartnerCourseCard c={c} onEnroll={setRedirectCourse} /></Reveal>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {redirectCourse && (
        <RedirectModal course={redirectCourse} onClose={() => setRedirectCourse(null)} />
      )}
    </section>
  );
};

export default XerxezPartnerCourses;
