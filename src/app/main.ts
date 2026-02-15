import { createOBSClient } from "../obs/client";
import { createObsControl } from "../obs/control";
import { registerObsEvents } from "../obs/events";
import "./config";

export const main = async () => {
  console.log("App started. Testing OBS client");
  const obs = createOBSClient();
  createObsControl(obs);
  const address = process.env.OBS_ADDRESS;
  const endingScene = process.env.ENDING_SCENE;

  try {
    await obs.connect();
    console.log("Connected to OBS at", address);

    registerObsEvents(obs, {
      endingScene,
      onEndingScene: () => {
        console.log("Entered ending scene:", endingScene);
      },
      onExitEnding: () => {
        console.log("Exited ending scene:", endingScene);
      }
    });

    console.log("Listening for scene changes...");
  } catch (err) {
    console.error("Failed to connect to OBS:", err);
  }
};
