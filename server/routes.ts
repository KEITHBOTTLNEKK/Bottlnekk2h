import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDiagnosticRequestSchema, type DiagnosticResult, type PhoneProvider } from "@shared/schema";

// Mock data generator for realistic phone system metrics
function generateMockDiagnostic(provider: PhoneProvider): DiagnosticResult {
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
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/diagnostic/analyze - Analyze phone system data
  app.post("/api/diagnostic/analyze", async (req, res) => {
    try {
      const validatedData = analyzeDiagnosticRequestSchema.parse(req.body);
      
      // Simulate API call delay (500-1000ms) for realistic experience
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
      const diagnosticResult = generateMockDiagnostic(validatedData.provider);
      
      // Save to storage
      const saved = await storage.saveDiagnostic(diagnosticResult);
      
      res.json(diagnosticResult);
    } catch (error) {
      console.error("Error analyzing diagnostic:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Invalid request" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
