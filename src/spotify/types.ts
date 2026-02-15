// Normalized playback types for Spotify
export interface SpotifyTrack {
  id: string;
  durationMs: number;
  progressMs: number;
  isPlaying: boolean;
}

export interface PollCurrentTrackConfig {
  onTrackChange: (track: SpotifyTrack | null) => void;
  intervalMs?: number;
}
