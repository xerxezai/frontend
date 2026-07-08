import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Shield, ShieldCheck, X, Lock, PlayCircle, FileText, Star } from "lucide-react";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const DARK2 = "#100c07";
const CREAM = "#F8F4EE";
const FF    = "'DM Sans', sans-serif";

const THUMB_GRADS = [
  ["#1e3a5f", "#3b82f6"],
  ["#3b1f6e", "#8b5cf6"],
  ["#0f3d30", "#10b981"],
  ["#5a3200", "#C9883A"],
  ["#5a1020", "#f43f5e"],
  ["#0f2040", "#60a5fa"],
];
const THUMB_ICONS = [
  "fas fa-brain", "fas fa-code", "fas fa-cogs",
  "fas fa-chart-bar", "fas fa-cloud", "fas fa-shield-alt",
];

/* ── URL → embed URL ── */
function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube: watch?v=ID or youtu.be/ID or already embed
  const ytWatch = url.match(/[?&]v=([^&\s]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  const ytShort = url.match(/youtu\.be\/([^?&\s]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  if (url.includes("youtube.com/embed/")) return url;
  // Vimeo: vimeo.com/ID or already embed
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (url.includes("player.vimeo.com/video/")) return url;
  return null;
}

/* ── Lesson modal ── */
const LessonModal = ({ lesson, enrolled, onClose, onEnroll, token, isInstructor }: {
  lesson: any; enrolled: boolean; onClose: () => void; onEnroll: () => void;
  token: string; isInstructor: boolean;
}) => {
  const canWatch = lesson.is_free_preview || enrolled || isInstructor;
  const [secureVideoUrl, setSecureVideoUrl] = useState("");
  const [videoFetching, setVideoFetching] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Fetch video URL from authenticated endpoint — never expose URL via public course API
  useEffect(() => {
    if (!canWatch) return;
    setVideoFetching(true);
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    fetch(`${API}/lma/lessons/${lesson.id}/video/`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then((d: { video_url?: string } | null) => { if (d?.video_url) setSecureVideoUrl(d.video_url); })
      .catch(() => {})
      .finally(() => setVideoFetching(false));
  }, [lesson.id, canWatch, token]);

  const embedUrl = secureVideoUrl ? toEmbedUrl(secureVideoUrl) : null;

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(10,8,6,0.78)", zIndex: 600,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", backdropFilter: "blur(4px)",
        animation: "lmacd-fadeIn 0.22s ease both",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 820,
        maxHeight: "92vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
        animation: "lmacd-slideUp 0.28s cubic-bezier(0.22,1,0.36,1) both",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "20px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)",
          background: DARK, borderRadius: "20px 20px 0 0",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {canWatch
              ? <PlayCircle size={18} color="#0a0806" />
              : <Lock size={16} color="#0a0806" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.25, fontFamily: FF }}>{lesson.title}</div>
            {lesson.duration > 0 && (
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)", marginTop: 3, fontFamily: FF }}>
                {lesson.duration} min{lesson.is_free_preview ? " · Free Preview" : ""}
              </div>
            )}
          </div>
          <button type="button" onClick={onClose} style={{
            background: "rgba(255,255,255,0.10)", border: "none", borderRadius: 8,
            padding: 8, cursor: "pointer", color: "rgba(255,255,255,0.60)",
            display: "flex", alignItems: "center", flexShrink: 0,
            transition: "background 0.18s ease",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "0 0 28px" }}>
          {/* Video section */}
          {canWatch ? (
            videoFetching ? (
              <div style={{ position: "relative", paddingBottom: "56.25%", background: "#0a0806" }}>
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0a0806",
                }}>
                  <div style={{
                    width: 36, height: 36,
                    border: `3px solid rgba(201,136,58,0.20)`,
                    borderTop: `3px solid ${GOLD}`,
                    borderRadius: "50%", animation: "lmacd-spin 0.8s linear infinite",
                  }} />
                </div>
              </div>
            ) : embedUrl ? (
              <div style={{ position: "relative", paddingBottom: "56.25%", background: "#0a0806" }}>
                {!videoLoaded && (
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#0a0806",
                  }}>
                    <div style={{
                      width: 36, height: 36,
                      border: `3px solid rgba(201,136,58,0.20)`,
                      borderTop: `3px solid ${GOLD}`,
                      borderRadius: "50%", animation: "lmacd-spin 0.8s linear infinite",
                    }} />
                  </div>
                )}
                <iframe
                  src={embedUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setVideoLoaded(true)}
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%", border: "none",
                  }}
                />
              </div>
            ) : secureVideoUrl ? (
              // Non-embeddable URL — show direct link
              <div style={{ padding: "20px 24px 0", background: "#f9f7f4" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
                  background: "rgba(201,136,58,0.08)", borderRadius: 10, border: "1px solid rgba(201,136,58,0.20)",
                }}>
                  <PlayCircle size={15} color={GOLD} />
                  <span style={{ fontSize: 13, color: GOLD, fontWeight: 600, fontFamily: FF }}>Video link: </span>
                  <a href={secureVideoUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: GOLD, fontFamily: FF, wordBreak: "break-all" }}>
                    {secureVideoUrl}
                  </a>
                </div>
              </div>
            ) : null
          ) : (
            /* Locked state */
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "48px 24px", textAlign: "center",
              background: `linear-gradient(160deg,${DARK} 0%,#120e05 100%)`,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(201,136,58,0.12)", border: `1.5px solid rgba(201,136,58,0.30)`,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
              }}>
                <Lock size={28} color={GOLD} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 8px", fontFamily: FF }}>
                Enroll to watch this lesson
              </h3>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", margin: "0 0 24px", maxWidth: 340, lineHeight: 1.6, fontFamily: FF }}>
                This lesson is only available to enrolled students. Get full access to all {lesson.duration > 0 ? `${lesson.duration}-minute ` : ""}lessons in this course.
              </p>
              <button type="button" onClick={onEnroll} style={{
                background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                color: "#0a0806", fontWeight: 800, fontSize: 14, fontFamily: FF,
                border: "none", borderRadius: 11, padding: "13px 32px", cursor: "pointer",
                boxShadow: "0 4px 0 rgba(130,78,18,0.45),0 8px 24px rgba(201,136,58,0.28)",
              }}>
                Enroll Now →
              </button>
            </div>
          )}

          {/* Content / Notes */}
          {canWatch && lesson.content && (
            <div style={{ padding: "22px 24px 0" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
              }}>
                <FileText size={15} color={GOLD} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF }}>Lesson Notes</span>
              </div>
              <div style={{
                fontSize: 14, color: "#374151", lineHeight: 1.75, fontFamily: FF,
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {lesson.content}
              </div>
            </div>
          )}

          {/* No content placeholder for free preview without content */}
          {canWatch && !lesson.content && !secureVideoUrl && !videoFetching && (
            <div style={{ padding: "32px 24px", textAlign: "center", color: "rgba(20,20,19,0.40)", fontSize: 13, fontFamily: FF }}>
              No content has been added for this lesson yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Module thumbnail ── */
const ModuleThumbnail = ({ index, size = 80 }: { index: number; size?: number }) => {
  const [a, b] = THUMB_GRADS[index % THUMB_GRADS.length];
  return (
    <div style={{
      width: size, height: Math.round(size * 0.7), borderRadius: 8, flexShrink: 0,
      background: `linear-gradient(135deg,${a} 0%,${b} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%,rgba(255,255,255,0.18) 0%,transparent 60%)" }} />
      <i className={THUMB_ICONS[index % THUMB_ICONS.length]}
        style={{ color: "rgba(255,255,255,0.92)", fontSize: size * 0.25, position: "relative", zIndex: 1 }} />
    </div>
  );
};

/* ── Star rating ── */
const StarRating = ({ rating }: { rating: number }) => (
  <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
    {[1,2,3,4,5].map(n => (
      <i key={n} className="fas fa-star"
        style={{ fontSize: 12, color: n <= Math.round(rating) ? "#f59e0b" : "rgba(255,255,255,0.22)" }} />
    ))}
    <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginLeft: 5 }}>{rating}</span>
  </span>
);

/* ── Interactive star input ── */
const StarInput = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
        >
          <Star
            size={26}
            color="#f59e0b"
            fill={n <= (hover || value) ? "#f59e0b" : "none"}
            style={{ transition: "transform 0.1s ease", transform: n <= (hover || value) ? "scale(1.08)" : "scale(1)" }}
          />
        </button>
      ))}
    </div>
  );
};

interface CourseReview {
  id: number;
  student_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

/* ── Reviews section: leave-a-review form (enrolled only) + list of real reviews ── */
const ReviewsSection = ({ courseId, enrolled, token }: { courseId: string; enrolled: boolean; token: string }) => {
  const [reviews, setReviews]   = useState<CourseReview[]>([]);
  const [loading, setLoading]   = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]       = useState("");
  const [editing, setEditing]   = useState(false);

  const loadReviews = useCallback(() => {
    fetch(`${API}/lma/courses/${courseId}/reviews/`)
      .then(r => r.json())
      .then(d => setReviews(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  useEffect(() => {
    if (!enrolled || !token) return;
    fetch(`${API}/lma/courses/${courseId}/my-review/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) { setMyRating(d.rating); setMyComment(d.comment || ""); setSubmitted(true); }
      })
      .catch(() => {});
  }, [enrolled, token, courseId]);

  const handleSubmit = async () => {
    if (myRating < 1) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API}/lma/courses/${courseId}/review/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: myRating, comment: myComment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not submit your review."); return; }
      setSubmitted(true);
      setEditing(false);
      loadReviews();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 36 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: FF }}>
        Student Reviews {reviews.length > 0 && <span style={{ color: "rgba(20,20,19,0.40)", fontWeight: 600 }}>({reviews.length})</span>}
      </h3>

      {/* Leave / edit a review */}
      {enrolled && (
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)",
          borderTop: `3px solid ${GOLD}`, padding: "22px 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: 20,
        }}>
          {submitted && !editing ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} size={16} color="#f59e0b" fill={n <= myRating ? "#f59e0b" : "none"} />
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, fontFamily: FF }}>
                  {myComment ? `"${myComment}"` : "Thanks for rating this course!"}
                </p>
              </div>
              <button type="button" onClick={() => setEditing(true)} style={{
                fontSize: 12.5, fontWeight: 700, color: GOLD, background: "rgba(201,136,58,0.08)",
                border: "1px solid rgba(201,136,58,0.22)", borderRadius: 8, padding: "7px 14px",
                cursor: "pointer", fontFamily: FF, flexShrink: 0,
              }}>
                Edit Review
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", marginBottom: 10, fontFamily: FF }}>
                {submitted ? "Update your review" : "Leave a review"}
              </div>
              <div style={{ marginBottom: 14 }}>
                <StarInput value={myRating} onChange={setMyRating} />
              </div>
              <textarea
                value={myComment}
                onChange={e => setMyComment(e.target.value)}
                placeholder="Share your experience with this course… (optional)"
                rows={3}
                style={{
                  width: "100%", boxSizing: "border-box", resize: "vertical",
                  border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: 10, padding: "12px 14px",
                  fontSize: 13.5, fontFamily: FF, outline: "none", color: "#141413",
                  marginBottom: 14,
                }}
              />
              {error && <p style={{ color: "#ef4444", fontSize: 12.5, margin: "0 0 12px", fontFamily: FF }}>{error}</p>}
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={handleSubmit} disabled={submitting} style={{
                  background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806",
                  fontSize: 13, fontWeight: 700, border: "none", borderRadius: 9,
                  padding: "10px 22px", cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1, fontFamily: FF,
                  boxShadow: "0 4px 0 rgba(140,80,20,0.30)",
                }}>
                  {submitting ? "Submitting…" : submitted ? "Update Review" : "Submit Review"}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(false); setError(""); }} style={{
                    background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.10)",
                    borderRadius: 9, padding: "10px 20px", color: "#6b7280", fontSize: 13,
                    fontWeight: 600, cursor: "pointer", fontFamily: FF,
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Review list */}
      {loading ? null : reviews.length === 0 ? (
        <p style={{ fontSize: 13, color: "rgba(20,20,19,0.40)", fontFamily: FF }}>
          No reviews yet{enrolled ? " — be the first to share your thoughts!" : "."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.map(r => (
            <div key={r.id} style={{
              background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)",
              padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 12.5, color: "#0a0806", flexShrink: 0, fontFamily: FF,
                }}>
                  {r.student_name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>{r.student_name}</div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={11} color="#f59e0b" fill={n <= r.rating ? "#f59e0b" : "none"} />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "rgba(20,20,19,0.35)", fontFamily: FF, flexShrink: 0 }}>
                  {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              {r.comment && (
                <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: 0, fontFamily: FF }}>
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Lesson row ── */
const LessonRow = ({ lesson, enrolled, onClick }: {
  lesson: any; enrolled: boolean; onClick: (lesson: any) => void;
}) => {
  const canWatch = lesson.is_free_preview || enrolled;
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(lesson)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "9px 8px",
        borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer",
        borderRadius: 7, transition: "background 0.16s ease",
        background: hov ? (canWatch ? "rgba(201,136,58,0.06)" : "rgba(0,0,0,0.03)") : "transparent",
        margin: "0 -8px",
      }}
    >
      {canWatch
        ? <i className="fas fa-play-circle" style={{ fontSize: 14, color: hov ? AMBER : GOLD, flexShrink: 0, width: 16, transition: "color 0.16s ease" }} />
        : <i className="fas fa-lock" style={{ fontSize: 12, color: "#c5bfba", flexShrink: 0, width: 16 }} />}
      <span style={{
        flex: 1, fontSize: 13, lineHeight: 1.45, fontFamily: FF,
        color: canWatch ? "#141413" : "rgba(20,20,19,0.52)",
        fontWeight: hov && canWatch ? 600 : 400,
        transition: "font-weight 0.12s ease",
      }}>
        {lesson.title}
      </span>
      {lesson.is_free_preview && (
        <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 4, padding: "1px 6px", flexShrink: 0 }}>
          Free
        </span>
      )}
      {lesson.has_video && canWatch && (
        <i className="fas fa-film" style={{ fontSize: 10, color: "rgba(20,20,19,0.28)", flexShrink: 0 }} />
      )}
      <span style={{ fontSize: 11.5, color: "rgba(20,20,19,0.38)", flexShrink: 0 }}>{lesson.duration}m</span>
    </div>
  );
};

/* ── Module accordion row ── */
const ModuleRow = ({ mod, modIndex, isOpen, toggle, revealDelay, enrolled, onLessonClick }: {
  mod: any; modIndex: number; isOpen: boolean; toggle: () => void; revealDelay: number;
  enrolled: boolean; onLessonClick: (lesson: any) => void;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current; if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = `opacity 0.48s ease ${revealDelay}ms, transform 0.48s cubic-bezier(0.22,1,0.36,1) ${revealDelay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [revealDelay]);

  const totalMins = mod.lessons?.reduce((s: number, l: any) => s + (l.duration ?? 0), 0) ?? mod.duration ?? 0;
  const h = Math.floor(totalMins / 60), m = totalMins % 60;
  const durStr = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;

  return (
    <div ref={rowRef} style={{
      border: "1px solid rgba(0,0,0,0.09)",
      borderLeft: `3px solid ${isOpen ? GOLD : "transparent"}`,
      borderRadius: 10, marginBottom: 8, overflow: "hidden", background: "#fff",
      transition: "border-left-color 0.22s ease",
    }}>
      <button type="button" onClick={toggle} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 14,
        padding: "13px 16px", border: "none", cursor: "pointer",
        background: isOpen ? "#fdfaf6" : "#fff", fontFamily: FF, textAlign: "left",
        transition: "background 0.18s ease",
      }}>
        <ModuleThumbnail index={modIndex} size={80} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", marginBottom: 3, lineHeight: 1.3 }}>{mod.title}</div>
          <div style={{ fontSize: 12, color: "rgba(20,20,19,0.44)" }}>
            Course {modIndex + 1} · {mod.lessons?.length ?? 0} lessons · {durStr}
          </div>
        </div>
        <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}
          style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0 }} />
      </button>
      <div style={{
        maxHeight: isOpen ? "3000px" : "0px", overflow: "hidden",
        transition: isOpen ? "max-height 0.55s cubic-bezier(0.4,0,0.2,1)" : "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div className="lmacd-lesson-indent" style={{ padding: "2px 16px 12px", paddingLeft: 110, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {(mod.lessons ?? []).map((l: any) => (
            <LessonRow key={l.id} lesson={l} enrolled={enrolled} onClick={onLessonClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Instructor item ── */
const InstructorItem = ({ name, designation, courses, learners }: {
  name: string; designation: string; courses: number; learners: string;
}) => {
  const [hov, setHov] = useState(false);
  const initials = name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
      <div
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg,${AMBER},${GOLD})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#0a0806", fontWeight: 800, fontSize: 15, cursor: "pointer",
          boxShadow: hov ? `0 0 0 3px ${GOLD},0 0 18px rgba(201,136,58,0.40)` : "none",
          transition: "box-shadow 0.22s ease",
        }}
      >{initials}</div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: GOLD, marginBottom: 2, fontFamily: FF }}>{name}</div>
        <div style={{ fontSize: 12, color: "rgba(20,20,19,0.52)", marginBottom: 3, fontFamily: FF }}>{designation}</div>
        <div style={{ fontSize: 11, color: "rgba(20,20,19,0.38)", fontFamily: FF }}>
          {courses} Course{courses !== 1 ? "s" : ""} · {learners} learners
        </div>
      </div>
    </div>
  );
};

/* ── What you'll learn ── */
const WhatYouLearnBox = ({ techStack }: { techStack: string[] }) => {
  const items = [
    `Hands-on with ${techStack[0] ?? "Python"} from day one`,
    "Build production-ready AI systems end-to-end",
    `Deploy and monitor with ${techStack[1] ?? "cloud platforms"}`,
    "Earn XERXEZ AI certification",
    `Work with real enterprise ${techStack[2] ?? "data pipelines"}`,
    "Master industry deployment patterns and MLOps",
  ];
  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.09)", borderRadius: 14, padding: "22px 26px", marginBottom: 24, background: "#fff" }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: FF }}>What you'll learn</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }} className="lmacd-learn-grid">
        {items.map(item => (
          <div key={item} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <i className="fas fa-check" style={{ color: GOLD, fontSize: 12, marginTop: 4, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, fontFamily: FF }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Skills pills ── */
const SkillsPills = ({ items, heading }: { items: string[]; heading: string }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 12px", fontFamily: FF }}>{heading}</h3>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map(t => (
        <span key={t} style={{
          fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 999,
          background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb", fontFamily: FF,
        }}>{t}</span>
      ))}
    </div>
  </div>
);

/* ── Details to know ── */
const DetailsToKnow = ({ hours, lessonsCount, level }: { hours: number; lessonsCount: number; level: string }) => (
  <div style={{ marginBottom: 28 }}>
    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: FF }}>Details to know</h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {[
        { icon: "fab fa-linkedin", label: "Shareable certificate", sub: "Add to LinkedIn profile",  iconColor: "#0077b5" },
        { icon: "fas fa-globe",    label: "Taught in English",     sub: "Certificate in English",   iconColor: GOLD     },
        { icon: "far fa-clock",    label: `${hours} hours`,        sub: "Flexible schedule",        iconColor: GOLD     },
        { icon: "fas fa-layer-group", label: `${lessonsCount} lessons`, sub: level.charAt(0).toUpperCase() + level.slice(1) + " level", iconColor: GOLD },
      ].map(d => (
        <div key={d.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <i className={d.icon} style={{ fontSize: 20, color: d.iconColor, width: 24, textAlign: "center" as const, marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>{d.label}</div>
            <div style={{ fontSize: 12, color: "rgba(20,20,19,0.48)", fontFamily: FF }}>{d.sub}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── Payment modal ── */
const PaymentModal = ({ course, token, onClose, onEnrolled }: {
  course: any; token: string; onClose: () => void; onEnrolled: () => void;
}) => {
  const [step, setStep] = useState<"confirm" | "processing" | "done">("confirm");

  const pay = async () => {
    setStep("processing");
    try {
      const r = await fetch(`${API}/lma/mock-payment/${course.id}/`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (r.ok) { setStep("done"); setTimeout(() => { onEnrolled(); onClose(); }, 2000); }
      else setStep("confirm");
    } catch { setStep("confirm"); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 22, padding: 32, width: "100%", maxWidth: 440, boxShadow: "0 32px 80px rgba(0,0,0,0.30)" }}>
        {step === "confirm" && (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Confirm Enrollment</h3>
            <p style={{ fontSize: 13, color: "rgba(20,20,19,0.55)", margin: "0 0 20px", fontFamily: FF }}>You're enrolling in:</p>
            <div style={{ background: CREAM, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#141413", marginBottom: 4, fontFamily: FF }}>{course.title}</div>
              <div style={{ fontSize: 12, color: "rgba(20,20,19,0.45)", fontFamily: FF }}>by {course.instructor_name}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "12px 0", margin: "0 0 20px" }}>
              <span style={{ fontSize: 14, color: "rgba(20,20,19,0.55)", fontFamily: FF }}>Total</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: GOLD, fontFamily: FF }}>₹{course.price?.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 20 }}>
              <Shield size={12} color="#9ca3af" />
              <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: FF }}>30-day money-back guarantee · Lifetime access</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 11, padding: 13, cursor: "pointer", fontFamily: FF }}>Cancel</button>
              <button type="button" onClick={pay} style={{ flex: 2, fontSize: 13, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg,${AMBER},${GOLD})`, border: "none", borderRadius: 11, padding: 13, cursor: "pointer", fontFamily: FF, boxShadow: "0 3px 0 rgba(140,80,20,0.40)" }}>
                Pay ₹{course.price?.toLocaleString()} →
              </button>
            </div>
          </>
        )}
        {step === "processing" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div className="lmacd-spinner" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#141413", fontFamily: FF }}>Processing…</p>
          </div>
        )}
        {step === "done" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle2 size={28} color="#059669" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Enrolled!</h3>
            <p style={{ fontSize: 13, color: "rgba(20,20,19,0.55)", fontFamily: FF }}>Redirecting to your dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   3-D HERO COURSE CARD
════════════════════════════════════════════════════════════════════════════ */
const HeroCourseCard = ({ course, totalLessons, onEnroll, onPreview }: {
  course: any; totalLessons: number; onEnroll: () => void; onPreview?: () => void;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current; if (!card) return;
    const wrap = wrapRef.current; if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
  };

  const onLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  return (
    <div ref={wrapRef} className="lmacd-hcard-wrap" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={cardRef} className="lmacd-hcard">
        {/* Gold top stripe */}
        <div style={{ height: 4, background: `linear-gradient(90deg,${AMBER},${GOLD})`, margin: "-20px -20px 16px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="fas fa-graduation-cap" style={{ color: "#0a0806", fontSize: 14 }} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: AMBER, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>XERXEZ ACADEMY</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", fontFamily: FF }}>Certified Professional Program</div>
          </div>
        </div>

        {/* Course title */}
        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4, lineHeight: 1.25, fontFamily: FF }}>
          {course.title}
        </div>
        {(course.total_ratings ?? 0) > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 14 }}>
            {[1,2,3,4,5].map(n => (
              <i key={n} className="fas fa-star" style={{ fontSize: 9, color: n <= Math.round(course.rating) ? "#f59e0b" : "rgba(255,255,255,0.15)" }} />
            ))}
            <span style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginLeft: 3 }}>{course.rating}</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginLeft: 2 }}>
              ({(course.total_ratings).toLocaleString()} reviews)
            </span>
          </div>
        ) : (
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.30)", marginBottom: 14, fontFamily: FF }}>No reviews yet</div>
        )}

        {/* Stat tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7, marginBottom: 14 }}>
          {[
            { val: `${course.hours}h`,   label: "Duration" },
            { val: String(totalLessons), label: "Lessons"  },
            { val: ((course.level ?? "Int").charAt(0).toUpperCase() + (course.level ?? "Int").slice(1)), label: "Level" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 9, padding: "8px 5px",
              textAlign: "center", border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: AMBER, fontFamily: FF }}>{s.val}</div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.32)", marginTop: 2, fontFamily: FF }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Completion bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", fontFamily: FF }}>Avg. Completion</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: GOLD, fontFamily: FF }}>{course.avg_completion ?? 0}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${course.avg_completion ?? 0}%`, borderRadius: 99, background: `linear-gradient(90deg,${AMBER},${GOLD})`, boxShadow: `0 0 8px rgba(201,136,58,0.50)` }} />
          </div>
        </div>

        {/* Certificate badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 9, padding: "9px 12px",
          borderRadius: 10, background: "rgba(201,136,58,0.08)",
          border: "1px solid rgba(201,136,58,0.20)", marginBottom: 14,
        }}>
          <i className="fas fa-certificate" style={{ color: GOLD, fontSize: 18, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", fontFamily: FF }}>Certificate of Completion</div>
            <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.38)", fontFamily: FF }}>Shareable · LinkedIn-ready</div>
          </div>
        </div>

        {/* Enroll CTA */}
        <button type="button" onClick={onEnroll} style={{
          width: "100%", padding: "11px", borderRadius: 10,
          background: `linear-gradient(135deg,${AMBER},${GOLD})`,
          color: "#0a0806", fontWeight: 800, fontSize: 13, fontFamily: FF,
          border: "none", cursor: "pointer",
          boxShadow: "0 3px 0 rgba(130,78,18,0.45),0 6px 20px rgba(201,136,58,0.28)",
        }}>
          Enroll Now — ₹{course.price?.toLocaleString() ?? "–"}
        </button>
        <button type="button" onClick={onPreview} className="lmacd-preview-btn" style={{
          width: "100%", padding: "9px", borderRadius: 10, marginTop: 8,
          background: "transparent", color: GOLD, fontWeight: 700, fontSize: 11.5, fontFamily: FF,
          border: `2px solid ${GOLD}`, cursor: "pointer",
          transition: "background 0.20s ease",
        }}>
          <i className="fas fa-play-circle" style={{ fontSize: 10, marginRight: 5 }} />
          Try Free Preview
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════ */
export default function LMACourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action") || "";
  const token = localStorage.getItem("lma_token") ?? "";
  const isInstructor = localStorage.getItem("lma_can_instructor") === "true";

  const [course, setCourse]               = useState<any>(null);
  const [courseList, setCourseList]       = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [openModules, setOpenModules]     = useState<Set<number>>(new Set([0]));
  const [activeTab, setActiveTab]         = useState<"about" | "curriculum">("about");
  const [showPay, setShowPay]             = useState(false);
  const [enrolled, setEnrolled]           = useState(false);
  const [enrollStatusChecked, setEnrollStatusChecked] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [hovCourse, setHovCourse]         = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [wordIdx,  setWordIdx ] = useState(0);
  const [fadeIn,   setFadeIn  ] = useState(true);
  const wordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion:reduce)").matches : false;

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/lma/courses/${id}/`)
      .then(r => r.json())
      .then(d => setCourse(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  /* Check enrollment status once course is loaded and user is logged in */
  useEffect(() => {
    if (!id || !token) { setEnrollStatusChecked(true); return; }
    fetch(`${API}/lma/enrollment-status/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : { enrolled: false })
      .then(d => { setEnrolled(d.enrolled ?? false); })
      .catch(() => {})
      .finally(() => setEnrollStatusChecked(true));
  }, [id, token]);

  /* Auto-trigger payment when action=enroll and conditions are met */
  useEffect(() => {
    if (action !== "enroll") return;
    if (loading || !enrollStatusChecked) return;
    if (!course) return;
    if (enrolled) { navigate("/lma/student/dashboard"); return; }
    if (isInstructor) return;
    if (!token) return;
    setShowPay(true);
  }, [action, loading, enrollStatusChecked, course, enrolled, isInstructor, token, navigate]);

  useEffect(() => {
    fetch(`${API}/lma/courses/`)
      .then(r => r.json())
      .then(d => setCourseList(Array.isArray(d) ? d : (d.results ?? [])))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleModule = useCallback((idx: number) => {
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }, []);

  const expandAll  = useCallback(() => {
    if (!course) return;
    setOpenModules(new Set((course.modules ?? []).map((_: any, i: number) => i)));
  }, [course]);

  const collapseAll = useCallback(() => setOpenModules(new Set()), []);

  const tabNavRef  = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const N = 55, LINK = 130;
    let W = 0, H = 0, raf = 0;
    const pts = Array.from({ length: N }, () => ({
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      r: Math.random() * 1.6 + 0.7,
    }));
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
      pts.forEach(p => { p.x = Math.random() * W; p.y = Math.random() * H; });
    };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(201,136,58,${0.18 * (1 - d / LINK)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201,136,58,0.36)"; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      raf = requestAnimationFrame(tick);
    };
    resize(); tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const scrollToCurriculum = useCallback(() => {
    setActiveTab("curriculum");
    setTimeout(() => tabNavRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, []);

  useEffect(() => {
    if (!course) return;
    const words: string[] = course.tech_stack ?? [];
    if (words.length <= 1) return;
    const id = setInterval(() => {
      setFadeIn(false);
      wordTimerRef.current = setTimeout(() => { setWordIdx(i => (i + 1) % words.length); setFadeIn(true); }, 340);
    }, 2600);
    return () => { clearInterval(id); if (wordTimerRef.current) clearTimeout(wordTimerRef.current); };
  }, [course]);

  const handleEnroll = () => {
    if (isInstructor) { navigate("/lma/instructor/dashboard"); return; }
    if (!token) {
      const courseUrl = `/lma/courses/${id}`;
      navigate(`/lma/login?redirect=${encodeURIComponent(courseUrl)}&action=enroll`);
      return;
    }
    if (enrolled) { navigate("/lma/student/dashboard"); return; }
    setShowPay(true);
  };

  const totalLessons = course?.modules?.reduce((s: number, m: any) => s + (m.lessons?.length ?? 0), 0) ?? 0;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: CREAM }}>
      <div className="lmacd-spinner" />
      <style>{`@keyframes lmacd-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!course) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: CREAM, fontFamily: FF }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#141413", marginBottom: 10 }}>Course not found</h2>
      <Link to="/lma/courses" style={{ color: GOLD, fontSize: 14, fontWeight: 600 }}>← Browse Courses</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: FF }}>

      {/* ══ STICKY SCROLL BAR ══ */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: DARK, borderBottom: "1px solid rgba(201,136,58,0.18)",
        transform: showStickyBar ? "translateY(0)" : "translateY(-100%)",
        opacity: showStickyBar ? 1 : 0,
        transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1), opacity 0.20s ease",
        display: "flex", alignItems: "center", gap: 20,
        padding: "10px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        fontFamily: FF, pointerEvents: showStickyBar ? "auto" : "none",
      }}>
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
            {course.title}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>
            {course.modules?.length ?? 0} modules · {totalLessons} lessons · {course.hours}h total
          </div>
        </div>
        {!enrolled && (
          <button type="button" onClick={handleEnroll} className="lmacd-shimmer-btn" style={{
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            color: "#0a0806", fontSize: 13, fontWeight: 800,
            border: "none", borderRadius: 9, padding: "9px 22px",
            cursor: "pointer", flexShrink: 0, fontFamily: FF,
            boxShadow: "0 2px 0 rgba(130,78,18,0.40)",
            position: "relative", overflow: "hidden",
          }}>
            Enroll Now
          </button>
        )}
      </div>

      {/* ══ HERO ══ */}
      <section className="lmacd-hero">
        <canvas ref={canvasRef} className="lmacd-particles" />
        {/* Atmospheric orbs */}
        <div className="lmacd-orb lmacd-orb-1" />
        <div className="lmacd-orb lmacd-orb-2" />
        <div className="lmacd-orb lmacd-orb-3" />
        <div className="lmacd-orb lmacd-orb-4" />
        {/* Diagonal light rays */}
        <div className="lmacd-ray lmacd-ray-1" />
        <div className="lmacd-ray lmacd-ray-2" />
        {/* Orbit rings */}
        <div className="lmacd-orbit lmacd-orbit-1" />
        <div className="lmacd-orbit lmacd-orbit-2" />
        <div className="lmacd-orbit lmacd-orbit-3" />
        {/* Floating diamonds */}
        <div className="lmacd-geo lmacd-geo-1" />
        <div className="lmacd-geo lmacd-geo-2" />
        <div className="lmacd-geo lmacd-geo-3" />
        <div className="lmacd-geo lmacd-geo-4" />

        <div className="lmacd-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Back link */}
          <Link to="/lma/courses" className="lmacd-back-link">
            <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />
            Back to Courses
          </Link>

          <div className="lmacd-hero-row">
            {/* ── Left text column ── */}
            <div className="lmacd-hero-text">

              {/* Eyebrow chip */}
              <div className="lmacd-eyebrow-chip" style={{ animation: prefersReduced ? "none" : "lmacd-fadeUp 0.6s ease both" }}>
                <span className="lmacd-eyebrow-dot" />
                <i className="fas fa-graduation-cap" style={{ fontSize: 10, color: GOLD }} />
                <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.13em", textTransform: "uppercase", color: GOLD }}>
                  {course.category}
                </span>
                {course.badge && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.13)", padding: "1px 8px", borderRadius: 999, marginLeft: 2 }}>
                    {course.badge}
                  </span>
                )}
              </div>

              {/* Animated title — word-safe: words never break mid-word */}
              <h1 className="lmacd-hero-title">
                {course.title.split(" ").map((word: string, wi: number) => (
                  <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.28em" }}>
                    {word.split("").map((ch: string, ci: number) => (
                      <span key={ci} className="lmacd-letter" style={{ animationDelay: prefersReduced ? "0s" : `${0.15 + (wi * 7 + ci) * 0.022}s` }}>
                        {ch}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>

              {/* Level / hours subtitle */}
              <p className="lmacd-hero-sub" style={{ animation: prefersReduced ? "none" : "lmacd-fadeUp 0.7s ease 0.3s both" }}>
                <span style={{ textTransform: "capitalize" }}>{course.level}</span>{" "}level
                {course.hours > 0 && <> &nbsp;·&nbsp; {course.hours}h of content</>}
                {totalLessons > 0 && <> &nbsp;·&nbsp; {totalLessons} lessons</>}
              </p>

              {/* Description */}
              <p style={{
                fontSize: 14.5, color: "rgba(255,255,255,0.54)", lineHeight: 1.67, maxWidth: 580,
                margin: "0 0 16px", fontFamily: FF,
                animation: prefersReduced ? "none" : "lmacd-fadeUp 0.7s ease 0.38s both",
              }}>
                {course.description}
              </p>

              {/* Cycling tech stack word */}
              {(course.tech_stack ?? []).length > 0 && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 9, marginBottom: 16,
                  animation: prefersReduced ? "none" : "lmacd-fadeUp 0.7s ease 0.44s both",
                }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.34)", fontFamily: FF }}>Covering:</span>
                  <span style={{
                    fontSize: 12.5, fontWeight: 700, color: AMBER, fontFamily: FF,
                    display: "inline-block",
                    opacity: fadeIn ? 1 : 0,
                    transform: fadeIn ? "translateY(0)" : "translateY(-7px)",
                    transition: prefersReduced ? "none" : "opacity 0.34s ease, transform 0.34s ease",
                  }}>
                    {(course.tech_stack ?? [])[wordIdx] ?? ""}
                  </span>
                  <div style={{ display: "flex", gap: 5 }}>
                    {(course.tech_stack ?? []).map((_: string, i: number) => (
                      <span key={i} style={{
                        width: i === wordIdx ? 16 : 4, height: 4, borderRadius: 999,
                        background: i === wordIdx ? GOLD : "rgba(255,255,255,0.20)",
                        transition: "width 0.35s ease, background 0.35s ease",
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Included with badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
                animation: prefersReduced ? "none" : "lmacd-fadeUp 0.7s ease 0.50s both",
              }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.34)", fontFamily: FF }}>Included with</span>
                <span style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase",
                  padding: "3px 11px", borderRadius: 5,
                  background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806",
                }}>XERXEZ Academy</span>
              </div>

              {/* Rating + enrolled */}
              {(course.rating > 0 || (course.total_students ?? 0) > 0) && (
                <div style={{
                  display: "flex", gap: 16, alignItems: "center", marginBottom: 20, flexWrap: "wrap",
                  animation: prefersReduced ? "none" : "lmacd-fadeUp 0.7s ease 0.54s both",
                }}>
                  {course.rating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StarRating rating={course.rating} />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: FF }}>
                        ({(course.total_ratings ?? 0).toLocaleString()} reviews)
                      </span>
                    </div>
                  )}
                  {(course.total_students ?? 0) > 0 && (
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", display: "flex", alignItems: "center", gap: 5, fontFamily: FF }}>
                      <i className="fas fa-users" style={{ fontSize: 11, color: GOLD }} />
                      {(course.total_students ?? 0).toLocaleString()} enrolled
                    </span>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div style={{
                display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32,
                animation: prefersReduced ? "none" : "lmacd-fadeUp 0.7s ease 0.60s both",
              }}>
                {enrolled ? (
                  <Link to="/lma/student/dashboard" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#d1fae5", color: "#059669", fontSize: 14, fontWeight: 800,
                    padding: "0 28px", height: 52, borderRadius: 11, textDecoration: "none", fontFamily: FF,
                  }}>
                    <CheckCircle2 size={16} /> Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <button type="button" onClick={handleEnroll} className="lmacd-enroll-btn">
                      <i className="fas fa-graduation-cap" style={{ fontSize: 13 }} />
                      Enroll Now
                      {course.price ? (
                        <span style={{ fontSize: 12, opacity: 0.70, marginLeft: 4 }}>₹{course.price.toLocaleString()}</span>
                      ) : null}
                    </button>
                    <button type="button" onClick={scrollToCurriculum} className="lmacd-preview-btn">
                      <i className="fas fa-list-ul" style={{ fontSize: 12 }} />
                      View Curriculum
                    </button>
                  </>
                )}
              </div>

              {/* Trust metrics row — like home hero */}
              <div className="lmacd-trust-row" style={{ animation: prefersReduced ? "none" : "lmacd-fadeUp 0.7s ease 0.70s both" }}>
                {[
                  { val: course.hours > 0 ? `${course.hours}h` : "—", label: "Content" },
                  { val: totalLessons > 0 ? String(totalLessons) : "—", label: "Lessons" },
                  { val: course.rating > 0 ? `${course.rating}★` : "New", label: "Rating" },
                  { val: (course.total_students ?? 0) > 0 ? `${(course.total_students ?? 0).toLocaleString()}+` : "Open", label: "Enrolled" },
                ].map(m => (
                  <div key={m.label} className="lmacd-trust-item">
                    <div className="lmacd-trust-val">{m.val}</div>
                    <div className="lmacd-trust-label">{m.label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* ── Right card column ── */}
            <div className="lmacd-hero-card-col">
              <HeroCourseCard course={course} totalLessons={totalLessons} onEnroll={handleEnroll} onPreview={scrollToCurriculum} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR ══ */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "13px 0" }}>
        <div className="lmacd-container">
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: "fas fa-award",         label: "CPD Accredited" },
              { icon: "fas fa-certificate",    label: "AWS Certified"  },
              { icon: "fas fa-shield-alt",     label: "ISO 27001"      },
              { icon: "fas fa-graduation-cap", label: "Hands-On Labs"  },
              { icon: "fas fa-users",          label: "500+ Trained"   },
              { icon: "fas fa-brain",          label: "OpenAI Partner" },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(20,20,19,0.52)", fontFamily: FF }}>
                <i className={t.icon} style={{ color: GOLD, fontSize: 13 }} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ STICKY TAB NAV ══ */}
      <div ref={tabNavRef} className="lmacd-tab-nav" style={{ top: showStickyBar ? 52 : 0, transition: "top 0.26s ease" }}>
        <div className="lmacd-container">
          <div style={{ display: "flex" }}>
            {(["about", "curriculum"] as const).map(t => (
              <button type="button" key={t} onClick={() => setActiveTab(t)} style={{
                fontSize: 13.5, fontWeight: activeTab === t ? 700 : 500,
                color: activeTab === t ? GOLD : "rgba(20,20,19,0.48)",
                borderBottom: `2px solid ${activeTab === t ? GOLD : "transparent"}`,
                marginBottom: -2, padding: "13px 20px",
                background: "none", border: "none", borderRadius: 0, cursor: "pointer",
                fontFamily: FF, textTransform: "capitalize",
                transition: "color 0.18s ease",
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CONTENT AREA ══ */}
      <div style={{ background: CREAM, minHeight: 500 }}>
        <div className="lmacd-container">
          <div className="lmacd-body-row">

            {/* ── LEFT COLUMN ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {activeTab === "about" && (
                <>
                  <WhatYouLearnBox techStack={course.tech_stack ?? []} />
                  <SkillsPills items={course.tech_stack ?? []} heading="Skills you'll gain" />
                  <DetailsToKnow hours={course.hours} lessonsCount={totalLessons} level={course.level ?? ""} />
                  <button type="button" onClick={scrollToCurriculum} style={{
                    fontSize: 14, fontWeight: 700, color: GOLD,
                    background: "transparent", border: `1.5px solid ${GOLD}`,
                    borderRadius: 9, padding: "10px 22px", cursor: "pointer", fontFamily: FF,
                    display: "inline-flex", alignItems: "center", gap: 8,
                  }}>
                    View full curriculum <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
                  </button>

                  {/* ── Student outcomes ── */}
                  <div style={{ marginTop: 36 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: FF }}>What students achieve</h3>
                    <div className="lmacd-outcomes-grid">
                      {[
                        { num: `${course.avg_completion ?? 0}%`,  label: "Completion rate", icon: "fas fa-chart-line" },
                        { num: (course.rating ?? 0) > 0 ? `${course.rating}★` : "—",  label: "Average rating",  icon: "fas fa-star"       },
                        { num: (course.total_students ?? 0).toLocaleString(), label: "Active learners", icon: "fas fa-users"      },
                      ].map(s => (
                        <div key={s.label} className="lmacd-outcome-card">
                          <i className={s.icon} style={{ color: GOLD, fontSize: 18, marginBottom: 8, display: "block" }} />
                          <div style={{ fontSize: 22, fontWeight: 900, color: "#141413", lineHeight: 1, fontFamily: FF }}>{s.num}</div>
                          <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 4, fontFamily: FF }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ReviewsSection courseId={id ?? ""} enrolled={enrolled} token={token} />
                </>
              )}

              {activeTab === "curriculum" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: 0, fontFamily: FF }}>
                      {course.modules?.length ?? 0}-Module Program
                    </h2>
                    <span style={{ fontSize: 12, color: "rgba(20,20,19,0.42)", fontFamily: FF }}>
                      {course.modules?.length ?? 0} modules · {totalLessons} lessons · {course.hours}h
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                    <button type="button" onClick={expandAll} style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: "none", border: "none", cursor: "pointer", fontFamily: FF, padding: 0 }}>
                      Expand all
                    </button>
                    <span style={{ color: "rgba(20,20,19,0.22)", fontSize: 14 }}>·</span>
                    <button type="button" onClick={collapseAll} style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: "none", border: "none", cursor: "pointer", fontFamily: FF, padding: 0 }}>
                      Collapse all
                    </button>
                  </div>
                  {(course.modules ?? []).map((mod: any, i: number) => (
                    <ModuleRow
                      key={mod.id ?? i}
                      mod={mod}
                      modIndex={i}
                      isOpen={openModules.has(i)}
                      toggle={() => toggleModule(i)}
                      revealDelay={Math.min(i * 45, 280)}
                      enrolled={enrolled}
                      onLessonClick={setSelectedLesson}
                    />
                  ))}
                  <div style={{ marginTop: 24, textAlign: "center" }}>
                    <button type="button" onClick={handleEnroll} style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                      color: "#0a0806", fontSize: 14, fontWeight: 700,
                      padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                      boxShadow: "0 4px 0 rgba(140,80,20,0.38),0 8px 24px rgba(201,136,58,0.22)",
                      fontFamily: FF,
                    }}>
                      Enroll in this course <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lmacd-right-col">

              <div className="lmacd-sidebar-card">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 18px", fontFamily: FF }}>Instructors</h3>
                <InstructorItem
                  name={course.instructor_name ?? "Expert Instructor"}
                  designation="Senior AI Instructor · XERXEZ Academy"
                  courses={2}
                  learners="1,650"
                />
                <InstructorItem
                  name="Danish Sheikh"
                  designation="Chief AI Officer · XERXEZ"
                  courses={2}
                  learners="500"
                />
                <button type="button" style={{ fontSize: 12.5, fontWeight: 700, color: GOLD, background: "none", border: "none", cursor: "pointer", fontFamily: FF, padding: 0, marginTop: 4 }}>
                  View all instructors →
                </button>
              </div>

              <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 0 16px" }} />

              <div className="lmacd-sidebar-card">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: FF }}>Offered by</h3>
                <div style={{ background: DARK, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12, border: "1px solid rgba(201,136,58,0.20)" }}>
                  <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 28, width: "auto" }} />
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.52)", lineHeight: 1.62, margin: "0 0 10px", fontFamily: FF }}>
                  Enterprise AI training and software solutions across UAE, India, and UK.
                </p>
                <Link to="/about" style={{ fontSize: 12.5, fontWeight: 700, color: GOLD, textDecoration: "none", fontFamily: FF }}>
                  Learn more →
                </Link>
              </div>

              <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 0 16px" }} />

              <div style={{ background: `linear-gradient(160deg,${DARK} 0%,${DARK2} 100%)`, borderRadius: 16, padding: "20px 22px", border: `1px solid rgba(201,136,58,0.22)` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.36)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6, fontFamily: FF }}>
                  One-time · Lifetime access
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, color: GOLD, marginBottom: 14, fontFamily: FF }}>
                  ₹{course.price?.toLocaleString()}
                </div>
                {enrolled ? (
                  <Link to="/lma/student/dashboard" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "#d1fae5", color: "#059669", fontSize: 14, fontWeight: 700,
                    padding: "12px", borderRadius: 10, textDecoration: "none", marginBottom: 10, fontFamily: FF,
                  }}>
                    <CheckCircle2 size={16} /> Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <button type="button" onClick={handleEnroll} style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                      color: "#0a0806", fontSize: 14, fontWeight: 700,
                      border: "none", borderRadius: 10, padding: "12px", cursor: "pointer",
                      boxShadow: "0 4px 0 rgba(130,78,18,0.45)", marginBottom: 10, fontFamily: FF,
                    }}>
                      Enroll Now
                    </button>
                    <button type="button" onClick={handleEnroll} className="lmacd-preview-btn" style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: "transparent", color: GOLD, fontSize: 13, fontWeight: 600,
                      border: `2px solid ${GOLD}`, borderRadius: 10, padding: "11px",
                      cursor: "pointer", fontFamily: FF, marginBottom: 12,
                      transition: "background 0.20s ease",
                    }}>
                      Try Free Preview
                    </button>
                  </>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.42)", fontFamily: FF }}>
                  <ShieldCheck size={13} color="rgba(201,136,58,0.65)" />
                  30-day money-back guarantee
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ══ SOCIAL PROOF ══ */}
      <div style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "40px 0" }}>
        <div className="lmacd-container">
          <div style={{ display: "flex", gap: 40, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", maxWidth: 400 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 10px", fontFamily: FF }}>
                See how top teams master AI faster with XERXEZ
              </h3>
              <Link to="/contact" style={{ fontSize: 13.5, fontWeight: 700, color: GOLD, textDecoration: "none", fontFamily: FF }}>
                Request enterprise training →
              </Link>
            </div>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
              {["Tata", "Capgemini", "P&G", "L'Oréal", "Danone", "HCL"].map(co => (
                <span key={co} style={{
                  fontSize: 13, fontWeight: 600, color: "#3d2a10",
                  background: "rgba(201,136,58,0.10)",
                  border: "1px solid rgba(201,136,58,0.20)",
                  borderRadius: 8, padding: "6px 16px", fontFamily: FF,
                }}>{co}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ ADVANCE EXPERTISE STRIP ══ */}
      <div style={{ background: CREAM, padding: "56px 0" }}>
        <div className="lmacd-container">
          <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: FF }}>
                Advance your team's AI expertise
              </h2>
              <ul style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.82, paddingLeft: 20, margin: "0 0 20px", fontFamily: FF }}>
                <li>Learn from practitioners with real production deployments</li>
                <li>Master models and tools in hands-on labs from day one</li>
                <li>Build deep understanding of production AI systems</li>
                <li>Earn XERXEZ AI certification recognised at 40+ organisations</li>
              </ul>
              <Link to="/contact" style={{ fontSize: 13.5, fontWeight: 700, color: GOLD, textDecoration: "none", fontFamily: FF }}>
                Learn more about enterprise plans →
              </Link>
            </div>
            {courseList.length > 0 && (
              <div style={{ flexShrink: 0, maxWidth: 400, width: "100%" }}>
                <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
                  {courseList.map((c: any, i: number) => (
                    <Link key={c.id} to={`/lma/courses/${c.id}`}
                      onMouseEnter={() => setHovCourse(c.id)}
                      onMouseLeave={() => setHovCourse(null)}
                      style={{
                        display: "flex", gap: 14, padding: "16px 18px", textDecoration: "none",
                        background: c.id === course.id ? "#fdfaf6" : "#fff",
                        borderLeft: `4px solid ${GOLD}`,
                        borderBottom: i < courseList.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                        transform: hovCourse === c.id ? "translateX(4px)" : "translateX(0)",
                        transition: "transform 0.20s ease",
                      }}>
                      <ModuleThumbnail index={i} size={70} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", lineHeight: 1.3, marginBottom: 3 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: "rgba(20,20,19,0.44)" }}>Course {i + 1} · {c.hours} hours</div>
                      </div>
                      <i className="fas fa-chevron-right" style={{ fontSize: 12, color: "#9ca3af", alignSelf: "center", flexShrink: 0 }} />
                    </Link>
                  ))}
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.48)", margin: "10px 4px 0", lineHeight: 1.6, fontFamily: FF }}>
                  {course.description?.substring(0, 90)}…
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPay && (
        <PaymentModal
          course={course}
          token={token}
          onClose={() => setShowPay(false)}
          onEnrolled={() => { setEnrolled(true); setTimeout(() => navigate("/lma/student/dashboard"), 2000); }}
        />
      )}

      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          enrolled={enrolled}
          token={token}
          isInstructor={isInstructor}
          onClose={() => setSelectedLesson(null)}
          onEnroll={() => { setSelectedLesson(null); handleEnroll(); }}
        />
      )}

      <style>{`
        .lmacd-container { width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 24px; box-sizing: border-box; }

        /* ══ HERO ══ */
        .lmacd-hero {
          background: linear-gradient(160deg,${DARK} 0%,${DARK2} 100%);
          min-height: calc(100vh - 70px);
          padding: 24px 0 72px;
          position: relative;
          overflow: hidden;
        }
        /* Dot grid */
        .lmacd-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(201,136,58,0.08) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
          z-index: 0;
        }
        /* Particle canvas */
        .lmacd-particles { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; }

        /* Atmospheric orbs */
        .lmacd-orb { position:absolute; border-radius:50%; pointer-events:none; }
        .lmacd-orb-1 { top:-5%;left:-8%;width:520px;height:520px;background:radial-gradient(circle,rgba(201,136,58,0.12) 0%,transparent 65%);animation:lmacd-float1 11s ease-in-out infinite; }
        .lmacd-orb-2 { bottom:-10%;right:-5%;width:440px;height:440px;background:radial-gradient(circle,rgba(232,168,78,0.09) 0%,transparent 65%);animation:lmacd-float2 15s ease-in-out infinite; }
        .lmacd-orb-3 { top:42%;right:28%;width:180px;height:180px;background:radial-gradient(circle,rgba(201,136,58,0.16) 0%,transparent 70%);animation:lmacd-float3 8s ease-in-out infinite; }
        .lmacd-orb-4 { top:18%;right:8%;width:260px;height:260px;background:radial-gradient(circle,rgba(232,168,78,0.06) 0%,transparent 70%);animation:lmacd-float1 13s ease-in-out infinite 2s; }

        /* Diagonal light rays */
        .lmacd-ray { position:absolute; pointer-events:none; opacity:0.04; }
        .lmacd-ray-1 { top:-30%;left:-10%;width:120px;height:200%;background:linear-gradient(180deg,transparent,rgba(201,136,58,0.9),transparent);transform:rotate(-35deg);animation:lmacd-rayDrift 9s ease-in-out infinite; }
        .lmacd-ray-2 { top:-20%;left:18%;width:60px;height:180%;background:linear-gradient(180deg,transparent,rgba(232,168,78,0.7),transparent);transform:rotate(-35deg);animation:lmacd-rayDrift 12s ease-in-out infinite 3s; }

        /* Orbit rings */
        .lmacd-orbit { position:absolute; border-radius:50%; pointer-events:none; border:1px solid; right:-120px; top:50%; transform:translateY(-50%); }
        .lmacd-orbit-1 { width:560px;height:560px;border-color:rgba(201,136,58,0.08);animation:lmacd-orbitSpin 60s linear infinite; }
        .lmacd-orbit-2 { width:420px;height:420px;border-color:rgba(201,136,58,0.12);right:-60px;animation:lmacd-orbitSpin 40s linear infinite reverse; }
        .lmacd-orbit-3 { width:280px;height:280px;border-color:rgba(201,136,58,0.18);right:0px;animation:lmacd-orbitSpin 28s linear infinite; }

        /* Floating diamonds */
        .lmacd-geo { position:absolute; pointer-events:none; }
        .lmacd-geo-1 { right:6%;top:12%;width:16px;height:16px;background:rgba(201,136,58,0.28);border:1px solid rgba(201,136,58,0.50);transform:rotate(45deg);animation:lmacd-diamondFloat 6s ease-in-out infinite; }
        .lmacd-geo-2 { right:22%;top:70%;width:10px;height:10px;background:rgba(232,168,78,0.20);border:1px solid rgba(232,168,78,0.45);transform:rotate(45deg);animation:lmacd-diamondFloat 8s ease-in-out infinite 1.5s; }
        .lmacd-geo-3 { left:6%;bottom:22%;width:12px;height:12px;background:rgba(201,136,58,0.18);border:1px solid rgba(201,136,58,0.40);transform:rotate(45deg);animation:lmacd-diamondFloat 7s ease-in-out infinite 3s; }
        .lmacd-geo-4 { right:32%;top:8%;width:8px;height:8px;background:rgba(201,136,58,0.25);border:1px solid rgba(201,136,58,0.55);transform:rotate(45deg);animation:lmacd-diamondFloat 5s ease-in-out infinite 0.8s; }

        /* Back link */
        .lmacd-back-link {
          display:inline-flex; align-items:center; gap:6px;
          font-size:12px; color:rgba(255,255,255,0.36); text-decoration:none;
          margin-bottom:28px; font-family:${FF}; font-weight:600;
          transition:color 0.18s ease;
          animation:lmacd-fadeUp 0.5s ease both;
        }
        .lmacd-back-link:hover { color:rgba(255,255,255,0.70); }

        /* Eyebrow chip */
        .lmacd-eyebrow-chip {
          display:inline-flex; align-items:center; gap:7px;
          padding:6px 14px 6px 10px; border-radius:999px; margin-bottom:18px;
          background:rgba(201,136,58,0.10); border:1px solid rgba(201,136,58,0.30);
          backdrop-filter:blur(8px);
        }
        .lmacd-eyebrow-dot {
          width:6px; height:6px; border-radius:50%;
          background:${GOLD}; flex-shrink:0;
          box-shadow:0 0 0 2px rgba(201,136,58,0.30);
          animation:lmacd-pulse 2s ease-in-out infinite;
        }

        /* Animated hero title */
        .lmacd-hero-title {
          font-family:${FF}; font-weight:900;
          font-size:clamp(28px,3.8vw,46px); line-height:1.1;
          color:#fff; margin:0 0 10px; letter-spacing:-0.03em;
        }
        .lmacd-letter {
          display:inline-block;
          opacity:0;
          animation:lmacd-letterIn 0.5s ease forwards;
        }

        /* Sub line */
        .lmacd-hero-sub {
          font-size:13px; font-weight:600; letter-spacing:0.01em;
          color:rgba(255,255,255,0.38); margin:0 0 16px; font-family:${FF};
          text-transform:uppercase; letter-spacing:0.06em;
        }

        /* Trust metrics row */
        .lmacd-trust-row {
          display:flex; gap:0; flex-wrap:wrap;
          border:1px solid rgba(255,255,255,0.09); border-radius:14px;
          overflow:hidden; background:rgba(255,255,255,0.03);
          max-width:440px;
        }
        .lmacd-trust-item {
          flex:1; min-width:80px; padding:14px 16px; text-align:center;
          border-right:1px solid rgba(255,255,255,0.08);
        }
        .lmacd-trust-item:last-child { border-right:none; }
        .lmacd-trust-val {
          font-size:18px; font-weight:800; color:#fff; font-family:${FF};
          line-height:1.1; margin-bottom:3px;
        }
        .lmacd-trust-label {
          font-size:10px; font-weight:600; color:rgba(255,255,255,0.35);
          text-transform:uppercase; letter-spacing:0.08em; font-family:${FF};
        }

        /* CTA Buttons */
        .lmacd-enroll-btn {
          display:inline-flex; align-items:center; gap:8px;
          background:linear-gradient(135deg,${AMBER},${GOLD});
          color:#0a0806; font-size:14px; font-weight:800;
          height:52px; padding:0 28px; border-radius:11px; border:none;
          cursor:pointer; font-family:${FF};
          box-shadow:0 4px 0 rgba(130,78,18,0.45),0 10px 32px rgba(201,136,58,0.25);
          transition:transform 0.18s ease, box-shadow 0.18s ease;
        }
        .lmacd-enroll-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 6px 0 rgba(130,78,18,0.45),0 14px 36px rgba(201,136,58,0.35);
        }
        .lmacd-preview-btn {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; color:${GOLD};
          font-size:14px; font-weight:700; height:52px; padding:0 24px;
          border-radius:11px; border:2px solid ${GOLD}; cursor:pointer;
          font-family:${FF}; transition:background 0.20s ease;
        }
        .lmacd-preview-btn:hover { background:rgba(201,136,58,0.14); }

        /* Hero layout */
        .lmacd-hero-row { display:flex; gap:56px; align-items:flex-start; }
        .lmacd-hero-text { flex:1; min-width:0; padding-top:8px; }
        .lmacd-hero-card-col { width:370px; flex-shrink:0; position:sticky; top:24px; align-self:flex-start; }

        /* 3-D floating card */
        .lmacd-hcard-wrap { animation:lmacd-card-float 4.5s ease-in-out infinite; }
        .lmacd-hcard {
          background:linear-gradient(145deg,#1f1507 0%,#120e05 100%);
          border-radius:18px; padding:20px; overflow:hidden;
          border:1px solid rgba(201,136,58,0.22);
          box-shadow:0 20px 60px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.05);
          transition:transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94);
          will-change:transform;
        }

        /* Tab nav + body */
        .lmacd-tab-nav { background:#fff; border-bottom:2px solid rgba(0,0,0,0.08); position:sticky; z-index:90; }
        .lmacd-body-row { display:flex; gap:40px; align-items:flex-start; padding:32px 0 60px; }
        .lmacd-right-col { width:300px; flex-shrink:0; position:sticky; top:132px; }
        .lmacd-sidebar-card { background:#fff; border-radius:16px; padding:22px 22px 18px; border:1px solid rgba(0,0,0,0.08); box-shadow:0 4px 20px rgba(0,0,0,0.07); margin-bottom:16px; }

        /* Spinner */
        .lmacd-spinner { width:36px; height:36px; border:3px solid rgba(201,136,58,0.18); border-top-color:${GOLD}; border-radius:50%; animation:lmacd-spin 0.8s linear infinite; display:inline-block; }

        /* Keyframes */
        @keyframes lmacd-float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(28px,-40px) scale(1.07)} }
        @keyframes lmacd-float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-24px,32px) scale(0.94)} }
        @keyframes lmacd-float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,-22px)} }
        @keyframes lmacd-spin  { to{transform:rotate(360deg)} }
        @keyframes lmacd-fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes lmacd-fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lmacd-slideUp { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes lmacd-letterIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lmacd-pulse { 0%,100%{box-shadow:0 0 0 2px rgba(201,136,58,0.30)} 50%{box-shadow:0 0 0 5px rgba(201,136,58,0.08)} }
        @keyframes lmacd-card-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes lmacd-rayDrift { 0%,100%{opacity:0.04} 50%{opacity:0.09} }
        @keyframes lmacd-orbitSpin { to{transform:translateY(-50%) rotate(360deg)} }
        @keyframes lmacd-diamondFloat { 0%,100%{transform:rotate(45deg) translateY(0)} 50%{transform:rotate(45deg) translateY(-10px)} }
        @keyframes lmacd-geo-rot { to{transform:rotate(405deg);} }

        /* Shimmer */
        .lmacd-shimmer-btn { position:relative; overflow:hidden; }
        .lmacd-shimmer-btn::after {
          content:''; position:absolute; top:0;left:-100%;
          width:55%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent);
          animation:lmacd-shimmer 2.4s ease-in-out infinite 0.8s;
          pointer-events:none;
        }
        @keyframes lmacd-shimmer { to{left:200%;} }

        /* Student outcomes */
        .lmacd-outcomes-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .lmacd-outcome-card { background:#fff; border-radius:14px; padding:18px 14px; border:1px solid rgba(0,0,0,0.07); text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05); }

        button:focus-visible { outline:2px solid ${GOLD}; outline-offset:2px; }
        html { scroll-behavior:smooth; }

        /* Responsive */
        @media (max-width:1000px) {
          .lmacd-hero-row { flex-direction:column; gap:36px; align-items:flex-start; }
          .lmacd-hero-card-col { width:100%; max-width:440px; margin:0 auto; position:static; }
          .lmacd-orbit { display:none; }
        }
        @media (max-width:960px) {
          .lmacd-body-row { flex-direction:column; }
          .lmacd-right-col { width:100%; position:static; }
          .lmacd-tab-nav { top:0 !important; }
        }
        @media (max-width:600px) {
          .lmacd-hero { min-height:auto; padding:56px 0 48px; }
          .lmacd-learn-grid { grid-template-columns:1fr !important; }
          .lmacd-lesson-indent { padding-left:16px !important; }
          .lmacd-lesson-modal { border-radius:16px 16px 0 0 !important; max-height:94vh !important; }
          .lmacd-outcomes-grid { grid-template-columns:1fr; }
          .lmacd-trust-row { max-width:100%; }
          .lmacd-trust-item { padding:12px 10px; }
        }
        @media (max-width:420px) {
          .lmacd-hero { padding:48px 0 40px; }
          .lmacd-container { padding:0 16px; }
          .lmacd-body-row { gap:24px; padding:20px 0 40px; }
        }
        @media (prefers-reduced-motion:reduce) {
          .lmacd-orb,.lmacd-geo,.lmacd-ray,.lmacd-orbit { animation:none !important; }
          .lmacd-shimmer-btn::after { animation:none !important; }
          .lmacd-spinner { animation-duration:0.01ms !important; }
          .lmacd-hcard-wrap { animation:none !important; }
          .lmacd-particles { display:none !important; }
          .lmacd-letter { opacity:1 !important; animation:none !important; }
          * { transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  );
}
