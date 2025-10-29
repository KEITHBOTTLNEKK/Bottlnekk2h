import { z } from "zod";
import { pgTable, varchar, integer, timestamp, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

// Phone System Providers - Top Enterprise VOIP Solutions
export const phoneProviders = ["RingCentral", "Vonage", "Nextiva", "8x8", "Zoom Phone"] as const;
export type PhoneProvider = typeof phoneProviders[number];

// Database Tables
export const diagnosticResults = pgTable("diagnostic_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: varchar("provider").notNull(),
  totalLoss: integer("total_loss").notNull(),
  missedCalls: integer("missed_calls").notNull(),
  afterHoursCalls: integer("after_hours_calls").notNull(),
  avgRevenuePerCall: integer("avg_revenue_per_call").notNull(),
  totalMissedOpportunities: integer("total_missed_opportunities").notNull(),
  month: text("month").notNull(),
  businessEmail: text("business_email"),
  // Sales intelligence metrics
  totalInboundCalls: integer("total_inbound_calls").notNull(),
  acceptedCalls: integer("accepted_calls").notNull(),
  avgCallbackTimeMinutes: integer("avg_callback_time_minutes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const oauthConnections = pgTable("oauth_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: varchar("provider").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  userId: text("user_id"),
  accountId: text("account_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  providerAccountUnique: uniqueIndex("provider_account_unique").on(table.provider, table.accountId),
}));

// Zod Schemas
export const diagnosticResultSchema = z.object({
  totalLoss: z.number(),
  missedCalls: z.number(),
  afterHoursCalls: z.number(),
  avgRevenuePerCall: z.number(),
  totalMissedOpportunities: z.number(),
  provider: z.enum(phoneProviders),
  month: z.string(),
  // Sales intelligence metrics
  totalInboundCalls: z.number(),
  acceptedCalls: z.number(),
  avgCallbackTimeMinutes: z.number().nullable(),
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

// OAuth Connection schemas
export const insertOAuthConnectionSchema = createInsertSchema(oauthConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOAuthConnection = z.infer<typeof insertOAuthConnectionSchema>;
export type SelectOAuthConnection = typeof oauthConnections.$inferSelect;
