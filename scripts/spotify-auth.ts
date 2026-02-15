import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import open from "open";
import { z } from "zod";
import "dotenv/config";
import "../src/app/config";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPES = [
  "user-read-playback-state",
  "user-read-currently-playing"
].join(" ");

const rl = readline.createInterface({ input, output });

async function main() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES)}`;

  console.log("Opening Spotify authorization URL in your browser...");
  await open(authUrl);
  const code = await rl.question("Paste the code from the redirect URL: ");

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code.trim());
  params.append("redirect_uri", REDIRECT_URI);

  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  try {
    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authHeader}`
        },
        body: params
      }
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const data = await response.json();
    const schema = z.object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_in: z.number()
    });
    const { access_token, refresh_token, expires_in } = schema.parse(data);
    console.log("\nAdd these to your .env file:");
    console.log(`SPOTIFY_ACCESS_TOKEN=${access_token}`);
    console.log(`SPOTIFY_REFRESH_TOKEN=${refresh_token}`);
    console.log(`# Expires in: ${expires_in} seconds`);
  } catch (err: any) {
    console.error("Failed to get tokens:", err.message);
  } finally {
    rl.close();
  }
}

main();
