import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDiagnosticRequestSchema, type DiagnosticResult, type PhoneProvider } from "@shared/schema";

// Mock data generator for realistic phone system metrics
function generateMockDiagnostic(provider: PhoneProvider, businessEmail?: string): DiagnosticResult {
  // Generate realistic ranges for home service businesses
  const missedCalls = Math.floor(Math.random() * 50) + 30; // 30-80 missed calls
  const afterHoursCalls = Math.floor(Math.random() * 40) + 20; // 20-60 after-hours calls
  const abandonedCalls = Math.floor(Math.random() * 35) + 15; // 15-50 abandoned calls
  
  // Average revenue per call for home services (plumbing, HVAC, electrical)
  const avgRevenuePerCall = Math.floor(Math.random() * 200) + 250; // $250-$450 per call
  
  const totalMissedOpportunities = missedCalls + afterHoursCalls + abandonedCalls;
  const totalLoss = totalMissedOpportunities * avgRevenuePerCall;

  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return {
    totalLoss,
    missedCalls,
    afterHoursCalls,
    abandonedCalls,
    avgRevenuePerCall,
    totalMissedOpportunities,
    provider,
    month: monthName,
    businessEmail,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/diagnostic/analyze - Analyze phone system data
  app.post("/api/diagnostic/analyze", async (req, res) => {
    try {
      const validatedData = analyzeDiagnosticRequestSchema.parse(req.body);
      
      // Simulate API call delay (500-1000ms) for realistic experience
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
      const diagnosticResult = generateMockDiagnostic(validatedData.provider, validatedData.businessEmail);
      
      // Save to database
      const saved = await storage.saveDiagnostic({
        provider: diagnosticResult.provider,
        totalLoss: diagnosticResult.totalLoss,
        missedCalls: diagnosticResult.missedCalls,
        afterHoursCalls: diagnosticResult.afterHoursCalls,
        abandonedCalls: diagnosticResult.abandonedCalls,
        avgRevenuePerCall: diagnosticResult.avgRevenuePerCall,
        totalMissedOpportunities: diagnosticResult.totalMissedOpportunities,
        month: diagnosticResult.month,
        businessEmail: diagnosticResult.businessEmail || null,
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

  const httpServer = createServer(app);

  return httpServer;
}
