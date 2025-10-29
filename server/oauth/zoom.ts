import type { Express } from "express";
import { db } from "../db";
import { oauthConnections } from "@shared/schema";
import { eq } from "drizzle-orm";

const ZOOM_OAUTH_URL = "https://zoom.us/oauth/authorize";
const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token";
const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

// Get the base URL for redirects
function getBaseUrl(req: any): string {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocol}://${host}`;
}

export function registerZoomOAuth(app: Express) {
  // Initiate OAuth flow
  app.get("/auth/zoom/login", (req, res) => {
    if (!CLIENT_ID) {
      return res.status(500).json({ error: "Zoom OAuth not configured" });
    }

    const baseUrl = getBaseUrl(req);
    const redirectUri = `${baseUrl}/auth/zoom/callback`;
    
    const authUrl = new URL(ZOOM_OAUTH_URL);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("state", Math.random().toString(36).substring(7));

    console.log("Zoom OAuth URL:", authUrl.toString());
    res.redirect(authUrl.toString());
  });

  // OAuth callback
  app.get("/auth/zoom/callback", async (req, res) => {
    const { code, error } = req.query;

    if (error) {
      console.error("Zoom OAuth error:", error);
      return res.redirect(`/diagnostic?error=${encodeURIComponent(error as string || 'Authentication failed')}`);
    }

    if (!code || !CLIENT_ID || !CLIENT_SECRET) {
      return res.redirect("/diagnostic?error=Invalid callback parameters");
    }

    try {
      const baseUrl = getBaseUrl(req);
      const redirectUri = `${baseUrl}/auth/zoom/callback`;

      // Exchange code for tokens
      const tokenResponse = await fetch(ZOOM_TOKEN_URL, {
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
      const userResponse = await fetch("https://api.zoom.us/v2/users/me", {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error("Failed to fetch user info:", errorText);
        throw new Error("Failed to fetch user information");
      }

      const userData = await userResponse.json();
      const accountId = userData.account_id || userData.id || "default";

      // Save OAuth connection to database (use upsert to update if exists)
      const existingConnection = await db.query.oauthConnections.findFirst({
        where: (connections, { and, eq }) =>
          and(
            eq(connections.provider, "Zoom Phone"),
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
          provider: "Zoom Phone",
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiry,
          accountId,
          userId: userData.id || accountId,
        });
      }

      // Redirect back to app with success
      res.redirect("/diagnostic?connected=zoom");
    } catch (error) {
      console.error("Error in Zoom callback:", error);
      res.redirect(`/diagnostic?error=${encodeURIComponent('Failed to connect to Zoom Phone')}`);
    }
  });

  // Check connection status
  app.get("/auth/zoom/status", async (req, res) => {
    try {
      const connection = await db.query.oauthConnections.findFirst({
        where: eq(oauthConnections.provider, "Zoom Phone"),
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
      console.error("Error checking Zoom status:", error);
      res.status(500).json({ error: "Failed to check connection status" });
    }
  });

  // Disconnect OAuth
  app.post("/auth/zoom/disconnect", async (req, res) => {
    try {
      await db.delete(oauthConnections)
        .where(eq(oauthConnections.provider, "Zoom Phone"));

      res.json({ success: true });
    } catch (error) {
      console.error("Error disconnecting Zoom:", error);
      res.status(500).json({ error: "Failed to disconnect" });
    }
  });
}
