import { createOBSClient } from "../obs/client";
import "./config";

export const main = async () => {
  console.log("App started. Testing OBS client");
  const obs = createOBSClient();
  const address = process.env.OBS_ADDRESS;
  try {
    await obs.connect();
    console.log("Connected to OBS at", address);
    obs.onSceneChange(sceneName => {
      console.log("Scene changed to:", sceneName);
    });
    console.log("Listening for scene changes...");
  } catch (err) {
    console.error("Failed to connect to OBS:", err);
  }
};
