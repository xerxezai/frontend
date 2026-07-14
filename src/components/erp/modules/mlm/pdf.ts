import { fmtINR } from './mlmShared';

interface ReportData {
  periodLabel: string;
  buckets: { label: string; total: number }[];
  topPerformers: { name: string; distributor_id: string; level: number; total_earnings: number }[];
  commissionByLevel: { level: number; total: number }[];
}

/** Generates and downloads a simple one-page MLM commission report PDF. jsPDF is loaded on
 *  demand to keep it out of the main ERP bundle — it's only needed when a user actually exports. */
export async function downloadMLMReportPDF(report: ReportData) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const left = 18;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('XERXEZ', left, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('MLM Commission Report', 190, y, { align: 'right' });
  y += 10;
  doc.setDrawColor(201, 136, 58);
  doc.setLineWidth(0.6);
  doc.line(left, y, 192, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Period: ${report.periodLabel}`, left, y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Commission by Period', left, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  report.buckets.forEach(b => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.text(b.label, left, y);
    doc.text(fmtINR(b.total).replace('₹', ''), 190, y, { align: 'right' });
    y += 6;
  });

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Commission by Level', left, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  report.commissionByLevel.forEach(l => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.text(`Level ${l.level}`, left, y);
    doc.text(fmtINR(l.total).replace('₹', ''), 190, y, { align: 'right' });
    y += 6;
  });

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Top Performers', left, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  if (report.topPerformers.length === 0) {
    doc.setTextColor(140, 140, 140);
    doc.text('No performer data.', left, y);
    doc.setTextColor(0, 0, 0);
    y += 6;
  } else {
    report.topPerformers.forEach(p => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(`${p.name} (${p.distributor_id}) — Level ${p.level}`, left, y);
      doc.text(fmtINR(p.total_earnings).replace('₹', ''), 190, y, { align: 'right' });
      y += 6;
    });
  }

  doc.save(`mlm-report-${report.periodLabel.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
