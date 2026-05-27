import readline from "node:readline";

import { onCleanup } from "@/utils/cleanup";

export function onKeyboardKey(handler: (key: readline.Key) => void) {
  readline.emitKeypressEvents(process.stdin);
  setStdinRawMode(true);
  process.stdin.resume();

  const handleKeypress = (_str: string, key: readline.Key) => {
    if (isCtrlC(key)) {
      process.kill(process.pid, "SIGINT");
      return;
    }
    handler(key);
  };

  process.stdin.on("keypress", handleKeypress);

  onCleanup(() => {
    process.stdin.off("keypress", handleKeypress);
    setStdinRawMode(false);
    process.stdin.pause();
  });
}

function isCtrlC(key: readline.Key | undefined) {
  return key?.ctrl === true && key.name === "c";
}

function setStdinRawMode(enabled: boolean) {
  if (!process.stdin.isTTY) return;
  process.stdin.setRawMode(enabled);
}
