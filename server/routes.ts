import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDiagnosticRequestSchema, bookingSchema, type DiagnosticResult, type PhoneProvider } from "@shared/schema";
import { sendSalesIntelligenceEmail, sendCustomerPainEmail } from "./api/email-service";
import { registerRingCentralOAuth } from "./oauth/ringcentral";
import { fetchRingCentralAnalytics } from "./api/ringcentral-client";
import { registerZoomOAuth } from "./oauth/zoom";
import { fetchZoomPhoneAnalytics } from "./api/zoom-client";
import { detectIndustry } from "./utils/industry-detector";
import { db } from "./db";
import { oauthConnections } from "@shared/schema";
import { eq } from "drizzle-orm";

// Helper function for currency formatting
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}


export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth - reference: blueprint:javascript_log_in_with_replit
  const { setupAuth, isAuthenticated } = await import("./replitAuth");
  await setupAuth(app);

  // Auth endpoint
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Register OAuth routes
  registerRingCentralOAuth(app);
  registerZoomOAuth(app);

  // POST /api/diagnostic/analyze - Analyze phone system data
  app.post("/api/diagnostic/analyze", async (req, res) => {
    try {
      const validatedData = analyzeDiagnosticRequestSchema.parse(req.body);
      const avgDealSize = req.body.avgDealSize || 350; // Use custom deal size or default
      
      let diagnosticResult: DiagnosticResult;

      // Fetch real data from connected providers only
      if (validatedData.provider === "RingCentral") {
        const realData = await fetchRingCentralAnalytics(avgDealSize);
        if (!realData) {
          return res.status(400).json({ 
            error: "Please connect your RingCentral account to analyze your call data." 
          });
        }
        diagnosticResult = realData;
      } else if (validatedData.provider === "Zoom Phone") {
        const realData = await fetchZoomPhoneAnalytics(avgDealSize);
        if (!realData) {
          return res.status(400).json({ 
            error: "Your Zoom account doesn't have Zoom Phone enabled. Contact Zoom to activate it." 
          });
        }
        diagnosticResult = realData;
      } else {
        // Other providers not yet implemented
        return res.status(400).json({ 
          error: `${validatedData.provider} integration is coming soon. Currently only RingCentral and Zoom Phone are supported.` 
        });
      }
      
      // Get company name from OAuth connection
      const connection = await db.query.oauthConnections.findFirst({
        where: eq(oauthConnections.provider, validatedData.provider),
      });
      
      const companyName = connection?.companyName || null;
      const industry = companyName ? detectIndustry(companyName) : null;
      
      console.log("Company info:", { companyName, industry });
      
      // Save to database
      const saved = await storage.saveDiagnostic({
        provider: diagnosticResult.provider,
        totalLoss: diagnosticResult.totalLoss,
        missedCalls: diagnosticResult.missedCalls,
        afterHoursCalls: diagnosticResult.afterHoursCalls,
        avgRevenuePerCall: diagnosticResult.avgRevenuePerCall,
        totalMissedOpportunities: diagnosticResult.totalMissedOpportunities,
        month: diagnosticResult.month,
        totalInboundCalls: diagnosticResult.totalInboundCalls,
        acceptedCalls: diagnosticResult.acceptedCalls,
        avgCallbackTimeMinutes: diagnosticResult.avgCallbackTimeMinutes,
        businessEmail: null,
        companyName,
        industry,
      });
      
      // Return diagnostic with ID for session tracking
      res.json({
        ...diagnosticResult,
        companyName,
        industry,
        diagnosticId: saved.id, // Include ID for booking flow
      });
    } catch (error) {
      console.error("Error analyzing diagnostic:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Invalid request" 
      });
    }
  });

  // GET /api/diagnostics - Get all diagnostics (protected - admin only)
  app.get("/api/diagnostics", isAuthenticated, async (req, res) => {
    try {
      const diagnostics = await storage.getAllDiagnostics();
      res.json(diagnostics);
    } catch (error) {
      console.error("Error fetching diagnostics:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch diagnostics" 
      });
    }
  });

  // GET /api/diagnostics/:email - Get diagnostics by email
  app.get("/api/diagnostics/:email", async (req, res) => {
    try {
      const diagnostics = await storage.getDiagnosticsByEmail(req.params.email);
      res.json(diagnostics);
    } catch (error) {
      console.error("Error fetching diagnostics by email:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch diagnostics" 
      });
    }
  });

  // POST /api/bookings - Submit booking request (deprecated - use webhook)
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = bookingSchema.parse(req.body);
      
      console.log("Booking request received:", {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        totalLoss: validatedData.diagnosticData.totalLoss,
      });

      // Send sales intelligence email to sales team
      try {
        await sendSalesIntelligenceEmail(
          {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            company: validatedData.company,
          },
          validatedData.diagnosticData
        );
        console.log("✅ Sales intelligence email sent successfully");
      } catch (emailError) {
        // Log error but don't fail the booking - email is a nice-to-have
        console.error("⚠️ Failed to send sales email (booking still recorded):", emailError);
      }
      
      res.json({ success: true, message: "Booking request received" });
    } catch (error) {
      console.error("Error processing booking:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Invalid booking request" 
      });
    }
  });

  // POST /api/webhooks/gohighlevel - GoHighLevel calendar booking webhook
  app.post("/api/webhooks/gohighlevel", async (req, res) => {
    console.log("\n🔔 ============ WEBHOOK RECEIVED ============");
    console.log("📥 Headers:", JSON.stringify(req.headers, null, 2));
    console.log("📦 Body:", JSON.stringify(req.body, null, 2));
    console.log("==========================================\n");
    
    try {
      // Verify webhook secret for security
      const webhookSecret = req.headers['x-webhook-secret'] || req.body.webhookSecret;
      const expectedSecret = process.env.GOHIGHLEVEL_WEBHOOK_SECRET;
      
      if (!expectedSecret) {
        console.error("⚠️ GOHIGHLEVEL_WEBHOOK_SECRET not configured");
        return res.status(500).json({ error: "Webhook not configured" });
      }

      // TEMPORARY: Log secret mismatch but allow through for debugging
      if (webhookSecret !== expectedSecret) {
        console.error("⚠️ WARNING: Webhook secret mismatch (allowing through for debugging)");
        console.error("Received:", webhookSecret ? `${webhookSecret.substring(0, 3)}...${webhookSecret.substring(webhookSecret.length - 3)}` : 'undefined');
        console.error("Expected:", expectedSecret ? `${expectedSecret.substring(0, 3)}...${expectedSecret.substring(expectedSecret.length - 3)}` : 'undefined');
        console.error("Received length:", webhookSecret?.length, "Expected length:", expectedSecret?.length);
        // TEMPORARY: Don't return 401, continue processing
        // return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("📅 GoHighLevel webhook received:", JSON.stringify(req.body, null, 2));

      // Extract booking data from GHL webhook
      const name = req.body.name || `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim();
      const email = req.body.email || req.body.contactEmail;
      const phone = req.body.phone || req.body.contactPhone;
      const company = req.body.company || req.body.companyName;
      const diagnosticId = req.body.diagnosticId || req.body.diagnostic_id;

      if (!name || !email) {
        console.error("⚠️ Missing required fields from webhook:", { name, email });
        return res.status(400).json({ error: "Missing required booking data" });
      }

      let diagnostic;

      // Try to get diagnostic by ID first (most accurate)
      if (diagnosticId) {
        console.log("🔍 Looking up diagnostic by ID:", diagnosticId);
        diagnostic = await storage.getDiagnostic(diagnosticId);
        
        if (diagnostic) {
          console.log("✅ Found exact diagnostic match for booking");
        } else {
          console.warn("⚠️ Diagnostic ID not found:", diagnosticId);
        }
      }

      // Fallback to most recent diagnostic if ID not provided or not found
      if (!diagnostic) {
        console.log("📊 Falling back to most recent diagnostic");
        const allDiagnostics = await storage.getAllDiagnostics();
        
        if (!allDiagnostics || allDiagnostics.length === 0) {
          console.error("⚠️ No diagnostic data found for booking by:", email);
          // Return 200 to prevent GHL retries, but log the issue
          return res.status(200).json({ 
            success: false, 
            message: "No diagnostic data available - email not sent" 
          });
        }

        // getAllDiagnostics already returns sorted by createdAt desc
        diagnostic = allDiagnostics[0];
        console.log("📊 Using fallback diagnostic from:", diagnostic.createdAt, "for booking by:", email);
      }

      // Send sales intelligence email and customer pain email
      let salesEmailSent = false;
      let customerEmailSent = false;
      let emailError = null;
      
      const bookingData = {
        name,
        email,
        phone: phone || "Not provided",
        company,
      };

      // For sales email: use full diagnostic (needs PDF generation)
      const fullDiagnosticResult: DiagnosticResult = {
        provider: diagnostic.provider as PhoneProvider,
        totalLoss: diagnostic.totalLoss,
        missedCalls: diagnostic.missedCalls,
        afterHoursCalls: diagnostic.afterHoursCalls,
        avgRevenuePerCall: diagnostic.avgRevenuePerCall,
        totalMissedOpportunities: diagnostic.totalMissedOpportunities,
        month: diagnostic.month,
        totalInboundCalls: diagnostic.totalInboundCalls || 0,
        acceptedCalls: diagnostic.acceptedCalls || 0,
        avgCallbackTimeMinutes: diagnostic.avgCallbackTimeMinutes || null,
        companyName: diagnostic.companyName || undefined,
        industry: diagnostic.industry || undefined,
      };

      // For customer email: lighter data (no PDF needed)
      const lightDiagnosticData = {
        totalLoss: diagnostic.totalLoss,
        missedCalls: diagnostic.missedCalls,
        afterHoursCalls: diagnostic.afterHoursCalls,
        avgRevenuePerCall: diagnostic.avgRevenuePerCall,
        totalMissedOpportunities: diagnostic.totalMissedOpportunities,
      };
      
      try {
        await sendSalesIntelligenceEmail(bookingData, fullDiagnosticResult);
        console.log("✅ Sales intelligence email sent for GHL booking");
        salesEmailSent = true;
      } catch (error) {
        emailError = error instanceof Error ? error.message : String(error);
        console.error("❌ CRITICAL: Failed to send sales email from webhook:", {
          error: emailError,
          booking: { name, email },
          diagnosticId: diagnostic.id,
        });
      }

      // Skip customer pain email - it will be sent 1 day before appointment via separate endpoint
      console.log("ℹ️ Customer pain email will be sent via delayed workflow (1 day before meeting)");

      res.json({ 
        success: true, 
        message: "Webhook processed - sales email sent immediately",
        salesEmailSent,
        customerEmailSent: false,
        emailError: emailError || undefined,
      });
    } catch (error) {
      console.error("❌ Error processing GHL webhook:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Webhook processing failed" 
      });
    }
  });

  // POST /api/webhooks/send-pain-email - Send customer pain email (delayed trigger)
  app.post("/api/webhooks/send-pain-email", async (req, res) => {
    console.log("\n📧 ============ PAIN EMAIL TRIGGER ============");
    console.log("📥 Headers:", JSON.stringify(req.headers, null, 2));
    console.log("📦 Body:", JSON.stringify(req.body, null, 2));
    console.log("============================================\n");
    
    try {
      // Verify webhook secret
      const webhookSecret = req.headers['x-webhook-secret'] || req.body.webhookSecret;
      const expectedSecret = process.env.GOHIGHLEVEL_WEBHOOK_SECRET;
      
      if (!expectedSecret) {
        console.error("⚠️ GOHIGHLEVEL_WEBHOOK_SECRET not configured");
        return res.status(500).json({ error: "Webhook not configured" });
      }

      // TEMPORARY: Log secret mismatch but allow through for debugging
      if (webhookSecret !== expectedSecret) {
        console.error("⚠️ WARNING: Pain email webhook secret mismatch (allowing through for debugging)");
        console.error("Received:", webhookSecret ? `${webhookSecret.substring(0, 3)}...${webhookSecret.substring(webhookSecret.length - 3)}` : 'undefined');
        console.error("Expected:", expectedSecret ? `${expectedSecret.substring(0, 3)}...${expectedSecret.substring(expectedSecret.length - 3)}` : 'undefined');
        console.error("Received length:", webhookSecret?.length, "Expected length:", expectedSecret?.length);
        // TEMPORARY: Don't return 401, continue processing
        // return res.status(401).json({ error: "Unauthorized" });
      }

      // Extract data from request
      const name = req.body.name || req.body.contact_name || `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim();
      const email = req.body.email || req.body.contactEmail || req.body.contact_email;
      const phone = req.body.phone || req.body.contactPhone;
      const company = req.body.company || req.body.companyName;
      const diagnosticId = req.body.diagnosticId || req.body.diagnostic_id;

      if (!email) {
        console.error("⚠️ Missing email in pain email request");
        return res.status(400).json({ error: "Email is required" });
      }

      let diagnostic;

      // Try to get diagnostic by ID first
      if (diagnosticId) {
        console.log("🔍 Looking up diagnostic by ID:", diagnosticId);
        diagnostic = await storage.getDiagnostic(diagnosticId);
      }

      // Fallback to most recent diagnostic
      if (!diagnostic) {
        console.log("📊 Falling back to most recent diagnostic");
        const allDiagnostics = await storage.getAllDiagnostics();
        
        if (!allDiagnostics || allDiagnostics.length === 0) {
          console.error("⚠️ No diagnostic data found");
          return res.status(404).json({ 
            error: "No diagnostic data available - cannot send pain email" 
          });
        }

        diagnostic = allDiagnostics[0];
      }

      const bookingData = {
        name: name || "Valued Customer",
        email,
        phone: phone || "Not provided",
        company,
      };

      const lightDiagnosticData = {
        totalLoss: diagnostic.totalLoss,
        missedCalls: diagnostic.missedCalls,
        afterHoursCalls: diagnostic.afterHoursCalls,
        avgRevenuePerCall: diagnostic.avgRevenuePerCall,
        totalMissedOpportunities: diagnostic.totalMissedOpportunities,
      };
      
      await sendCustomerPainEmail(bookingData, lightDiagnosticData);
      console.log("✅ Customer pain email sent successfully to:", email);

      res.json({ 
        success: true, 
        message: "Pain email sent successfully",
        email,
      });
    } catch (error) {
      console.error("❌ Error sending pain email:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to send pain email" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
