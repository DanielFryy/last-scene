import { describe, it, expect, mock } from "bun:test";
import { createLastSceneActor } from "../../state/machine";

describe("lastScene state machine", () => {
  it("starts in idle", () => {
    const stopStream = mock();
    const actor = createLastSceneActor(stopStream);

    actor.start();

    expect(actor.getSnapshot().value).toBe("idle");
  });

  it("goes to waitingForSong when ending scene is entered", () => {
    const stopStream = mock();
    const actor = createLastSceneActor(stopStream);

    actor.start();
    actor.send({ type: "ENDING_SCENE_ENTERED" });

    expect(actor.getSnapshot().value).toBe("waitingForSong");
  });

  it("stops the stream when a long song ends", () => {
    const stopStream = mock();
    const actor = createLastSceneActor(stopStream);

    actor.start();
    actor.send({ type: "ENDING_SCENE_ENTERED" });
    actor.send({ type: "SONG_STARTED_LONG" });
    actor.send({ type: "SONG_ENDED" });

    expect(stopStream).toHaveBeenCalledTimes(1);
    expect(actor.getSnapshot().value).toBe("idle");
  });

  it("stops the stream after next song when the song is short", () => {
    const stopStream = mock();
    const actor = createLastSceneActor(stopStream);

    actor.start();
    actor.send({ type: "ENDING_SCENE_ENTERED" });
    actor.send({ type: "SONG_STARTED_SHORT" });
    actor.send({ type: "NEXT_SONG_ENDED" });

    expect(stopStream).toHaveBeenCalledTimes(1);
    expect(actor.getSnapshot().value).toBe("idle");
  });

  it("cancels the process if exiting the ending scene", () => {
    const stopStream = mock();
    const actor = createLastSceneActor(stopStream);

    actor.start();
    actor.send({ type: "ENDING_SCENE_ENTERED" });
    actor.send({ type: "SONG_STARTED_LONG" });
    actor.send({ type: "EXIT_ENDING_SCENE" });

    expect(stopStream).not.toHaveBeenCalled();
    expect(actor.getSnapshot().value).toBe("idle");
  });
});
