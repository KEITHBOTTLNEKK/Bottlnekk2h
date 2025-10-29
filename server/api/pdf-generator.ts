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
        bufferPages: true
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
      
      const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.35);
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
         .text('Revenue Recovery Intelligence Report', 50, 30, { align: 'center' });
      
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#cccccc')
         .text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 50, 58, { align: 'center' });

      let y = 100;

      // LEAD INFORMATION SECTION - Compact
      doc.rect(40, y, doc.page.width - 80, 85).fillAndStroke('#f8f9fa', '#e0e0e0');
      
      doc.fontSize(11)
         .fillColor('#0066cc')
         .font('Helvetica-Bold')
         .text('LEAD INFORMATION', 60, y + 12);

      y += 35;
      const contactWidth = (doc.page.width - 140) / 2;
      
      // Contact grid - more compact
      doc.fontSize(8)
         .fillColor('#666666')
         .font('Helvetica')
         .text('CONTACT', 60, y);
      doc.fontSize(11)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text(booking.name, 60, y + 12);

      doc.fontSize(8)
         .fillColor('#666666')
         .font('Helvetica')
         .text('EMAIL', 60 + contactWidth, y);
      doc.fontSize(11)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text(booking.email, 60 + contactWidth, y + 12, { width: contactWidth - 20 });

      y += 32;
      
      doc.fontSize(8)
         .fillColor('#666666')
         .font('Helvetica')
         .text('PHONE', 60, y);
      doc.fontSize(11)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text(booking.phone, 60, y + 12);

      if (booking.company) {
        doc.fontSize(8)
           .fillColor('#666666')
           .font('Helvetica')
           .text('COMPANY', 60 + contactWidth, y);
        doc.fontSize(11)
           .fillColor('#1a1a1a')
           .font('Helvetica-Bold')
           .text(booking.company, 60 + contactWidth, y + 12);
      }

      y += 40;

      // HERO METRIC - Potential Recovery (more compact)
      doc.rect(40, y, doc.page.width - 80, 95)
         .lineWidth(2)
         .fillAndStroke('#e8f5e9', '#4caf50');

      doc.fontSize(10)
         .fillColor('#2e7d32')
         .font('Helvetica-Bold')
         .text('POTENTIAL REVENUE RECOVERY', 50, y + 15, { align: 'center' });

      doc.fontSize(42)
         .fillColor('#1b5e20')
         .font('Helvetica-Bold')
         .text(`$${potentialRecovery.toLocaleString()}`, 50, y + 35, { align: 'center' });

      doc.fontSize(10)
         .fillColor('#2e7d32')
         .font('Helvetica')
         .text('Based on 35% conversion rate of missed opportunities', 50, y + 80, { align: 'center' });

      y += 110;

      // CALCULATION BREAKDOWN (compact)
      doc.rect(40, y, doc.page.width - 80, 55)
         .fillAndStroke('#f0f4f8', '#90a4ae');

      doc.fontSize(10)
         .fillColor('#37474f')
         .font('Helvetica-Bold')
         .text('HOW WE CALCULATE RECOVERABLE REVENUE', 60, y + 12);

      doc.fontSize(10)
         .fillColor('#37474f')
         .font('Courier')
         .text(`${diagnostic.missedCalls} missed calls x $${diagnostic.avgRevenuePerCall} avg value x 35% conversion = $${potentialRecovery.toLocaleString()}`, 60, y + 28, { width: doc.page.width - 120 });

      y += 70;

      // 30-DAY ANALYTICS SECTION (compact header)
      doc.fontSize(14)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text('30-Day Call Analytics', 50, y);
      
      doc.moveTo(50, y + 20)
         .lineTo(doc.page.width - 50, y + 20)
         .lineWidth(1)
         .stroke('#e0e0e0');

      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text(`${diagnostic.provider} • ${diagnostic.month}`, 50, y + 24);

      y += 45;

      // Metrics Grid (3 columns, more compact)
      const metricWidth = (doc.page.width - 140) / 3;
      const metrics = [
        { label: 'TOTAL REVENUE LOSS', value: `$${(diagnostic.totalLoss / 1000).toFixed(1)}k`, unit: 'unanswered calls' },
        { label: 'MISSED CALLS', value: `${diagnostic.missedCalls}`, unit: `of ${totalInbound} total` },
        { label: 'AFTER-HOURS', value: `${diagnostic.afterHoursCalls}`, unit: 'after 6pm ET' },
        { label: 'ANSWER RATE', value: `${answerRate}%`, unit: `${accepted} answered` },
        { label: 'AVG VALUE', value: `$${diagnostic.avgRevenuePerCall}`, unit: 'per call' },
        { label: 'CALLBACK TIME', value: callbackTime === 'Insufficient data' ? 'N/A' : callbackTime, unit: 'avg response' },
      ];

      for (let i = 0; i < metrics.length; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 50 + (col * metricWidth) + (col * 20);
        const currentY = y + (row * 70);

        doc.rect(x, currentY, metricWidth, 60)
           .lineWidth(1)
           .fillAndStroke('#ffffff', '#e0e0e0');

        doc.fontSize(8)
           .fillColor('#666666')
           .font('Helvetica-Bold')
           .text(metrics[i].label, x + 8, currentY + 10, { width: metricWidth - 16, align: 'center' });

        doc.fontSize(22)
           .fillColor('#1a1a1a')
           .font('Helvetica-Bold')
           .text(metrics[i].value, x + 8, currentY + 22, { width: metricWidth - 16, align: 'center' });

        doc.fontSize(8)
           .fillColor('#666666')
           .font('Helvetica')
           .text(metrics[i].unit, x + 8, currentY + 47, { width: metricWidth - 16, align: 'center' });
      }

      y += 155;

      // KEY INSIGHT BOX (more compact)
      if (diagnostic.afterHoursCalls > 0 && diagnostic.missedCalls > 0) {
        doc.rect(40, y, doc.page.width - 80, 60)
           .fillAndStroke('#fff9e6', '#ff9800');

        doc.fontSize(10)
           .fillColor('#e65100')
           .font('Helvetica-Bold')
           .text('CRITICAL INSIGHT', 60, y + 12);

        doc.fontSize(9)
           .fillColor('#3e2723')
           .font('Helvetica-Bold')
           .text(`${diagnostic.afterHoursCalls} calls (${afterHoursPercentage}% of missed calls)`, 60, y + 28, { continued: true })
           .font('Helvetica')
           .text(` came in after hours. This is a `, { continued: true })
           .font('Helvetica-Bold')
           .text(`$${afterHoursRevenue.toLocaleString()} opportunity`, { continued: true })
           .font('Helvetica')
           .text(` for extended coverage or answering service.`, { width: doc.page.width - 120 });

        y += 75;
      }

      // FOOTER (compact, at bottom of page)
      const footerY = doc.page.height - 60;
      
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Revenue Leak Diagnostic Tool', 50, footerY, { align: 'center' });

      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text(`Powered by Real ${diagnostic.provider} Call Data`, 50, footerY + 16, { align: 'center' });

      doc.fontSize(8)
         .fillColor('#999999')
         .text('30-day call pattern analysis to identify revenue recovery opportunities', 50, footerY + 32, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
