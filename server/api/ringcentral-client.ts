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
export async function fetchRingCentralAnalytics(avgRevenuePerCall: number = 350): Promise<DiagnosticResult | null> {
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

    // Log first call for debugging
    if (records.length > 0) {
      const firstCall = records[0];
      console.log(`📞 Sample call: direction=${firstCall.direction}, result=${firstCall.result}, startTime=${firstCall.startTime}, duration=${firstCall.duration}s`);
    }

    // Analyze calls - Enhanced for sales intelligence
    let missedCalls = 0;
    let afterHoursCalls = 0;
    let totalInboundCalls = 0;
    let acceptedCalls = 0;

    // Track calls by phone number for callback time analysis
    const callsByNumber: Map<string, Array<{time: Date, isMissed: boolean}>> = new Map();

    for (const call of records) {
      // Only count inbound calls
      if (call.direction !== "Inbound") continue;

      totalInboundCalls++;

      const startTime = new Date(call.startTime);
      const phoneNumber = call.from?.phoneNumber || "unknown";
      
      // Convert to Eastern Time for business hours calculation
      const easternTime = new Date(startTime.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const hour = easternTime.getHours();
      const dayOfWeek = easternTime.getDay();

      // After-hours: before 8am or after 6pm on weekdays, or weekends
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isAfterHours = hour < 8 || hour >= 18 || isWeekend;
      
      // Debug logging for first inbound call
      if (call.direction === "Inbound" && missedCalls === 0) {
        console.log(`🕐 Time analysis: ${call.startTime} → ET hour=${hour}, day=${dayOfWeek}, isAfterHours=${isAfterHours}`);
      }

      const isMissed = call.result === "Missed" || call.result === "Voicemail" || call.result === "Abandoned";

      // Simple: Any unanswered inbound call is a missed opportunity
      if (isMissed) {
        missedCalls++;
        
        // Track if this was after-hours (subset for actionable insight)
        if (isAfterHours) {
          afterHoursCalls++;
        }
      } else {
        // Call was accepted/answered
        acceptedCalls++;
      }

      // Track for callback analysis
      if (!callsByNumber.has(phoneNumber)) {
        callsByNumber.set(phoneNumber, []);
      }
      callsByNumber.get(phoneNumber)!.push({ time: startTime, isMissed });
    }

    // Calculate average callback time
    let totalCallbackTime = 0;
    let callbackCount = 0;

    for (const [phoneNumber, calls] of callsByNumber.entries()) {
      if (calls.length < 2) continue; // Need at least 2 calls to measure callback time

      // Sort by time
      calls.sort((a, b) => a.time.getTime() - b.time.getTime());

      // Find missed calls followed by answered calls from same number
      for (let i = 0; i < calls.length - 1; i++) {
        if (calls[i].isMissed && !calls[i + 1].isMissed) {
          // Found a callback! Measure time between missed call and answered call
          const callbackMinutes = (calls[i + 1].time.getTime() - calls[i].time.getTime()) / (1000 * 60);
          totalCallbackTime += callbackMinutes;
          callbackCount++;
        }
      }
    }

    const avgCallbackTimeMinutes = callbackCount > 0 
      ? Math.round(totalCallbackTime / callbackCount) 
      : null;

    // Use the provided average revenue per call

    // Clean calculation: every missed call = lost revenue
    const totalMissedOpportunities = missedCalls;
    const totalLoss = totalMissedOpportunities * avgRevenuePerCall;

    const currentDate = new Date();
    const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return {
      totalLoss,
      missedCalls,
      afterHoursCalls,
      avgRevenuePerCall,
      totalMissedOpportunities,
      provider: "RingCentral",
      month: monthName,
      // Sales intelligence metrics
      totalInboundCalls,
      acceptedCalls,
      avgCallbackTimeMinutes,
    };
  } catch (error) {
    console.error("Error fetching RingCentral analytics:", error);
    return null;
  }
}
