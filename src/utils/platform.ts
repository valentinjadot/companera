import { existsSync } from "node:fs";

export const isPi = existsSync("/dev/i2c-1");

export async function pickImpl<T>(
  hardware: () => Promise<T>,
  mock: () => Promise<T>,
): Promise<T> {
  return isPi ? hardware() : mock();
}
