import { fmtINR } from './procurementShared';

/** Generates and downloads a simple one-page purchase order PDF. jsPDF is loaded on demand
 *  to keep it out of the main ERP bundle — it's only needed when a user actually exports. */
export async function downloadPurchaseOrderPDF(po: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const left = 18;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('XERXEZ', left, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Purchase Order', 190, y, { align: 'right' });
  y += 10;
  doc.setDrawColor(201, 136, 58);
  doc.setLineWidth(0.6);
  doc.line(left, y, 192, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`PO #: ${po.po_number ?? '—'}`, left, y);
  doc.text(`Order Date: ${po.order_date ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Supplier: ${po.supplier_name ?? '—'}`, left, y);
  doc.text(`Expected Delivery: ${po.expected_delivery ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Status: ${(po.status ?? '').toUpperCase()}`, left, y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Product', left, y);
  doc.text('Qty', 120, y, { align: 'right' });
  doc.text('Unit Price', 155, y, { align: 'right' });
  doc.text('Total', 190, y, { align: 'right' });
  y += 3;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(left, y, 192, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  const items: any[] = po.items ?? [];
  if (items.length === 0) {
    doc.setTextColor(140, 140, 140);
    doc.text('No line items.', left, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
  } else {
    items.forEach(it => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.text(String(it.product_name || '—'), left, y, { maxWidth: 90 });
      doc.text(String(it.quantity), 120, y, { align: 'right' });
      doc.text(fmtINR(it.unit_price).replace('₹', ''), 155, y, { align: 'right' });
      doc.text(fmtINR(it.total).replace('₹', ''), 190, y, { align: 'right' });
      y += 7;
    });
  }

  y += 4;
  doc.line(120, y, 192, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total', 155, y, { align: 'right' });
  doc.text(fmtINR(po.total).replace('₹', ''), 190, y, { align: 'right' });

  if (po.notes) {
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Notes:', left, y);
    y += 5;
    doc.text(String(po.notes), left, y, { maxWidth: 174 });
  }

  doc.save(`${po.po_number || 'purchase-order'}.pdf`);
}
