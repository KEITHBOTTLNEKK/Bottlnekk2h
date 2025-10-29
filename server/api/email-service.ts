import { Resend } from 'resend';
import type { DiagnosticResult } from '@shared/schema';

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
  const callbackTime = formatCallbackTime(diagnostic.avgCallbackTimeMinutes ?? null);
  const totalInbound = diagnostic.totalInboundCalls ?? 0;
  const accepted = diagnostic.acceptedCalls ?? 0;
  const answerRate = totalInbound > 0 
    ? Math.round((accepted / totalInbound) * 100)
    : 0;
  
  // Potential revenue recovery: 35% of missed calls could be recovered
  const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.35);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #000; color: #fff; padding: 30px 20px; text-align: center; margin: -20px -20px 30px -20px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 300; }
    .opportunity { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 25px; margin: 30px 0; text-align: center; }
    .opportunity-label { font-size: 14px; color: #2e7d32; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .opportunity-value { font-size: 48px; font-weight: 700; color: #1b5e20; margin: 10px 0; }
    .opportunity-subtext { font-size: 16px; color: #2e7d32; }
    .metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
    .metric { background: #f8f8f8; padding: 20px; border-radius: 8px; }
    .metric-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .metric-value { font-size: 32px; font-weight: 600; color: #000; }
    .metric-unit { font-size: 14px; color: #666; margin-top: 4px; }
    .contact { background: #f0f9ff; border-left: 4px solid #0066cc; padding: 20px; margin: 30px 0; }
    .contact h2 { margin: 0 0 15px 0; font-size: 18px; color: #0066cc; }
    .contact-detail { margin: 8px 0; }
    .contact-label { font-weight: 600; color: #333; }
    .insight { background: #fff9e6; border-left: 4px solid #ff9800; padding: 20px; margin: 30px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔔 New Lead: Revenue Recovery Opportunity</h1>
  </div>

  <div class="contact">
    <h2>Contact Information</h2>
    <div class="contact-detail"><span class="contact-label">Name:</span> ${booking.name}</div>
    <div class="contact-detail"><span class="contact-label">Email:</span> ${booking.email}</div>
    <div class="contact-detail"><span class="contact-label">Phone:</span> ${booking.phone}</div>
    ${booking.company ? `<div class="contact-detail"><span class="contact-label">Company:</span> ${booking.company}</div>` : ''}
  </div>

  <div class="opportunity">
    <div class="opportunity-label">💰 Potential Revenue Recovery</div>
    <div class="opportunity-value">$${potentialRecovery.toLocaleString()}</div>
    <div class="opportunity-subtext">Estimated recoverable revenue from missed calls (35% conversion)</div>
  </div>

  <h2 style="font-size: 20px; margin-top: 40px;">30-Day Call Intelligence Report</h2>
  <p style="color: #666; margin-bottom: 30px;">${diagnostic.provider} • ${diagnostic.month}</p>

  <div class="metric-grid">
    <div class="metric">
      <div class="metric-label">Total Revenue Loss</div>
      <div class="metric-value">$${diagnostic.totalLoss.toLocaleString()}</div>
      <div class="metric-unit">in unanswered calls</div>
    </div>

    <div class="metric">
      <div class="metric-label">Missed Calls</div>
      <div class="metric-value">${diagnostic.missedCalls}</div>
      <div class="metric-unit">of ${totalInbound} total</div>
    </div>

    <div class="metric">
      <div class="metric-label">After-Hours Calls</div>
      <div class="metric-value">${diagnostic.afterHoursCalls}</div>
      <div class="metric-unit">outside business hours</div>
    </div>

    <div class="metric">
      <div class="metric-label">Answer Rate</div>
      <div class="metric-value">${answerRate}%</div>
      <div class="metric-unit">${accepted} calls answered</div>
    </div>

    <div class="metric">
      <div class="metric-label">Avg Customer Value</div>
      <div class="metric-value">$${diagnostic.avgRevenuePerCall}</div>
      <div class="metric-unit">per call</div>
    </div>

    <div class="metric">
      <div class="metric-label">Avg Callback Time</div>
      <div class="metric-value">${callbackTime}</div>
      <div class="metric-unit">when they call back</div>
    </div>
  </div>

  ${diagnostic.afterHoursCalls > 0 && diagnostic.missedCalls > 0 ? `
  <div class="insight">
    <strong>💡 Key Insight:</strong> ${diagnostic.afterHoursCalls} calls (${Math.round((diagnostic.afterHoursCalls / diagnostic.missedCalls) * 100)}% of missed calls) came in after hours. This represents a <strong>$${(diagnostic.afterHoursCalls * diagnostic.avgRevenuePerCall).toLocaleString()}</strong> opportunity for an answering service or extended hours.
  </div>
  ` : ''}

  <div class="footer">
    <p>This report was generated from ${diagnostic.provider} call data for the last 30 days.</p>
    <p>Revenue Loss Diagnostic Tool • Powered by Real Call Data</p>
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
    
    console.log('📧 Sending sales intelligence email to:', salesEmail);
    
    const { data, error } = await client.emails.send({
      from: fromEmail || 'onboarding@resend.dev', // Use Resend's default if no verified domain
      to: salesEmail,
      subject: `🔔 New Lead: ${booking.name} - $${diagnostic.totalLoss.toLocaleString()} Revenue Opportunity`,
      html: createSalesEmailHTML(booking, diagnostic),
      text: createSalesEmailText(booking, diagnostic),
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
