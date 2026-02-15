import { z } from "zod";
import "dotenv/config";

export const envSchema = z.object({
  OBS_ADDRESS: z.string(),
  OBS_PASSWORD: z.string(),
  ENDING_SCENE: z.string(),
  SPOTIFY_ACCESS_TOKEN: z.string(),
  SPOTIFY_REFRESH_TOKEN: z.string(),
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
  SONG_REMAINING_THRESHOLD_MS: z.coerce.number().default(120_000),
  SPOTIFY_POLL_INTERVAL_MS: z.coerce.number().default(1500),
  SPOTIFY_REDIRECT_URI: z.string()
});

envSchema.parse(process.env);
