import { spawn, type ChildProcess } from "node:child_process";

let current: ChildProcess | null = null;
let playGeneration = 0;

function buildArgs(url: string): string[] {
  const input = [
    "-nostdin",
    "-loglevel",
    "error",
    "-i",
    url,
    "-vn",
    "-af",
    "volume=0.5",
  ];

  if (process.platform === "darwin") {
    return [...input, "-f", "audiotoolbox", "-"];
  }

  return [...input, "-ac", "2", "-f", "alsa", "default"];
}

export function stop(): Promise<void> {
  return new Promise((resolve) => {
    if (!current) return resolve();
    const child = current;
    current = null;
    playGeneration++;
    child.once("exit", () => resolve());
    child.kill("SIGKILL");
  });
}

export async function play(url: string, onStart?: () => void): Promise<void> {
  await stop();
  const generation = playGeneration;

  const stderrLines: string[] = [];

  console.log("[PLAYER] playing " + url);

  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", buildArgs(url), {
      stdio: ["ignore", "ignore", "pipe"],
    });
    current = child;

    const superseded = () => generation !== playGeneration;

    child.on("spawn", () => {
      console.log("[PLAYER] stream started");
      onStart?.();
    });

    child.on("error", (err: NodeJS.ErrnoException) => {
      if (child === current) current = null;
      if (superseded()) return resolve();

      if (err.code === "ENOENT") {
        const install =
          process.platform === "darwin"
            ? "brew install ffmpeg"
            : "sudo apt install ffmpeg";
        console.error(`[PLAYER] ffmpeg not found — ${install}`);
      } else {
        console.error("[PLAYER] failed to spawn ffmpeg:", err);
      }
      reject(err);
    });

    child.stderr?.on("data", (chunk: Buffer) => {
      if (superseded()) return;
      for (const line of chunk.toString().split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        stderrLines.push(trimmed);
        console.error("[PLAYER] " + trimmed);
      }
    });

    child.on("exit", (code, signal) => {
      if (child === current) current = null;
      if (superseded()) return resolve();

      if (code === 0) return resolve();

      if (code === null) {
        const msg = signal
          ? `ffmpeg killed by signal ${signal}`
          : "ffmpeg exited unexpectedly";
        console.error("[PLAYER] " + msg);
        reject(new Error(msg));
        return;
      }

      const detail =
        stderrLines.length > 0
          ? stderrLines.slice(-5).join(" | ")
          : "no stderr output";
      const err = new Error(
        `ffmpeg exited with code ${code} (${detail})`,
      );
      console.error("[PLAYER] " + err.message);
      reject(err);
    });
  });
}
