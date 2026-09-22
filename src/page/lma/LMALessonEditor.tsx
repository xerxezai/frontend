import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X, Video, FileText, HelpCircle, ClipboardEdit, Radio, BookOpen,
  Plus, Trash2, Save, Upload, Link2, Check,
} from "lucide-react";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";
import RichTextEditor from "../../components/lma/RichTextEditor";

const GOLD = "#D93522";
const AMBER = "#D93522";
const FF = "'DM Sans', sans-serif";

const hdr = (token: string) => ({ Authorization: `Bearer ${token}` });
const hdrJson = (token: string) => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" });

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 9,
  border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: FF, outline: "none",
  transition: "border-color 150ms, box-shadow 150ms", color: "#141413", background: "#fff",
};
const focusGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = GOLD;
  e.target.style.boxShadow = `0 0 0 3px rgba(217,53,34,0.12)`;
};
const blurGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "#e5e7eb";
  e.target.style.boxShadow = "none";
};

type ContentType = "video" | "document" | "quiz" | "assignment" | "live_session" | "text";

const CONTENT_TYPES: { type: ContentType; icon: any; label: string; desc: string }[] = [
  { type: "video", icon: Video, label: "Video", desc: "Upload MP4 or paste a YouTube/Vimeo URL" },
  { type: "document", icon: FileText, label: "Document/PDF", desc: "Upload a PDF, slides or notes" },
  { type: "quiz", icon: HelpCircle, label: "Quiz", desc: "Add multiple choice questions" },
  { type: "assignment", icon: ClipboardEdit, label: "Assignment", desc: "Written or file submission task" },
  { type: "live_session", icon: Radio, label: "Live Session", desc: "Add a Zoom/Meet link + schedule" },
  { type: "text", icon: BookOpen, label: "Text/Article", desc: "Rich text content" },
];

interface QuizQuestionDraft {
  id?: number;
  question: string;
  option_a: string; option_b: string; option_c: string; option_d: string;
  correct_answer: "a" | "b" | "c" | "d";
  explanation: string;
}

const emptyQuestion = (): QuizQuestionDraft => ({
  question: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "a", explanation: "",
});

interface Resource { name: string; url: string; type: string }

interface Props {
  token: string;
  moduleId: number;
  lesson?: any | null; // existing lesson to edit, or null/undefined to create
  onClose: () => void;
  onSaved: () => void;
  showToast: (m: string, t?: "success" | "error") => void;
}

export default function LMALessonEditor({ token, moduleId, lesson, onClose, onSaved, showToast }: Props) {
  const isEdit = !!lesson;
  const [step, setStep] = useState<"type" | "form">(isEdit ? "form" : "type");
  const [contentType, setContentType] = useState<ContentType>((lesson?.content_type as ContentType) || "video");
  const bodyRef = useRef<HTMLDivElement>(null);

  // The lesson title field is always the first field in the form — but if the
  // user scrolled down while picking a content type or editing, jumping back
  // to "form" should reset scroll to top so the title (and the "Lesson title
  // is required" field it satisfies) is immediately visible, not hidden above
  // the fold.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step]);

  // Shared
  const [title, setTitle] = useState(lesson?.title || "");
  const [duration, setDuration] = useState(String(lesson?.duration ?? 0));
  const [description, setDescription] = useState(lesson?.content || "");
  const [isFreePreview, setIsFreePreview] = useState(!!lesson?.is_free_preview);
  const [isDownloadable, setIsDownloadable] = useState(!!lesson?.is_downloadable);
  const [saving, setSaving] = useState(false);

  // Video
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url || "");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [hasUploadedVideo, setHasUploadedVideo] = useState(!!lesson?.video_file);
  const [removingVideo, setRemovingVideo] = useState(false);
  const [resources, setResources] = useState<Resource[]>(Array.isArray(lesson?.resources) ? lesson.resources : []);

  // Document
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [hasUploadedDocument, setHasUploadedDocument] = useState(!!lesson?.document_file);
  const [removingDocument, setRemovingDocument] = useState(false);

  // Text/Article
  const [textContent, setTextContent] = useState(lesson?.text_content || "");

  // Live session
  const [liveUrl, setLiveUrl] = useState(lesson?.live_session_url || "");
  const [liveDate, setLiveDate] = useState(lesson?.live_session_date ? String(lesson.live_session_date).slice(0, 16) : "");

  // Quiz — optional: an instructor can save the lesson with zero questions
  // and come back to add more later (the save endpoint fully replaces the
  // question set each call, so existing + new questions are resent together).
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestionDraft[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);

  // Assignment — also optional; title/description can be left blank and filled in later.
  const [assignTitle, setAssignTitle] = useState(lesson?.assignment?.title || "");
  const [assignDesc, setAssignDesc] = useState(lesson?.assignment?.description || "");
  const [dueDays, setDueDays] = useState(String(lesson?.assignment?.due_days ?? 7));
  const [submissionType, setSubmissionType] = useState(lesson?.assignment?.submission_type || "text");

  // Prefill quiz questions when editing an existing quiz-type lesson.
  useEffect(() => {
    if (!isEdit || !lesson?.id || contentType !== "quiz") return;
    setQuizLoading(true);
    fetch(`${API}/lma/lessons/${lesson.id}/quiz/`, { headers: hdr(token) })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d) { setPassingScore(d.passing_score); setQuestions(d.questions || []); }
      })
      .catch(() => {})
      .finally(() => setQuizLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, lesson?.id, contentType]);

  const removeUploadedVideo = async () => {
    if (!lesson?.id) return;
    setRemovingVideo(true);
    try {
      const r = await fetch(`${API}/lma/lessons/${lesson.id}/upload-video/`, { method: "DELETE", headers: hdr(token) });
      if (r.ok) { setHasUploadedVideo(false); showToast("Video removed."); }
      else showToast("Failed to remove video.", "error");
    } catch {
      showToast("Network error — check console", "error");
    } finally {
      setRemovingVideo(false);
    }
  };

  const removeUploadedDocument = async () => {
    if (!lesson?.id) return;
    setRemovingDocument(true);
    try {
      const r = await fetch(`${API}/lma/lessons/${lesson.id}/upload-document/`, { method: "DELETE", headers: hdr(token) });
      if (r.ok) { setHasUploadedDocument(false); showToast("Document removed."); }
      else showToast("Failed to remove document.", "error");
    } catch {
      showToast("Network error — check console", "error");
    } finally {
      setRemovingDocument(false);
    }
  };

  const addResource = () => setResources(r => [...r, { name: "", url: "", type: "link" }]);
  const updateResource = (i: number, patch: Partial<Resource>) =>
    setResources(r => r.map((res, idx) => (idx === i ? { ...res, ...patch } : res)));
  const removeResource = (i: number) => setResources(r => r.filter((_, idx) => idx !== i));

  const addQuestion = () => setQuestions(q => [...q, emptyQuestion()]);
  const updateQuestion = (i: number, patch: Partial<QuizQuestionDraft>) =>
    setQuestions(q => q.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const removeQuestion = (i: number) => setQuestions(q => q.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!title.trim()) { showToast("Lesson title is required", "error"); return; }
    setSaving(true);
    try {
      // 1. Create/update the base lesson record — only the title is truly
      //    required; every content-type field is optional so an instructor
      //    can save a bare lesson now and fill in content later.
      const basePayload: Record<string, any> = {
        title, duration: Number(duration) || 0, content: description || "",
        is_free_preview: isFreePreview, is_downloadable: isDownloadable,
        content_type: contentType,
        video_url: contentType === "video" ? videoUrl : lesson?.video_url || "",
        resources: contentType === "video" ? resources.filter(r => r.name || r.url) : resources,
        text_content: contentType === "text" ? textContent : "",
        live_session_url: contentType === "live_session" ? liveUrl : "",
        live_session_date: contentType === "live_session" && liveDate ? new Date(liveDate).toISOString() : null,
      };
      if (!isEdit) basePayload.order = 0;

      const baseUrl = isEdit ? `${API}/lma/lessons/${lesson.id}/` : `${API}/lma/modules/${moduleId}/lessons/`;
      const baseRes = await fetch(baseUrl, {
        method: isEdit ? "PUT" : "POST", headers: hdrJson(token), body: JSON.stringify(basePayload),
      });
      if (!baseRes.ok) {
        const err = await baseRes.json().catch(() => ({}));
        showToast(String(err.error ?? err.detail ?? "Failed to save lesson"), "error");
        return;
      }
      const savedLesson = await baseRes.json();
      const lessonId = savedLesson.id;

      // 2. Type-specific uploads/sub-resources — each is independently optional.
      if (contentType === "video" && videoFile) {
        const fd = new FormData(); fd.append("video_file", videoFile);
        const r = await fetch(`${API}/lma/lessons/${lessonId}/upload-video/`, { method: "POST", headers: hdr(token), body: fd });
        if (!r.ok) showToast("Lesson saved, but the video upload failed.", "error");
      }
      if (contentType === "document" && documentFile) {
        const fd = new FormData(); fd.append("document_file", documentFile);
        const r = await fetch(`${API}/lma/lessons/${lessonId}/upload-document/`, { method: "POST", headers: hdr(token), body: fd });
        if (!r.ok) showToast("Lesson saved, but the document upload failed.", "error");
      }
      if (contentType === "quiz") {
        const r = await fetch(`${API}/lma/lessons/${lessonId}/quiz/`, {
          method: "POST", headers: hdrJson(token),
          body: JSON.stringify({ passing_score: Number(passingScore) || 70, questions }),
        });
        if (!r.ok) showToast("Lesson saved, but the quiz couldn't be saved.", "error");
      }
      if (contentType === "assignment") {
        const r = await fetch(`${API}/lma/lessons/${lessonId}/assignment/`, {
          method: "POST", headers: hdrJson(token),
          body: JSON.stringify({ title: assignTitle, description: assignDesc, due_days: Number(dueDays) || 7, submission_type: submissionType }),
        });
        if (!r.ok) showToast("Lesson saved, but the assignment couldn't be saved.", "error");
      }

      showToast(isEdit ? "Lesson updated!" : "Lesson added!");
      onSaved();
      onClose();
    } catch (e) {
      console.error("[LMALessonEditor] save error:", e);
      showToast("Network error — check console", "error");
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <>
      <style>{`@keyframes lle-modalIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }`}</style>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{ background: "#fff", width: "100%", maxWidth: 560, maxHeight: "85vh", borderRadius: 18, display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.30)", animation: "lle-modalIn 0.18s ease-out both" }}>

          {/* Header — pinned, never scrolls away */}
          <div style={{ flexShrink: 0, padding: "18px 22px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12 }}>
            <h3 style={{ flex: 1, fontSize: 16, fontWeight: 800, color: "#141413", margin: 0, fontFamily: FF }}>
              {step === "type" ? "Choose Content Type" : isEdit ? "Edit Lesson" : "New Lesson"}
            </h3>
            <button type="button" onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: 7, cursor: "pointer", color: "#6b7280" }}>
              <X size={16} />
            </button>
          </div>

          {/* Body — the only scrollable region; Lesson Title is always the
              first field here, and scroll resets to top on every step change
              so it's never left scrolled out of view. */}
          <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          {step === "type" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(3, 100px)", gap: 12 }}>
              {CONTENT_TYPES.map(ct => {
                const selected = ct.type === contentType;
                return (
                  <button
                    key={ct.type} type="button"
                    onClick={() => { setContentType(ct.type); setStep("form"); }}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, textAlign: "center",
                      width: "100%", height: 100, boxSizing: "border-box", padding: 16, borderRadius: 12, cursor: "pointer",
                      border: selected ? `2px solid ${GOLD}` : "1px solid #e5e7eb",
                      background: selected ? "rgba(217,53,34,0.05)" : "#fff",
                      boxShadow: "none",
                      transition: "border-color 150ms, background 150ms, box-shadow 150ms",
                    }}
                    onMouseEnter={e => {
                      if (!selected) e.currentTarget.style.borderColor = GOLD;
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={e => {
                      if (!selected) e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <ct.icon size={18} color={GOLD} />
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: "#141413", fontFamily: FF, lineHeight: 1.2 }}>{ct.label}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", fontFamily: FF, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{ct.desc}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              {/* Content type switcher (only when creating — locked once saved to keep sub-content consistent) */}
              {!isEdit && (
                <button type="button" onClick={() => setStep("type")} style={{
                  display: "flex", alignItems: "center", gap: 6, marginBottom: 16,
                  background: "rgba(217,53,34,0.08)", border: "none", borderRadius: 8, padding: "6px 12px",
                  cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: GOLD, fontFamily: FF,
                }}>
                  {CONTENT_TYPES.find(c => c.type === contentType)?.label} — change type
                </button>
              )}

              <Field label="Lesson Title">
                <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Introduction to Cloud Security" autoFocus
                  onFocus={focusGold} onBlur={blurGold} />
              </Field>

              {contentType === "video" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Upload Video (optional)">
                      <FileDrop accept="video/*" file={videoFile} onFile={setVideoFile} icon={Upload} label="Choose MP4…"
                        existingLabel={hasUploadedVideo ? "Video already uploaded" : undefined}
                        onRemoveExisting={hasUploadedVideo ? removeUploadedVideo : undefined} removing={removingVideo} />
                      {videoFile && <VideoPreview file={videoFile} />}
                    </Field>
                    <Field label="OR Video URL (optional)">
                      <input style={inputStyle} value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/…"
                        onFocus={focusGold} onBlur={blurGold} />
                    </Field>
                  </div>
                  <Field label="Duration (minutes)">
                    <input type="number" style={inputStyle} value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 12"
                      onFocus={focusGold} onBlur={blurGold} />
                  </Field>
                  <Field label="Description (optional)">
                    <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="What this lesson covers…" onFocus={focusGold} onBlur={blurGold} />
                  </Field>
                  <ResourcesEditor resources={resources} onAdd={addResource} onUpdate={updateResource} onRemove={removeResource} />
                  <ToggleRow label="Free preview" checked={isFreePreview} onChange={setIsFreePreview} />
                  <ToggleRow label="Downloadable" checked={isDownloadable} onChange={setIsDownloadable} />
                </>
              )}

              {contentType === "document" && (
                <>
                  <Field label="Upload PDF/Document (optional)">
                    <FileDrop accept=".pdf,.doc,.docx,.ppt,.pptx" file={documentFile} onFile={setDocumentFile} icon={Upload} label="Choose file…"
                      existingLabel={hasUploadedDocument ? "Document already uploaded" : undefined}
                      onRemoveExisting={hasUploadedDocument ? removeUploadedDocument : undefined} removing={removingDocument} />
                  </Field>
                  <Field label="Description (optional)">
                    <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="What this document covers…" onFocus={focusGold} onBlur={blurGold} />
                  </Field>
                  <ToggleRow label="Free preview" checked={isFreePreview} onChange={setIsFreePreview} />
                </>
              )}

              {contentType === "quiz" && (
                <>
                  <Field label="Passing Score (%)">
                    <input type="number" min={0} max={100} style={inputStyle} value={passingScore} onChange={e => setPassingScore(Number(e.target.value))}
                      onFocus={focusGold} onBlur={blurGold} />
                  </Field>
                  {quizLoading ? (
                    <p style={{ fontSize: 12.5, color: "#9ca3af", fontFamily: FF }}>Loading questions…</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                      {questions.length === 0 && (
                        <p style={{ fontSize: 12.5, color: "#9ca3af", fontFamily: FF, margin: 0 }}>
                          No questions yet — add one below, or save now and come back later.
                        </p>
                      )}
                      {questions.map((q, i) => (
                        <QuestionCard key={i} index={i} q={q}
                          onChange={patch => updateQuestion(i, patch)}
                          onRemove={() => removeQuestion(i)} />
                      ))}
                      <button type="button" onClick={addQuestion} style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        background: "rgba(217,53,34,0.08)", border: "1.5px dashed rgba(217,53,34,0.35)",
                        borderRadius: 9, padding: "10px", cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: GOLD, fontFamily: FF,
                      }}>
                        <Plus size={14} /> Add Question
                      </button>
                    </div>
                  )}
                </>
              )}

              {contentType === "assignment" && (
                <>
                  <Field label="Assignment Title (optional)">
                    <input style={inputStyle} value={assignTitle} onChange={e => setAssignTitle(e.target.value)} placeholder="e.g. Build a REST API"
                      onFocus={focusGold} onBlur={blurGold} />
                  </Field>
                  <Field label="Description (optional)">
                    <textarea rows={4} style={{ ...inputStyle, resize: "vertical" }} value={assignDesc} onChange={e => setAssignDesc(e.target.value)}
                      placeholder="Describe the task in detail…" onFocus={focusGold} onBlur={blurGold} />
                  </Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Due (days after enrollment)">
                      <input type="number" style={inputStyle} value={dueDays} onChange={e => setDueDays(e.target.value)}
                        onFocus={focusGold} onBlur={blurGold} />
                    </Field>
                    <Field label="Submission Type">
                      <select style={{ ...inputStyle, cursor: "pointer" }} value={submissionType} onChange={e => setSubmissionType(e.target.value)}
                        onFocus={focusGold} onBlur={blurGold}>
                        <option value="text">Text submission</option>
                        <option value="file">File upload</option>
                        <option value="url">URL/Link</option>
                        <option value="code">Code submission</option>
                      </select>
                    </Field>
                  </div>
                </>
              )}

              {contentType === "live_session" && (
                <>
                  <Field label="Meeting URL (optional)">
                    <input style={inputStyle} value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://zoom.us/j/… or meet.google.com/…"
                      onFocus={focusGold} onBlur={blurGold} />
                  </Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Date & Time (optional)">
                      <input type="datetime-local" style={inputStyle} value={liveDate} onChange={e => setLiveDate(e.target.value)}
                        onFocus={focusGold} onBlur={blurGold} />
                    </Field>
                    <Field label="Duration (minutes)">
                      <input type="number" style={inputStyle} value={duration} onChange={e => setDuration(e.target.value)}
                        onFocus={focusGold} onBlur={blurGold} />
                    </Field>
                  </div>
                  <Field label="Description (optional)">
                    <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="What this session covers…" onFocus={focusGold} onBlur={blurGold} />
                  </Field>
                </>
              )}

              {contentType === "text" && (
                <Field label="Content (optional)">
                  <RichTextEditor value={textContent} onChange={setTextContent} />
                </Field>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {step === "form" && (
          <div style={{ padding: "14px 22px 20px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving} style={{
              flex: 2, padding: "11px", borderRadius: 10, border: "none",
              background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#fff",
              fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: FF,
              opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Save size={14} /> {saving ? "Saving…" : "Save Lesson"}
            </button>
          </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

// ── Small building blocks ─────────────────────────────────────────────────────

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", fontFamily: FF, marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const ToggleRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer", fontSize: 13, color: "#141413", fontFamily: FF }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ accentColor: GOLD, width: 16, height: 16 }} />
    {label}
  </label>
);

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FileDrop = ({ accept, file, onFile, icon: Icon, label, existingLabel, onRemoveExisting, removing }: {
  accept: string; file: File | null; onFile: (f: File | null) => void; icon: any; label: string;
  existingLabel?: string; onRemoveExisting?: () => void; removing?: boolean;
}) => {
  const id = `filedrop-${label.replace(/\s/g, "")}`;
  return (
    <div>
      <label htmlFor={id} style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 9,
        border: "1.5px dashed rgba(0,0,0,0.18)", cursor: "pointer", fontSize: 12.5, color: file ? "#141413" : "#9ca3af", fontFamily: FF,
      }}>
        <Icon size={14} color={GOLD} />
        {file ? `${file.name} · ${formatFileSize(file.size)}` : label}
      </label>
      <input id={id} type="file" accept={accept} style={{ display: "none" }} onChange={e => onFile(e.target.files?.[0] || null)} />
      {!file && existingLabel && (
        <div style={{ fontSize: 10.5, color: "#10b981", marginTop: 4, fontFamily: FF, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Check size={10} /> {existingLabel} — choose a new file to replace it</span>
          {onRemoveExisting && (
            <button type="button" onClick={onRemoveExisting} disabled={removing} style={{
              background: "none", border: "none", padding: 0, color: "#dc2626", fontSize: 10.5, fontWeight: 700,
              fontFamily: FF, cursor: removing ? "not-allowed" : "pointer", textDecoration: "underline", opacity: removing ? 0.6 : 1,
            }}>
              {removing ? "Removing…" : "Remove"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/** Local <video> preview of a just-picked File, before it's uploaded — uses
 * an object URL (the only way to preview a browser File that has no server
 * URL yet) and revokes it on unmount/file change to avoid leaking memory. */
const VideoPreview = ({ file }: { file: File }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  if (!url) return null;
  return (
    <video controls src={url} style={{ width: "100%", maxHeight: 220, borderRadius: 9, marginTop: 8, background: "#000", display: "block" }} />
  );
};

const ResourcesEditor = ({ resources, onAdd, onUpdate, onRemove }: {
  resources: Resource[]; onAdd: () => void; onUpdate: (i: number, patch: Partial<Resource>) => void; onRemove: (i: number) => void;
}) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", fontFamily: FF, marginBottom: 6 }}>Attached Resources (optional)</label>
    {resources.map((r, i) => (
      <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <input style={{ ...inputStyle, flex: 1 }} value={r.name} placeholder="Name" onChange={e => onUpdate(i, { name: e.target.value })} onFocus={focusGold} onBlur={blurGold} />
        <input style={{ ...inputStyle, flex: 2 }} value={r.url} placeholder="URL" onChange={e => onUpdate(i, { url: e.target.value })} onFocus={focusGold} onBlur={blurGold} />
        <button type="button" onClick={() => onRemove(i)} style={{ background: "rgba(239,68,68,0.08)", border: "none", borderRadius: 8, padding: "0 10px", cursor: "pointer", color: "#dc2626" }}>
          <Trash2 size={13} />
        </button>
      </div>
    ))}
    <button type="button" onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: GOLD, fontFamily: FF, padding: "4px 0" }}>
      <Link2 size={12} /> Add resource
    </button>
  </div>
);

const QuestionCard = ({ index, q, onChange, onRemove }: {
  index: number; q: QuizQuestionDraft; onChange: (patch: Partial<QuizQuestionDraft>) => void; onRemove: () => void;
}) => (
  <div style={{ background: "#f9f7f4", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(0,0,0,0.06)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 11.5, fontWeight: 800, color: GOLD, fontFamily: FF }}>QUESTION {index + 1}</span>
      <button type="button" onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}><Trash2 size={13} /></button>
    </div>
    <input style={{ ...inputStyle, marginBottom: 8 }} value={q.question} placeholder="Question text…" onChange={e => onChange({ question: e.target.value })} onFocus={focusGold} onBlur={blurGold} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
      {(["a", "b", "c", "d"] as const).map(letter => (
        <div key={letter} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="radio" checked={q.correct_answer === letter} onChange={() => onChange({ correct_answer: letter })} style={{ accentColor: GOLD, flexShrink: 0 }} title="Correct answer" />
          <input style={inputStyle} value={q[`option_${letter}` as const]} placeholder={`Option ${letter.toUpperCase()}`}
            onChange={e => onChange({ [`option_${letter}`]: e.target.value } as Partial<QuizQuestionDraft>)}
            onFocus={focusGold} onBlur={blurGold} />
        </div>
      ))}
    </div>
    <input style={inputStyle} value={q.explanation} placeholder="Explanation (optional)" onChange={e => onChange({ explanation: e.target.value })} onFocus={focusGold} onBlur={blurGold} />
  </div>
);
