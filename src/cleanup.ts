const cleanupHandlers: Array<() => void> = [];

export function onCleanup(fn: () => void) {
  cleanupHandlers.push(fn);
}

process.on("SIGINT", () => {
  cleanupHandlers.forEach((fn) => fn());
  process.exit();
});
