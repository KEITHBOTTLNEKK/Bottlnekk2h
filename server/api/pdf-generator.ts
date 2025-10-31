import PDFDocument from 'pdfkit';
import type { DiagnosticResult } from '@shared/schema';

interface BookingData {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

function formatCallbackTime(minutes: number | null): string {
  if (minutes === null) return "N/A";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

export async function generateDiagnosticPDF(
  booking: BookingData,
  diagnostic: DiagnosticResult
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'LETTER',
        margin: 0,
        autoFirstPage: false
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add exactly ONE page
      doc.addPage();

      const monthlyLoss = diagnostic.totalLoss;
      const annualLoss = monthlyLoss * 12;
      const dailyLoss = Math.round(monthlyLoss / 30);
      const totalInbound = diagnostic.totalInboundCalls ?? 0;
      const accepted = diagnostic.acceptedCalls ?? 0;
      const potentialBudget = Math.round(accepted * diagnostic.avgRevenuePerCall * 0.30);
      const answerRate = totalInbound > 0 ? Math.round((accepted / totalInbound) * 100) : 0;
      const afterHoursPercentage = diagnostic.missedCalls > 0 ? Math.round((diagnostic.afterHoursCalls / diagnostic.missedCalls) * 100) : 0;
      const afterHoursRevenue = diagnostic.afterHoursCalls * diagnostic.avgRevenuePerCall;
      const callbackTime = formatCallbackTime(diagnostic.avgCallbackTimeMinutes ?? null);

      // HEADER
      doc.rect(0, 0, 612, 80).fill('#000000');
      doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold');
      doc.text('Revenue Recovery Intelligence Report', 50, 28, { width: 512 });
      doc.fontSize(11).fillColor('#cccccc').font('Helvetica');
      doc.text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 50, 58, { width: 512 });

      // LEAD INFO
      const companyName = diagnostic.companyName || booking.company || 'Not provided';
      const industry = diagnostic.industry || 'Home Services';
      
      doc.rect(40, 95, 532, 75).fillAndStroke('#f8f9fa', '#e0e0e0');
      doc.fontSize(11).fillColor('#00C97B').font('Helvetica-Bold');
      doc.text('LEAD INFORMATION', 50, 103, { width: 512 });
      
      doc.fontSize(8).fillColor('#666666').font('Helvetica');
      doc.text('CONTACT', 50, 122, { width: 240 });
      doc.fontSize(11).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text(booking.name, 50, 133, { width: 240 });
      
      doc.fontSize(8).fillColor('#666666').font('Helvetica');
      doc.text('EMAIL', 310, 122, { width: 252 });
      doc.fontSize(11).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text(booking.email, 310, 133, { width: 252 });
      
      doc.fontSize(8).fillColor('#666666').font('Helvetica');
      doc.text('PHONE', 50, 150, { width: 240 });
      doc.fontSize(11).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text(booking.phone, 50, 161, { width: 240 });
      
      doc.fontSize(8).fillColor('#666666').font('Helvetica');
      doc.text('COMPANY / INDUSTRY', 310, 150, { width: 252 });
      doc.fontSize(11).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text(`${companyName} • ${industry}`, 310, 161, { width: 252 });

      // HERO - ANNUAL REVENUE LEAK (Bottlnekk Green)
      doc.rect(40, 185, 532, 85).lineWidth(2).fillAndStroke('#e6f9f2', '#00C97B');
      doc.fontSize(11).fillColor('#00A565').font('Helvetica-Bold');
      doc.text('ANNUAL REVENUE LEAK', 50, 195, { width: 512, align: 'center' });
      doc.fontSize(40).fillColor('#008558').font('Helvetica-Bold');
      doc.text(`$${annualLoss.toLocaleString()}`, 50, 215, { width: 512, align: 'center' });
      doc.fontSize(11).fillColor('#00A565').font('Helvetica');
      doc.text(`${diagnostic.missedCalls} missed calls/month bleeding revenue`, 50, 253, { width: 512, align: 'center' });

      // MONTHLY LOSS DETAILS
      doc.rect(40, 285, 532, 52).fillAndStroke('#f8f9fa', '#dee2e6');
      doc.fontSize(9).fillColor('#666666').font('Helvetica-Bold');
      doc.text('MONTHLY LOSS DETAILS', 50, 294, { width: 512, align: 'center' });
      doc.fontSize(11).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text(`$${monthlyLoss.toLocaleString()}/month bleeding`, 50, 310, { width: 512, align: 'center' });
      doc.fontSize(10).fillColor('#666666').font('Helvetica');
      doc.text(`≈ $${dailyLoss.toLocaleString()}/day disappearing`, 50, 325, { width: 512, align: 'center' });

      // POTENTIAL BUDGET (Internal Use Only)
      doc.rect(40, 352, 532, 60).fillAndStroke('#fff3e0', '#ff9800');
      doc.fontSize(11).fillColor('#e65100').font('Helvetica-Bold');
      doc.text('POTENTIAL BUDGET', 50, 362, { width: 512, align: 'center' });
      doc.fontSize(9).fillColor('#bf360c').font('Helvetica-Bold');
      doc.text('(Internal Use Only - Never Mention to Client)', 50, 377, { width: 512, align: 'center' });
      doc.fontSize(32).fillColor('#e65100').font('Helvetica-Bold');
      doc.text(`$${potentialBudget.toLocaleString()}`, 50, 392, { width: 512, align: 'center' });

      // AFTER-HOURS OPPORTUNITY (if applicable)
      let afterHoursBoxHeight = 0;
      if (diagnostic.afterHoursCalls > 0) {
        afterHoursBoxHeight = 62;
        doc.rect(40, 427, 532, afterHoursBoxHeight).fillAndStroke('#fff9e6', '#ffa726');
        doc.fontSize(11).fillColor('#e65100').font('Helvetica-Bold');
        doc.text('AFTER-HOURS OPPORTUNITY', 50, 436, { width: 512 });
        doc.fontSize(9).fillColor('#3e2723').font('Helvetica');
        doc.text(`${diagnostic.afterHoursCalls} of the ${diagnostic.missedCalls} missed calls came after business hours (nights/weekends) = $${afterHoursRevenue.toLocaleString()} in lost revenue.`, 50, 452, { width: 512, lineGap: 1 });
        doc.fontSize(9).fillColor('#e65100').font('Helvetica-Bold');
        doc.text(`AI answering service works 24/7 and books appointments regardless of time or day.`, 50, 469, { width: 512, lineGap: 1 });
      }

      // ANALYTICS HEADER
      const analyticsY = 427 + afterHoursBoxHeight + 15;
      doc.fontSize(14).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text('30-Day Call Analytics', 50, analyticsY, { width: 512 });
      doc.moveTo(50, analyticsY + 18).lineTo(562, analyticsY + 18).lineWidth(1).stroke('#e0e0e0');
      doc.fontSize(10).fillColor('#666666').font('Helvetica');
      doc.text(`${diagnostic.provider} • ${diagnostic.month}`, 50, analyticsY + 22, { width: 512 });

      // METRICS GRID (3x2)
      const metrics = [
        { label: 'REVENUE LOSS', value: `$${(diagnostic.totalLoss / 1000).toFixed(1)}k`, unit: 'unanswered' },
        { label: 'MISSED CALLS', value: `${diagnostic.missedCalls}`, unit: `of ${totalInbound}` },
        { label: 'AFTER-HOURS', value: `${diagnostic.afterHoursCalls}`, unit: 'late calls' },
        { label: 'ANSWER RATE', value: `${answerRate}%`, unit: `${accepted} answered` },
        { label: 'AVG VALUE', value: `$${diagnostic.avgRevenuePerCall}`, unit: 'per call' },
        { label: 'CALLBACK', value: callbackTime, unit: 'response' },
      ];

      const startY = analyticsY + 45;
      for (let i = 0; i < 6; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 50 + (col * 174);
        const y = startY + (row * 65);
        
        doc.rect(x, y, 164, 58).lineWidth(1).fillAndStroke('#ffffff', '#e0e0e0');
        doc.fontSize(8).fillColor('#666666').font('Helvetica-Bold');
        doc.text(metrics[i].label, x + 8, y + 10, { width: 148, align: 'center' });
        doc.fontSize(20).fillColor('#1a1a1a').font('Helvetica-Bold');
        doc.text(metrics[i].value, x + 8, y + 23, { width: 148, align: 'center' });
        doc.fontSize(8).fillColor('#666666').font('Helvetica');
        doc.text(metrics[i].unit, x + 8, y + 45, { width: 148, align: 'center' });
      }

      // FOOTER
      doc.fontSize(10).fillColor('#000000').font('Helvetica-Bold');
      doc.text('Revenue Leak Diagnostic Tool', 50, 730, { width: 512, align: 'center' });
      doc.fontSize(9).fillColor('#666666').font('Helvetica');
      doc.text(`${diagnostic.provider} • 30-day analysis`, 50, 744, { width: 512, align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
