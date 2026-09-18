/** Generates and downloads a landscape "Certificate of Completion" PDF —
 * same on-demand-import pattern as the ERP payslip/invoice PDFs (jsPDF loaded
 * only when a student actually clicks Download, kept out of the main bundle). */
export async function downloadCertificatePDF(
  cert: { course_title: string; issued_at: string; id: number | string },
  studentName: string,
) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Outer + inner decorative border
  doc.setDrawColor(217, 53, 34);
  doc.setLineWidth(1.2);
  doc.rect(8, 8, w - 16, h - 16);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, w - 24, h - 24);

  doc.setTextColor(7, 26, 51);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('XERXEZ ACADEMY', w / 2, 32, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(217, 53, 34);
  doc.text('CERTIFICATE OF COMPLETION', w / 2, 42, { align: 'center' });

  doc.setTextColor(90, 90, 90);
  doc.setFontSize(11);
  doc.text('This certifies that', w / 2, 62, { align: 'center' });

  doc.setTextColor(7, 26, 51);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(studentName, w / 2, 78, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(11);
  doc.text('has successfully completed the course', w / 2, 90, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(7, 26, 51);
  doc.setFontSize(17);
  doc.text(cert.course_title, w / 2, 102, { align: 'center' });

  const issued = new Date(cert.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(10);
  doc.text(`Issued on ${issued}`, w / 2, 114, { align: 'center' });
  doc.text(`Certificate ID: XZ-CERT-${cert.id}`, w / 2, h - 20, { align: 'center' });

  doc.save(`XERXEZ-Certificate-${cert.course_title.replace(/[^a-z0-9]+/gi, '-')}.pdf`);
}
