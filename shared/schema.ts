import { z } from "zod";
import { pgTable, varchar, integer, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

// Phone System Providers
export const phoneProviders = ["CallRail", "GoHighLevel", "RingCentral", "Nextiva"] as const;
export type PhoneProvider = typeof phoneProviders[number];

// Database Tables
export const diagnosticResults = pgTable("diagnostic_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: varchar("provider").notNull(),
  totalLoss: integer("total_loss").notNull(),
  missedCalls: integer("missed_calls").notNull(),
  afterHoursCalls: integer("after_hours_calls").notNull(),
  abandonedCalls: integer("abandoned_calls").notNull(),
  avgRevenuePerCall: integer("avg_revenue_per_call").notNull(),
  totalMissedOpportunities: integer("total_missed_opportunities").notNull(),
  month: text("month").notNull(),
  businessEmail: text("business_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod Schemas
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

// Insert schema for database operations
export const insertDiagnosticResultSchema = createInsertSchema(diagnosticResults).omit({
  id: true,
  createdAt: true,
});

export type InsertDiagnosticResult = z.infer<typeof insertDiagnosticResultSchema>;
export type SelectDiagnosticResult = typeof diagnosticResults.$inferSelect;

// API Request/Response types
export const analyzeDiagnosticRequestSchema = z.object({
  provider: z.enum(phoneProviders),
});

export type AnalyzeDiagnosticRequest = z.infer<typeof analyzeDiagnosticRequestSchema>;

// Booking schema
export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().optional(),
  diagnosticData: z.object({
    totalLoss: z.number(),
    provider: z.enum(phoneProviders),
  }),
});

export type BookingRequest = z.infer<typeof bookingSchema>;
