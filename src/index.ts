import i2c from "i2c-bus";
import Oled from "oled-i2c-bus";
import font from "oled-font-5x7";

const i2cBus = i2c.openSync(1);
const oled = new Oled(i2cBus, { width: 128, height: 64, address: 0x3c });

oled.clearDisplay();
oled.setCursor(1, 1);
oled.writeString(font, 2, "Hola companera", 1, true);
