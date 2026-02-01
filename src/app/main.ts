const abort = new AbortController();

obs.onEndingScene(() => {
  state.onEndingSceneEntered();
  startSpotifyPolling({ signal: abort.signal, ... });
});

obs.onExitEnding(() => {
  abort.abort();
  state.reset();
});

spotify.onPlayback((playback) => {
  // feed state machine
  // if machine says "true" → obs.stopStream()
});