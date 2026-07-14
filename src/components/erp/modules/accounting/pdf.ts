import { fmtINR } from './accountingShared';

/** Generates and downloads a simple one-page GST tax report summary PDF. jsPDF is loaded on
 *  demand to keep it out of the main ERP bundle — it's only needed when a user actually exports. */
export async function downloadTaxReportPDF(report: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const left = 18;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('XERXEZ', left, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Tax Report', 190, y, { align: 'right' });
  y += 10;
  doc.setDrawColor(201, 136, 58);
  doc.setLineWidth(0.6);
  doc.line(left, y, 192, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Period: ${report.period ?? '—'}`, left, y);
  y += 14;

  const rows: [string, string][] = [
    ['Total Revenue', fmtINR(report.total_revenue)],
    ['Total Tax Collected', fmtINR(report.total_tax_collected)],
    ['Total Tax Paid', fmtINR(report.total_tax_paid)],
    ['Net Tax', fmtINR(report.net_tax)],
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Metric', left, y);
  doc.text('Value', 190, y, { align: 'right' });
  y += 3;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(left, y, 192, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  rows.forEach(([label, value]) => {
    doc.text(label, left, y);
    doc.text(value.replace('₹', ''), 190, y, { align: 'right' });
    y += 9;
  });

  doc.save(`tax-report-${report.period || 'summary'}.pdf`);
}

/** Generates and downloads a simple one-page balance sheet PDF (Assets / Liabilities / Equity). */
export async function downloadBalanceSheetPDF(sheet: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const left = 18;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('XERXEZ', left, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Balance Sheet', 190, y, { align: 'right' });
  y += 10;
  doc.setDrawColor(201, 136, 58);
  doc.setLineWidth(0.6);
  doc.line(left, y, 192, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`As of: ${sheet.as_of_date ?? '—'}`, left, y);
  y += 14;

  const section = (title: string, rows: [string, string][]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, left, y);
    y += 3;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(left, y, 192, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    rows.forEach(([label, value]) => {
      doc.text(label, left, y);
      doc.text(value.replace('₹', ''), 190, y, { align: 'right' });
      y += 8;
    });
    y += 8;
  };

  section('Assets', [
    ['Accounts Receivable', fmtINR(sheet.assets?.accounts_receivable)],
    ['Cash & Bank', fmtINR(sheet.assets?.cash_and_bank)],
    ['Total Assets', fmtINR(sheet.assets?.total_assets)],
  ]);
  section('Liabilities', [
    ['Accounts Payable', fmtINR(sheet.liabilities?.accounts_payable)],
    ['Total Liabilities', fmtINR(sheet.liabilities?.total_liabilities)],
  ]);
  section('Equity', [
    ['Retained Earnings', fmtINR(sheet.equity?.retained_earnings)],
    ['Total Equity', fmtINR(sheet.equity?.total_equity)],
  ]);

  doc.save(`balance-sheet-${sheet.as_of_date || 'summary'}.pdf`);
}
