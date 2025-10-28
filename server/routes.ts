import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDiagnosticRequestSchema, bookingSchema, type DiagnosticResult, type PhoneProvider } from "@shared/schema";
import { getUncachableResendClient } from "./resend-client";
import { generateDiagnosticEmailHtml, generateDiagnosticEmailText } from "./email-templates";
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
      
      // Save to database
      const saved = await storage.saveDiagnostic({
        provider: diagnosticResult.provider,
        totalLoss: diagnosticResult.totalLoss,
        missedCalls: diagnosticResult.missedCalls,
        afterHoursCalls: diagnosticResult.afterHoursCalls,
        avgRevenuePerCall: diagnosticResult.avgRevenuePerCall,
        totalMissedOpportunities: diagnosticResult.totalMissedOpportunities,
        month: diagnosticResult.month,
        businessEmail: null,
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

  // POST /api/bookings - Submit booking request
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

      // TODO: Send booking notification email to sales team
      // For now, just log the booking
      
      res.json({ success: true, message: "Booking request received" });
    } catch (error) {
      console.error("Error processing booking:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Invalid booking request" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
