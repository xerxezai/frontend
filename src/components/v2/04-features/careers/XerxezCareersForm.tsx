// XerxezCareersForm.tsx
// Purpose: The job-application form on the careers page — name / email / phone /
//          position / experience / links / cover letter / PDF resume upload,
//          with inline validation and a success state.
// Used in: page/v2/CareersV2.tsx
// Data source: `positions` (dropdown options) are passed in by the page, which
//              fetches them from GET /careers/positions/. On submit this POSTs a
//              multipart body to /careers/apply/ with the exact same field names
//              (name, email, phone, position, experience, linkedin, portfolio,
//              cover_letter, resume_file) as the existing CareersPage form.

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";                       // submit feedback toasts
import { FileText } from "lucide-react";                       // resume-drop icon
import apiService from "../../../../services/api";                // shared API client
import PhoneInput, { isValidPhone } from "../../../common/PhoneInput";  // existing phone field + validator
import { T } from "../../01-core/v2theme";
import { v2Label, v2Control, validateEmail, V2Field, V2SubmitBtn, V2FormSuccess } from "../../01-core/v2form";

// One open role. Also imported by the page (re-exported through the v2 barrel).
export interface Position {
  id: string; title: string; type: string; location: string;
  description: string; requirements: string[];
}

// Experience dropdown options (verbatim from CareersPage).
const EXPERIENCE_LEVELS = ["0-1 years", "1-3 years", "3-5 years", "5+ years"];

// All text fields the form tracks (the resume file is separate state).
interface FormState {
  name: string; email: string; phone: string; position: string; experience: string;
  linkedin: string; portfolio: string; cover_letter: string;
}
const EMPTY: FormState = {
  name: "", email: "", phone: "", position: "", experience: "",
  linkedin: "", portfolio: "", cover_letter: "",
};

const XerxezCareersForm = ({
  positions,          // dropdown options, from the page
  prefillPosition,    // job title to pre-select (set when a JobCard "Apply" is clicked)
}: { positions: Position[]; prefillPosition: string }) => {
  const [form, setForm] = useState<FormState>(EMPTY);         // text field values
  const [resume, setResume] = useState<File | null>(null);    // the chosen PDF
  const [errors, setErrors] = useState<Record<string, string>>({});  // field name → message
  const [submitting, setSubmitting] = useState(false);        // request in flight
  const [submitted, setSubmitted] = useState(false);          // show the success panel
  const fileRef = useRef<HTMLInputElement>(null);             // hidden <input type=file>
  const [foc, setFoc] = useState<string | null>(null);        // focused field name (for the ring)

  // When the page asks to prefill a position, apply it.
  useEffect(() => {
    if (prefillPosition) setForm((f) => ({ ...f, position: prefillPosition }));
  }, [prefillPosition]);

  // Update one text field and clear its error, if any.
  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  // Validate a picked file: PDF only, ≤ 5 MB. A rejected file is discarded and
  // the native input cleared, so re-picking the same file still fires onChange.
  const onFile = (file: File | null) => {
    let problem = "";
    if (file && file.type !== "application/pdf") problem = "Resume must be a PDF file.";
    else if (file && file.size > 5 * 1024 * 1024) problem = "Resume must be under 5 MB.";

    if (problem) {
      setResume(null);
      if (fileRef.current) fileRef.current.value = "";
    } else {
      setResume(file);
    }
    setErrors((e) => ({ ...e, resume: problem }));
  };

  // Required: name, valid email, position, experience, resume. Phone optional but must be valid if present.
  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!validateEmail(form.email)) next.email = "Enter a valid email address.";
    if (!form.position) next.position = "Select the position you're applying for.";
    if (!form.experience) next.experience = "Select your experience level.";
    if (form.phone.trim() && !isValidPhone(form.phone)) next.phone = "Please enter a valid phone number with country code";
    if (!resume) next.resume = "Attach your resume (PDF only).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      // Multipart body — field names must match the backend serializer.
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("phone", form.phone.trim());
      fd.append("position", form.position);
      fd.append("experience", form.experience);
      fd.append("linkedin", form.linkedin.trim());
      fd.append("portfolio", form.portfolio.trim());
      fd.append("cover_letter", form.cover_letter.trim());
      if (resume) fd.append("resume_file", resume);

      const result = await apiService.postFormData("/careers/apply/", fd);
      if (result.success) {
        setSubmitted(true);
        toast.success("Application submitted!");
      } else {
        // Surface the first field error the API returned, else its message, else a generic line.
        const details = (result as { details?: unknown }).details;
        const firstErr = details && typeof details === "object"
          ? (Object.values(details as Record<string, unknown>)[0] as unknown)
          : null;
        const firstErrText = Array.isArray(firstErr) ? firstErr[0] : firstErr;
        toast.error((firstErrText as string) || (result as { message?: string }).message || "Failed to submit application. Please try again.");
      }
    } catch {
      toast.error("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success panel — replaces the form after a successful submit ──
  if (submitted) {
    return (
      <V2FormSuccess title="Application submitted!">
        We will contact you within 3-5 business days.
        <span style={{ display: "block", fontSize: 13, marginTop: 14 }}>
          Or email your resume directly to{" "}
          <a href="mailto:info@xerxez.com" style={{ color: T.red, fontWeight: 700, textDecoration: "none" }}>info@xerxez.com</a>
        </span>
      </V2FormSuccess>
    );
  }

  // Control style for a named field (adds the focus ring when focused).
  const ctrl = (name: string) => v2Control({ focused: foc === name });
  // Same, but forces a red border when the field has an error.
  const errCtrl = (name: string, err?: string) => ({
    ...ctrl(name),
    ...(err ? { borderColor: "#e11d2e" } : null),
  });

  return (
    <form onSubmit={submit} noValidate autoComplete="off">{/* noValidate → our validate() runs instead of the browser's */}
      <div className="row g-3">
        <V2Field label="Full Name" required htmlFor="v2j-name" error={errors.name}>
          <input id="v2j-name" style={errCtrl("name", errors.name)} value={form.name} autoComplete="off"
            onFocus={() => setFoc("name")} onBlur={() => setFoc(null)}
            onChange={(e) => set("name", e.target.value)} placeholder="Your full name" />
        </V2Field>
        <V2Field label="Email" required htmlFor="v2j-email" error={errors.email}>
          <input id="v2j-email" type="email" style={errCtrl("email", errors.email)} value={form.email} autoComplete="off"
            onFocus={() => setFoc("email")} onBlur={() => setFoc(null)}
            onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
        </V2Field>
        {/* Phone uses the existing site component; error shown manually below it */}
        <div className="col-md-6">
          <label style={v2Label}>Phone</label>
          <PhoneInput value={form.phone} onChange={(v) => set("phone", v)} hasError={!!errors.phone} />
          {errors.phone && <span style={{ display: "block", marginTop: 6, fontFamily: T.fontBody, fontSize: 12, color: "#e11d2e" }}>{errors.phone}</span>}
        </div>
        <V2Field label="Position" required htmlFor="v2j-position" error={errors.position}>
          <select id="v2j-position" style={{ ...errCtrl("position", errors.position), cursor: "pointer" }} value={form.position}
            onFocus={() => setFoc("position")} onBlur={() => setFoc(null)}
            onChange={(e) => set("position", e.target.value)}>
            <option value="">Select a position</option>
            {positions.map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
            <option value="Other">Other / General Application</option>
          </select>
        </V2Field>
        <V2Field label="Experience" required htmlFor="v2j-exp" error={errors.experience}>
          <select id="v2j-exp" style={{ ...errCtrl("experience", errors.experience), cursor: "pointer" }} value={form.experience}
            onFocus={() => setFoc("experience")} onBlur={() => setFoc(null)}
            onChange={(e) => set("experience", e.target.value)}>
            <option value="">Select experience level</option>
            {EXPERIENCE_LEVELS.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </V2Field>
        <V2Field label="LinkedIn URL" htmlFor="v2j-li">
          <input id="v2j-li" style={ctrl("linkedin")} value={form.linkedin}
            onFocus={() => setFoc("linkedin")} onBlur={() => setFoc(null)}
            onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
        </V2Field>
        <V2Field label="Portfolio / GitHub URL" htmlFor="v2j-pf">
          <input id="v2j-pf" style={ctrl("portfolio")} value={form.portfolio}
            onFocus={() => setFoc("portfolio")} onBlur={() => setFoc(null)}
            onChange={(e) => set("portfolio", e.target.value)} placeholder="https://github.com/..." />
        </V2Field>
        <V2Field label="Cover Letter" htmlFor="v2j-cl" full>
          <textarea id="v2j-cl" style={{ ...ctrl("cover_letter"), resize: "vertical", minHeight: 110 }} value={form.cover_letter}
            onFocus={() => setFoc("cover_letter")} onBlur={() => setFoc(null)}
            onChange={(e) => set("cover_letter", e.target.value)}
            placeholder="Tell us why you're a great fit for this role..." />
        </V2Field>
        {/* Resume — a styled drop zone that proxies clicks/Enter/Space to the hidden file input */}
        <V2Field label="Resume (PDF only)" required htmlFor="v2j-resume" error={errors.resume} full>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
            style={{
              border: `1.5px dashed ${errors.resume ? "#e11d2e" : "rgba(217,53,34,0.4)"}`,
              borderRadius: T.rx, padding: "20px 18px", textAlign: "center",
              background: "rgba(217,53,34,0.04)", cursor: "pointer",
            }}
          >
            <input ref={fileRef} type="file" accept="application/pdf,.pdf" style={{ display: "none" }}
              onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
            <FileText size={22} color={T.red} style={{ display: "block", margin: "0 auto 8px" }} />
            <span style={{
              fontFamily: T.fontBody, fontSize: 13.5,
              fontWeight: resume ? 700 : 500, color: resume ? T.headNavy : T.muted,
            }}>
              {resume ? resume.name : "Click to upload your resume (PDF, max 5 MB)"}
            </span>
          </div>
        </V2Field>
      </div>

      {/* submit + fallback email line */}
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <V2SubmitBtn loading={submitting} loadingLabel="Submitting…">Submit application →</V2SubmitBtn>
        <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.muted, textAlign: "center" }}>
          Or email your resume directly to{" "}
          <a href="mailto:info@xerxez.com" style={{ color: T.red, fontWeight: 700, textDecoration: "none" }}>info@xerxez.com</a>
        </p>
      </div>
    </form>
  );
};

export default XerxezCareersForm;
