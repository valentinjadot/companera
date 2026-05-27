import { Gpio } from "onoff";
import { onCleanup } from "@/utils/cleanup";
import { PINS } from "@/gpio";

const clickPin = new Gpio(PINS.rotaryClick, "in", "falling", {
  debounceTimeout: 50,
});

onCleanup(() => clickPin.unexport());

export function onRotaryClick(handler: () => void) {
  clickPin.watch((err) => {
    if (!err) handler();
  });
}
