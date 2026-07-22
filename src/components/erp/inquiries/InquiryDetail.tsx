import { useState } from 'react';
import { toast } from 'react-toastify';
import { inquiryApi, type Inquiry } from './inquiryApi';
import { FF, OG, STATUS_BADGE, PRIORITY_BADGE, Badge } from './Inquiries';

interface Props {
  inquiry: Inquiry;
  onClose: () => void;
  onSaved: (updated: Inquiry) => void;
}

const fieldLabel: React.CSSProperties = { display: 'block', fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: FF };
const sectionTitle: React.CSSProperties = { fontFamily: FF, fontSize: 13, fontWeight: 800, color: '#141413', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={fieldLabel}>{label}</div>
      <div style={{ fontSize: 13.5, color: '#1A1A1A', fontFamily: FF }}>{value || '—'}</div>
    </div>
  );
}

const STATUS_ORDER = ['new', 'reviewed', 'replied', 'closed'] as const;
const PRIORITY_ORDER = ['low', 'medium', 'high'] as const;

export default function InquiryDetail({ inquiry, onClose, onSaved }: Props) {
  const [notes, setNotes] = useState(inquiry.notes || '');
  const [saving, setSaving] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  const update = async (data: Partial<Inquiry>, msg?: string) => {
    setSaving(true);
    try {
      const updated = await inquiryApi.update(inquiry.id, data);
      if (msg) toast.success(msg);
      onSaved(updated);
    } catch (e: any) {
      toast.error(e.message || 'Could not update inquiry');
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const updated = await inquiryApi.update(inquiry.id, { notes });
      toast.success('Notes saved');
      onSaved(updated);
    } catch (e: any) {
      toast.error(e.message || 'Could not save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(inquiry.email)
      .then(() => toast.success('Email copied'))
      .catch(() => toast.error('Could not copy email'));
  };

  const hasErpFields = !!(inquiry.plan_interest || inquiry.team_size || inquiry.timeline || inquiry.budget_range || inquiry.budget_currency);

  const timeline: { label: string; date: string }[] = [
    { label: 'Inquiry received', date: inquiry.created_at },
    ...(inquiry.updated_at && inquiry.updated_at !== inquiry.created_at
      ? [{ label: `Status set to ${STATUS_BADGE[inquiry.status]?.label || inquiry.status}${inquiry.assigned_to_name ? ` by ${inquiry.assigned_to_name}` : ''}`, date: inquiry.updated_at }]
      : []),
    ...(inquiry.replied_at ? [{ label: inquiry.assigned_to_name ? `Replied by ${inquiry.assigned_to_name}` : 'Replied', date: inquiry.replied_at }] : []),
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflow: 'auto' }} onClick={onClose}>
      <style>{`
        @media (max-width: 860px) {
          .inq-detail-grid { grid-template-columns: 1fr !important; }
          .inq-detail-right { border-left: none !important; border-top: 1px solid rgba(0,0,0,0.06); }
        }
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, width: '100%', maxWidth: 1080, maxHeight: '92vh',
          display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: FF, overflow: 'hidden',
        }}
      >
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#141413' }}>{inquiry.full_name}</h3>
            <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
              <Badge value={inquiry.status} map={STATUS_BADGE} />
              <Badge value={inquiry.priority} map={PRIORITY_BADGE} />
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#666', width: 32, height: 32 }}>&times;</button>
        </div>

        <div className="inq-detail-grid" style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr' }}>
          {/* LEFT — info */}
          <div style={{ padding: '22px 28px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={sectionTitle}><i className="fas fa-user" style={{ color: OG, fontSize: 12 }} /> Contact Details</div>
            <div className="row g-2" style={{ marginBottom: 22 }}>
              <div className="col-6"><Row label="Full Name" value={inquiry.full_name} /></div>
              <div className="col-6"><Row label="Email" value={<a href={`mailto:${inquiry.email}`} style={{ color: OG, textDecoration: 'none' }}>{inquiry.email}</a>} /></div>
              <div className="col-6"><Row label="Phone" value={inquiry.phone ? <a href={`tel:${inquiry.phone}`} style={{ color: OG, textDecoration: 'none' }}>{inquiry.phone}</a> : null} /></div>
              <div className="col-6"><Row label="Company Name" value={inquiry.company} /></div>
              <div className="col-6"><Row label="Country" value={inquiry.country} /></div>
            </div>

            <div style={sectionTitle}><i className="fas fa-comment-alt" style={{ color: OG, fontSize: 12 }} /> Enquiry Details</div>
            <div className="row g-2" style={{ marginBottom: 14 }}>
              <div className="col-6"><Row label="Industry" value={inquiry.industry} /></div>
              <div className="col-6"><Row label="Service of Interest" value={inquiry.service} /></div>
              <div className="col-12"><Row label="Current Challenge" value={inquiry.current_challenge} /></div>
              <div className="col-6"><Row label="Date Submitted" value={new Date(inquiry.created_at).toLocaleString()} /></div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <div style={fieldLabel}>Message</div>
              <div style={{ background: '#fafaf8', border: '1px solid #F0EBE4', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#333', lineHeight: 1.65, whiteSpace: 'pre-wrap', marginTop: 6 }}>
                {inquiry.message}
              </div>
            </div>

            {hasErpFields && (
              <>
                <div style={sectionTitle}><i className="fas fa-layer-group" style={{ color: OG, fontSize: 12 }} /> ERP Requirements</div>
                <div className="row g-2">
                  <div className="col-6"><Row label="Plan Interest" value={inquiry.plan_interest} /></div>
                  <div className="col-6"><Row label="Team Size" value={inquiry.team_size} /></div>
                  <div className="col-6"><Row label="Timeline" value={inquiry.timeline} /></div>
                  <div className="col-6"><Row label="Budget Range" value={inquiry.budget_range} /></div>
                  <div className="col-6"><Row label="Budget Currency" value={inquiry.budget_currency} /></div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT — actions */}
          <div className="inq-detail-right" style={{ padding: '22px 24px', background: '#fafaf8', overflowY: 'auto' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={fieldLabel}>Status</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {STATUS_ORDER.map(s => (
                  <button
                    key={s} disabled={saving} onClick={() => update({ status: s }, `Marked as ${STATUS_BADGE[s].label}`)}
                    style={{
                      padding: '6px 13px', borderRadius: 20, fontFamily: FF, fontSize: 11.5, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
                      border: `1.5px solid ${inquiry.status === s ? STATUS_BADGE[s].color : 'rgba(0,0,0,0.12)'}`,
                      background: inquiry.status === s ? STATUS_BADGE[s].bg : '#fff',
                      color: inquiry.status === s ? STATUS_BADGE[s].color : '#5a5650',
                    }}
                  >
                    {STATUS_BADGE[s].label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={fieldLabel}>Priority</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {PRIORITY_ORDER.map(p => (
                  <button
                    key={p} disabled={saving} onClick={() => update({ priority: p }, `Priority set to ${PRIORITY_BADGE[p].label}`)}
                    style={{
                      padding: '6px 13px', borderRadius: 20, fontFamily: FF, fontSize: 11.5, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
                      border: `1.5px solid ${inquiry.priority === p ? PRIORITY_BADGE[p].color : 'rgba(0,0,0,0.12)'}`,
                      background: inquiry.priority === p ? PRIORITY_BADGE[p].bg : '#fff',
                      color: inquiry.priority === p ? PRIORITY_BADGE[p].color : '#5a5650',
                    }}
                  >
                    {PRIORITY_BADGE[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={fieldLabel}>Internal Notes</div>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                placeholder="Internal notes about this inquiry…"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontFamily: FF, fontSize: 13, outline: 'none', resize: 'vertical', marginTop: 6 }}
              />
              <button
                onClick={saveNotes} disabled={savingNotes}
                style={{
                  marginTop: 8, background: 'linear-gradient(145deg,#e8a84e,#C9883A)', border: 'none', borderRadius: 8, padding: '8px 16px',
                  color: '#fff', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: savingNotes ? 'wait' : 'pointer',
                }}
              >
                {savingNotes ? 'Saving…' : 'Save Notes'}
              </button>
              {inquiry.notes && (
                <div style={{ marginTop: 10 }}>
                  <div style={fieldLabel}>Previous Notes</div>
                  <div style={{ fontSize: 12.5, color: '#5a5650', background: '#fff', border: '1px solid #F0EBE4', borderRadius: 8, padding: '10px 12px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {inquiry.notes}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={fieldLabel}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <a
                  href={`mailto:${inquiry.email}?subject=${encodeURIComponent('Re: Your XERXEZ Inquiry')}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none',
                    background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', fontFamily: FF, fontWeight: 700, fontSize: 12.5,
                    padding: '9px 14px', borderRadius: 8,
                  }}
                >
                  <i className="fas fa-paper-plane" style={{ fontSize: 11 }} /> Send Email Reply
                </a>
                <button
                  onClick={copyEmail}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#fff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, padding: '9px 14px',
                    color: '#5a5650', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                  }}
                >
                  <i className="far fa-copy" style={{ fontSize: 11 }} /> Copy Email
                </button>
                <button
                  onClick={() => update({ status: 'replied' }, 'Marked as Replied')} disabled={saving}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 8, padding: '9px 14px',
                    color: '#16a34a', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: saving ? 'wait' : 'pointer',
                  }}
                >
                  <i className="fas fa-check" style={{ fontSize: 11 }} /> Mark as Replied
                </button>
              </div>
            </div>

            <div>
              <div style={fieldLabel}>Timeline</div>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {timeline.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 9 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: OG, marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12.5, color: '#141413', fontFamily: FF, fontWeight: 600 }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: '#9b9690', fontFamily: FF }}>{new Date(t.date).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
