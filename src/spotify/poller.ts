import { getCurrentPlayback } from "./client";
import type { SpotifyTrack } from "./types";

export const pollCurrentTrack = (
  onTrackChange: (track: SpotifyTrack | null) => void,
  intervalMs = 1000
) => {
  let lastTrackId: string | null = null;

  const poller = async () => {
    const playback = await getCurrentPlayback();
    if (!playback?.item) {
      onTrackChange(null);
      return;
    }

    const track: SpotifyTrack = {
      id: playback.item.id,
      durationMs: playback.item.duration_ms,
      progressMs: playback.progress_ms,
      isPlaying: playback.is_playing
    };

    if (track.id !== lastTrackId) {
      lastTrackId = track.id;
      onTrackChange(track);
    }
  };

  setInterval(poller, intervalMs);
};
