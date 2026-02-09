import { getCurrentPlayback } from "./client";
import type { SpotifyTrack } from "./types";

export const pollCurrentTrack = ({
  onTrackChange,
  intervalMs = 1000
}: {
  onTrackChange: (track: SpotifyTrack | null) => void;
  intervalMs?: number;
}) => {
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
