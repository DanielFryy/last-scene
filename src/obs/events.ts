import type { OBSClient, ObsEventHandlers } from "./types";

export const registerObsEvents = (
  obs: Pick<OBSClient, "onSceneChange">,
  eventHandlers: ObsEventHandlers
) => {
  const { endingScene, onEndingScene, onExitEnding } = eventHandlers;
  let wasEndingScene = false;

  obs.onSceneChange(sceneName => {
    const isEndingScene = sceneName === endingScene;

    if (isEndingScene && !wasEndingScene) onEndingScene();
    if (!isEndingScene && wasEndingScene) onExitEnding();

    wasEndingScene = isEndingScene;
  });
};
