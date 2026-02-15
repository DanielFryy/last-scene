import { SpotifyApi, type AccessToken } from "@spotify/web-api-ts-sdk";
import z from "zod";

let spotify: SpotifyApi | null = null;
let spotifyAccessToken: string | null = null;
let refreshInFlight: Promise<AccessToken> | null = null;

const TOKEN_REFRESH_SAFETY_WINDOW_MS = 30_000;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const INITIAL_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

let currentToken: AccessToken | null = process.env.SPOTIFY_ACCESS_TOKEN
  ? {
      access_token: process.env.SPOTIFY_ACCESS_TOKEN,
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: INITIAL_REFRESH_TOKEN
    }
  : null;

// Force refresh at startup to avoid trusting an unknown token age.
let expiresAtMs = 0;

// Helper to fetch a new token using the Refresh Token
const refreshAccessToken = async (
  refreshToken: string
): Promise<AccessToken> => {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authHeader}`
    },
    body: params
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to refresh token: ${response.status} ${response.statusText}. Body: ${raw}`
    );
  }

  const schema = z.object({
    access_token: z.string(),
    refresh_token: z.string().optional(),
    expires_in: z.number(),
    token_type: z.string().optional()
  });
  const data = schema.parse(JSON.parse(raw));

  return {
    access_token: data.access_token,
    token_type: data.token_type ?? "Bearer",
    expires_in: data.expires_in,
    refresh_token: data.refresh_token ?? refreshToken
  };
};

const ensureFreshToken = async (
  options: { force?: boolean } = {}
): Promise<AccessToken> => {
  const { force = false } = options;
  const now = Date.now();
  const hasExpired = expiresAtMs - now <= TOKEN_REFRESH_SAFETY_WINDOW_MS;

  const hasValidToken = currentToken !== null && !hasExpired && !force;

  if (hasValidToken) return currentToken!;
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = currentToken?.refresh_token ?? INITIAL_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("Missing Spotify refresh token");
  }

  refreshInFlight = (async () => {
    const refreshedToken = await refreshAccessToken(refreshToken);
    currentToken = refreshedToken;
    expiresAtMs = Date.now() + refreshedToken.expires_in * 1000;
    return refreshedToken;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

const isAuthError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("bad or expired token") ||
    message.includes("unauthorized") ||
    message.includes("401")
  );
};

export const getSpotifyClient = async (): Promise<SpotifyApi> => {
  const token = await ensureFreshToken();

  if (!spotify || spotifyAccessToken !== token.access_token) {
    spotify = SpotifyApi.withAccessToken(CLIENT_ID, token);
    spotifyAccessToken = token.access_token;
  }

  return spotify;
};

export const getCurrentPlayback = async () => {
  const client = await getSpotifyClient();

  try {
    return await client.player.getCurrentlyPlayingTrack();
  } catch (error) {
    if (!isAuthError(error)) throw error;

    await ensureFreshToken({ force: true });
    const refreshedClient = await getSpotifyClient();
    return refreshedClient.player.getCurrentlyPlayingTrack();
  }
};
