import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, ChevronDown, Video, FileText, HelpCircle, ClipboardEdit, Radio, BookOpen,
  Lock, ShieldCheck, Download, ExternalLink, Check, Clock, CheckCircle2, PlayCircle,
} from "lucide-react";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const DARK = "#071a33";
const GREEN = "#10b981";
const FF = "'DM Sans', sans-serif";

const CONTENT_ICON: Record<string, any> = {
  video: Video, document: FileText, quiz: HelpCircle,
  assignment: ClipboardEdit, live_session: Radio, text: BookOpen,
};

/** Best-effort conversion of a YouTube/Vimeo watch URL to its embeddable form. */
function toEmbedUrl(url: string): string {
  if (!url) return url;
  const yt = url.match(/(?:youtu\.be\/|[?&]v=)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

interface LessonData {
  id: number; title: string; content_type: string; duration: number; content: string;
  is_free_preview: boolean; is_downloadable: boolean;
  video_url: string; video_file: string | null; document_file: string | null;
  text_content: string; resources: { name: string; url: string; type: string }[];
  live_session_url: string; live_session_date: string | null;
  assignment: { id: number; title: string; description: string; due_days: number; submission_type: string } | null;
  course_id: number; course_title: string; is_admin_preview: boolean;
}

interface CourseLesson {
  id: number; title: string; duration: number; content_type: string; is_completed: boolean; is_free_preview: boolean;
}
interface CourseModuleData { id: number; title: string; lessons: CourseLesson[] }
interface CourseData { id: number; title: string; modules: CourseModuleData[] }

export default function LMALessonPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [marking, setMarking] = useState(false);
  // Optimistic local overrides (lesson id -> completed) so the checkbox/
  // progress bar update instantly on toggle, without waiting for the course
  // refetch to land. Cleared each time a fresh load completes.
  const [localOverrides, setLocalOverrides] = useState<Record<number, boolean>>({});
  const [celebrating, setCelebrating] = useState(false);

  const load = useCallback(() => {
    setLoading(true); setError("");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    Promise.all([
      fetch(`${API}/lma/lessons/${lessonId}/player/`, { headers }).then(async r => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || "Could not load this lesson.");
        return d as LessonData;
      }),
      fetch(`${API}/lma/courses/${courseId}/`, { headers }).then(r => (r.ok ? r.json() : null)).catch(() => null),
    ])
      .then(([lessonData, courseData]) => {
        setLesson(lessonData);
        if (courseData) {
          setCourse(courseData);
          setLocalOverrides({});
          const mod = (courseData.modules ?? []).find((m: CourseModuleData) =>
            (m.lessons ?? []).some(l => String(l.id) === String(lessonData.id)));
          if (mod) setExpanded(prev => new Set(prev).add(mod.id));
        }
      })
      .catch(e => setError(e.message || "Could not load this lesson."))
      .finally(() => setLoading(false));
  }, [lessonId, courseId, token]);

  useEffect(() => { load(); }, [load]);

  const flatLessons = useMemo(
    () => (course?.modules ?? []).flatMap(m => m.lessons ?? []),
    [course]
  );
  const currentIndex = flatLessons.findIndex(l => String(l.id) === String(lessonId));
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;
  const currentModule = course?.modules.find(m => (m.lessons ?? []).some(l => String(l.id) === String(lessonId)));

  const isDone = (l: CourseLesson) => localOverrides[l.id] ?? l.is_completed;
  const totalLessons = flatLessons.length;
  const completedCount = flatLessons.filter(isDone).length;
  const progressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
  const currentLessonRow = flatLessons.find(l => String(l.id) === String(lessonId));
  const isCurrentCompleted = !!currentLessonRow && isDone(currentLessonRow);

  const toggleLessonById = async (id: number, currentlyDone: boolean) => {
    if (!token) return;
    setLocalOverrides(prev => ({ ...prev, [id]: !currentlyDone }));
    try {
      const r = await fetch(`${API}/lma/lessons/${id}/complete/`, { method: currentlyDone ? "DELETE" : "POST", headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) {
        if (!currentlyDone) {
          const d = await r.json().catch(() => ({} as any));
          if (d.course_completed) {
            setCelebrating(true);
            // Kick off certificate generation now so it's ready by the time
            // the student clicks "Download Certificate" in the modal.
            fetch(`${API}/lma/courses/${courseId}/generate-certificate/`, {
              method: "POST", headers: { Authorization: `Bearer ${token}` },
            }).catch(() => {});
          }
        }
        load();
      } else {
        setLocalOverrides(prev => ({ ...prev, [id]: currentlyDone }));
      }
    } catch {
      setLocalOverrides(prev => ({ ...prev, [id]: currentlyDone }));
    }
  };

  const toggleComplete = async () => {
    if (!token || !lesson) return;
    setMarking(true);
    try {
      await toggleLessonById(lesson.id, isCurrentCompleted);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: `3px solid rgba(217,53,34,0.20)`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lp-spin 0.8s linear infinite" }} />
        <style>{`@keyframes lp-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !lesson) {
    const locked = /enroll|authentication/i.test(error);
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 36px", textAlign: "center", maxWidth: 400, border: "1px solid rgba(0,0,0,0.07)" }}>
          {locked ? <Lock size={36} color={GOLD} style={{ marginBottom: 14 }} /> : <HelpCircle size={36} color="#9ca3af" style={{ marginBottom: 14 }} />}
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 8px", fontFamily: FF }}>
            {locked ? "Enrollment required" : "Lesson unavailable"}
          </h2>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 20px", fontFamily: FF }}>{error || "This lesson could not be found."}</p>
          <button type="button" onClick={() => navigate(`/lma/courses/${courseId}?tab=curriculum`)} style={{
            background: GOLD, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px",
            fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: FF,
          }}>
            Back to course
          </button>
        </div>
      </div>
    );
  }

  const navBtnStyle = (enabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.10)", background: "#fff", color: enabled ? "#141413" : "#d1d5db",
    fontSize: 12.5, fontWeight: 600, fontFamily: FF, cursor: enabled ? "pointer" : "not-allowed",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: FF }}>
      <style>{`
        .lp-layout { display: flex; align-items: flex-start; }
        .lp-sidebar { flex: 0 0 340px; max-width: 340px; }
        @media (max-width: 900px) {
          .lp-layout { flex-direction: column; }
          .lp-sidebar { flex: 1 1 auto; max-width: 100%; border-left: none !important; border-top: 1px solid rgba(0,0,0,0.08); }
        }
      `}</style>
      <div className="lp-layout" style={{ maxWidth: 1440, margin: "0 auto" }}>

        {/* ══ LEFT — main content (~70%) ══════════════════════════════════ */}
        <div style={{ flex: "1 1 0%", minWidth: 0, padding: "20px 28px 60px" }}>
          {/* Breadcrumb + Prev/Next */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 12.5, color: "#6b7280", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <Link to={`/lma/courses/${courseId}?tab=curriculum`} style={{ color: "#6b7280", textDecoration: "none" }}>{course?.title || lesson.course_title}</Link>
              {currentModule && <> <span style={{ margin: "0 5px", color: "#d1d5db" }}>›</span><span>{currentModule.title}</span></>}
              <span style={{ margin: "0 5px", color: "#d1d5db" }}>›</span>
              <span style={{ color: "#141413", fontWeight: 700 }}>{lesson.title}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button type="button" disabled={!prevLesson} onClick={() => prevLesson && navigate(`/lma/courses/${courseId}/lessons/${prevLesson.id}`)} style={navBtnStyle(!!prevLesson)}>
                <ChevronLeft size={14} /> Previous Lesson
              </button>
              {nextLesson ? (
                <button type="button" onClick={() => navigate(`/lma/courses/${courseId}/lessons/${nextLesson.id}`)} style={navBtnStyle(true)}>
                  Next Lesson <ChevronRight size={14} />
                </button>
              ) : (
                <button type="button" onClick={() => navigate(`/lma/courses/${courseId}?tab=curriculum`)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8,
                  border: "none", background: GREEN, color: "#fff", fontSize: 12.5, fontWeight: 700, fontFamily: FF, cursor: "pointer",
                }}>
                  Complete Course 🎉
                </button>
              )}
            </div>
          </div>

          {/* Content block — 16:9 black frame for video, plain card for everything else */}
          <div style={{
            background: lesson.content_type === "video" ? "#000" : "#fff",
            borderRadius: 14, overflow: "hidden", marginBottom: 22,
            border: lesson.content_type === "video" ? "none" : "1px solid rgba(0,0,0,0.08)",
          }}>
            {lesson.content_type === "video" && <VideoBlock lesson={lesson} onEnded={() => { if (!isCurrentCompleted) toggleComplete(); }} />}
            {lesson.content_type === "document" && <DocumentBlock lesson={lesson} />}
            {lesson.content_type === "quiz" && <QuizBlock lessonId={lesson.id} token={token} />}
            {lesson.content_type === "assignment" && <AssignmentBlock lesson={lesson} token={token} />}
            {lesson.content_type === "live_session" && <LiveSessionBlock lesson={lesson} />}
            {lesson.content_type === "text" && <TextBlock lesson={lesson} />}
          </div>

          {/* Title + meta + Mark complete */}
          <h1 style={{ fontSize: 21, fontWeight: 800, color: "#141413", margin: "0 0 10px", fontFamily: FF }}>{lesson.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            {lesson.duration > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#6b7280", fontFamily: FF }}>
                <Clock size={13} /> {lesson.duration} min
              </span>
            )}
            {lesson.is_free_preview && <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, fontFamily: FF }}>FREE PREVIEW</span>}
            {lesson.is_admin_preview && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: GREEN, fontFamily: FF }}>
                <ShieldCheck size={12} /> ADMIN PREVIEW
              </span>
            )}
            {token && (
              <div style={{ marginLeft: "auto" }}>
                <button type="button" onClick={toggleComplete} disabled={marking} title={isCurrentCompleted ? "Click to unmark" : "Mark as complete"} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: isCurrentCompleted ? GREEN : "#fff",
                  color: isCurrentCompleted ? "#fff" : "#141413",
                  border: isCurrentCompleted ? "none" : "1.5px solid rgba(0,0,0,0.15)",
                  borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 700, fontFamily: FF,
                  cursor: marking ? "not-allowed" : "pointer", opacity: marking ? 0.7 : 1,
                }}>
                  <Check size={13} /> {marking ? "Updating…" : isCurrentCompleted ? "Completed — Click to unmark" : "Mark as Complete"}
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {lesson.content && (
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, fontFamily: FF, whiteSpace: "pre-wrap", margin: 0 }}>{lesson.content}</p>
          )}
        </div>

        {/* ══ RIGHT — curriculum sidebar (~30%) ══════════════════════════ */}
        {course && (
          <div className="lp-sidebar" style={{ borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
            <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#141413", marginBottom: 10, fontFamily: FF }}>{course.title}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 7, fontFamily: FF }}>
                {completedCount} of {totalLessons} lesson{totalLessons !== 1 ? "s" : ""} · {progressPct}%
              </div>
              <div style={{ height: 6, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: GREEN, borderRadius: 999, transition: "width 0.3s ease" }} />
              </div>
            </div>

            <div>
              {course.modules.map(mod => {
                const modLessons = mod.lessons ?? [];
                const modCompleted = modLessons.filter(isDone).length;
                const modDuration = modLessons.reduce((s, l) => s + (l.duration || 0), 0);
                const modPct = modLessons.length ? Math.round((modCompleted / modLessons.length) * 100) : 0;
                const isOpen = expanded.has(mod.id);
                return (
                  <div key={mod.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <button
                      type="button"
                      onClick={() => setExpanded(prev => {
                        const next = new Set(prev);
                        next.has(mod.id) ? next.delete(mod.id) : next.add(mod.id);
                        return next;
                      })}
                      style={{ width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, padding: "14px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: "#141413", fontFamily: FF, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mod.title}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: FF, marginBottom: 6 }}>{modCompleted}/{modLessons.length}{modDuration > 0 ? ` · ${modDuration}m` : ""}</div>
                        <div style={{ height: 4, width: "100%", maxWidth: 160, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${modPct}%`, background: GREEN, borderRadius: 999 }} />
                        </div>
                      </div>
                      <ChevronDown size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: 2, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
                    </button>
                    {isOpen && (
                      <div style={{ paddingBottom: 6 }}>
                        {modLessons.map(l => {
                          const isCurrent = String(l.id) === String(lessonId);
                          const done = isDone(l);
                          const LIcon = CONTENT_ICON[l.content_type] || PlayCircle;
                          return (
                            <div
                              key={l.id}
                              style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "9px 20px",
                                borderLeft: `3px solid ${isCurrent ? DARK : "transparent"}`,
                                background: isCurrent ? "rgba(7,26,51,0.05)" : "transparent",
                              }}
                            >
                              <button
                                type="button"
                                title={done ? "Completed — click to unmark" : "Mark as complete"}
                                onClick={e => { e.preventDefault(); toggleLessonById(l.id, done); }}
                                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", flexShrink: 0 }}
                              >
                                {done
                                  ? <CheckCircle2 size={15} color={GREEN} />
                                  : <LIcon size={13} color={isCurrent ? DARK : "#9ca3af"} />}
                              </button>
                              <Link
                                to={`/lma/courses/${courseId}/lessons/${l.id}`}
                                style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontFamily: FF, color: isCurrent ? "#141413" : "#374151", fontWeight: isCurrent ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none" }}
                              >
                                {l.title}
                              </Link>
                              {l.duration > 0 && <span style={{ fontSize: 10.5, color: "#9ca3af", flexShrink: 0, fontFamily: FF }}>{l.duration}m</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {celebrating && (
        <CelebrationModal
          courseTitle={course?.title || lesson.course_title}
          onClose={() => setCelebrating(false)}
          onDownload={() => navigate("/lma/student/certificates")}
        />
      )}
    </div>
  );
}

function CelebrationModal({ courseTitle, onClose, onDownload }: { courseTitle: string; onClose: () => void; onDownload: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(7,26,51,0.60)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "44px 36px", maxWidth: 420, width: "100%",
        textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.30)", animation: "lp-pop 0.28s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <style>{`@keyframes lp-pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#141413", margin: "0 0 8px", fontFamily: FF }}>Congratulations!</h2>
        <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 26px", lineHeight: 1.6, fontFamily: FF }}>
          You've completed <strong style={{ color: "#141413" }}>{courseTitle}</strong>. Your certificate is being generated.
        </p>
        <button type="button" onClick={onDownload} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
          background: GREEN, color: "#fff", border: "none", borderRadius: 11, padding: "13px", marginBottom: 10,
          fontSize: 13.5, fontWeight: 700, fontFamily: FF, cursor: "pointer",
        }}>
          <Download size={15} /> Download Certificate
        </button>
        <button type="button" onClick={onClose} style={{
          width: "100%", background: "none", border: "none", color: "#9ca3af",
          fontSize: 12.5, fontWeight: 600, fontFamily: FF, cursor: "pointer", padding: "8px",
        }}>
          Continue browsing
        </button>
      </div>
    </div>
  );
}

// ── Per-content-type blocks ───────────────────────────────────────────────────

function EmptyBlock({ label }: { label: string }) {
  return (
    <div style={{ padding: "56px 24px", textAlign: "center" }}>
      <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>{label}</p>
    </div>
  );
}

function VideoBlock({ lesson, onEnded }: { lesson: LessonData; onEnded?: () => void }) {
  if (lesson.video_file) {
    return (
      <video controls width="100%" onEnded={onEnded} style={{ display: "block", background: "#000", maxHeight: 480 }}>
        <source src={lesson.video_file} type="video/mp4" />
      </video>
    );
  }
  if (lesson.video_url) {
    // Embedded YouTube/Vimeo iframes don't expose an onEnded event across
    // origins, so auto-complete-on-end isn't wired for this path — the
    // Mark as Complete button below the player remains the fallback.
    return (
      <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
        <iframe
          src={toEmbedUrl(lesson.video_url)} title={lesson.title} allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
    );
  }
  return <EmptyBlock label="No video has been added to this lesson yet." />;
}

function DocumentBlock({ lesson }: { lesson: LessonData }) {
  if (!lesson.document_file) return <EmptyBlock label="No document has been added to this lesson yet." />;
  return (
    <div style={{ padding: "24px" }}>
      {/* Inline preview — requires frame-src to allow the backend's media
          origin (and blob: for locally-generated previews), otherwise the
          browser silently renders a blank frame with no console error. */}
      <iframe src={lesson.document_file} title={lesson.title} style={{ width: "100%", height: 480, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10 }} />
      {/* Always offered as a fallback — some browsers/extensions block PDF
          iframes outright even when CSP allows them. */}
      <a href={lesson.document_file} target="_blank" rel="noopener noreferrer" style={{
        display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14,
        background: GOLD, color: "#fff", borderRadius: 9, padding: "9px 16px",
        fontSize: 12.5, fontWeight: 700, fontFamily: FF, textDecoration: "none",
      }}>
        <Download size={13} /> {lesson.is_downloadable ? "Download" : "Open in new tab"}
      </a>
    </div>
  );
}

function TextBlock({ lesson }: { lesson: LessonData }) {
  if (!lesson.text_content) return <EmptyBlock label="No content has been written for this lesson yet." />;
  return (
    <div style={{ padding: "24px 28px", fontSize: 14, color: "#141413", lineHeight: 1.75 }}
      dangerouslySetInnerHTML={{ __html: lesson.text_content }} />
  );
}

function LiveSessionBlock({ lesson }: { lesson: LessonData }) {
  if (!lesson.live_session_url && !lesson.live_session_date) return <EmptyBlock label="This live session hasn't been scheduled yet." />;
  return (
    <div style={{ padding: "28px 24px", textAlign: "center" }}>
      <Radio size={32} color={GOLD} style={{ marginBottom: 14 }} />
      {lesson.live_session_date && (
        <p style={{ fontSize: 14, fontWeight: 700, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>
          {new Date(lesson.live_session_date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      )}
      {lesson.live_session_url && (
        <a href={lesson.live_session_url} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10,
          background: GOLD, color: "#fff", borderRadius: 10, padding: "11px 22px",
          fontSize: 13.5, fontWeight: 700, fontFamily: FF, textDecoration: "none",
        }}>
          Join session <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
}

function QuizBlock({ lessonId, token }: { lessonId: number; token: string }) {
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/lma/lessons/${lessonId}/quiz/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r => (r.ok ? r.json() : null))
      .then(setQuiz)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId, token]);

  if (loading) return <EmptyBlock label="Loading quiz…" />;
  if (!quiz || !quiz.questions?.length) return <EmptyBlock label="This quiz doesn't have any questions yet." />;

  const submit = async () => {
    setSubmitting(true);
    try {
      const r = await fetch(`${API}/lma/lessons/${lessonId}/quiz/submit/`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const d = await r.json();
      if (r.ok) setResult({ score: d.score, passed: d.passed });
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div style={{ padding: "40px 24px", textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
          background: result.passed ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.10)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {result.passed ? <Check size={28} color="#10b981" /> : <HelpCircle size={28} color="#ef4444" />}
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#141413", margin: "0 0 4px", fontFamily: FF }}>{result.score}%</h3>
        <p style={{ fontSize: 13.5, color: result.passed ? "#10b981" : "#ef4444", fontWeight: 700, margin: 0, fontFamily: FF }}>
          {result.passed ? "Passed" : "Not passed — you can review and try again"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {quiz.questions.map((q: any, i: number) => (
        <div key={q.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < quiz.questions.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#141413", margin: "0 0 10px", fontFamily: FF }}>{i + 1}. {q.question}</p>
          {(["a", "b", "c", "d"] as const).map(letter => (
            <label key={letter} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", fontSize: 13.5, color: "#374151", cursor: "pointer", fontFamily: FF }}>
              <input type="radio" name={`q${q.id}`} checked={answers[q.id] === letter} onChange={() => setAnswers(a => ({ ...a, [q.id]: letter }))} style={{ accentColor: GOLD }} />
              {q[`option_${letter}`]}
            </label>
          ))}
        </div>
      ))}
      <button type="button" onClick={submit} disabled={submitting || Object.keys(answers).length < quiz.questions.length} style={{
        background: GOLD, color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px",
        fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: FF,
        opacity: submitting || Object.keys(answers).length < quiz.questions.length ? 0.5 : 1,
      }}>
        {submitting ? "Submitting…" : "Submit Quiz"}
      </button>
    </div>
  );
}

function AssignmentBlock({ lesson, token }: { lesson: LessonData; token: string }) {
  const a = lesson.assignment;
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!a) return <EmptyBlock label="This assignment hasn't been set up yet." />;

  const submit = async () => {
    setSubmitting(true);
    try {
      let res: Response;
      if (a.submission_type === "file" && file) {
        const fd = new FormData(); fd.append("file", file);
        res = await fetch(`${API}/lma/lesson-assignments/${a.id}/submit/`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      } else {
        res = await fetch(`${API}/lma/lesson-assignments/${a.id}/submit/`, {
          method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      }
      if (res.ok) setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {a.title && <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 8px", fontFamily: FF }}>{a.title}</h3>}
      {a.description && <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: "0 0 8px" }}>{a.description}</p>}
      <p style={{ fontSize: 11.5, color: "#9ca3af", margin: "0 0 18px" }}>Due {a.due_days} day{a.due_days !== 1 ? "s" : ""} after enrollment</p>

      {submitted ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981", fontWeight: 700, fontSize: 13.5, fontFamily: FF }}>
          <Check size={16} /> Submitted
        </div>
      ) : a.submission_type === "file" ? (
        <>
          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={{ marginBottom: 14, fontSize: 13, fontFamily: FF }} />
          <br />
          <button type="button" onClick={submit} disabled={!file || submitting} style={{ background: GOLD, color: "#fff", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, opacity: !file || submitting ? 0.5 : 1 }}>
            {submitting ? "Submitting…" : "Submit File"}
          </button>
        </>
      ) : (
        <>
          <textarea rows={5} value={content} onChange={e => setContent(e.target.value)}
            placeholder={a.submission_type === "url" ? "Paste a link…" : a.submission_type === "code" ? "Paste your code…" : "Write your submission…"}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: a.submission_type === "code" ? "monospace" : FF, resize: "vertical", marginBottom: 12 }} />
          <button type="button" onClick={submit} disabled={!content.trim() || submitting} style={{ background: GOLD, color: "#fff", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, opacity: !content.trim() || submitting ? 0.5 : 1 }}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </>
      )}
    </div>
  );
}
