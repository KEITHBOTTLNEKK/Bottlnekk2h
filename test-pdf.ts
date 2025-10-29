import { generateDiagnosticPDF } from './server/api/pdf-generator';
import { writeFileSync } from 'fs';

const sampleBooking = {
  name: "John Smith",
  email: "john@smithplumbing.com",
  phone: "(555) 123-4567",
  company: "Smith Plumbing & Heating"
};

const sampleDiagnostic = {
  provider: "RingCentral" as const,
  totalLoss: 17000,
  missedCalls: 17,
  afterHoursCalls: 6,
  avgRevenuePerCall: 1000,
  totalMissedOpportunities: 17,
  month: "October 2025",
  totalInboundCalls: 85,
  acceptedCalls: 68,
  avgCallbackTimeMinutes: 142,
  companyName: "Smith Plumbing & Heating",
  industry: "Plumbing"
};

async function generateTestPDF() {
  console.log('📄 Generating test PDF...');
  const pdfBuffer = await generateDiagnosticPDF(sampleBooking, sampleDiagnostic);
  writeFileSync('sample-report.pdf', pdfBuffer);
  console.log('✅ PDF saved to sample-report.pdf');
  console.log('');
  console.log('📊 Report Details:');
  console.log(`   Recovery Opportunity: $${Math.round(17 * 1000 * 0.60).toLocaleString()}`);
  console.log(`   Potential Budget: $${Math.round(68 * 1000 * 0.30).toLocaleString()}`);
  console.log(`   After-Hours Calls: 6 of 17`);
}

generateTestPDF().catch(console.error);
