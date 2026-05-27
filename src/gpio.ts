export const PINS = {
  // OLED (I2C bus 1)
  oledSDA: 2, // physical pin 3
  oledSCL: 3, // physical pin 5

  // Rotary encoder
  rotaryClick: 23, // pin 16
  rotaryDT: 24, // pin 18
  rotaryCLK: 25, // pin 22

  // DAC PCM5102A (I2S)
  dacBCK: 18, // pin 12
  dacLRCK: 19, // pin 35
  dacDIN: 21, // pin 40
} as const;

export const I2C_BUS = {
  implicitlyUses: [PINS.oledSDA, PINS.oledSCL],
  busNumber: 1,
} as const;

export const I2S_DAC = {
  implicitlyUses: [PINS.dacBCK, PINS.dacLRCK, PINS.dacDIN],
  // activated via dtoverlay=hifiberry-dac in /boot/firmware/config.txt
} as const;
