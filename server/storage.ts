// Referenced integration: blueprint:javascript_database, blueprint:javascript_log_in_with_replit
import { diagnosticResults, users, vapiBookings, type SelectDiagnosticResult, type InsertDiagnosticResult, type User, type UpsertUser, type InsertVapiBooking, type SelectVapiBooking } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Diagnostic operations
  saveDiagnostic(result: InsertDiagnosticResult): Promise<SelectDiagnosticResult>;
  getDiagnostic(id: string): Promise<SelectDiagnosticResult | undefined>;
  getAllDiagnostics(): Promise<SelectDiagnosticResult[]>;
  getDiagnosticsByEmail(email: string): Promise<SelectDiagnosticResult[]>;
  // Vapi booking operations
  saveVapiBooking(booking: InsertVapiBooking): Promise<SelectVapiBooking>;
  getAllVapiBookings(): Promise<SelectVapiBooking[]>;
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async saveDiagnostic(result: InsertDiagnosticResult): Promise<SelectDiagnosticResult> {
    const [diagnostic] = await db
      .insert(diagnosticResults)
      .values(result)
      .returning();
    return diagnostic;
  }

  async getDiagnostic(id: string): Promise<SelectDiagnosticResult | undefined> {
    const [diagnostic] = await db
      .select()
      .from(diagnosticResults)
      .where(eq(diagnosticResults.id, id));
    return diagnostic || undefined;
  }

  async getAllDiagnostics(): Promise<SelectDiagnosticResult[]> {
    return await db
      .select()
      .from(diagnosticResults)
      .orderBy(desc(diagnosticResults.createdAt));
  }

  async getDiagnosticsByEmail(email: string): Promise<SelectDiagnosticResult[]> {
    return await db
      .select()
      .from(diagnosticResults)
      .where(eq(diagnosticResults.businessEmail, email))
      .orderBy(desc(diagnosticResults.createdAt));
  }

  // Vapi booking operations
  async saveVapiBooking(booking: InsertVapiBooking): Promise<SelectVapiBooking> {
    const [saved] = await db
      .insert(vapiBookings)
      .values(booking)
      .returning();
    return saved;
  }

  async getAllVapiBookings(): Promise<SelectVapiBooking[]> {
    return await db
      .select()
      .from(vapiBookings)
      .orderBy(desc(vapiBookings.createdAt));
  }

  // User operations - required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
