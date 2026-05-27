import { spawn, ChildProcess } from "node:child_process";

let current: ChildProcess | null = null;

export function play(url: string) {
  stop();
  current = spawn("mpv", ["--no-video", "--quiet", url], { stdio: "ignore" });
}

export function stop() {
  if (current) {
    current.kill();
    current = null;
  }
}
