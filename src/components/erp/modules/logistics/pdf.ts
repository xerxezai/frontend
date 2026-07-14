/** Generates and downloads a simple one-page shipment slip PDF. jsPDF is loaded on demand
 *  to keep it out of the main ERP bundle — it's only needed when a user actually exports. */
export async function downloadShipmentPDF(shipment: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const left = 18;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('XERXEZ', left, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Shipment Slip', 190, y, { align: 'right' });
  y += 10;
  doc.setDrawColor(201, 136, 58);
  doc.setLineWidth(0.6);
  doc.line(left, y, 192, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Shipment #: ${shipment.shipment_number ?? '—'}`, left, y);
  doc.text(`Tracking #: ${shipment.tracking_number ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Customer: ${shipment.customer_name ?? '—'}`, left, y);
  doc.text(`Carrier: ${shipment.carrier ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Origin: ${shipment.origin ?? '—'}`, left, y);
  doc.text(`Destination: ${shipment.destination ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Estimated Delivery: ${shipment.estimated_delivery ?? '—'}`, left, y);
  doc.text(`Actual Delivery: ${shipment.actual_delivery ?? '—'}`, 130, y);
  y += 7;
  doc.text(`Status: ${(shipment.status ?? '').toUpperCase().replace(/_/g, ' ')}`, left, y);
  y += 12;

  if (shipment.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Notes:', left, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(String(shipment.notes), left, y, { maxWidth: 174 });
    y += 12;
  }

  const updates: any[] = shipment.tracking_updates ?? [];
  if (updates.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Tracking History', left, y);
    y += 3;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(left, y, 192, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    updates.forEach(u => {
      if (y > 270) { doc.addPage(); y = 20; }
      const when = u.occurred_at ? new Date(u.occurred_at).toLocaleString() : '—';
      doc.text(`${when} — ${String(u.status).toUpperCase().replace(/_/g, ' ')}${u.location ? ` (${u.location})` : ''}`, left, y, { maxWidth: 174 });
      y += 7;
    });
  }

  doc.save(`${shipment.shipment_number || 'shipment'}.pdf`);
}
