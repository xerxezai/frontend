import { useState, useMemo } from 'react';
import { Star, Plus, Trash2, Award, History } from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import {
  Card3D, SlidePanel, Skeleton, PageHead, EmptyState,
  OG, DARK, FF, inp, lbl, btnPrimary, btnGhost, initials,
} from './hrShared';

interface Review {
  id: number; employee: number; employee_name: string;
  period: string; rating: number; reviewer_username: string | null;
  goals_achieved: string; areas_improvement: string; comments: string; review_date: string;
}

const ratingColor = (r: number) => r >= 5 ? '#10b981' : r === 4 ? '#3b82f6' : r === 3 ? OG : '#ef4444';

const Stars = ({ value, size = 13, onChange }: { value: number; size?: number; onChange?: (n: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n} size={size}
          color={ratingColor(value || 3)}
          fill={n <= (hover || value) ? ratingColor(value || 3) : 'none'}
          onClick={onChange ? () => onChange(n) : undefined}
          onMouseEnter={onChange ? () => setHover(n) : undefined}
          onMouseLeave={onChange ? () => setHover(0) : undefined}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
        />
      ))}
    </span>
  );
};

export default function HRPerformancePage() {
  const { userRole } = useAccess();
  const isRegularUser = userRole === 'regular_user';
  const reviews = useERPList<Review>('hr/reviews/');
  const employees = useERPList<any>('hr/employees/');
  const [showAdd, setShowAdd] = useState(false);
  const [historyEmp, setHistoryEmp] = useState<{ id: number; name: string } | null>(null);
  const [form, setForm] = useState({ employee: '', period: '', rating: 0, goals_achieved: '', areas_improvement: '', comments: '' });
  const [saving, setSaving] = useState(false);

  const avgRating = useMemo(() => {
    if (!reviews.data.length) return 0;
    return reviews.data.reduce((s, r) => s + r.rating, 0) / reviews.data.length;
  }, [reviews.data]);

  const submit = async () => {
    if (!form.employee) { toast.error('Select an employee'); return; }
    if (!form.period.trim()) { toast.error('Period is required'); return; }
    if (!form.rating) { toast.error('Pick a star rating'); return; }
    setSaving(true);
    try {
      await erpFetch('hr/reviews/', { method: 'POST', body: JSON.stringify({ ...form, employee: Number(form.employee) }) });
      toast.success('Review added');
      setShowAdd(false);
      setForm({ employee: '', period: '', rating: 0, goals_achieved: '', areas_improvement: '', comments: '' });
      reviews.reload();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    try { await erpFetch(`hr/reviews/${id}/`, { method: 'DELETE' }); toast.success('Review deleted'); reviews.reload(); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
  };

  const empHistory = historyEmp ? reviews.data.filter(r => r.employee === historyEmp.id) : [];

  return (
    <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
      <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <PageHead
        title={isRegularUser ? 'My Performance' : 'Performance Reviews'}
        subtitle={isRegularUser ? 'Your ratings, goals and growth history' : 'Track ratings, goals and growth across the team'}
        action={!isRegularUser && <button style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 7 }} onClick={() => setShowAdd(true)}><Plus size={15} /> Add Review</button>}
      />

      {/* stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        <Card3D accent="#3b82f6" p="18px 20px">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Total Reviews</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#3b82f6', lineHeight: 1 }}>{reviews.data.length}</div>
        </Card3D>
        <Card3D accent={OG} p="18px 20px">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Average Rating</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: OG, lineHeight: 1 }}>{avgRating.toFixed(1)}</div>
            <Stars value={Math.round(avgRating)} size={14} />
          </div>
        </Card3D>
        <Card3D accent="#10b981" p="18px 20px">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Top Performers</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#10b981', lineHeight: 1 }}>{reviews.data.filter(r => r.rating >= 4).length}</div>
        </Card3D>
      </div>

      {/* table */}
      {reviews.loading ? (
        <div>{[0, 1, 2].map(i => <Skeleton key={i} h={54} />)}</div>
      ) : reviews.data.length === 0 ? (
        <EmptyState
          icon={Award}
          message={isRegularUser ? 'No performance reviews yet.' : "No reviews yet. Add your team's first performance review."}
          cta={!isRegularUser ? <button style={btnPrimary} onClick={() => setShowAdd(true)}>Add Review</button> : undefined}
        />
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#faf8f5', textAlign: 'left' }}>
                {['Employee', 'Period', 'Rating', 'Reviewer', 'Date', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B6B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.data.map(r => (
                <tr key={r.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '11px 16px' }}>
                    <button onClick={() => setHistoryEmp({ id: r.employee, name: r.employee_name })}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF }}>
                      <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', fontSize: 10.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials(r.employee_name)}</span>
                      <span style={{ fontWeight: 700, color: DARK }}>{r.employee_name}</span>
                    </button>
                  </td>
                  <td style={{ padding: '11px 16px', color: '#4b4b4b' }}>{r.period}</td>
                  <td style={{ padding: '11px 16px' }}><Stars value={r.rating} /></td>
                  <td style={{ padding: '11px 16px', color: '#6B6B6B' }}>{r.reviewer_username || '—'}</td>
                  <td style={{ padding: '11px 16px', color: '#9ca3af' }}>{r.review_date}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                    {!isRegularUser && (
                      <button onClick={() => del(r.id)} title="Delete" style={{ background: 'rgba(239,68,68,0.10)', border: 'none', borderRadius: 7, width: 28, height: 28, cursor: 'pointer', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={13} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* add review panel */}
      {showAdd && (
        <SlidePanel
          title="Add Performance Review" onClose={() => setShowAdd(false)}
          footer={<>
            <button style={{ ...btnGhost, flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</button>
            <button style={{ ...btnPrimary, flex: 2, opacity: saving ? 0.7 : 1 }} disabled={saving} onClick={submit}>{saving ? 'Saving…' : 'Save Review'}</button>
          </>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={lbl}>Employee *</label>
              <select style={inp} value={form.employee} onChange={e => setForm(f => ({ ...f, employee: e.target.value }))}>
                <option value="">— Select employee —</option>
                {employees.data.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Review Period *</label><input style={inp} value={form.period} placeholder="e.g. Q3 2026" onChange={e => setForm(f => ({ ...f, period: e.target.value }))} /></div>
            <div><label style={lbl}>Rating *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
                <span style={{ transform: 'scale(1.5)', transformOrigin: 'left' }}><Stars value={form.rating} size={16} onChange={n => setForm(f => ({ ...f, rating: n }))} /></span>
                {form.rating > 0 && <span style={{ fontSize: 12.5, fontWeight: 700, color: ratingColor(form.rating) }}>{['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][form.rating]}</span>}
              </div>
            </div>
            <div><label style={lbl}>Goals Achieved</label><textarea style={{ ...inp, resize: 'vertical', minHeight: 64 }} value={form.goals_achieved} onChange={e => setForm(f => ({ ...f, goals_achieved: e.target.value }))} /></div>
            <div><label style={lbl}>Areas for Improvement</label><textarea style={{ ...inp, resize: 'vertical', minHeight: 64 }} value={form.areas_improvement} onChange={e => setForm(f => ({ ...f, areas_improvement: e.target.value }))} /></div>
            <div><label style={lbl}>Comments</label><textarea style={{ ...inp, resize: 'vertical', minHeight: 64 }} value={form.comments} onChange={e => setForm(f => ({ ...f, comments: e.target.value }))} /></div>
          </div>
        </SlidePanel>
      )}

      {/* history panel */}
      {historyEmp && (
        <SlidePanel title={`${historyEmp.name} — Review History`} subtitle={`${empHistory.length} review${empHistory.length === 1 ? '' : 's'}`} onClose={() => setHistoryEmp(null)}>
          {empHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: 13 }}><History size={30} color="#d1d5db" style={{ margin: '0 auto 10px', display: 'block' }} />No reviews for this employee yet.</div>
          ) : (
            <div style={{ position: 'relative' }}>
              {empHistory.map((r, i) => (
                <div key={r.id} style={{ display: 'flex', gap: 14, paddingBottom: i < empHistory.length - 1 ? 20 : 0, position: 'relative' }}>
                  {i < empHistory.length - 1 && <div style={{ position: 'absolute', left: 13, top: 28, bottom: 0, width: 2, background: 'rgba(201,136,58,0.15)' }} />}
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${ratingColor(r.rating)}18`, border: `2px solid ${ratingColor(r.rating)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 800, color: ratingColor(r.rating) }}>{r.rating}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 700, color: DARK, fontSize: 13.5 }}>{r.period}</span>
                      <Stars value={r.rating} size={12} />
                    </div>
                    <div style={{ fontSize: 11.5, color: '#9ca3af', margin: '2px 0 8px' }}>{r.review_date} · by {r.reviewer_username || '—'}</div>
                    {r.goals_achieved && <p style={{ fontSize: 12.5, color: '#4b4b4b', margin: '0 0 6px', lineHeight: 1.55 }}><strong style={{ color: '#10b981' }}>Goals:</strong> {r.goals_achieved}</p>}
                    {r.areas_improvement && <p style={{ fontSize: 12.5, color: '#4b4b4b', margin: '0 0 6px', lineHeight: 1.55 }}><strong style={{ color: OG }}>Improve:</strong> {r.areas_improvement}</p>}
                    {r.comments && <p style={{ fontSize: 12.5, color: '#6B6B6B', margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>{r.comments}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SlidePanel>
      )}
    </div>
  );
}
