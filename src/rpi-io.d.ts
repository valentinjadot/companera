declare module "rpi-io" {
  export class RIO {
    constructor(line: number, mode: "input" | "output" | "pwm", opt?: object);
    monitoringStart(
      callback: (edge: string) => void,
      edge: "rising" | "falling" | "both",
      debounceMs: number,
    ): void;
    monitoringStop(): void;
    close(): void;
  }
}
