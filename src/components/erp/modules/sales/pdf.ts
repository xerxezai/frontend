import { fmtINR } from './salesShared';

/** Generates and downloads a simple one-page quotation PDF. jsPDF is loaded on demand
 *  to keep it out of the main ERP bundle — it's only needed when a user actually exports. */
export async function downloadQuotationPDF(q: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const left = 18;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('XERXEZ', left, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Quotation', 190, y, { align: 'right' });
  y += 10;
  doc.setDrawColor(201, 136, 58);
  doc.setLineWidth(0.6);
  doc.line(left, y, 192, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Quotation #: ${q.number ?? '—'}`, left, y);
  doc.text(`Issue Date: ${q.issue_date ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Customer: ${q.customer_name ?? '—'}`, left, y);
  doc.text(`Valid Until: ${q.valid_until ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Status: ${(q.status ?? '').toUpperCase()}`, left, y);
  y += 12;

  // items table header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', left, y);
  doc.text('Qty', 120, y, { align: 'right' });
  doc.text('Unit Price', 155, y, { align: 'right' });
  doc.text('Line Total', 190, y, { align: 'right' });
  y += 3;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(left, y, 192, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  const items: any[] = q.items ?? [];
  if (items.length === 0) {
    doc.setTextColor(140, 140, 140);
    doc.text('No line items.', left, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
  } else {
    items.forEach(it => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(String(it.description || it.product_name || '—'), left, y, { maxWidth: 90 });
      doc.text(String(it.quantity), 120, y, { align: 'right' });
      doc.text(fmtINR(it.unit_price).replace('₹', ''), 155, y, { align: 'right' });
      doc.text(fmtINR(it.line_total).replace('₹', ''), 190, y, { align: 'right' });
      y += 7;
    });
  }

  y += 4;
  doc.line(120, y, 192, y);
  y += 7;
  doc.text('Subtotal', 155, y, { align: 'right' });
  doc.text(fmtINR(q.subtotal).replace('₹', ''), 190, y, { align: 'right' });
  y += 6;
  doc.text('GST (18%)', 155, y, { align: 'right' });
  doc.text(fmtINR(q.tax).replace('₹', ''), 190, y, { align: 'right' });
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total', 155, y, { align: 'right' });
  doc.text(fmtINR(q.total).replace('₹', ''), 190, y, { align: 'right' });

  if (q.notes) {
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Notes:', left, y);
    y += 5;
    doc.text(String(q.notes), left, y, { maxWidth: 174 });
  }

  doc.save(`${q.number || 'quotation'}.pdf`);
}

/** Exports an array of quotation rows to a CSV file. */
export function exportQuotationsCSV(rows: any[]) {
  const headers = ['Number', 'Customer', 'Issue Date', 'Valid Until', 'Status', 'Subtotal', 'Tax', 'Total'];
  const lines = [headers.join(',')];
  rows.forEach(r => {
    const cells = [
      r.number, r.customer_name, r.issue_date, r.valid_until || '', r.status, r.subtotal, r.tax, r.total,
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`);
    lines.push(cells.join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quotations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
