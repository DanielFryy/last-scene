import { createActor, setup } from "xstate";
import { LastSceneEvent } from "./machine.types";

const createLastSceneMachine = (stopStream: () => void) => {
  return setup({
    types: { events: {} as LastSceneEvent },
    actions: { stopStream }
  }).createMachine({
    id: "streamEnd",
    initial: "idle",
    states: {
      idle: {
        on: {
          ENDING_SCENE_ENTERED: "waitingForSong"
        }
      },
      waitingForSong: {
        on: {
          SONG_STARTED_LONG: "waitingForSongEnd", // Song started with more than threshold time remaining (2 minutes)
          SONG_STARTED_SHORT: "waitingForNextSongEnd", // Song started with less than threshold time remaining (2 minutes)
          EXIT_ENDING_SCENE: "idle"
        }
      },
      waitingForSongEnd: {
        on: {
          SONG_ENDED: "stoppingStream",
          EXIT_ENDING_SCENE: "idle"
        }
      },
      waitingForNextSongEnd: {
        on: {
          NEXT_SONG_ENDED: "stoppingStream",
          EXIT_ENDING_SCENE: "idle"
        }
      },
      stoppingStream: {
        entry: "stopStream",
        always: "idle"
      }
    }
  });
};

export const createLastSceneActor = (stopStream: () => void) => {
  const machine = createLastSceneMachine(stopStream);
  return createActor(machine);
};
