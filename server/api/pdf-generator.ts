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
      doc.rect(0, 0, doc.page.width, 120).fill('#000000');
      doc.fillColor('#ffffff')
         .fontSize(26)
         .font('Helvetica-Bold')
         .text('Revenue Recovery Intelligence Report', 50, 40, { align: 'center' });
      
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#cccccc')
         .text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 50, 75, { align: 'center' });

      let y = 150;

      // LEAD INFORMATION SECTION
      doc.rect(40, y, doc.page.width - 80, 120).fillAndStroke('#f8f9fa', '#e0e0e0');
      
      doc.fontSize(14)
         .fillColor('#0066cc')
         .font('Helvetica-Bold')
         .text('LEAD INFORMATION', 60, y + 20);

      y += 50;
      const contactWidth = (doc.page.width - 140) / 2;
      
      // Contact grid
      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text('CONTACT NAME', 60, y);
      doc.fontSize(13)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text(booking.name, 60, y + 15);

      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text('EMAIL', 60 + contactWidth, y);
      doc.fontSize(13)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text(booking.email, 60 + contactWidth, y + 15);

      y += 45;
      
      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text('PHONE', 60, y);
      doc.fontSize(13)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text(booking.phone, 60, y + 15);

      if (booking.company) {
        doc.fontSize(9)
           .fillColor('#666666')
           .font('Helvetica')
           .text('COMPANY', 60 + contactWidth, y);
        doc.fontSize(13)
           .fillColor('#1a1a1a')
           .font('Helvetica-Bold')
           .text(booking.company, 60 + contactWidth, y + 15);
      }

      y += 60;

      // HERO METRIC - Potential Recovery
      doc.rect(40, y, doc.page.width - 80, 130)
         .lineWidth(2)
         .fillAndStroke('#e8f5e9', '#4caf50');

      doc.fontSize(11)
         .fillColor('#2e7d32')
         .font('Helvetica-Bold')
         .text('💰 POTENTIAL REVENUE RECOVERY', 50, y + 25, { align: 'center' });

      doc.fontSize(52)
         .fillColor('#1b5e20')
         .font('Helvetica-Bold')
         .text(`$${potentialRecovery.toLocaleString()}`, 50, y + 50, { align: 'center' });

      doc.fontSize(12)
         .fillColor('#2e7d32')
         .font('Helvetica')
         .text('Based on 35% conversion rate of missed opportunities', 50, y + 110, { align: 'center' });

      y += 160;

      // CALCULATION BREAKDOWN
      doc.rect(40, y, doc.page.width - 80, 80)
         .fillAndStroke('#f0f4f8', '#90a4ae');

      doc.fontSize(12)
         .fillColor('#37474f')
         .font('Helvetica-Bold')
         .text('📊 How We Calculate Recoverable Revenue', 60, y + 15);

      doc.fontSize(11)
         .fillColor('#37474f')
         .font('Courier')
         .text(`${diagnostic.missedCalls} missed calls × $${diagnostic.avgRevenuePerCall} avg value × 35% = $${potentialRecovery.toLocaleString()}`, 60, y + 35, { width: doc.page.width - 120 });

      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Industry research shows that approximately 35% of missed calls can be converted into revenue when proper follow-up systems are in place.', 60, y + 55, { width: doc.page.width - 120 });

      y += 110;

      // 30-DAY ANALYTICS SECTION
      doc.fontSize(18)
         .fillColor('#1a1a1a')
         .font('Helvetica-Bold')
         .text('30-Day Call Analytics', 50, y);
      
      doc.moveTo(50, y + 25)
         .lineTo(doc.page.width - 50, y + 25)
         .lineWidth(2)
         .stroke('#e0e0e0');

      doc.fontSize(11)
         .fillColor('#666666')
         .font('Helvetica')
         .text(`${diagnostic.provider} • ${diagnostic.month}`, 50, y + 30);

      y += 60;

      // Metrics Grid (3 columns)
      const metricWidth = (doc.page.width - 140) / 3;
      const metrics = [
        { label: 'TOTAL REVENUE LOSS', value: `$${(diagnostic.totalLoss / 1000).toFixed(1)}k`, unit: 'from unanswered calls' },
        { label: 'MISSED CALLS', value: `${diagnostic.missedCalls}`, unit: `of ${totalInbound} total inbound` },
        { label: 'AFTER-HOURS CALLS', value: `${diagnostic.afterHoursCalls}`, unit: 'outside 8am-6pm ET' },
        { label: 'ANSWER RATE', value: `${answerRate}%`, unit: `${accepted} calls answered` },
        { label: 'AVG CUSTOMER VALUE', value: `$${diagnostic.avgRevenuePerCall}`, unit: 'per service call' },
        { label: 'AVG CALLBACK TIME', value: callbackTime, unit: 'response window' },
      ];

      for (let i = 0; i < metrics.length; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 50 + (col * metricWidth) + (col * 20);
        const currentY = y + (row * 100);

        doc.rect(x, currentY, metricWidth, 80)
           .lineWidth(1)
           .fillAndStroke('#ffffff', '#e0e0e0');

        doc.fontSize(9)
           .fillColor('#666666')
           .font('Helvetica-Bold')
           .text(metrics[i].label, x + 10, currentY + 15, { width: metricWidth - 20, align: 'center' });

        doc.fontSize(28)
           .fillColor('#1a1a1a')
           .font('Helvetica-Bold')
           .text(metrics[i].value, x + 10, currentY + 30, { width: metricWidth - 20, align: 'center' });

        doc.fontSize(9)
           .fillColor('#666666')
           .font('Helvetica')
           .text(metrics[i].unit, x + 10, currentY + 62, { width: metricWidth - 20, align: 'center' });
      }

      y += 220;

      // KEY INSIGHT BOX
      if (diagnostic.afterHoursCalls > 0 && diagnostic.missedCalls > 0) {
        doc.rect(40, y, doc.page.width - 80, 90)
           .fillAndStroke('#fff9e6', '#ff9800');

        doc.fontSize(13)
           .fillColor('#e65100')
           .font('Helvetica-Bold')
           .text('💡 Critical Business Insight', 60, y + 20);

        doc.fontSize(11)
           .fillColor('#3e2723')
           .font('Helvetica')
           .text(`${diagnostic.afterHoursCalls} calls (${afterHoursPercentage}% of all missed calls) came in outside of normal business hours (8am-6pm ET, Monday-Friday).`, 60, y + 42, { width: doc.page.width - 120 });

        doc.fontSize(11)
           .fillColor('#3e2723')
           .font('Helvetica-Bold')
           .text(`This represents a $${afterHoursRevenue.toLocaleString()} revenue opportunity `, 60, y + 62, { width: doc.page.width - 120, continued: true })
           .font('Helvetica')
           .text('that could be captured with an answering service, extended hours, or automated booking system.');

        y += 110;
      }

      // FOOTER
      doc.fontSize(12)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Revenue Leak Diagnostic Tool', 50, doc.page.height - 90, { align: 'center' });

      doc.fontSize(10)
         .fillColor('#666666')
         .font('Helvetica')
         .text(`Powered by Real ${diagnostic.provider} Call Data`, 50, doc.page.height - 70, { align: 'center' });

      doc.fontSize(9)
         .fillColor('#999999')
         .text('This report analyzes actual call patterns from the last 30 days to identify revenue recovery opportunities.', 50, doc.page.height - 50, { align: 'center', width: doc.page.width - 100 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
