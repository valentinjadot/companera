import { onKeyboardKey } from "@/utils/keyboard";

const CLICK_KEY = "r";

let onClick: (() => void) | undefined;

console.log(`[ROTARY] Dev mode — press "${CLICK_KEY}" to simulate a click`);

onKeyboardKey((key) => {
  if (key?.name !== CLICK_KEY) return;
  console.log("[ROTARY] Click");
  onClick?.();
});

export function onRotaryClick(handler: () => void) {
  onClick = handler;
}
