// Referenced integration: blueprint:javascript_database
import { diagnosticResults, type SelectDiagnosticResult, type InsertDiagnosticResult } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  saveDiagnostic(result: InsertDiagnosticResult): Promise<SelectDiagnosticResult>;
  getDiagnostic(id: string): Promise<SelectDiagnosticResult | undefined>;
  getAllDiagnostics(): Promise<SelectDiagnosticResult[]>;
  getDiagnosticsByEmail(email: string): Promise<SelectDiagnosticResult[]>;
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
}

export const storage = new DatabaseStorage();
