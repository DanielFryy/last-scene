// Normalized playback types for Spotify
export interface SpotifyTrack {
  id: string;
  durationMs: number;
  progressMs: number;
  isPlaying: boolean;
}
