import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, OG } from './assetsShared';

export default function QRCodeDisplay({ asset, onGenerated }: { asset: any; onGenerated: () => void }) {
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      await erpFetch(`asset-management/assets/${asset.id}/generate-qr/`, { method: 'POST', body: JSON.stringify({}) });
      toast.success('QR code generated');
      onGenerated();
    } catch (err: any) { toast.error(err.message || 'Could not generate QR code'); }
    finally { setGenerating(false); }
  };

  const print = () => {
    if (!asset.qr_code_image_url) return;
    const win = window.open('', '_blank', 'width=400,height=500');
    if (!win) return;
    win.document.write(`
      <html><head><title>${asset.asset_code}</title></head>
      <body style="text-align:center;font-family:sans-serif;padding:40px;">
        <img src="${asset.qr_code_image_url}" style="width:220px;height:220px;" />
        <div style="margin-top:12px;font-weight:700;">${asset.asset_code}</div>
        <div style="color:#666;">${asset.name}</div>
      </body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const download = () => {
    if (!asset.qr_code_image_url) return;
    const a = document.createElement('a');
    a.href = asset.qr_code_image_url;
    a.download = `${asset.asset_code}-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      {asset.qr_code_image_url ? (
        <>
          <img src={asset.qr_code_image_url} alt={`QR code for ${asset.asset_code}`} style={{ width: 220, height: 220, borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', padding: 12, background: '#fff' }} />
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 14, color: '#1A1A1A', marginTop: 14 }}>{asset.asset_code}</div>
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', marginBottom: 18 }}>{asset.name}</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={print} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
              <i className="fas fa-print" style={{ marginRight: 6 }} />Print QR
            </button>
            <button onClick={download} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
              <i className="fas fa-download" style={{ marginRight: 6 }} />Download QR
            </button>
            <button onClick={generate} disabled={generating} style={{ background: 'none', border: 'none', color: OG, fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: generating ? 'wait' : 'pointer' }}>
              {generating ? 'Regenerating…' : 'Regenerate'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ width: 220, height: 220, margin: '0 auto', borderRadius: 12, border: '2px dashed rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F7F4' }}>
            <i className="fas fa-qrcode" style={{ fontSize: 48, color: '#d1cec7' }} />
          </div>
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', margin: '14px 0 18px' }}>No QR code generated yet for {asset.asset_code}.</div>
          <button onClick={generate} disabled={generating} style={{ background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 20px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: generating ? 'wait' : 'pointer' }}>
            <i className={`fas ${generating ? 'fa-spinner fa-spin' : 'fa-qrcode'}`} style={{ marginRight: 8 }} />{generating ? 'Generating…' : 'Generate QR'}
          </button>
        </>
      )}
    </div>
  );
}
