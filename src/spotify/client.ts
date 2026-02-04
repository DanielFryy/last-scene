import { SpotifyApi } from "@spotify/web-api-ts-sdk";

// Singleton Spotify client instance
let spotify: SpotifyApi | null = null;

export const getSpotifyClient = () => {
  spotify ??= SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID, {
    access_token: process.env.SPOTIFY_REFRESH_TOKEN,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
  });
  return spotify;
};

// Example: get current playback state
export const getCurrentPlayback = async () => {
  const client = getSpotifyClient();
  return client.player.getCurrentlyPlayingTrack();
};
