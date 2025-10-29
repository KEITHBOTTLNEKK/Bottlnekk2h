import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BOTTLNEKK_GREEN = "#00C97B";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Diagnostic {
  id: string;
  provider: string;
  companyName: string | null;
  industry: string | null;
  totalLoss: number;
  missedCalls: number;
  afterHoursCalls: number;
  avgRevenuePerCall: number;
  totalInboundCalls: number | null;
  acceptedCalls: number | null;
  avgCallbackTimeMinutes: number | null;
  month: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<Diagnostic | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Logging in...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: diagnostics = [], isLoading } = useQuery<Diagnostic[]>({
    queryKey: ["/api/diagnostics"],
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  const industries = Array.from(new Set(diagnostics.map(d => d.industry).filter(Boolean)));
  
  const filteredDiagnostics = diagnostics.filter(d => 
    industryFilter === "all" || d.industry === industryFilter
  );

  const sortedDiagnostics = [...filteredDiagnostics].sort((a, b) => b.totalLoss - a.totalLoss);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // Don't render until authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (selectedDiagnostic) {
    const totalInbound = selectedDiagnostic.totalInboundCalls || 0;
    const accepted = selectedDiagnostic.acceptedCalls || 0;
    const answerRate = totalInbound > 0 ? Math.round((accepted / totalInbound) * 100) : 0;
    const potentialRecovery = Math.round(selectedDiagnostic.missedCalls * selectedDiagnostic.avgRevenuePerCall * 0.60);
    const afterHoursPercentage = selectedDiagnostic.missedCalls > 0 
      ? Math.round((selectedDiagnostic.afterHoursCalls / selectedDiagnostic.missedCalls) * 100)
      : 0;

    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => setSelectedDiagnostic(null)}
            variant="outline"
            className="mb-6 bg-white text-black hover:bg-gray-200"
            data-testid="button-back"
          >
            ← Back to Dashboard
          </Button>

          <Card className="bg-zinc-900 border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {selectedDiagnostic.companyName || "Company"} • {selectedDiagnostic.industry}
              </CardTitle>
              <p className="text-zinc-400">
                {selectedDiagnostic.provider} • {selectedDiagnostic.month}
              </p>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 mb-6" style={{ borderColor: BOTTLNEKK_GREEN, borderWidth: '2px' }}>
            <CardContent className="pt-6">
              <p className="text-sm font-semibold mb-2" style={{ color: BOTTLNEKK_GREEN }}>POTENTIAL REVENUE RECOVERY</p>
              <p className="text-5xl font-bold" style={{ color: BOTTLNEKK_GREEN }}>${potentialRecovery.toLocaleString()}</p>
              <p className="text-sm mt-2" style={{ color: BOTTLNEKK_GREEN, opacity: 0.8 }}>60% conversion rate for hot inbound leads</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-zinc-400 text-xs font-semibold mb-1">REVENUE LOSS</p>
                <p className="text-3xl font-bold text-white">${(selectedDiagnostic.totalLoss / 1000).toFixed(1)}k</p>
                <p className="text-zinc-500 text-xs mt-1">unanswered calls</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-zinc-400 text-xs font-semibold mb-1">MISSED CALLS</p>
                <p className="text-3xl font-bold text-white">{selectedDiagnostic.missedCalls}</p>
                <p className="text-zinc-500 text-xs mt-1">of {totalInbound} total</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-zinc-400 text-xs font-semibold mb-1">AFTER-HOURS</p>
                <p className="text-3xl font-bold text-white">{selectedDiagnostic.afterHoursCalls}</p>
                <p className="text-zinc-500 text-xs mt-1">late calls</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-zinc-400 text-xs font-semibold mb-1">ANSWER RATE</p>
                <p className="text-3xl font-bold text-white">{answerRate}%</p>
                <p className="text-zinc-500 text-xs mt-1">{accepted} answered</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-zinc-400 text-xs font-semibold mb-1">AVG VALUE</p>
                <p className="text-3xl font-bold text-white">${selectedDiagnostic.avgRevenuePerCall}</p>
                <p className="text-zinc-500 text-xs mt-1">per call</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-zinc-400 text-xs font-semibold mb-1">DIAGNOSTIC ID</p>
                <p className="text-sm font-mono text-white truncate">{selectedDiagnostic.id}</p>
                <p className="text-zinc-500 text-xs mt-1">for matching</p>
              </CardContent>
            </Card>
          </div>

          {selectedDiagnostic.afterHoursCalls > 0 && (
            <Card className="bg-orange-900/30 border-orange-800">
              <CardContent className="pt-6">
                <p className="text-orange-400 text-sm font-semibold mb-2">AFTER-HOURS OPPORTUNITY</p>
                <p className="text-white">
                  {selectedDiagnostic.afterHoursCalls} of the {selectedDiagnostic.missedCalls} missed calls ({afterHoursPercentage}%) came after business hours = <span className="font-bold">${(selectedDiagnostic.afterHoursCalls * selectedDiagnostic.avgRevenuePerCall).toLocaleString()}</span> opportunity.
                </p>
                <p className="text-orange-400 font-semibold mt-2">
                  AI answering service works 24/7 and books appointments regardless of time or day.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" data-testid="text-title">Sales Intelligence Dashboard</h1>
            <p className="text-zinc-400">Track diagnostics and identify high-value opportunities</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-48 bg-zinc-900 border-zinc-800 text-white" data-testid="select-industry">
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry!}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-zinc-400 text-xs font-semibold mb-1">TOTAL DIAGNOSTICS</p>
              <p className="text-3xl font-bold text-white">{sortedDiagnostics.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-zinc-400 text-xs font-semibold mb-1">TOTAL REVENUE LOSS</p>
              <p className="text-3xl font-bold text-red-500">
                ${(sortedDiagnostics.reduce((sum, d) => sum + d.totalLoss, 0) / 1000).toFixed(0)}k
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-zinc-400 text-xs font-semibold mb-1">TOTAL MISSED CALLS</p>
              <p className="text-3xl font-bold text-white">
                {sortedDiagnostics.reduce((sum, d) => sum + d.missedCalls, 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-zinc-400 text-xs font-semibold mb-1">AVG RECOVERY</p>
              <p className="text-3xl font-bold" style={{ color: BOTTLNEKK_GREEN }}>
                ${sortedDiagnostics.length > 0 
                  ? Math.round(sortedDiagnostics.reduce((sum, d) => sum + (d.missedCalls * d.avgRevenuePerCall * 0.60), 0) / sortedDiagnostics.length).toLocaleString()
                  : 0
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">All Diagnostics</CardTitle>
            <p className="text-sm text-zinc-400">Sorted by revenue loss (highest first)</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableHead className="text-zinc-400">Company</TableHead>
                  <TableHead className="text-zinc-400">Industry</TableHead>
                  <TableHead className="text-zinc-400">Provider</TableHead>
                  <TableHead className="text-zinc-400 text-right">Revenue Loss</TableHead>
                  <TableHead className="text-zinc-400 text-right">Missed Calls</TableHead>
                  <TableHead className="text-zinc-400 text-right">After Hours</TableHead>
                  <TableHead className="text-zinc-400 text-right">Recovery Opp.</TableHead>
                  <TableHead className="text-zinc-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDiagnostics.map((diagnostic) => (
                  <TableRow
                    key={diagnostic.id}
                    className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                    onClick={() => setSelectedDiagnostic(diagnostic)}
                    data-testid={`row-diagnostic-${diagnostic.id}`}
                  >
                    <TableCell className="text-white font-medium">
                      {diagnostic.companyName || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700">
                        {diagnostic.industry || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300">{diagnostic.provider}</TableCell>
                    <TableCell className="text-right text-red-400 font-semibold">
                      ${(diagnostic.totalLoss / 1000).toFixed(1)}k
                    </TableCell>
                    <TableCell className="text-right text-white font-semibold">
                      {diagnostic.missedCalls}
                    </TableCell>
                    <TableCell className="text-right text-orange-400">
                      {diagnostic.afterHoursCalls}
                    </TableCell>
                    <TableCell className="text-right text-green-400 font-semibold">
                      ${Math.round(diagnostic.missedCalls * diagnostic.avgRevenuePerCall * 0.60).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {new Date(diagnostic.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {sortedDiagnostics.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-zinc-500 py-12">
                      No diagnostics found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
