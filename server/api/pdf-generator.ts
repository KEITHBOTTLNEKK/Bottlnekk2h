import PDFDocument from 'pdfkit';
import type { DiagnosticResult } from '@shared/schema';

interface BookingData {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

function formatCallbackTime(minutes: number | null): string {
  if (minutes === null) return "Insufficient data";
  
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
}

export async function generateDiagnosticPDF(
  booking: BookingData,
  diagnostic: DiagnosticResult
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: false,
        autoFirstPage: true
      });

      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Calculate metrics
      const totalInbound = diagnostic.totalInboundCalls ?? 0;
      const accepted = diagnostic.acceptedCalls ?? 0;
      const answerRate = totalInbound > 0 
        ? Math.round((accepted / totalInbound) * 100)
        : 0;
      
      const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.60);
      const afterHoursPercentage = diagnostic.missedCalls > 0 
        ? Math.round((diagnostic.afterHoursCalls / diagnostic.missedCalls) * 100)
        : 0;
      const afterHoursRevenue = diagnostic.afterHoursCalls * diagnostic.avgRevenuePerCall;
      const callbackTime = formatCallbackTime(diagnostic.avgCallbackTimeMinutes ?? null);

      // HEADER - Black gradient effect
      doc.rect(0, 0, doc.page.width, 80).fill('#000000');
      doc.fillColor('#ffffff')
         .fontSize(22)
         .font('Helvetica-Bold')
         .text('Revenue Recovery Intelligence Report', 50, 30, { width: doc.page.width - 100, align: 'center' });
      
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#cccccc')
         .text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 50, 58, { width: doc.page.width - 100, align: 'center' });

      let y = 100;

      // LEAD INFORMATION SECTION - Ultra compact
      doc.rect(40, y, doc.page.width - 80, 70).fillAndStroke('#f8f9fa', '#e0e0e0');
      
      doc.fontSize(10)
         .fillColor('#0066cc')
         .font('Helvetica-Bold')
         .text('LEAD INFORMATION', 60, y + 10);

      y += 28;
      const contactWidth = (doc.page.width - 140) / 2;
      
      // Contact grid - ultra compact
      doc.fontSize(7)
         .fillColor('#666666')
         .font('Helvetica')
         .text('CONTACT', 60, y);
      doc.fontSize(10)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text(booking.name, 60, y + 10);

      doc.fontSize(7)
         .fillColor('#666666')
         .font('Helvetica')
         .text('EMAIL', 60 + contactWidth, y);
      doc.fontSize(10)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text(booking.email, 60 + contactWidth, y + 10, { width: contactWidth - 20 });

      y += 26;
      
      doc.fontSize(7)
         .fillColor('#666666')
         .font('Helvetica')
         .text('PHONE', 60, y);
      doc.fontSize(10)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text(booking.phone, 60, y + 10);

      if (booking.company) {
        doc.fontSize(7)
           .fillColor('#666666')
           .font('Helvetica')
           .text('COMPANY', 60 + contactWidth, y);
        doc.fontSize(10)
           .fillColor('#1a1a1a')
           .font('Helvetica-Bold')
           .text(booking.company, 60 + contactWidth, y + 10);
      }

      y += 32;

      // HERO METRIC - Potential Recovery (ultra compact)
      doc.rect(40, y, doc.page.width - 80, 75)
         .lineWidth(2)
         .fillAndStroke('#e8f5e9', '#4caf50');

      doc.fontSize(9)
         .fillColor('#2e7d32')
         .font('Helvetica-Bold')
         .text('POTENTIAL REVENUE RECOVERY', 50, y + 12, { width: doc.page.width - 100, align: 'center' });

      doc.fontSize(36)
         .fillColor('#1b5e20')
         .font('Helvetica-Bold')
         .text(`$${potentialRecovery.toLocaleString()}`, 50, y + 28, { width: doc.page.width - 100, align: 'center' });

      doc.fontSize(9)
         .fillColor('#2e7d32')
         .font('Helvetica')
         .text('60% conversion rate for hot inbound leads', 50, y + 65, { width: doc.page.width - 100, align: 'center' });

      y += 88;

      // CALCULATION BREAKDOWN (ultra compact)
      doc.rect(40, y, doc.page.width - 80, 42)
         .fillAndStroke('#f0f4f8', '#90a4ae');

      doc.fontSize(9)
         .fillColor('#37474f')
         .font('Helvetica-Bold')
         .text('CALCULATION', 60, y + 10);

      doc.fontSize(9)
         .fillColor('#37474f')
         .font('Courier')
         .text(`${diagnostic.missedCalls} calls x $${diagnostic.avgRevenuePerCall} x 60% = $${potentialRecovery.toLocaleString()}`, 60, y + 24, { width: doc.page.width - 120 });

      y += 54;

      // 30-DAY ANALYTICS SECTION (ultra compact)
      doc.fontSize(12)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text('30-Day Call Analytics', 50, y);
      
      doc.moveTo(50, y + 16)
         .lineTo(doc.page.width - 50, y + 16)
         .lineWidth(1)
         .stroke('#e0e0e0');

      doc.fontSize(8)
         .fillColor('#666666')
         .font('Helvetica')
         .text(`${diagnostic.provider} • ${diagnostic.month}`, 50, y + 20);

      y += 36;

      // Metrics Grid (3 columns, ultra compact)
      const metricWidth = (doc.page.width - 140) / 3;
      const metrics = [
        { label: 'REVENUE LOSS', value: `$${(diagnostic.totalLoss / 1000).toFixed(1)}k`, unit: 'unanswered' },
        { label: 'MISSED CALLS', value: `${diagnostic.missedCalls}`, unit: `of ${totalInbound}` },
        { label: 'AFTER-HOURS', value: `${diagnostic.afterHoursCalls}`, unit: 'late calls' },
        { label: 'ANSWER RATE', value: `${answerRate}%`, unit: `${accepted} answered` },
        { label: 'AVG VALUE', value: `$${diagnostic.avgRevenuePerCall}`, unit: 'per call' },
        { label: 'CALLBACK', value: callbackTime === 'Insufficient data' ? 'N/A' : callbackTime, unit: 'response' },
      ];

      for (let i = 0; i < metrics.length; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 50 + (col * metricWidth) + (col * 20);
        const currentY = y + (row * 55);

        doc.rect(x, currentY, metricWidth, 48)
           .lineWidth(1)
           .fillAndStroke('#ffffff', '#e0e0e0');

        doc.fontSize(7)
           .fillColor('#666666')
           .font('Helvetica-Bold')
           .text(metrics[i].label, x + 6, currentY + 8, { width: metricWidth - 12, align: 'center' });

        doc.fontSize(19)
           .fillColor('#1a1a1a')
           .font('Helvetica-Bold')
           .text(metrics[i].value, x + 6, currentY + 18, { width: metricWidth - 12, align: 'center' });

        doc.fontSize(7)
           .fillColor('#666666')
           .font('Helvetica')
           .text(metrics[i].unit, x + 6, currentY + 38, { width: metricWidth - 12, align: 'center' });
      }

      y += 120;

      // KEY INSIGHT BOX (ultra compact)
      if (diagnostic.afterHoursCalls > 0 && diagnostic.missedCalls > 0) {
        doc.rect(40, y, doc.page.width - 80, 48)
           .fillAndStroke('#fff9e6', '#ff9800');

        doc.fontSize(9)
           .fillColor('#e65100')
           .font('Helvetica-Bold')
           .text('AFTER-HOURS INSIGHT', 60, y + 10);

        doc.fontSize(8)
           .fillColor('#3e2723')
           .font('Helvetica')
           .text(`${diagnostic.afterHoursCalls} calls (${afterHoursPercentage}%) after hours = $${afterHoursRevenue.toLocaleString()} opportunity for extended coverage.`, 60, y + 24, { width: doc.page.width - 120 });

        y += 58;
      }

      // FOOTER (ultra compact, at bottom of page)
      const footerY = doc.page.height - 50;
      
      doc.fontSize(9)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Revenue Leak Diagnostic Tool', 50, footerY, { width: doc.page.width - 100, align: 'center' });

      doc.fontSize(8)
         .fillColor('#666666')
         .font('Helvetica')
         .text(`${diagnostic.provider} • 30-day analysis`, 50, footerY + 14, { width: doc.page.width - 100, align: 'center' });

      doc.fontSize(7)
         .fillColor('#999999')
         .text('Revenue recovery opportunity analysis', 50, footerY + 28, { width: doc.page.width - 100, align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
