import { getCurrentPlayback } from "./client";
import type { PollCurrentTrackConfig as Config, SpotifyTrack } from "./types";

export const pollCurrentTrack = (config: Config) => {
  const { onTrackChange, intervalMs = 1500 } = config;
  let lastTrackId: string | null = null;
  let intervalId: NodeJS.Timeout | null = null;

  const poller = async () => {
    try {
      const playback = await getCurrentPlayback();
      if (!playback?.item) {
        if (lastTrackId !== null) {
          lastTrackId = null;
          onTrackChange(null);
        }
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
    } catch (err) {
      console.error("Error in pollCurrentTrack:", err);
      if (lastTrackId !== null) {
        lastTrackId = null;
        onTrackChange(null);
      }
    }
  };

  intervalId = setInterval(poller, intervalMs);
  // Return cleanup function
  return () => {
    if (intervalId) clearInterval(intervalId);
  };
};
