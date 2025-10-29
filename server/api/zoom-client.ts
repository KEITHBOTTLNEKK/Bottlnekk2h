import { db } from "../db";
import { oauthConnections } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { DiagnosticResult } from "@shared/schema";

const ZOOM_API_URL = "https://api.zoom.us/v2";
const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token";
const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

interface ZoomCallLog {
  id: string;
  call_id: string;
  caller_number: string;
  caller_number_type: string;
  callee_number: string;
  callee_number_type: string;
  direction: string;
  duration: number;
  result: string;
  date_time: string;
}

// Refresh access token if expired
async function refreshTokenIfNeeded(connection: any): Promise<string> {
  if (!connection.tokenExpiry || new Date() < connection.tokenExpiry) {
    return connection.accessToken;
  }

  if (!connection.refreshToken || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Cannot refresh token: missing credentials");
  }

  const response = await fetch(ZOOM_TOKEN_URL, {
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

// Fetch call analytics from Zoom Phone
export async function fetchZoomPhoneAnalytics(avgRevenuePerCall: number = 1000): Promise<DiagnosticResult | null> {
  try {
    // Get OAuth connection
    const connection = await db.query.oauthConnections.findFirst({
      where: eq(oauthConnections.provider, "Zoom Phone"),
    });

    if (!connection) {
      console.log("No Zoom Phone connection found");
      return null;
    }

    // Refresh token if needed
    const accessToken = await refreshTokenIfNeeded(connection);

    // Calculate date range (last 30 days)
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);

    // Fetch call history (using newer endpoint)
    const callHistoryUrl = new URL(`${ZOOM_API_URL}/phone/call_history`);
    callHistoryUrl.searchParams.append("from", dateFrom.toISOString().split('T')[0]);
    callHistoryUrl.searchParams.append("to", dateTo.toISOString().split('T')[0]);
    callHistoryUrl.searchParams.append("page_size", "300");
    callHistoryUrl.searchParams.append("type", "all");

    const response = await fetch(callHistoryUrl.toString(), {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Zoom Phone API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: callHistoryUrl.toString(),
      });
      throw new Error(`Zoom Phone API failed (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    const records: ZoomCallLog[] = data.call_logs || [];

    console.log(`✅ Zoom Phone API call successful! Found ${records.length} call records in last 30 days`);

    // Log first call for debugging
    if (records.length > 0) {
      const firstCall = records[0];
      console.log(`📞 Sample call: direction=${firstCall.direction}, result=${firstCall.result}, date_time=${firstCall.date_time}, duration=${firstCall.duration}s`);
    }

    // Analyze calls - Enhanced for sales intelligence with deduplication
    let totalInboundCalls = 0;
    let acceptedCalls = 0;

    // Track calls by phone number for callback time analysis AND deduplication
    const callsByNumber: Map<string, Array<{time: Date, isMissed: boolean, isAfterHours: boolean}>> = new Map();
    
    // Track unique callers who had at least one missed call
    const uniqueMissedCallers = new Set<string>();
    const uniqueAfterHoursCallers = new Set<string>();

    for (const call of records) {
      // Only count inbound calls
      if (call.direction !== "inbound") continue;

      totalInboundCalls++;

      const startTime = new Date(call.date_time);
      const phoneNumber = call.caller_number || "unknown";
      
      // Convert to Eastern Time for business hours calculation
      const easternTime = new Date(startTime.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const hour = easternTime.getHours();
      const dayOfWeek = easternTime.getDay();

      // After-hours: before 8am or after 6pm on weekdays, or weekends
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isAfterHours = hour < 8 || hour >= 18 || isWeekend;
      
      // Debug logging for first inbound call
      if (call.direction === "inbound" && uniqueMissedCallers.size === 0) {
        console.log(`🕐 Time analysis: ${call.date_time} → ET hour=${hour}, day=${dayOfWeek}, isAfterHours=${isAfterHours}`);
      }

      // Zoom Phone results: "Call connected", "Voicemail", "Missed", "Declined", etc.
      // Any unanswered inbound call is a missed opportunity
      const isMissed = call.result && (call.result.toLowerCase().includes("missed") || 
          call.result.toLowerCase().includes("voicemail") ||
          call.result.toLowerCase().includes("declined") ||
          call.result.toLowerCase().includes("busy") ||
          call.result === "Not Answered");

      // Accepted = actually connected (successful call, not just non-missed)
      const isAccepted = !isMissed && call.result && call.result.toLowerCase().includes("connected");

      // Track unique callers who had at least one missed call
      if (isMissed) {
        uniqueMissedCallers.add(phoneNumber);
        
        // Track unique callers who had after-hours missed calls
        if (isAfterHours) {
          uniqueAfterHoursCallers.add(phoneNumber);
        }
      } else if (isAccepted) {
        // Call was genuinely accepted/answered (successfully connected)
        acceptedCalls++;
      }

      // Track for callback analysis
      if (!callsByNumber.has(phoneNumber)) {
        callsByNumber.set(phoneNumber, []);
      }
      callsByNumber.get(phoneNumber)!.push({ time: startTime, isMissed: !!isMissed, isAfterHours });
    }

    // Count unique callers instead of total calls
    const missedCalls = uniqueMissedCallers.size;
    const afterHoursCalls = uniqueAfterHoursCallers.size;

    // Calculate average callback time
    let totalCallbackTime = 0;
    let callbackCount = 0;

    for (const [phoneNumber, calls] of Array.from(callsByNumber.entries())) {
      if (calls.length < 2) continue; // Need at least 2 calls to measure callback time

      // Sort by time
      calls.sort((a: {time: Date, isMissed: boolean, isAfterHours: boolean}, b: {time: Date, isMissed: boolean, isAfterHours: boolean}) => a.time.getTime() - b.time.getTime());

      // Find missed calls followed by the NEXT answered call from same number
      for (let i = 0; i < calls.length; i++) {
        if (calls[i].isMissed) {
          // Look for next answered call (not just next call)
          for (let j = i + 1; j < calls.length; j++) {
            if (!calls[j].isMissed) {
              // Found a callback! Measure time between missed call and answered call
              const callbackMinutes = (calls[j].time.getTime() - calls[i].time.getTime()) / (1000 * 60);
              totalCallbackTime += callbackMinutes;
              callbackCount++;
              break; // Only count first callback for this missed call
            }
          }
        }
      }
    }

    const avgCallbackTimeMinutes = callbackCount > 0 
      ? Math.round(totalCallbackTime / callbackCount) 
      : null;

    // Use the provided average revenue per call
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
      provider: "Zoom Phone",
      month: monthName,
      // Sales intelligence metrics
      totalInboundCalls,
      acceptedCalls,
      avgCallbackTimeMinutes,
    };
  } catch (error) {
    console.error("Error fetching Zoom Phone analytics:", error);
    return null;
  }
}
