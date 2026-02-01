import { createMachine, interpret } from "xstate";


const streamEndMachine = createMachine(
  {
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
          SONG_STARTED_LONG: "waitingForSongEnd",
          SONG_STARTED_SHORT: "waitingForNextSongEnd",
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
  },
  {
    actions: {
      stopStream: async () => {
        await obs.stopStream();
      }
    }
  }
);

const service = interpret(streamEndMachine).start();
