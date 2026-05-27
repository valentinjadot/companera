import { Gpio } from "onoff";
import { PINS } from "./gpio";
import { onCleanup } from "./cleanup";

const clickPin = new Gpio(PINS.rotaryClick, "in", "falling", {
  debounceTimeout: 50,
});

onCleanup(() => clickPin.unexport());

export function onRotaryClick(handler: () => void) {
  clickPin.watch((err) => {
    if (!err) handler();
  });
}
