import { fmtINR } from './invoicingShared';

/** Generates and downloads a simple one-page invoice PDF. jsPDF is loaded on demand
 *  to keep it out of the main ERP bundle — it's only needed when a user actually exports. */
export async function downloadInvoicePDF(inv: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const left = 18;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('XERXEZ', left, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice', 190, y, { align: 'right' });
  y += 10;
  doc.setDrawColor(201, 136, 58);
  doc.setLineWidth(0.6);
  doc.line(left, y, 192, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Invoice #: ${inv.number ?? '—'}`, left, y);
  doc.text(`Issue Date: ${inv.issue_date ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Customer: ${inv.customer_name ?? '—'}`, left, y);
  doc.text(`Due Date: ${inv.due_date ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Status: ${(inv.status ?? '').toUpperCase()}`, left, y);
  y += 12;

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
  const items: any[] = inv.items ?? [];
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
  doc.text(fmtINR(inv.subtotal).replace('₹', ''), 190, y, { align: 'right' });
  y += 6;
  doc.text('Tax (18% GST)', 155, y, { align: 'right' });
  doc.text(fmtINR(inv.tax).replace('₹', ''), 190, y, { align: 'right' });
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total', 155, y, { align: 'right' });
  doc.text(fmtINR(inv.total).replace('₹', ''), 190, y, { align: 'right' });
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Amount Paid', 155, y, { align: 'right' });
  doc.text(fmtINR(inv.amount_paid).replace('₹', ''), 190, y, { align: 'right' });
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Balance Due', 155, y, { align: 'right' });
  doc.text(fmtINR(inv.balance ?? (Number(inv.total || 0) - Number(inv.amount_paid || 0))).replace('₹', ''), 190, y, { align: 'right' });

  if (inv.notes) {
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Notes:', left, y);
    y += 5;
    doc.text(String(inv.notes), left, y, { maxWidth: 174 });
  }

  doc.save(`${inv.number || 'invoice'}.pdf`);
}
