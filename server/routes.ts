import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDiagnosticRequestSchema, bookingSchema, type DiagnosticResult, type PhoneProvider } from "@shared/schema";
import { sendSalesIntelligenceEmail } from "./api/email-service";
import { registerRingCentralOAuth } from "./oauth/ringcentral";
import { fetchRingCentralAnalytics } from "./api/ringcentral-client";
import { registerZoomOAuth } from "./oauth/zoom";
import { fetchZoomPhoneAnalytics } from "./api/zoom-client";

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
      
      // Save to database with user's email from session or request
      // Note: We'll update this to capture email when we have user authentication
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
        businessEmail: req.body.email || null, // Capture email if provided
      });
      
      res.json(diagnosticResult);
    } catch (error) {
      console.error("Error analyzing diagnostic:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Invalid request" 
      });
    }
  });

  // GET /api/diagnostics - Get all diagnostics (for admin/history)
  app.get("/api/diagnostics", async (req, res) => {
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
    try {
      // Verify webhook secret for security
      const webhookSecret = req.headers['x-webhook-secret'] || req.body.webhookSecret;
      const expectedSecret = process.env.GOHIGHLEVEL_WEBHOOK_SECRET;
      
      if (!expectedSecret) {
        console.error("⚠️ GOHIGHLEVEL_WEBHOOK_SECRET not configured");
        return res.status(500).json({ error: "Webhook not configured" });
      }

      if (webhookSecret !== expectedSecret) {
        console.error("🚫 Invalid webhook secret");
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("📅 GoHighLevel webhook received:", JSON.stringify(req.body, null, 2));

      // Extract booking data from GHL webhook
      // GHL sends different formats, try to extract contact info
      const name = req.body.name || `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim();
      const email = req.body.email || req.body.contactEmail;
      const phone = req.body.phone || req.body.contactPhone;
      const company = req.body.company || req.body.companyName;

      if (!name || !email) {
        console.error("⚠️ Missing required fields from webhook:", { name, email });
        return res.status(400).json({ error: "Missing required booking data" });
      }

      // Get the most recent diagnostic
      // Since we don't currently capture email during analysis, we use the most recent diagnostic
      // This assumes users book shortly after running their analysis
      const allDiagnostics = await storage.getAllDiagnostics();
      
      if (!allDiagnostics || allDiagnostics.length === 0) {
        console.error("⚠️ No diagnostic data found for booking");
        return res.status(400).json({ error: "No diagnostic data found" });
      }

      // Use the most recently created diagnostic
      // Sort by createdAt descending to get newest first
      const sortedDiagnostics = allDiagnostics.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      const diagnostic = sortedDiagnostics[0];

      console.log("📊 Using diagnostic from:", diagnostic.createdAt, "for booking by:", email);

      // Send sales intelligence email
      try {
        await sendSalesIntelligenceEmail(
          {
            name,
            email,
            phone: phone || "Not provided",
            company,
          },
          {
            provider: diagnostic.provider as any,
            totalLoss: diagnostic.totalLoss,
            missedCalls: diagnostic.missedCalls,
            afterHoursCalls: diagnostic.afterHoursCalls,
            avgRevenuePerCall: diagnostic.avgRevenuePerCall,
            totalMissedOpportunities: diagnostic.totalMissedOpportunities,
            month: diagnostic.month,
            totalInboundCalls: diagnostic.totalInboundCalls || 0,
            acceptedCalls: diagnostic.acceptedCalls || 0,
            avgCallbackTimeMinutes: diagnostic.avgCallbackTimeMinutes || null,
          }
        );
        console.log("✅ Sales intelligence email sent for GHL booking");
      } catch (emailError) {
        console.error("⚠️ Failed to send sales email from webhook:", emailError);
      }

      res.json({ success: true, message: "Webhook processed successfully" });
    } catch (error) {
      console.error("❌ Error processing GHL webhook:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Webhook processing failed" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
