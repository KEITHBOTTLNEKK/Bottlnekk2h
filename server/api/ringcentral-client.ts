import { db } from "../db";
import { oauthConnections } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { DiagnosticResult } from "@shared/schema";

const RINGCENTRAL_SERVER = process.env.RINGCENTRAL_SERVER || "https://platform.ringcentral.com";
const CLIENT_ID = process.env.RINGCENTRAL_CLIENT_ID;
const CLIENT_SECRET = process.env.RINGCENTRAL_CLIENT_SECRET;

interface RingCentralCallLogRecord {
  direction: string;
  type: string;
  action: string;
  result: string;
  startTime: string;
  duration: number;
  to?: { phoneNumber?: string };
  from?: { phoneNumber?: string };
}

// Refresh access token if expired
async function refreshTokenIfNeeded(connection: any): Promise<string> {
  if (!connection.tokenExpiry || new Date() < connection.tokenExpiry) {
    return connection.accessToken;
  }

  if (!connection.refreshToken || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Cannot refresh token: missing credentials");
  }

  const response = await fetch(`${RINGCENTRAL_SERVER}/restapi/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: connection.refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const tokenData = await response.json();
  const expiresIn = tokenData.expires_in || 3600;
  const tokenExpiry = new Date(Date.now() + expiresIn * 1000);

  // Update token in database
  await db.update(oauthConnections)
    .set({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || connection.refreshToken,
      tokenExpiry,
      updatedAt: new Date(),
    })
    .where(eq(oauthConnections.id, connection.id));

  return tokenData.access_token;
}

// Fetch call analytics from RingCentral
export async function fetchRingCentralAnalytics(): Promise<DiagnosticResult | null> {
  try {
    // Get OAuth connection
    const connection = await db.query.oauthConnections.findFirst({
      where: eq(oauthConnections.provider, "RingCentral"),
    });

    if (!connection) {
      console.log("No RingCentral connection found");
      return null;
    }

    // Refresh token if needed
    const accessToken = await refreshTokenIfNeeded(connection);

    // Calculate date range (last 30 days)
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);

    // Fetch call log
    const callLogUrl = new URL(`${RINGCENTRAL_SERVER}/restapi/v1.0/account/~/call-log`);
    callLogUrl.searchParams.append("dateFrom", dateFrom.toISOString());
    callLogUrl.searchParams.append("dateTo", dateTo.toISOString());
    callLogUrl.searchParams.append("view", "Detailed");
    callLogUrl.searchParams.append("perPage", "1000");

    const response = await fetch(callLogUrl.toString(), {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch call log:", errorText);
      throw new Error("Failed to fetch call log");
    }

    const data = await response.json();
    const records: RingCentralCallLogRecord[] = data.records || [];

    console.log(`✅ RingCentral API call successful! Found ${records.length} call records in last 30 days`);

    // Analyze calls
    let missedCalls = 0;
    let afterHoursCalls = 0;
    let abandonedCalls = 0;

    for (const call of records) {
      // Only count inbound calls
      if (call.direction !== "Inbound") continue;

      const startTime = new Date(call.startTime);
      const hour = startTime.getHours();

      // After-hours: before 8am or after 6pm on weekdays, or weekends
      const isWeekend = startTime.getDay() === 0 || startTime.getDay() === 6;
      const isAfterHours = hour < 8 || hour >= 18 || isWeekend;

      // Missed calls: no answer or voicemail
      if (call.result === "Missed" || call.result === "Voicemail") {
        missedCalls++;
        if (isAfterHours) {
          afterHoursCalls++;
        }
      }

      // Abandoned: caller hung up before answer
      if (call.result === "Abandoned" || (call.result === "Missed" && call.duration < 10)) {
        abandonedCalls++;
      }
    }

    // Estimate average revenue per call (industry standard for home services)
    const avgRevenuePerCall = 350;

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
      provider: "RingCentral",
      month: monthName,
    };
  } catch (error) {
    console.error("Error fetching RingCentral analytics:", error);
    return null;
  }
}
