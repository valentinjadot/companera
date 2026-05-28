import { RIO } from "rpi-io";

import { ROTARY_ENCODER } from "@/gpio/pins";
import { onCleanup } from "@/utils/cleanup";

const button = new RIO(ROTARY_ENCODER.KEY, "input");

onCleanup(() => {
  button.monitoringStop();
  button.close();
});

export function onRotaryClick(handler: () => void) {
  button.monitoringStart(() => handler(), "falling", 2000);
}
