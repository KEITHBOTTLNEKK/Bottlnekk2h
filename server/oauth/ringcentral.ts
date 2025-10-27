import type { Express } from "express";
import { db } from "../db";
import { oauthConnections } from "@shared/schema";
import { eq } from "drizzle-orm";

const RINGCENTRAL_SERVER = process.env.RINGCENTRAL_SERVER || "https://platform.ringcentral.com";
const CLIENT_ID = process.env.RINGCENTRAL_CLIENT_ID;
const CLIENT_SECRET = process.env.RINGCENTRAL_CLIENT_SECRET;

// Get the base URL for redirects
function getBaseUrl(req: any): string {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocol}://${host}`;
}

export function registerRingCentralOAuth(app: Express) {
  // Initiate OAuth flow
  app.get("/auth/ringcentral/login", (req, res) => {
    if (!CLIENT_ID) {
      return res.status(500).json({ error: "RingCentral OAuth not configured" });
    }

    const baseUrl = getBaseUrl(req);
    const redirectUri = `${baseUrl}/auth/ringcentral/callback`;
    
    const authUrl = new URL(`${RINGCENTRAL_SERVER}/restapi/oauth/authorize`);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("state", Math.random().toString(36).substring(7));
    // Try common scope names that match the UI labels
    authUrl.searchParams.append("scope", "ReadAccounts CallLog Messages ReadPresence");

    console.log("RingCentral OAuth URL:", authUrl.toString());
    res.redirect(authUrl.toString());
  });

  // OAuth callback
  app.get("/auth/ringcentral/callback", async (req, res) => {
    const { code, error, error_description } = req.query;

    if (error) {
      console.error("RingCentral OAuth error:", error_description);
      return res.redirect(`/?error=${encodeURIComponent(error_description as string || 'Authentication failed')}`);
    }

    if (!code || !CLIENT_ID || !CLIENT_SECRET) {
      return res.redirect("/?error=Invalid callback parameters");
    }

    try {
      const baseUrl = getBaseUrl(req);
      const redirectUri = `${baseUrl}/auth/ringcentral/callback`;

      // Exchange code for tokens
      const tokenResponse = await fetch(`${RINGCENTRAL_SERVER}/restapi/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code as string,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", errorText);
        throw new Error("Failed to exchange authorization code");
      }

      const tokenData = await tokenResponse.json();
      
      // Calculate token expiry
      const expiresIn = tokenData.expires_in || 3600;
      const tokenExpiry = new Date(Date.now() + expiresIn * 1000);

      // Get account info to extract user ID
      const accountResponse = await fetch(`${RINGCENTRAL_SERVER}/restapi/v1.0/account/~`, {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`,
        },
      });

      if (!accountResponse.ok) {
        const errorText = await accountResponse.text();
        console.error("Failed to fetch account info:", errorText);
        throw new Error("Failed to fetch account information");
      }

      const accountData = await accountResponse.json();
      const accountId = accountData.id || "default";

      // Save OAuth connection to database (use upsert to update if exists)
      const existingConnection = await db.query.oauthConnections.findFirst({
        where: (connections, { and, eq }) =>
          and(
            eq(connections.provider, "RingCentral"),
            eq(connections.accountId, accountId)
          ),
      });

      if (existingConnection) {
        // Update existing connection
        await db.update(oauthConnections)
          .set({
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || existingConnection.refreshToken,
            tokenExpiry,
            updatedAt: new Date(),
          })
          .where(eq(oauthConnections.id, existingConnection.id));
      } else {
        // Create new connection
        await db.insert(oauthConnections).values({
          provider: "RingCentral",
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiry,
          accountId,
          userId: accountId,
        });
      }

      // Redirect back to app with success
      res.redirect("/?connected=ringcentral");
    } catch (error) {
      console.error("Error in RingCentral callback:", error);
      res.redirect(`/?error=${encodeURIComponent('Failed to connect to RingCentral')}`);
    }
  });

  // Check connection status
  app.get("/auth/ringcentral/status", async (req, res) => {
    try {
      const connection = await db.query.oauthConnections.findFirst({
        where: eq(oauthConnections.provider, "RingCentral"),
      });

      if (!connection) {
        return res.json({ connected: false });
      }

      // Check if token is expired
      const isExpired = connection.tokenExpiry && new Date() > connection.tokenExpiry;

      res.json({
        connected: true,
        expired: isExpired,
        accountId: connection.accountId,
      });
    } catch (error) {
      console.error("Error checking RingCentral status:", error);
      res.status(500).json({ error: "Failed to check connection status" });
    }
  });

  // Disconnect OAuth
  app.post("/auth/ringcentral/disconnect", async (req, res) => {
    try {
      await db.delete(oauthConnections)
        .where(eq(oauthConnections.provider, "RingCentral"));

      res.json({ success: true });
    } catch (error) {
      console.error("Error disconnecting RingCentral:", error);
      res.status(500).json({ error: "Failed to disconnect" });
    }
  });
}
