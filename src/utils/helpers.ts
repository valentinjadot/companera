export function pickRandomItem<T>(array: readonly T[]): T | undefined {
  if (array.length === 0) return undefined;

  return array[Math.floor(Math.random() * array.length)];
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
