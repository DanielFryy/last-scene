import { describe, expect, it, mock } from "bun:test";
import type { OBSClient } from "../../obs/types";
import { createObsControl } from "../../obs/control";

describe("createObsControl", () => {
  it("calls StopStream when stream is active", async () => {
    const callMock = mock(async (requestType: string) => {
      if (requestType === "GetStreamStatus") return { outputActive: true };
      if (requestType === "StopStream") return;
      throw new Error(`Unexpected request: ${requestType}`);
    });

    const control = createObsControl({
      call: callMock as unknown as OBSClient["call"]
    });

    await control.stopStream();

    expect(callMock).toHaveBeenCalledTimes(2);
    expect(callMock).toHaveBeenNthCalledWith(1, "GetStreamStatus");
    expect(callMock).toHaveBeenNthCalledWith(2, "StopStream");
  });

  it("skips StopStream when stream is already inactive", async () => {
    const callMock = mock(async (requestType: string) => {
      if (requestType === "GetStreamStatus") return { outputActive: false };
      if (requestType === "StopStream") {
        throw new Error("StopStream should not be called");
      }
      throw new Error(`Unexpected request: ${requestType}`);
    });

    const control = createObsControl({
      call: callMock as unknown as OBSClient["call"]
    });

    await control.stopStream();

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenNthCalledWith(1, "GetStreamStatus");
  });

  it("propagates OBS errors", async () => {
    const callMock = mock(async () => {
      throw new Error("OBS unavailable");
    });

    const control = createObsControl({
      call: callMock as unknown as OBSClient["call"]
    });

    await expect(control.stopStream()).rejects.toThrow("OBS unavailable");
  });
});
