export type LastSceneEvent =
  | { type: "ENDING_SCENE_ENTERED" }
  | { type: "SONG_STARTED_LONG" }
  | { type: "SONG_STARTED_SHORT" }
  | { type: "SONG_ENDED" }
  | { type: "NEXT_SONG_ENDED" }
  | { type: "EXIT_ENDING_SCENE" };
