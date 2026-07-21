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
