import os from "node:os";

const RASPBERRY_PI_HOSTNAME = "companera";
const hostname = os.hostname();
export const isPi = hostname === RASPBERRY_PI_HOSTNAME;

export async function pickImpl<T>(
  hardware: () => Promise<T>,
  mock: () => Promise<T>,
): Promise<T> {
  return isPi ? hardware() : mock();
}
