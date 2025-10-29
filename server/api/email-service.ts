import { Resend } from 'resend';
import type { DiagnosticResult } from '@shared/schema';
import { generateDiagnosticPDF } from './pdf-generator';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

function formatCallbackTime(minutes: number | null): string {
  if (minutes === null) return "Not enough data";
  
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

function createSalesEmailHTML(booking: BookingData, diagnostic: DiagnosticResult): string {
  const totalInbound = diagnostic.totalInboundCalls ?? 0;
  const accepted = diagnostic.acceptedCalls ?? 0;
  const answerRate = totalInbound > 0 
    ? Math.round((accepted / totalInbound) * 100)
    : 0;
  
  const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.35);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      line-height: 1.6; 
      color: #1a1a1a; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 0;
      background: #f5f5f5;
    }
    .container {
      background: #ffffff;
      margin: 20px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
      color: #ffffff; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 { 
      margin: 0; 
      font-size: 26px; 
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 30px;
    }
    .badge {
      display: inline-block;
      background: #4caf50;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }
    .hero-metric { 
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      padding: 35px; 
      margin: 25px 0; 
      text-align: center;
      border-radius: 8px;
      border: 2px solid #4caf50;
    }
    .hero-label { 
      font-size: 13px; 
      color: #2e7d32; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 1.5px; 
      margin-bottom: 12px; 
    }
    .hero-value { 
      font-size: 56px; 
      font-weight: 700; 
      color: #1b5e20; 
      line-height: 1;
      margin: 10px 0;
    }
    .hero-subtext { 
      font-size: 14px; 
      color: #2e7d32; 
      margin-top: 10px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 30px 0 15px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e0e0e0;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }
    .contact-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
    }
    .contact-label {
      font-size: 11px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .contact-value {
      font-size: 15px;
      color: #1a1a1a;
      font-weight: 500;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 25px 0;
    }
    .stat-card {
      background: #f8f9fa;
      padding: 20px 15px;
      border-radius: 6px;
      text-align: center;
    }
    .stat-label {
      font-size: 11px;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1;
    }
    .stat-unit {
      font-size: 12px;
      color: #666;
      margin-top: 6px;
    }
    .insight-box {
      background: #fff9e6;
      border-left: 4px solid #ff9800;
      padding: 20px;
      margin: 25px 0;
      border-radius: 6px;
    }
    .insight-box strong {
      color: #e65100;
    }
    .cta-box {
      background: #f0f9ff;
      border: 2px solid #0066cc;
      padding: 25px;
      margin: 30px 0;
      text-align: center;
      border-radius: 8px;
    }
    .cta-box p {
      margin: 0;
      font-size: 15px;
      color: #1a1a1a;
      font-weight: 500;
    }
    .footer { 
      text-align: center; 
      color: #999; 
      font-size: 12px; 
      padding: 30px;
      background: #f8f9fa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 New Lead: High-Value Opportunity</h1>
    </div>

    <div class="content">
      <div class="badge">NEW BOOKING</div>

      <div class="section-title">Lead Information</div>
      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-label">Contact Name</div>
          <div class="contact-value">${booking.name}</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Email</div>
          <div class="contact-value">${booking.email}</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Phone</div>
          <div class="contact-value">${booking.phone}</div>
        </div>
        ${booking.company ? `
        <div class="contact-item">
          <div class="contact-label">Company</div>
          <div class="contact-value">${booking.company}</div>
        </div>
        ` : ''}
      </div>

      <div class="hero-metric">
        <div class="hero-label">💰 Potential Revenue Recovery</div>
        <div class="hero-value">$${potentialRecovery.toLocaleString()}</div>
        <div class="hero-subtext">35% conversion rate on missed opportunities</div>
      </div>

      <div class="cta-box">
        <p>📎 <strong>Detailed PDF Report Attached</strong> – Full analytics breakdown included</p>
      </div>

      <div class="section-title">Quick Stats Overview</div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Loss</div>
          <div class="stat-value">$${(diagnostic.totalLoss / 1000).toFixed(1)}k</div>
          <div class="stat-unit">monthly</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Missed Calls</div>
          <div class="stat-value">${diagnostic.missedCalls}</div>
          <div class="stat-unit">opportunities</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Answer Rate</div>
          <div class="stat-value">${answerRate}%</div>
          <div class="stat-unit">${accepted}/${totalInbound}</div>
        </div>
      </div>

      ${diagnostic.afterHoursCalls > 0 ? `
      <div class="insight-box">
        <strong>💡 After-Hours Opportunity:</strong> ${diagnostic.afterHoursCalls} calls came in outside business hours—a 
        <strong>$${(diagnostic.afterHoursCalls * diagnostic.avgRevenuePerCall).toLocaleString()}</strong> opportunity 
        for extended coverage.
      </div>
      ` : ''}

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        <strong>Data Source:</strong> ${diagnostic.provider} call analytics from ${diagnostic.month}
      </p>
    </div>

    <div class="footer">
      <p><strong>Revenue Leak Diagnostic Tool</strong></p>
      <p>Powered by Real Call Data Analysis</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function createSalesEmailText(booking: BookingData, diagnostic: DiagnosticResult): string {
  const callbackTime = formatCallbackTime(diagnostic.avgCallbackTimeMinutes ?? null);
  const totalInbound = diagnostic.totalInboundCalls ?? 0;
  const accepted = diagnostic.acceptedCalls ?? 0;
  const answerRate = totalInbound > 0 
    ? Math.round((accepted / totalInbound) * 100)
    : 0;
  
  // Potential revenue recovery: 35% of missed calls could be recovered
  const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.35);

  return `
🔔 NEW LEAD: Revenue Recovery Opportunity

CONTACT INFORMATION
-------------------
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
${booking.company ? `Company: ${booking.company}` : ''}

💰 POTENTIAL REVENUE RECOVERY
-----------------------------
$${potentialRecovery.toLocaleString()}
Estimated recoverable revenue from missed calls (35% conversion)

30-DAY CALL INTELLIGENCE REPORT
--------------------------------
${diagnostic.provider} • ${diagnostic.month}

TOTAL REVENUE LOSS: $${diagnostic.totalLoss.toLocaleString()}
In unanswered calls

MISSED CALLS: ${diagnostic.missedCalls}
Of ${totalInbound} total inbound calls

AFTER-HOURS CALLS: ${diagnostic.afterHoursCalls}
Outside business hours (8am-6pm ET, Mon-Fri)

ANSWER RATE: ${answerRate}%
${accepted} calls answered

AVG CUSTOMER VALUE: $${diagnostic.avgRevenuePerCall}
Per call

AVG CALLBACK TIME: ${callbackTime}
When customers call back after missing them

${diagnostic.afterHoursCalls > 0 && diagnostic.missedCalls > 0 ? `
KEY INSIGHT
-----------
${diagnostic.afterHoursCalls} calls (${Math.round((diagnostic.afterHoursCalls / diagnostic.missedCalls) * 100)}% of missed calls) came in after hours. 
This represents a $${(diagnostic.afterHoursCalls * diagnostic.avgRevenuePerCall).toLocaleString()} opportunity for an answering service or extended hours.
` : ''}

---
This report was generated from ${diagnostic.provider} call data for the last 30 days.
Revenue Loss Diagnostic Tool • Powered by Real Call Data
  `.trim();
}

export async function sendSalesIntelligenceEmail(
  booking: BookingData,
  diagnostic: DiagnosticResult
): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    // Email to sales team
    const salesEmail = process.env.SALES_EMAIL;
    
    if (!salesEmail) {
      console.error('❌ CRITICAL: SALES_EMAIL environment variable not configured - email cannot be sent');
      throw new Error('SALES_EMAIL environment variable not configured');
    }
    
    console.log('📧 Generating PDF report...');
    const pdfBuffer = await generateDiagnosticPDF(booking, diagnostic);
    console.log('✅ PDF generated successfully');
    
    console.log('📧 Sending sales intelligence email to:', salesEmail);
    
    const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.35);
    const fileName = `Revenue-Recovery-Report-${booking.name.replace(/\s+/g, '-')}.pdf`;
    
    const { data, error } = await client.emails.send({
      from: fromEmail || 'onboarding@resend.dev',
      to: salesEmail,
      subject: `🔔 New Lead: ${booking.name} - $${potentialRecovery.toLocaleString()} Recovery Opportunity`,
      html: createSalesEmailHTML(booking, diagnostic),
      text: createSalesEmailText(booking, diagnostic),
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error('❌ Resend API error:', {
        name: error.name,
        message: error.message,
        statusCode: (error as any).statusCode,
      });
      throw new Error(`Failed to send sales email: ${error.message}`);
    }

    console.log('✅ Sales intelligence email sent successfully:', data?.id);
  } catch (error) {
    console.error('Error in sendSalesIntelligenceEmail:', error);
    throw error;
  }
}
