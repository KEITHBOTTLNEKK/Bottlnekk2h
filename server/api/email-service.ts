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
      padding: 40px;
    }
    .badge {
      display: inline-block;
      background: #4caf50;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 30px;
    }
    .hero-metric { 
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      padding: 40px; 
      margin: 30px 0; 
      text-align: center;
      border-radius: 10px;
      border: 2px solid #4caf50;
    }
    .hero-label { 
      font-size: 14px; 
      color: #2e7d32; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 2px; 
      margin-bottom: 15px; 
    }
    .hero-value { 
      font-size: 58px; 
      font-weight: 700; 
      color: #1b5e20; 
      line-height: 1;
      margin: 15px 0;
    }
    .hero-subtext { 
      font-size: 15px; 
      color: #2e7d32; 
      margin-top: 12px;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 30px 0;
    }
    .contact-item {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 3px solid #0066cc;
    }
    .contact-label {
      font-size: 11px;
      font-weight: 700;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .contact-value {
      font-size: 16px;
      color: #1a1a1a;
      font-weight: 600;
    }
    .pdf-box {
      background: #f0f9ff;
      border: 2px solid #0066cc;
      padding: 30px;
      margin: 35px 0;
      text-align: center;
      border-radius: 10px;
    }
    .pdf-box h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: #0066cc;
    }
    .pdf-box p {
      margin: 0;
      font-size: 14px;
      color: #666;
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
      <h1>New Lead Notification</h1>
    </div>

    <div class="content">
      <div class="badge">NEW BOOKING</div>

      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-label">Contact Name</div>
          <div class="contact-value">${booking.name}</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Email Address</div>
          <div class="contact-value">${booking.email}</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Phone Number</div>
          <div class="contact-value">${booking.phone}</div>
        </div>
        ${booking.company ? `
        <div class="contact-item">
          <div class="contact-label">Company Name</div>
          <div class="contact-value">${booking.company}</div>
        </div>
        ` : ''}
      </div>

      <div class="hero-metric">
        <div class="hero-label">Recovery Opportunity</div>
        <div class="hero-value">$${potentialRecovery.toLocaleString()}</div>
        <div class="hero-subtext">Estimated revenue recovery potential</div>
      </div>

      <div class="pdf-box">
        <h3>📎 Complete Intelligence Report Attached</h3>
        <p>Open the PDF for full call analytics, revenue breakdown, and actionable insights</p>
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

function createSalesEmailText(booking: BookingData, diagnostic: DiagnosticResult): string {
  const potentialRecovery = Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.35);

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
Estimated revenue recovery potential

COMPLETE INTELLIGENCE REPORT ATTACHED
--------------------------------------
Open the attached PDF for:
- Full call analytics breakdown
- Revenue recovery calculation
- After-hours opportunity analysis
- Actionable insights and recommendations

---
Revenue Leak Diagnostic Tool
Automated Lead Intelligence System
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
