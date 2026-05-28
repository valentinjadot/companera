import MPV from "node-mpv";
import { onCleanup } from "@/utils/cleanup";

const mpv = new MPV({ audio_only: true }, mpvArgs());

let playGeneration = 0;
let loadLock: Promise<void> = Promise.resolve();

function mpvArgs(): string[] {
  const alsa =
    process.platform === "linux" ? ["--ao=alsa", "--audio-device=default"] : [];

  return [
    ...alsa,
    "--volume=50",
    "--ytdl=no",
    "--load-scripts=no",
  ];
}

function isStale(generation: number): boolean {
  return generation !== playGeneration;
}

async function withLoadLock<T>(fn: () => Promise<T>): Promise<T> {
  let unlock!: () => void;
  const locked = new Promise<void>((resolve) => {
    unlock = resolve;
  });
  const previous = loadLock;
  loadLock = locked;
  await previous;
  try {
    return await fn();
  } finally {
    unlock();
  }
}

export async function warmUp(): Promise<void> {
  if (mpv.isRunning()) return;
  await mpv.start();
}

export async function stop(): Promise<void> {
  playGeneration++;
  if (!mpv.isRunning()) return;
  await mpv.stop().catch(() => {});
}

export async function play(url: string, onStart?: () => void): Promise<void> {
  let generation = 0;

  await withLoadLock(async () => {
    await stop();
    generation = playGeneration;

    console.log("[PLAYER] playing " + url);

    if (!mpv.isRunning()) await mpv.start();
    if (isStale(generation)) return;

    await mpv.load(url, "replace");
    if (isStale(generation)) return;

    console.log("[PLAYER] stream started");
    onStart?.();
  });

  if (isStale(generation)) return;

  await waitUntilPlaybackEnds(generation);
}

function waitUntilPlaybackEnds(generation: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const done = (error?: Error) => {
      if (isStale(generation)) resolve();
      else if (error) reject(error);
      else resolve();
    };

    mpv.once("stopped", () => done(new Error("playback stopped")));
    mpv.once("crashed", () => done(new Error("mpv crashed")));
  });
}

async function quit(): Promise<void> {
  playGeneration++;
  if (!mpv.isRunning()) return;
  await mpv.quit().catch(() => {});
}

onCleanup(() => void quit());
