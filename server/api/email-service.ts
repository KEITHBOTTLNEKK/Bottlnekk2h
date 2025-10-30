import { Resend } from 'resend';
import type { DiagnosticResult } from '@shared/schema';
import { generateDiagnosticPDF } from './pdf-generator';

let connectionSettings: any;

interface EmailDiagnosticData {
  totalLoss: number;
  missedCalls: number;
  afterHoursCalls: number;
  avgRevenuePerCall: number;
  totalMissedOpportunities: number;
  totalInboundCalls?: number;
  acceptedCalls?: number;
  provider?: string;
  month?: string;
  avgCallbackTimeMinutes?: number | null;
}

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

function createSalesEmailHTML(booking: BookingData, diagnostic: EmailDiagnosticData): string {
  const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.60);
  const totalInbound = diagnostic.totalInboundCalls ?? 0;
  const accepted = diagnostic.acceptedCalls ?? 0;
  const potentialBudget = Math.round(accepted * diagnostic.avgRevenuePerCall * 0.30);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      line-height: 1.4; 
      color: #1a1a1a; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 0;
      background: #f5f5f5;
    }
    .container {
      background: #ffffff;
      margin: 12px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
      color: #ffffff; 
      padding: 20px; 
      text-align: center;
    }
    .header h1 { 
      margin: 0; 
      font-size: 22px; 
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 20px;
    }
    .badge {
      display: inline-block;
      background: #00C97B;
      color: white;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    .hero-metric { 
      background: linear-gradient(135deg, #e6f9f2 0%, #ccf2e5 100%);
      padding: 20px; 
      margin: 16px 0; 
      text-align: center;
      border-radius: 8px;
      border: 2px solid #00C97B;
    }
    .hero-label { 
      font-size: 12px; 
      color: #00A565; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 1px; 
      margin-bottom: 8px; 
    }
    .hero-value { 
      font-size: 42px; 
      font-weight: 700; 
      color: #008558; 
      line-height: 1;
      margin: 8px 0;
    }
    .hero-subtext { 
      font-size: 13px; 
      color: #00A565; 
      margin-top: 8px;
    }
    .contact-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    .contact-item {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
      border-left: 3px solid #00C97B;
      vertical-align: top;
    }
    .contact-label {
      font-size: 10px;
      font-weight: 700;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      display: block;
    }
    .contact-value {
      font-size: 14px;
      color: #1a1a1a;
      font-weight: 600;
      display: block;
    }
    .pdf-box {
      background: #e6f9f2;
      border: 2px solid #00C97B;
      padding: 16px;
      margin: 16px 0;
      text-align: center;
      border-radius: 8px;
    }
    .pdf-box h3 {
      margin: 0 0 6px 0;
      font-size: 16px;
      color: #00C97B;
    }
    .pdf-box p {
      margin: 0;
      font-size: 12px;
      color: #666;
    }
    .footer { 
      text-align: center; 
      color: #999; 
      font-size: 11px; 
      padding: 16px;
      background: #f8f9fa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Lead Notification</h1>
    </div>

    <div class="content">
      <div class="badge">NEW BOOKING</div>

      <table class="contact-table" cellpadding="0" cellspacing="0">
        <tr>
          <td class="contact-item" style="width: 48%; padding-right: 6px;">
            <span class="contact-label">Contact Name</span>
            <span class="contact-value">${booking.name}</span>
          </td>
          <td style="width: 4%;"></td>
          <td class="contact-item" style="width: 48%; padding-left: 6px;">
            <span class="contact-label">Email Address</span>
            <span class="contact-value">${booking.email}</span>
          </td>
        </tr>
        <tr><td colspan="3" style="height: 12px;"></td></tr>
        <tr>
          <td class="contact-item" style="width: 48%; padding-right: 6px;">
            <span class="contact-label">Phone Number</span>
            <span class="contact-value">${booking.phone}</span>
          </td>
          ${booking.company ? `
          <td style="width: 4%;"></td>
          <td class="contact-item" style="width: 48%; padding-left: 6px;">
            <span class="contact-label">Company Name</span>
            <span class="contact-value">${booking.company}</span>
          </td>
          ` : '<td colspan="2"></td>'}
        </tr>
      </table>

      <div class="hero-metric">
        <div class="hero-label">Recovery Opportunity</div>
        <div class="hero-value">$${potentialRecovery.toLocaleString()}</div>
        <div class="hero-subtext">Estimated from missed inbound opportunities</div>
      </div>

      <div style="background: #fff3e0; border: 2px solid #ff9800; padding: 16px; margin: 16px 0; text-align: center; border-radius: 8px;">
        <div style="font-size: 13px; font-weight: 700; color: #e65100; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Potential Budget</div>
        <div style="font-size: 10px; font-weight: 700; color: #bf360c; margin-bottom: 6px;">(Internal Use Only - Never Mention to Client)</div>
        <div style="font-size: 36px; font-weight: 700; color: #e65100; margin: 6px 0;">$${potentialBudget.toLocaleString()}</div>
      </div>

      <div class="pdf-box">
        <h3>📎 Complete Intelligence Report Attached</h3>
        <p>Open the PDF for full call analytics and actionable insights</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>Revenue Leak Diagnostic Tool</strong></p>
      <p>Automated Lead Intelligence System</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function createSalesEmailText(booking: BookingData, diagnostic: EmailDiagnosticData): string {
  const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.60);
  const totalInbound = diagnostic.totalInboundCalls ?? 0;
  const accepted = diagnostic.acceptedCalls ?? 0;
  const potentialBudget = Math.round(accepted * diagnostic.avgRevenuePerCall * 0.30);

  return `
NEW LEAD NOTIFICATION

CONTACT INFORMATION
-------------------
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
${booking.company ? `Company: ${booking.company}` : ''}

RECOVERY OPPORTUNITY
--------------------
$${potentialRecovery.toLocaleString()}
Estimated from missed inbound opportunities

POTENTIAL BUDGET (INTERNAL USE ONLY - NEVER MENTION TO CLIENT)
---------------------------------------------------------------
$${potentialBudget.toLocaleString()}

COMPLETE INTELLIGENCE REPORT ATTACHED
--------------------------------------
Open the attached PDF for:
- Full call analytics breakdown
- Revenue recovery analysis
- After-hours opportunity insights
- Actionable recommendations

---
Revenue Leak Diagnostic Tool
Automated Lead Intelligence System
  `.trim();
}

function createCustomerEmailHTML(booking: BookingData, diagnostic: EmailDiagnosticData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header { 
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #00C97B;
    }
    .header h1 { 
      margin: 0; 
      font-size: 20px; 
      font-weight: 600;
      color: #1a1a1a;
    }
    p {
      margin: 16px 0;
      color: #555;
    }
    .highlight-box {
      background: #f8f9fa;
      border-left: 4px solid #00C97B;
      padding: 16px;
      margin: 20px 0;
    }
    .stat {
      margin: 12px 0;
      font-size: 15px;
    }
    .stat strong {
      color: #1a1a1a;
    }
    .footer { 
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
      font-size: 13px; 
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Upcoming Appointment Reminder</h1>
    </div>

    <p>Hi ${booking.name.split(' ')[0]},</p>

    <p>We're looking forward to speaking with you about your phone system analysis.</p>

    <div class="highlight-box">
      <p style="margin: 0 0 12px 0; font-weight: 600;">Your Diagnostic Summary:</p>
      <div class="stat"><strong>${diagnostic.missedCalls}</strong> missed calls last month</div>
      ${diagnostic.afterHoursCalls > 0 ? `<div class="stat"><strong>${diagnostic.afterHoursCalls}</strong> after-hours calls</div>` : ''}
      <div class="stat">Estimated impact: <strong>$${diagnostic.totalLoss.toLocaleString()}</strong></div>
    </div>

    <p>During our call, we'll review these findings and discuss practical solutions to help you capture more of these opportunities.</p>

    <p>Talk soon,<br>The Bottlnekk Team</p>

    <div class="footer">
      <p>© 2025 Bottlnekk</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function createCustomerEmailText(booking: BookingData, diagnostic: EmailDiagnosticData): string {
  return `
Hi ${booking.name.split(' ')[0]},

UPCOMING APPOINTMENT REMINDER
==============================

We're looking forward to speaking with you about your phone system analysis.

YOUR DIAGNOSTIC SUMMARY
-----------------------
- ${diagnostic.missedCalls} missed calls last month
${diagnostic.afterHoursCalls > 0 ? `- ${diagnostic.afterHoursCalls} after-hours calls\n` : ''}- Estimated impact: $${diagnostic.totalLoss.toLocaleString()}

During our call, we'll review these findings and discuss practical solutions to help you capture more of these opportunities.

Talk soon,
The Bottlnekk Team

---
© 2025 Bottlnekk
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
    
    const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.60);
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

export async function sendCustomerPainEmail(
  booking: BookingData,
  diagnostic: EmailDiagnosticData | DiagnosticResult
): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    console.log('📧 Sending customer pain email to:', booking.email);
    
    const { data, error } = await client.emails.send({
      from: fromEmail || 'onboarding@resend.dev',
      to: booking.email,
      subject: `Appointment Reminder - Bottlnekk Phone System Analysis`,
      html: createCustomerEmailHTML(booking, diagnostic),
      text: createCustomerEmailText(booking, diagnostic),
    });

    if (error) {
      console.error('❌ Resend API error:', {
        name: error.name,
        message: error.message,
        statusCode: (error as any).statusCode,
      });
      throw new Error(`Failed to send customer email: ${error.message}`);
    }

    console.log('✅ Customer pain email sent successfully:', data?.id);
  } catch (error) {
    console.error('Error in sendCustomerPainEmail:', error);
    throw error;
  }
}
