import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import type { OBSClient } from "./types";

export const createOBSClient = (): OBSClient => {
  const obs = new OBSWebSocket();

  const connect = async () => {
    const address = process.env.OBS_ADDRESS;
    const password = process.env.OBS_PASSWORD;
    await obs.connect(address, password, {
      eventSubscriptions: EventSubscription.Scenes
    });
  };

  const onSceneChange = (callback: (sceneName: string) => void) => {
    obs.on("CurrentProgramSceneChanged", data => {
      callback(data.sceneName);
    });
  };

  const call: OBSClient["call"] = (requestType, requestData) => {
    return obs.call(requestType, requestData);
  };

  return { connect, onSceneChange, call };
};
