import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { partnerApi, type TrainingMaterial } from '../api/partnerApi';
import { useCurrency } from '../context/CurrencyContext';
import { PACKAGES, OG, FF } from '../constants';

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)', padding: '22px 24px',
  display: 'flex', flexDirection: 'column', height: '100%',
};
const btnStyle: React.CSSProperties = {
  marginTop: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  textDecoration: 'none', background: `linear-gradient(145deg,#e8a84e,${OG})`, color: '#fff',
  fontFamily: FF, fontWeight: 700, fontSize: 13, padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
};

// ── module sales playbook — what to say, who to say it to, how to handle pushback ──
interface ModulePlaybook {
  key: string; label: string; icon: string;
  what: string; who: string; pitch: string[]; objectionQ: string; objectionA: string;
}
const MODULE_PLAYBOOK: ModulePlaybook[] = [
  {
    key: 'dashboard', label: 'Dashboard & Analytics', icon: 'fas fa-chart-line',
    what: 'A single live view of revenue, project status, and team performance, pulled automatically from every other module — no manual reports required.',
    who: 'Business owners, GMs, and department heads currently relying on scattered Excel reports or gut feeling to make decisions.',
    pitch: ['No more waiting for month-end reports to know how the business is doing', 'One login shows every department\'s numbers, live', 'Spot a problem while it\'s still cheap to fix'],
    objectionQ: '"We already get reports from our team."',
    objectionA: 'Those reports are backward-looking and manually compiled by hand. This is live, automatic, and can\'t be quietly polished before it reaches you.',
  },
  {
    key: 'crm', label: 'CRM', icon: 'fas fa-address-book',
    what: 'Tracks every lead and customer from first contact to closed deal, with automatic follow-up reminders so nothing falls through the cracks.',
    who: 'Sales teams and business development managers juggling leads across WhatsApp, email, and spreadsheets.',
    pitch: ['Never lose a lead in someone\'s inbox again', 'See exactly where every deal stands, in real time', 'New sales hires ramp up faster with full deal history'],
    objectionQ: '"Our sales team won\'t adopt another tool."',
    objectionA: 'It replaces the spreadsheet chaos they\'re already fighting — it doesn\'t add to it. And management finally gets visibility they don\'t have today.',
  },
  {
    key: 'sales', label: 'Sales', icon: 'fas fa-file-invoice-dollar',
    what: 'Manages quotations, orders, and invoicing in one connected flow — quote to cash without re-typing the same data three times.',
    who: 'Sales and commercial teams handling repeat B2B orders with multi-stage approvals.',
    pitch: ['Quotes go out faster and get approved faster', 'Zero re-entry between quote, order, and invoice', 'A full audit trail for every sale, automatically'],
    objectionQ: '"We already use accounting software for invoicing."',
    objectionA: 'This connects the actual sale — the quote and order — directly to that invoice. No gap, no manual handoff errors between teams.',
  },
  {
    key: 'procurement', label: 'Procurement', icon: 'fas fa-shopping-cart',
    what: 'Manages supplier records, purchase orders, and goods receipt so nothing is bought or received without a clear paper trail.',
    who: 'Companies managing multiple suppliers or subcontractors — especially in construction and EPC, where procurement delays cost real money.',
    pitch: ['Know exactly what\'s on order and when it lands', 'Stop double-ordering or missed deliveries', 'Full supplier performance history, built automatically'],
    objectionQ: '"Our procurement person handles it all from memory / Excel."',
    objectionA: 'That\'s exactly the risk — if they\'re out sick or leave the company, that knowledge walks out the door with them.',
  },
  {
    key: 'logistics', label: 'Logistics', icon: 'fas fa-truck',
    what: 'Tracks shipments, deliveries, and fleet or route status so nothing gets "lost" between the warehouse and the site.',
    who: 'Companies regularly moving materials or equipment between sites or to clients.',
    pitch: ['Real-time delivery status — no more calling drivers to check', 'Fewer disputes over what was delivered and when', 'Delivery history data improves future planning'],
    objectionQ: '"We\'re too small to need a logistics system."',
    objectionA: 'If you\'re already tracking deliveries over WhatsApp, you already need this — it just formalizes what you\'re trying to do anyway.',
  },
  {
    key: 'accounting', label: 'Accounting', icon: 'fas fa-calculator',
    what: 'The core financial ledger — expenses, revenue, and reporting — connected directly to sales and procurement so the books stay accurate without manual reconciliation.',
    who: 'Finance teams and owners tired of month-end reconciliation between disconnected departments.',
    pitch: ['Books update themselves as the business runs', 'Close the month in days, not weeks', 'Audit-ready at any moment, not just at year-end'],
    objectionQ: '"We already have an accountant / Tally / QuickBooks."',
    objectionA: 'This isn\'t replacing the accountant — it gives them clean, connected data instead of manual entry pulled from five different sources.',
  },
  {
    key: 'hr', label: 'HR & Payroll', icon: 'fas fa-users',
    what: 'Employee records, attendance, leave, and payroll calculation, including shift-based tracking common in engineering and EPC teams.',
    who: 'Companies with 10+ employees still running payroll manually or from disconnected spreadsheets.',
    pitch: ['Payroll calculates itself from attendance data', 'No more chasing paper leave forms', 'Compliance-ready employee records, always up to date'],
    objectionQ: '"Payroll is sensitive — we don\'t trust a new system with it."',
    objectionA: 'Role-based access means only authorized people ever see payroll data — genuinely more secure than a shared spreadsheet.',
  },
  {
    key: 'documents', label: 'Document Management', icon: 'fas fa-folder-open',
    what: 'Central, versioned storage for contracts, drawings, permits, and compliance documents with controlled access.',
    who: 'Any EPC or engineering company juggling drawings, permits, and contracts across email threads and shared drives.',
    pitch: ['One place, always the latest version', 'No more "which file is the final one" confusion', 'Instant access to documents during audits or client requests'],
    objectionQ: '"We already use Google Drive or Dropbox."',
    objectionA: 'Those aren\'t built for approval workflows or version control on engineering documents, or for linking files directly to a project or deal — this is.',
  },
  {
    key: 'projects', label: 'Project Management', icon: 'fas fa-tasks',
    what: 'Task planning, timelines, and progress tracking for engineering and construction projects, including Gantt-style views.',
    who: 'Project managers and site engineers running multi-phase projects with subcontractors and deadlines.',
    pitch: ['See project status without chasing site engineers for updates', 'Catch delays before they cascade into bigger problems', 'Clear accountability — everyone knows what they own'],
    objectionQ: '"We already use MS Project."',
    objectionA: 'MS Project isn\'t connected to your team\'s actual work, documents, or budget — this keeps everything in one system instead of a disconnected file.',
  },
  {
    key: 'assets', label: 'Asset Management', icon: 'fas fa-tools',
    what: 'Tracks equipment, machinery, and tools — their location, maintenance schedule, and utilization across sites.',
    who: 'Companies with expensive equipment or machinery that moves between multiple sites.',
    pitch: ['Know where every asset is, always', 'Preventive maintenance reminders cut down on breakdowns', 'Stop losing tools and equipment between sites'],
    objectionQ: '"We track assets manually and it\'s fine."',
    objectionA: 'Until equipment goes missing or breaks down mid-project — this pays for itself the first time it prevents exactly that.',
  },
  {
    key: 'qhse', label: 'QHSE', icon: 'fas fa-hard-hat',
    what: 'Quality, Health, Safety & Environment tracking — incident reporting, safety checklists, and compliance documentation.',
    who: 'EPC, construction, oil & gas, and manufacturing companies with safety compliance requirements.',
    pitch: ['Incident reports and audits live in one system, not paper forms', 'Faster compliance reporting to regulators and clients', 'Proactive safety checklists help reduce incidents'],
    objectionQ: '"We already meet our compliance requirements."',
    objectionA: 'Proving that today, on paper, is slow during an audit — this makes your existing safety record instantly demonstrable.',
  },
  {
    key: 'mlm', label: 'MLM / Network', icon: 'fas fa-project-diagram',
    what: 'Manages multi-level distributor or partner networks — commissions, hierarchy, and payouts (the same system behind the XERXEZ Partner Program itself).',
    who: 'Companies running their own distributor, franchise, or referral network with tiered commissions.',
    pitch: ['Automatic commission calculation across every level', 'Full network visibility for the business owner', 'Removes manual commission disputes entirely'],
    objectionQ: '"Sounds complex for our small network."',
    objectionA: 'It scales down just as well as up — even a simple 2-tier referral program benefits from automated, transparent payouts.',
  },
];

function ModulePlaybookAccordion() {
  const [open, setOpen] = useState<string | null>(MODULE_PLAYBOOK[0].key);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {MODULE_PLAYBOOK.map(m => {
        const isOpen = open === m.key;
        return (
          <div key={m.key} style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <button
              type="button" onClick={() => setOpen(isOpen ? null : m.key)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                background: isOpen ? 'rgba(201,136,58,0.05)' : '#fff', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
              aria-expanded={isOpen}
            >
              <span style={{
                width: 36, height: 36, borderRadius: 10, background: 'rgba(201,136,58,0.10)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={m.icon} style={{ color: OG, fontSize: 15 }} />
              </span>
              <span style={{ flex: 1, fontFamily: FF, fontSize: 14.5, fontWeight: 700, color: '#141413' }}>{m.label}</span>
              <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: '#9b9690', fontSize: 12, flexShrink: 0 }} />
            </button>
            {isOpen && (
              <div style={{ padding: '4px 20px 22px 70px' }}>
                <PlaybookField label="What It Does" text={m.what} />
                <PlaybookField label="Who Needs It" text={m.who} />
                <div style={{ marginBottom: 14 }}>
                  <div style={fieldLabelStyle}>How to Pitch It</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {m.pitch.map(p => (
                      <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: FF, fontSize: 13, color: '#333', lineHeight: 1.6 }}>
                        <i className="fas fa-check" style={{ color: OG, fontSize: 10, marginTop: 4, flexShrink: 0 }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ background: '#fafaf8', border: '1px solid #F0EBE4', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ ...fieldLabelStyle, marginBottom: 4 }}>Common Objection</div>
                  <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: '#141413', margin: '0 0 6px', fontStyle: 'italic' }}>{m.objectionQ}</p>
                  <p style={{ fontFamily: FF, fontSize: 13, color: '#5a5650', lineHeight: 1.6, margin: 0 }}>
                    <i className="fas fa-reply" style={{ color: OG, fontSize: 11, marginRight: 7 }} />
                    {m.objectionA}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: FF, fontSize: 10.5, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
};
function PlaybookField({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={fieldLabelStyle}>{label}</div>
      <p style={{ fontFamily: FF, fontSize: 13.5, color: '#333', lineHeight: 1.65, margin: 0 }}>{text}</p>
    </div>
  );
}

const ICON: Record<string, string> = { view: 'fas fa-external-link-alt', download: 'fas fa-download' };

const MaterialCard = ({ m }: { m: TrainingMaterial }) => (
  <div style={cardStyle}>
    <i className="fas fa-book-open" style={{ color: OG, fontSize: 20, marginBottom: 12 }} />
    <h3 style={{ fontFamily: FF, fontSize: 15, fontWeight: 700, color: '#141413', marginBottom: 8 }}>{m.title}</h3>
    <p style={{ fontFamily: FF, fontSize: 13, color: '#6B6B6B', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{m.description}</p>
    {m.action === 'view' && m.url ? (
      <a href={m.url} target="_blank" rel="noopener noreferrer" style={btnStyle}>
        <i className={ICON.view} style={{ fontSize: 11 }} /> View
      </a>
    ) : (
      <button type="button" onClick={() => toast.info('PDF coming soon — check back shortly.')} style={btnStyle}>
        <i className={ICON.download} style={{ fontSize: 11 }} /> Download PDF
      </button>
    )}
  </div>
);

function CommissionCalcCard() {
  const { currency } = useCurrency();
  const [value, setValue] = useState('');
  const [pkg, setPkg] = useState('basic');
  const pct = PACKAGES.find(p => p.value === pkg)?.pct || 0;
  const amount = (parseFloat(value) || 0) * (pct / 100);

  return (
    <div style={cardStyle}>
      <i className="fas fa-calculator" style={{ color: OG, fontSize: 20, marginBottom: 12 }} />
      <h3 style={{ fontFamily: FF, fontSize: 15, fontWeight: 700, color: '#141413', marginBottom: 12 }}>Commission Calculator</h3>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, fontFamily: FF }}>
          Deal Value ({currency.code})
        </label>
        <input
          type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="50000"
          style={{ width: '100%', boxSizing: 'border-box', height: 40, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E4DFD8', fontFamily: FF, fontSize: 13, background: '#fafaf8', outline: 'none' }}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, fontFamily: FF }}>
          Package
        </label>
        <select value={pkg} onChange={e => setPkg(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', height: 40, padding: '0 12px', borderRadius: 8, border: '1.5px solid #E4DFD8', fontFamily: FF, fontSize: 13, background: '#fafaf8', outline: 'none', cursor: 'pointer' }}>
          {PACKAGES.map(p => <option key={p.value} value={p.value}>{p.label} ({p.pct}%)</option>)}
        </select>
      </div>
      <div style={{
        marginTop: 'auto', background: 'rgba(201,136,58,0.08)', border: '1.5px solid rgba(201,136,58,0.25)',
        borderRadius: 10, padding: '12px 16px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: FF, fontSize: 10.5, fontWeight: 700, color: '#8B5E1A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
          Estimated Commission
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: OG }}>
          {currency.symbol} {amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}

function SupportCard() {
  return (
    <div style={cardStyle}>
      <i className="fas fa-headset" style={{ color: OG, fontSize: 20, marginBottom: 12 }} />
      <h3 style={{ fontFamily: FF, fontSize: 15, fontWeight: 700, color: '#141413', marginBottom: 8 }}>Contact XERXEZ Support</h3>
      <p style={{ fontFamily: FF, fontSize: 13, color: '#6B6B6B', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
        Need help? Contact our team.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <a href="mailto:info@xerxez.com" style={{ ...btnStyle, marginTop: 0, background: '#fafaf8', border: '1.5px solid #E4DFD8', color: '#5a5650' }}>
          <i className="fas fa-envelope" style={{ fontSize: 11 }} /> info@xerxez.com
        </a>
        <a href="https://wa.me/971567867451" target="_blank" rel="noopener noreferrer" style={btnStyle}>
          <i className="fab fa-whatsapp" style={{ fontSize: 13 }} /> +971 56 786 7451
        </a>
      </div>
    </div>
  );
}

const TrainingMaterials = () => {
  const [materials, setMaterials] = useState<TrainingMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    partnerApi.materials()
      .then(setMaterials)
      .catch((e: any) => toast.error(e.message || 'Could not load training materials'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: '#141413', margin: '0 0 6px' }}>
          Module Sales Playbook
        </h1>
        <p style={{ fontFamily: FF, fontSize: 13.5, color: '#9b9690', margin: 0 }}>
          What each module does, who needs it, how to pitch it, and how to handle the objection you'll hear most.
        </p>
      </div>
      <div style={{ marginBottom: 40 }}>
        <ModulePlaybookAccordion />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: FF, color: '#9b9690' }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {materials.map(m => <MaterialCard key={m.id} m={m} />)}
          <CommissionCalcCard />
          <SupportCard />
        </div>
      )}
    </div>
  );
};

export default TrainingMaterials;
