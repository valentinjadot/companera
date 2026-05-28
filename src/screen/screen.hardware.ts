import i2c from "i2c-bus";
import Oled from "oled-i2c-bus";
import FontPack from "oled-font-pack";
import { I2C_BUS_FOR_OLED_SCREEN } from "@/gpio/pins";
import { toCp437 } from "@/screen/cp437";
import { generateLoadingText } from "@/screen/loading";
import { onCleanup } from "@/utils/cleanup";

const i2cBus = i2c.openSync(I2C_BUS_FOR_OLED_SCREEN);
const oled = new Oled(i2cBus, { width: 128, height: 64, address: 0x3c });

const OPTIONS = {
  font: FontPack.cp437_8x8,
  fontSize: 1,
  color: 1,
  wrap: true,
} as const;

function drawText(text: string, wrap: boolean = OPTIONS.wrap) {
  oled.clearDisplay();
  oled.setCursor(1, 1);
  oled.writeString(
    OPTIONS.font,
    OPTIONS.fontSize,
    toCp437(text),
    OPTIONS.color,
    wrap,
  );
}

export function writeOnScreen(text: string) {
  stopLoadingAnimation();
  drawText(text);
}

let interval: ReturnType<typeof setInterval> | null = null;
const LOADING_FRAME_INTERVAL_MS = 20;

export function startLoadingAnimation() {
  stopLoadingAnimation();

  let frame = 0;

  const renderLoadingFrame = () => {
    const text = generateLoadingText(frame++);
    drawText(text, false);
  };

  interval = setInterval(renderLoadingFrame, LOADING_FRAME_INTERVAL_MS);
}

export function stopLoadingAnimation() {
  if (!interval) return;
  clearInterval(interval);
  interval = null;
}

onCleanup(() => {
  stopLoadingAnimation();
  oled.clearDisplay();
  i2cBus.closeSync();
});
