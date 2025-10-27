import type { DiagnosticResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  saveDiagnostic(result: DiagnosticResult): Promise<DiagnosticResult & { id: string }>;
  getDiagnostic(id: string): Promise<(DiagnosticResult & { id: string }) | undefined>;
}

export class MemStorage implements IStorage {
  private diagnostics: Map<string, DiagnosticResult & { id: string }>;

  constructor() {
    this.diagnostics = new Map();
  }

  async saveDiagnostic(result: DiagnosticResult): Promise<DiagnosticResult & { id: string }> {
    const id = randomUUID();
    const diagnostic = { ...result, id };
    this.diagnostics.set(id, diagnostic);
    return diagnostic;
  }

  async getDiagnostic(id: string): Promise<(DiagnosticResult & { id: string }) | undefined> {
    return this.diagnostics.get(id);
  }
}

export const storage = new MemStorage();
