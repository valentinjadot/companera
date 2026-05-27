import i2c from "i2c-bus";
import Oled from "oled-i2c-bus";
import font from "oled-font-5x7";
import { I2C_BUS } from "@/gpio";

const i2cBus = i2c.openSync(I2C_BUS.busNumber);
const oled = new Oled(i2cBus, { width: 128, height: 64, address: 0x3c });

export function writeOnScreen(text: string) {
  oled.clearDisplay();
  oled.setCursor(1, 1);
  oled.writeString(font, 2, text, 1, true);
}
