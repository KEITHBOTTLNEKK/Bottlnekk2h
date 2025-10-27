import type { DiagnosticResult } from "@shared/schema";

export function generateDiagnosticEmailHtml(result: DiagnosticResult): string {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Revenue Leak Diagnostic Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 40px;">
              <h1 style="font-size: 42px; font-weight: 200; margin: 0; letter-spacing: -0.02em; color: #ffffff;">
                Your Revenue Leak Report
              </h1>
            </td>
          </tr>

          <!-- Main Loss Number -->
          <tr>
            <td align="center" style="padding: 40px 0; border-top: 1px solid rgba(255, 255, 255, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="font-size: 72px; font-weight: 100; color: #ffffff; margin-bottom: 16px; letter-spacing: -0.03em;">
                ${formatCurrency(result.totalLoss)}
              </div>
              <p style="font-size: 18px; font-weight: 200; color: #9CA3AF; margin: 0; letter-spacing: 0.01em;">
                lost this month from ${formatNumber(result.totalMissedOpportunities)} missed opportunities
              </p>
            </td>
          </tr>

          <!-- Breakdown -->
          <tr>
            <td style="padding: 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding: 20px; vertical-align: top;">
                    <div style="font-size: 11px; font-weight: 300; color: #6B7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
                      Missed Calls
                    </div>
                    <div style="font-size: 36px; font-weight: 100; color: #ffffff; letter-spacing: -0.02em;">
                      ${formatNumber(result.missedCalls)}
                    </div>
                  </td>
                  <td width="50%" style="padding: 20px; vertical-align: top;">
                    <div style="font-size: 11px; font-weight: 300; color: #6B7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
                      After-Hours Calls
                    </div>
                    <div style="font-size: 36px; font-weight: 100; color: #ffffff; letter-spacing: -0.02em;">
                      ${formatNumber(result.afterHoursCalls)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 20px; vertical-align: top;">
                    <div style="font-size: 11px; font-weight: 300; color: #6B7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
                      Abandoned Calls
                    </div>
                    <div style="font-size: 36px; font-weight: 100; color: #ffffff; letter-spacing: -0.02em;">
                      ${formatNumber(result.abandonedCalls)}
                    </div>
                  </td>
                  <td width="50%" style="padding: 20px; vertical-align: top;">
                    <div style="font-size: 11px; font-weight: 300; color: #6B7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
                      Avg Revenue Per Call
                    </div>
                    <div style="font-size: 36px; font-weight: 100; color: #ffffff; letter-spacing: -0.02em;">
                      ${formatCurrency(result.avgRevenuePerCall)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 40px 0; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="font-size: 12px; font-weight: 300; color: #6B7280; margin: 0; letter-spacing: 0.02em;">
                Data analyzed from ${result.provider} • ${result.month}
              </p>
              <p style="font-size: 12px; font-weight: 300; color: #6B7280; margin: 16px 0 0 0; letter-spacing: 0.02em;">
                Revenue Leak Diagnostic Tool
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateDiagnosticEmailText(result: DiagnosticResult): string {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return `
YOUR REVENUE LEAK REPORT

${formatCurrency(result.totalLoss)}
Lost this month from ${formatNumber(result.totalMissedOpportunities)} missed opportunities

BREAKDOWN:

Missed Calls: ${formatNumber(result.missedCalls)}
After-Hours Calls: ${formatNumber(result.afterHoursCalls)}
Abandoned Calls: ${formatNumber(result.abandonedCalls)}
Avg Revenue Per Call: ${formatCurrency(result.avgRevenuePerCall)}

---
Data analyzed from ${result.provider} • ${result.month}
Revenue Leak Diagnostic Tool
  `.trim();
}
