// Minimal Bun server to handle Spotify OAuth callback
import { serve } from "bun";

const PORT = 8888;

serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/callback" && url.searchParams.has("code")) {
      const code = url.searchParams.get("code");
      return new Response(
        `<html><body><h1>Spotify Auth Code</h1><p>Copy this code and paste it in your terminal:</p><pre>${code}</pre></body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }
    return new Response("Not found", { status: 404 });
  }
});

console.log(`Listening for Spotify OAuth callback on https://localhost:${PORT}/callback`);
