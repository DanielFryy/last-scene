import type { OBSRequestTypes, OBSResponseTypes } from "obs-websocket-js";

export interface OBSClient {
  connect: () => Promise<void>;
  onSceneChange: (callback: (sceneName: string) => void) => void;
  call: <Type extends keyof OBSRequestTypes>(
    requestType: Type,
    requestData?: OBSRequestTypes[Type]
  ) => Promise<OBSResponseTypes[Type]>;
}

export type OBSConnection = OBSClient;

export interface ObsEventHandlers {
  endingScene: string;
  onEndingScene: () => void;
  onExitEnding: () => void;
}

export interface ObsControl {
  stopStream: () => Promise<void>;
}
