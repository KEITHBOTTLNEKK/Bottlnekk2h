import { z } from "zod";

// Phone System Providers
export const phoneProviders = ["CallRail", "GoHighLevel", "RingCentral", "Nextiva"] as const;
export type PhoneProvider = typeof phoneProviders[number];

// Diagnostic Analysis Result
export const diagnosticResultSchema = z.object({
  totalLoss: z.number(),
  missedCalls: z.number(),
  afterHoursCalls: z.number(),
  abandonedCalls: z.number(),
  avgRevenuePerCall: z.number(),
  totalMissedOpportunities: z.number(),
  provider: z.enum(phoneProviders),
  month: z.string(),
});

export type DiagnosticResult = z.infer<typeof diagnosticResultSchema>;

// API Request/Response types
export const analyzeDiagnosticRequestSchema = z.object({
  provider: z.enum(phoneProviders),
});

export type AnalyzeDiagnosticRequest = z.infer<typeof analyzeDiagnosticRequestSchema>;
