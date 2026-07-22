import { toast } from 'react-toastify';
import { OG, FF } from '../constants';

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)', padding: '24px 26px', marginBottom: 24,
};
const sectionHeader = (n: number, title: string) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
    <div style={{
      width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(145deg,#e8a84e,${OG})`,
      boxShadow: '0 3px 0 rgba(130,80,20,0.50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#fff' }}>{n}</span>
    </div>
    <span style={{ fontFamily: FF, fontSize: 15, fontWeight: 800, color: '#141413' }}>{title}</span>
    <div style={{ flex: 1, height: 1, background: '#F0EBE4' }} />
  </div>
);

// ── Section 1 — Email Templates ──────────────────────────────────────────
interface EmailTemplate { title: string; subject: string; body: string }
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    title: 'Introduction Email',
    subject: "Quick question about [Company]'s operations",
    body: `Hi [Name],

I work with XERXEZ, and we help Engineering, EPC, and Industrial companies replace manual approvals, Excel chaos, and disconnected systems with one AI-powered ERP platform — covering everything from CRM and procurement to HR, project management, and safety compliance.

I noticed [Company] might be dealing with some of the same operational headaches we solve for similar companies in the region. Would you be open to a quick 15-minute call to see if it's a fit?

Best regards,
[Your Name]
XERXEZ Partner`,
  },
  {
    title: 'Follow-Up Email',
    subject: 'Following up — XERXEZ ERP for [Company]',
    body: `Hi [Name],

Just following up on my earlier note. I know things get busy, so I'll keep this short.

XERXEZ's ERP is built specifically for Engineering, EPC, and Industrial companies — modules like Procurement, Project Management, and QHSE come standard, not as expensive add-ons.

Happy to send over a short demo video, or we can jump on a quick call whenever works for you. Let me know what's easier.

Best regards,
[Your Name]`,
  },
  {
    title: 'Demo Request Email',
    subject: "Let's schedule your XERXEZ ERP demo",
    body: `Hi [Name],

Thanks for your interest in XERXEZ! I'd like to set up a personalized demo with our product team so you can see exactly how the platform would work for [Company]'s operations.

Could you share a few times that work for you this week? The demo takes about 30 minutes and we'll tailor it to the modules most relevant to your business.

Looking forward to it.

Best regards,
[Your Name]`,
  },
];

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text)
    .then(() => toast.success(`${label} copied`))
    .catch(() => toast.error('Could not copy — please copy manually.'));
}

function EmailTemplateCard({ t }: { t: EmailTemplate }) {
  return (
    <div style={{ background: '#fafaf8', border: '1px solid #F0EBE4', borderRadius: 12, padding: '18px 20px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <h4 style={{ fontFamily: FF, fontSize: 14.5, fontWeight: 800, color: '#141413', margin: 0 }}>{t.title}</h4>
        <button
          type="button" onClick={() => copyToClipboard(`Subject: ${t.subject}\n\n${t.body}`, t.title)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1.5px solid #E4DFD8',
            borderRadius: 8, padding: '6px 12px', fontFamily: FF, fontSize: 11.5, fontWeight: 700, color: OG, cursor: 'pointer',
          }}
        >
          <i className="far fa-copy" style={{ fontSize: 10 }} /> Copy
        </button>
      </div>
      <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Subject</div>
      <p style={{ fontFamily: FF, fontSize: 13, color: '#333', margin: '0 0 12px', fontWeight: 600 }}>{t.subject}</p>
      <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Body</div>
      <p style={{ fontFamily: FF, fontSize: 13, color: '#333', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{t.body}</p>
    </div>
  );
}

// ── Section 2 — Key Talking Points ───────────────────────────────────────
const WHY_XERXEZ = [
  'Built for Engineering/EPC from the ground up — modules like QHSE, Asset Management, and Project Management are standard, not costly add-ons bolted onto a generic ERP.',
  'Fast to deploy — most clients are live within weeks, not the 6–12 month rollouts typical of legacy ERP systems.',
  'AI-powered insights baked in — flags risks and opportunities automatically instead of requiring a data analyst to dig them out.',
];

// ── Section 3 — Quick Module Reference ───────────────────────────────────
const MODULE_ONE_LINERS: { label: string; icon: string; line: string }[] = [
  { label: 'Dashboard & Analytics', icon: 'fas fa-chart-line', line: 'Live view of revenue, projects, and performance across the whole business.' },
  { label: 'CRM', icon: 'fas fa-address-book', line: 'Tracks every lead and customer from first contact to closed deal.' },
  { label: 'Sales', icon: 'fas fa-file-invoice-dollar', line: 'Quotes, orders, and invoicing in one connected flow.' },
  { label: 'Procurement', icon: 'fas fa-shopping-cart', line: 'Supplier records, purchase orders, and goods receipt with full tracking.' },
  { label: 'Logistics', icon: 'fas fa-truck', line: 'Shipment, delivery, and fleet tracking in real time.' },
  { label: 'Accounting', icon: 'fas fa-calculator', line: 'Core financial ledger connected directly to sales and procurement.' },
  { label: 'HR & Payroll', icon: 'fas fa-users', line: 'Employee records, attendance, leave, and automatic payroll.' },
  { label: 'Document Management', icon: 'fas fa-folder-open', line: 'Central, version-controlled storage for contracts and drawings.' },
  { label: 'Project Management', icon: 'fas fa-tasks', line: 'Task planning, timelines, and progress tracking.' },
  { label: 'Asset Management', icon: 'fas fa-tools', line: 'Tracks equipment location, maintenance, and utilization.' },
  { label: 'QHSE', icon: 'fas fa-hard-hat', line: 'Safety incident reporting, checklists, and compliance documentation.' },
  { label: 'MLM / Network', icon: 'fas fa-project-diagram', line: 'Manages distributor/partner networks and automatic commission payouts.' },
];

const MarketingMaterials = () => {
  const allModuleLines = MODULE_ONE_LINERS.map(m => `${m.label}: ${m.line}`).join('\n');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: '#141413', margin: '0 0 6px' }}>
          Marketing Materials
        </h1>
        <p style={{ fontFamily: FF, fontSize: 13.5, color: '#9b9690', margin: 0 }}>
          Ready-to-use email templates, talking points, and a module cheat sheet for your prospects.
        </p>
      </div>

      {/* Section 1 */}
      <div style={cardStyle}>
        {sectionHeader(1, 'Email Templates')}
        {EMAIL_TEMPLATES.map(t => <EmailTemplateCard key={t.title} t={t} />)}
      </div>

      {/* Section 2 */}
      <div style={cardStyle}>
        {sectionHeader(2, 'Key Talking Points')}

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontFamily: FF, fontSize: 13, fontWeight: 800, color: '#141413', margin: '0 0 8px' }}>What Is XERXEZ ERP?</h4>
          <p style={{ fontFamily: FF, fontSize: 13.5, color: '#333', lineHeight: 1.7, background: '#fafaf8', border: '1px solid #F0EBE4', borderRadius: 10, padding: '14px 16px', margin: 0 }}>
            XERXEZ is an AI-powered ERP platform built specifically for Engineering, EPC, and Industrial companies. It replaces disconnected spreadsheets and manual approvals with one system covering CRM, procurement, HR, accounting, project management, and safety compliance. Everything talks to everything else — so data entered once shows up everywhere it's needed.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontFamily: FF, fontSize: 13, fontWeight: 800, color: '#141413', margin: '0 0 10px' }}>Why XERXEZ Over Competitors</h4>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {WHY_XERXEZ.map(line => (
              <li key={line} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontFamily: FF, fontSize: 13.5, color: '#333', lineHeight: 1.65 }}>
                <i className="fas fa-check-circle" style={{ color: OG, fontSize: 13, marginTop: 3, flexShrink: 0 }} />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: FF, fontSize: 13, fontWeight: 800, color: '#141413', margin: '0 0 8px' }}>
            Handling "We Already Have a System"
          </h4>
          <p style={{ fontFamily: FF, fontSize: 13.5, color: '#333', lineHeight: 1.7, background: 'rgba(201,136,58,0.06)', border: '1px solid rgba(201,136,58,0.2)', borderRadius: 10, padding: '14px 16px', margin: 0 }}>
            <i className="fas fa-reply" style={{ color: OG, fontSize: 12, marginRight: 8 }} />
            That's actually the most common thing I hear — and it's usually Excel, an old accounting tool, or a few disconnected apps stitched together with WhatsApp. Ask what happens when someone's on leave and no one else knows where a file or approval is stuck — that's the gap XERXEZ closes. It's not about ripping out what works; it's about connecting what doesn't.
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {sectionHeader(3, 'Quick Module Reference')}
        </div>
        <div style={{ marginTop: -10, marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button" onClick={() => copyToClipboard(allModuleLines, 'Module reference')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1.5px solid #E4DFD8',
              borderRadius: 8, padding: '6px 12px', fontFamily: FF, fontSize: 11.5, fontWeight: 700, color: OG, cursor: 'pointer',
            }}
          >
            <i className="far fa-copy" style={{ fontSize: 10 }} /> Copy All
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
          {MODULE_ONE_LINERS.map(m => (
            <div key={m.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#fafaf8', border: '1px solid #F0EBE4', borderRadius: 10, padding: '12px 14px' }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8, background: 'rgba(201,136,58,0.10)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={m.icon} style={{ color: OG, fontSize: 12.5 }} />
              </span>
              <div>
                <div style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: '#141413' }}>{m.label}</div>
                <div style={{ fontFamily: FF, fontSize: 12, color: '#6B6B6B', lineHeight: 1.5, marginTop: 2 }}>{m.line}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketingMaterials;
