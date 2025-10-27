import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDiagnosticRequestSchema, bookingSchema, type DiagnosticResult, type PhoneProvider } from "@shared/schema";
import { getUncachableResendClient } from "./resend-client";
import { generateDiagnosticEmailHtml, generateDiagnosticEmailText } from "./email-templates";
import { registerRingCentralOAuth } from "./oauth/ringcentral";
import { fetchRingCentralAnalytics } from "./api/ringcentral-client";

// Helper function for currency formatting
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Mock data generator for realistic phone system metrics
function generateMockDiagnostic(provider: PhoneProvider): DiagnosticResult {
  // Steve Jobs simplicity: just count missed opportunities
  const missedCalls = Math.floor(Math.random() * 50) + 30; // 30-80 missed calls
  const afterHoursCalls = Math.floor(Math.random() * Math.min(missedCalls, 30)) + 10; // Subset of missed calls
  
  // Average revenue per call for home services (plumbing, HVAC, electrical)
  const avgRevenuePerCall = Math.floor(Math.random() * 200) + 250; // $250-$450 per call
  
  const totalMissedOpportunities = missedCalls;
  const totalLoss = totalMissedOpportunities * avgRevenuePerCall;

  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return {
    totalLoss,
    missedCalls,
    afterHoursCalls,
    avgRevenuePerCall,
    totalMissedOpportunities,
    provider,
    month: monthName,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Register OAuth routes
  registerRingCentralOAuth(app);

  // POST /api/diagnostic/analyze - Analyze phone system data
  app.post("/api/diagnostic/analyze", async (req, res) => {
    try {
      const validatedData = analyzeDiagnosticRequestSchema.parse(req.body);
      
      let diagnosticResult: DiagnosticResult;

      // Try to fetch real data for RingCentral if connected
      if (validatedData.provider === "RingCentral") {
        const realData = await fetchRingCentralAnalytics();
        if (realData) {
          diagnosticResult = realData;
        } else {
          // Fall back to mock data if not connected
          diagnosticResult = generateMockDiagnostic(validatedData.provider);
        }
      } else {
        // Use mock data for other providers
        diagnosticResult = generateMockDiagnostic(validatedData.provider);
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
