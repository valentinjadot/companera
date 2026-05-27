import readline from "node:readline";
import { onCleanup } from "@/utils/cleanup";

export function onRotaryClick(handler: () => void) {
  console.log("[ROTARY] Press 'r' to simulate a click");

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();

  const onKeypress = (_str: string, key: readline.Key) => {
    if (key?.ctrl && key.name === "c") {
      process.kill(process.pid, "SIGINT");
      return;
    }

    if (key?.name === "r") {
      console.log("[ROTARY] Click");
      handler();
    }
  };

  process.stdin.on("keypress", onKeypress);

  onCleanup(() => {
    process.stdin.off("keypress", onKeypress);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  });
}
