export function registerObsEvents(obs, { onEndingScene, onExitEnding }) {
  obs.on("CurrentProgramSceneChanged", ({ sceneName }) => {
    if (sceneName === ENDING_SCENE) onEndingScene();
    else onExitEnding();
  });
}
