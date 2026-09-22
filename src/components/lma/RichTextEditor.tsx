import { useRef, useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Code } from "lucide-react";

const GOLD = "#D93522";
const FF = "'DM Sans', sans-serif";

interface Props {
  value: string; // stored as HTML
  onChange: (html: string) => void;
  placeholder?: string;
}

/** Minimal contentEditable rich text editor — bold, italic, lists, code
 * blocks. No external dependency (no Tiptap/Quill installed in this
 * project); good enough for lesson article bodies without pulling in a
 * second large library on top of dnd-kit. */
export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Only sync external value into the DOM on mount / when it changes from
  // outside (e.g. loading an existing lesson) — never on every keystroke,
  // which would fight the browser's own cursor position.
  useEffect(() => {
    if (ref.current && isFirstRender.current) {
      ref.current.innerHTML = value || "";
      isFirstRender.current = false;
    }
  }, [value]);

  const exec = (command: string) => {
    document.execCommand(command, false);
    ref.current?.focus();
    onChange(ref.current?.innerHTML || "");
  };

  const btnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 30, height: 30, borderRadius: 7, border: "none", background: "transparent",
    cursor: "pointer", color: "#6b7280",
  };

  return (
    <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 2, padding: "6px 8px", background: "#f9f7f4", borderBottom: "1px solid #e5e7eb" }}>
        {[
          { cmd: "bold", icon: Bold, title: "Bold" },
          { cmd: "italic", icon: Italic, title: "Italic" },
          { cmd: "insertUnorderedList", icon: List, title: "Bulleted list" },
          { cmd: "insertOrderedList", icon: ListOrdered, title: "Numbered list" },
          { cmd: "formatBlock:pre", icon: Code, title: "Code block" },
        ].map(({ cmd, icon: Icon, title }) => (
          <button
            key={cmd} type="button" title={title}
            onMouseDown={e => e.preventDefault()} // keep focus/selection in the editable area
            onClick={() => (cmd.startsWith("formatBlock") ? execFormatBlock() : exec(cmd))}
            style={btnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(217,53,34,0.10)"; e.currentTarget.style.color = GOLD; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML || "")}
        data-placeholder={placeholder || "Write your lesson content…"}
        style={{
          minHeight: 180, maxHeight: 420, overflowY: "auto", padding: "12px 14px",
          fontSize: 13.5, fontFamily: FF, color: "#141413", lineHeight: 1.65, outline: "none",
        }}
      />
      <style>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #aaa; }
        [contenteditable] pre { background: #f3f4f6; border-radius: 6px; padding: 8px 10px; font-family: monospace; font-size: 12.5px; overflow-x: auto; }
        [contenteditable] ul, [contenteditable] ol { padding-left: 22px; margin: 6px 0; }
      `}</style>
    </div>
  );

  function execFormatBlock() {
    document.execCommand("formatBlock", false, "pre");
    ref.current?.focus();
    onChange(ref.current?.innerHTML || "");
  }
}
