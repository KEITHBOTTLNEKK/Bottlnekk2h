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

      const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.60);
      const totalInbound = diagnostic.totalInboundCalls ?? 0;
      const accepted = diagnostic.acceptedCalls ?? 0;
      const answerRate = totalInbound > 0 ? Math.round((accepted / totalInbound) * 100) : 0;
      const afterHoursPercentage = diagnostic.missedCalls > 0 ? Math.round((diagnostic.afterHoursCalls / diagnostic.missedCalls) * 100) : 0;
      const afterHoursRevenue = diagnostic.afterHoursCalls * diagnostic.avgRevenuePerCall;
      const callbackTime = formatCallbackTime(diagnostic.avgCallbackTimeMinutes ?? null);

      // HEADER
      doc.rect(0, 0, 612, 70).fill('#000000');
      doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold');
      doc.text('Revenue Recovery Intelligence Report', 50, 25, { width: 512 });
      doc.fontSize(9).fillColor('#cccccc').font('Helvetica');
      doc.text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 50, 50, { width: 512 });

      // LEAD INFO
      doc.rect(40, 85, 532, 65).fillAndStroke('#f8f9fa', '#e0e0e0');
      doc.fontSize(9).fillColor('#0066cc').font('Helvetica-Bold');
      doc.text('LEAD INFORMATION', 50, 92, { width: 512 });
      
      doc.fontSize(7).fillColor('#666666').font('Helvetica');
      doc.text('CONTACT', 50, 108, { width: 250 });
      doc.fontSize(10).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text(booking.name, 50, 118, { width: 250 });
      
      doc.fontSize(7).fillColor('#666666').font('Helvetica');
      doc.text('EMAIL', 310, 108, { width: 250 });
      doc.fontSize(10).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text(booking.email, 310, 118, { width: 250 });
      
      doc.fontSize(7).fillColor('#666666').font('Helvetica');
      doc.text('PHONE', 50, 133, { width: 250 });
      doc.fontSize(10).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text(booking.phone, 50, 143, { width: 250 });
      
      if (booking.company) {
        doc.fontSize(7).fillColor('#666666').font('Helvetica');
        doc.text('COMPANY', 310, 133, { width: 250 });
        doc.fontSize(10).fillColor('#1a1a1a').font('Helvetica-Bold');
        doc.text(booking.company, 310, 143, { width: 250 });
      }

      // HERO RECOVERY
      doc.rect(40, 160, 532, 70).lineWidth(2).fillAndStroke('#e8f5e9', '#4caf50');
      doc.fontSize(9).fillColor('#2e7d32').font('Helvetica-Bold');
      doc.text('POTENTIAL REVENUE RECOVERY', 50, 168, { width: 512, align: 'center' });
      doc.fontSize(32).fillColor('#1b5e20').font('Helvetica-Bold');
      doc.text(`$${potentialRecovery.toLocaleString()}`, 50, 185, { width: 512, align: 'center' });
      doc.fontSize(9).fillColor('#2e7d32').font('Helvetica');
      doc.text('60% conversion rate for hot inbound leads', 50, 217, { width: 512, align: 'center' });

      // CALCULATION
      doc.rect(40, 240, 532, 38).fillAndStroke('#f0f4f8', '#90a4ae');
      doc.fontSize(9).fillColor('#37474f').font('Helvetica-Bold');
      doc.text('CALCULATION', 50, 248, { width: 512 });
      doc.fontSize(9).fillColor('#37474f').font('Courier');
      doc.text(`${diagnostic.missedCalls} calls x $${diagnostic.avgRevenuePerCall} x 60% = $${potentialRecovery.toLocaleString()}`, 50, 261, { width: 512 });

      // AFTER-HOURS OPPORTUNITY (if applicable)
      let afterHoursBoxHeight = 0;
      if (diagnostic.afterHoursCalls > 0) {
        afterHoursBoxHeight = 52;
        doc.rect(40, 288, 532, afterHoursBoxHeight).fillAndStroke('#fff9e6', '#ff9800');
        doc.fontSize(9).fillColor('#e65100').font('Helvetica-Bold');
        doc.text('AFTER-HOURS OPPORTUNITY', 50, 295, { width: 512 });
        doc.fontSize(8).fillColor('#3e2723').font('Helvetica');
        doc.text(`${diagnostic.afterHoursCalls} of the ${diagnostic.missedCalls} missed calls came after business hours (nights/weekends) = $${afterHoursRevenue.toLocaleString()} opportunity.`, 50, 308, { width: 512 });
        doc.fontSize(8).fillColor('#e65100').font('Helvetica-Bold');
        doc.text(`AI answering service works 24/7 and books appointments regardless of time or day.`, 50, 322, { width: 512 });
      }

      // ANALYTICS HEADER
      const analyticsY = 288 + afterHoursBoxHeight + 10;
      doc.fontSize(12).fillColor('#1a1a1a').font('Helvetica-Bold');
      doc.text('30-Day Call Analytics', 50, analyticsY, { width: 512 });
      doc.moveTo(50, analyticsY + 15).lineTo(562, analyticsY + 15).lineWidth(1).stroke('#e0e0e0');
      doc.fontSize(8).fillColor('#666666').font('Helvetica');
      doc.text(`${diagnostic.provider} • ${diagnostic.month}`, 50, analyticsY + 18, { width: 512 });

      // METRICS GRID (3x2)
      const metrics = [
        { label: 'REVENUE LOSS', value: `$${(diagnostic.totalLoss / 1000).toFixed(1)}k`, unit: 'unanswered' },
        { label: 'MISSED CALLS', value: `${diagnostic.missedCalls}`, unit: `of ${totalInbound}` },
        { label: 'AFTER-HOURS', value: `${diagnostic.afterHoursCalls}`, unit: 'late calls' },
        { label: 'ANSWER RATE', value: `${answerRate}%`, unit: `${accepted} answered` },
        { label: 'AVG VALUE', value: `$${diagnostic.avgRevenuePerCall}`, unit: 'per call' },
        { label: 'CALLBACK', value: callbackTime, unit: 'response' },
      ];

      const startY = analyticsY + 35;
      for (let i = 0; i < 6; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 50 + (col * 174);
        const y = startY + (row * 52);
        
        doc.rect(x, y, 164, 45).lineWidth(1).fillAndStroke('#ffffff', '#e0e0e0');
        doc.fontSize(7).fillColor('#666666').font('Helvetica-Bold');
        doc.text(metrics[i].label, x + 5, y + 7, { width: 154, align: 'center' });
        doc.fontSize(18).fillColor('#1a1a1a').font('Helvetica-Bold');
        doc.text(metrics[i].value, x + 5, y + 17, { width: 154, align: 'center' });
        doc.fontSize(7).fillColor('#666666').font('Helvetica');
        doc.text(metrics[i].unit, x + 5, y + 35, { width: 154, align: 'center' });
      }

      // FOOTER
      doc.fontSize(9).fillColor('#000000').font('Helvetica-Bold');
      doc.text('Revenue Leak Diagnostic Tool', 50, 720, { width: 512, align: 'center' });
      doc.fontSize(8).fillColor('#666666').font('Helvetica');
      doc.text(`${diagnostic.provider} • 30-day analysis`, 50, 732, { width: 512, align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
