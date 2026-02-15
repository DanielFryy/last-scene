import OBSWebSocket, { EventSubscription } from "obs-websocket-js";

export type OBSConnection = ReturnType<typeof createOBSClient>;

export const createOBSClient = () => {
  const obs = new OBSWebSocket();

  const connect = async () => {
    const address = process.env.OBS_ADDRESS;
    const password = process.env.OBS_PASSWORD;
    await obs.connect(address, password, {
      eventSubscriptions: EventSubscription.Scenes
    });
  }

  const onSceneChange = (callback: (sceneName: string) => void) => {
    obs.on("CurrentProgramSceneChanged", data => {
      callback(data.sceneName);
    });
  }

  return { connect, onSceneChange };
}
