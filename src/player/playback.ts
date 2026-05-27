import { spawn, type ChildProcess } from "node:child_process";

let current: ChildProcess | null = null;

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

  return [...input, "-f", "alsa", "default"];
}

export function play(url: string): Promise<void> {
  stop();

  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", buildArgs(url), {
      stdio: ["ignore", "ignore", "pipe"],
    });
    current = child;

    child.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code !== "ENOENT") return;
      const install =
        process.platform === "darwin"
          ? "brew install ffmpeg"
          : "sudo apt install ffmpeg";
      console.error(`[PLAYER] ffmpeg not found — ${install}`);
      reject(err);
    });

    child.stderr?.on("data", (chunk: Buffer) => {
      const message = chunk.toString().trim();
      if (message) console.error("[PLAYER] " + message);
    });

    child.on("exit", (code) => {
      if (child !== current) return;
      current = null;
      if (code !== 0 && code !== null) {
        console.error(`[PLAYER] ffmpeg exited with code ${code}`);
        reject(new Error(`ffmpeg exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

export function stop() {
  if (!current) return;
  const child = current;
  current = null;
  child.kill();
}
