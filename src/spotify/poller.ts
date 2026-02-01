import { SpotifyClient } from "./client";

export async function startSpotifyPolling({
  client,
  intervalMs,
  signal,
  onPlayback
}: {
  client: SpotifyClient;
  intervalMs: number;
  signal: AbortSignal;
  onPlayback: (data: PlaybackData) => void;
}) {
  while (!signal.aborted) {
    const playback = await client.getPlayback();
    if (playback) onPlayback(playback);
    await new Promise(r => setTimeout(r, intervalMs));
  }
}
