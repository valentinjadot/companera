import ffmpegPath from "ffmpeg-static";
import { spawn, type ChildProcess } from "node:child_process";
import { onCleanup } from "@/utils/cleanup";

let current: ChildProcess | null = null;

function buildArgs(url: string): string[] {
  const input = ["-nostdin", "-loglevel", "error", "-i", url, "-vn"];

  if (process.platform === "darwin") {
    return [...input, "-f", "audiotoolbox", "-"];
  }

  return [...input, "-f", "alsa", "default"];
}

export function play(url: string) {
  stop();

  if (!ffmpegPath) {
    throw new Error("ffmpeg-static binary not found — run pnpm install");
  }

  const process = spawn(ffmpegPath, buildArgs(url), {
    stdio: ["ignore", "ignore", "pipe"],
  });
  current = process;

  process.stderr?.on("data", (chunk: Buffer) => {
    const message = chunk.toString().trim();
    if (message) console.error("[PLAYER] " + message);
  });

  process.on("exit", (code) => {
    if (process !== current) return;
    current = null;
    if (code !== 0 && code !== null) {
      console.error(`[PLAYER] ffmpeg exited with code ${code}`);
    }
  });
}

export function stop() {
  if (!current) return;
  const process = current;
  current = null;
  process.kill();
}

onCleanup(stop);
