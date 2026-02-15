import type { OBSClient, ObsControl } from "./types";

export const createObsControl = (obs: Pick<OBSClient, "call">): ObsControl => {
  const stopStream = async () => {
    const status = await obs.call("GetStreamStatus");
    if (!status.outputActive) return;
    await obs.call("StopStream");
  };

  return { stopStream };
};
