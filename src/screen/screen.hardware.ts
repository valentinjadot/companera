import i2c from "i2c-bus";
import Oled from "oled-i2c-bus";
import FontPack from "oled-font-pack";
import { I2C_BUS_FOR_OLED_SCREEN } from "@/gpio/pins";

const i2cBus = i2c.openSync(I2C_BUS_FOR_OLED_SCREEN);
const oled = new Oled(i2cBus, { width: 128, height: 64, address: 0x3c });

const OPTIONS = {
  font: FontPack.tiny_8x8,
  fontSize: 1,
  color: 1,
  wrap: true,
} as const;

export function writeOnScreen(text: string) {
  oled.clearDisplay();
  oled.setCursor(1, 1);
  oled.writeString(
    OPTIONS.font,
    OPTIONS.fontSize,
    text,
    OPTIONS.color,
    OPTIONS.wrap,
  );
}
