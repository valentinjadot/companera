import MPV from "node-mpv";
import { onCleanup } from "@/utils/cleanup";

const mpv = new MPV({ audio_only: true }, [
  ...(process.platform === "linux"
    ? ["--ao=alsa", "--audio-device=default"]
    : []),
  "--volume=50",
]);

let intentionalStop = false;

export async function stop(): Promise<void> {
  intentionalStop = true;
  if (mpv.isRunning()) await mpv.stop().catch(() => {});
}

export async function play(url: string, onStart?: () => void): Promise<void> {
  await stop();
  intentionalStop = false;

  console.log("[PLAYER] playing " + url);

  if (!mpv.isRunning()) await mpv.start();
  await mpv.load(url, "replace");

  console.log("[PLAYER] stream started");
  onStart?.();

  await new Promise<void>((resolve, reject) => {
    mpv.once("stopped", () =>
      intentionalStop ? resolve() : reject(new Error("playback stopped")),
    );
    mpv.once("crashed", () =>
      intentionalStop ? resolve() : reject(new Error("mpv crashed")),
    );
  });
}

async function quit(): Promise<void> {
  intentionalStop = true;
  if (mpv.isRunning()) await mpv.quit().catch(() => {});
}

onCleanup(() => void quit());
