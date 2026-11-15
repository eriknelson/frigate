import { test, expect } from "../fixtures/frigate-test";

test("WebRTC playback does not contact an external ICE server @mobile", async ({
  frigateApp,
}) => {
  await frigateApp.page.addInitScript(() => {
    Object.defineProperty(window, "MediaSource", { value: undefined });
    delete (window as unknown as Record<string, unknown>).MediaSource;
    delete (window as unknown as Record<string, unknown>).ManagedMediaSource;

    const OriginalPeerConnection = window.RTCPeerConnection;
    const configurations: RTCConfiguration[] = [];
    Object.assign(window, { capturedIceConfigurations: configurations });
    window.RTCPeerConnection = class extends OriginalPeerConnection {
      constructor(configuration?: RTCConfiguration) {
        configurations.push(configuration ?? {});
        super(configuration);
      }
    };
  });

  await frigateApp.goto("/#front_door");
  const configurations = () =>
    frigateApp.page.evaluate(
      () =>
        (
          window as unknown as {
            capturedIceConfigurations: RTCConfiguration[];
          }
        ).capturedIceConfigurations,
    );

  await expect
    .poll(async () => (await configurations()).length)
    .toBeGreaterThan(0);
  for (const configuration of await configurations()) {
    expect(configuration.iceServers ?? []).toEqual([]);
  }
});
