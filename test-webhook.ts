// Test script to simulate a GoHighLevel webhook call

const WEBHOOK_SECRET = process.env.GOHIGHLEVEL_WEBHOOK_SECRET;
const BASE_URL = process.env.REPLIT_DEV_DOMAIN 
  ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
  : 'http://localhost:5000';

// Sample webhook payload from GoHighLevel
const webhookPayload = {
  name: "Sarah Johnson",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@hvacpros.com",
  phone: "(555) 987-6543",
  company: "Johnson HVAC Pros",
  contactEmail: "sarah.johnson@hvacpros.com",
  contactPhone: "(555) 987-6543",
  companyName: "Johnson HVAC Pros",
  diagnosticId: null, // Will use most recent diagnostic
  eventType: "appointment.booked",
  calendarId: "fix-your-phone-leak"
};

async function testWebhook() {
  console.log("🧪 Testing GoHighLevel Webhook\n");
  console.log("📍 Target URL:", `${BASE_URL}/api/webhooks/gohighlevel`);
  console.log("🔑 Using webhook secret:", WEBHOOK_SECRET ? "✅ Found" : "❌ Missing");
  console.log("\n📦 Payload:");
  console.log(JSON.stringify(webhookPayload, null, 2));
  console.log("\n🚀 Sending webhook request...\n");

  try {
    const response = await fetch(`${BASE_URL}/api/webhooks/gohighlevel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': WEBHOOK_SECRET || 'test-secret',
      },
      body: JSON.stringify(webhookPayload),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    console.log("📥 Response Status:", response.status, response.statusText);
    console.log("📄 Response:");
    console.log(JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log("\n✅ Webhook test PASSED!");
      console.log("📧 Check your email at:", process.env.SALES_EMAIL);
      console.log("📎 A PDF report should have been sent!");
    } else {
      console.log("\n❌ Webhook test FAILED!");
      console.log("Check the error above for details.");
    }
  } catch (error) {
    console.error("\n❌ Network Error:", error);
    console.log("\nMake sure the server is running on port 5000");
  }
}

testWebhook();
