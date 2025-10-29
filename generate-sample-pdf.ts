import { generateDiagnosticPDF } from './server/api/pdf-generator';
import { writeFileSync } from 'fs';

// Sample booking data
const sampleBooking = {
  name: "John Smith",
  email: "john.smith@acmeplumbing.com",
  phone: "(555) 123-4567",
  company: "ACME Plumbing & Heating"
};

// Sample diagnostic result with realistic data
const sampleDiagnostic = {
  provider: "RingCentral" as const,
  totalLoss: 11550,
  missedCalls: 33,
  afterHoursCalls: 12,
  avgRevenuePerCall: 350,
  totalMissedOpportunities: 33,
  month: "October 2025",
  totalInboundCalls: 156,
  acceptedCalls: 123,
  avgCallbackTimeMinutes: 47,
  companyName: "ACME Plumbing & Heating",
  industry: "Plumbing"
};

async function generateSample() {
  console.log("📄 Generating sample sales intelligence PDF...");
  
  try {
    const pdfBuffer = await generateDiagnosticPDF(sampleBooking, sampleDiagnostic);
    
    const filename = 'sample-sales-intelligence-report.pdf';
    writeFileSync(filename, pdfBuffer);
    
    console.log(`✅ PDF generated successfully: ${filename}`);
    console.log(`📊 Sample data used:`);
    console.log(`   - Company: ${sampleBooking.company}`);
    console.log(`   - Total Loss: $${sampleDiagnostic.totalLoss.toLocaleString()}`);
    console.log(`   - Missed Calls: ${sampleDiagnostic.missedCalls}`);
    console.log(`   - After-Hours: ${sampleDiagnostic.afterHoursCalls}`);
    console.log(`   - Potential Recovery: $${Math.round(sampleDiagnostic.missedCalls * sampleDiagnostic.avgRevenuePerCall * 0.60).toLocaleString()}`);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    process.exit(1);
  }
}

generateSample();
