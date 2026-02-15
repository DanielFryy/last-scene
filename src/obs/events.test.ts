import { describe, expect, it, mock } from "bun:test";
import type { OBSClient } from "./types";
import { registerObsEvents } from "./events";

const createObsStub = () => {
  let handler: ((sceneName: string) => void) | null = null;

  const obs: Pick<OBSClient, "onSceneChange"> = {
    onSceneChange: callback => {
      handler = callback;
    }
  };

  const emitScene = (sceneName: string) => {
    if (!handler) throw new Error("Scene handler was not registered");
    handler(sceneName);
  };

  return { obs, emitScene };
};

describe("registerObsEvents", () => {
  it("calls onEndingScene when switching into the ending scene", () => {
    const onEndingScene = mock();
    const onExitEnding = mock();
    const { obs, emitScene } = createObsStub();

    registerObsEvents(obs, {
      endingScene: "Ending",
      onEndingScene,
      onExitEnding
    });

    emitScene("Starting Soon");
    emitScene("Ending");

    expect(onEndingScene).toHaveBeenCalledTimes(1);
    expect(onExitEnding).toHaveBeenCalledTimes(0);
  });

  it("calls onExitEnding when switching away after being in ending", () => {
    const onEndingScene = mock();
    const onExitEnding = mock();
    const { obs, emitScene } = createObsStub();

    registerObsEvents(obs, {
      endingScene: "Ending",
      onEndingScene,
      onExitEnding
    });

    emitScene("Ending");
    emitScene("Gameplay");

    expect(onEndingScene).toHaveBeenCalledTimes(1);
    expect(onExitEnding).toHaveBeenCalledTimes(1);
  });

  it("does not call onExitEnding when ending scene was never entered", () => {
    const onEndingScene = mock();
    const onExitEnding = mock();
    const { obs, emitScene } = createObsStub();

    registerObsEvents(obs, {
      endingScene: "Ending",
      onEndingScene,
      onExitEnding
    });

    emitScene("Starting Soon");
    emitScene("Gameplay");

    expect(onEndingScene).toHaveBeenCalledTimes(0);
    expect(onExitEnding).toHaveBeenCalledTimes(0);
  });

  it("does not double-fire on repeated same-state transitions", () => {
    const onEndingScene = mock();
    const onExitEnding = mock();
    const { obs, emitScene } = createObsStub();

    registerObsEvents(obs, {
      endingScene: "Ending",
      onEndingScene,
      onExitEnding
    });

    emitScene("Ending");
    emitScene("Ending");
    emitScene("Gameplay");
    emitScene("Gameplay");

    expect(onEndingScene).toHaveBeenCalledTimes(1);
    expect(onExitEnding).toHaveBeenCalledTimes(1);
  });
});
