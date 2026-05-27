/**
 * Raspberry Pi Zero 2 W — J8 header pinout.
 * Keys are physical pin numbers. GPIO pins map to their BCM number.
 *
 * J8:
 *    3V3  (1) (2)  5V
 *  GPIO2  (3) (4)  5V
 *  GPIO3  (5) (6)  GND
 *  GPIO4  (7) (8)  GPIO14
 *    GND  (9) (10) GPIO15
 * GPIO17 (11) (12) GPIO18
 * GPIO27 (13) (14) GND
 * GPIO22 (15) (16) GPIO23
 *   3V3  (17) (18) GPIO24
 * GPIO10 (19) (20) GND
 *  GPIO9 (21) (22) GPIO25
 * GPIO11 (23) (24) GPIO8
 *   GND  (25) (26) GPIO7
 * GPIO0  (27) (28) GPIO1
 * GPIO5  (29) (30) GND
 * GPIO6  (31) (32) GPIO12
 * GPIO13 (33) (34) GND
 * GPIO19 (35) (36) GPIO16
 * GPIO26 (37) (38) GPIO20
 *   GND  (39) (40) GPIO21
 */

export const PHYSICAL_PIN_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
] as const;

export const BCM_PIN_NUMBERS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27,
] as const;

export type PhysicalPinNumber = (typeof PHYSICAL_PIN_NUMBERS)[number];
export type BcmPinNumber = (typeof BCM_PIN_NUMBERS)[number];
export type PinLabel = "3V3" | "5V" | "GND";

export type GpioPin = Record<PhysicalPinNumber, PinLabel | BcmPinNumber>;

export const GPIO_PINS = {
  1: "3V3",
  2: "5V",
  3: 2,
  4: "5V",
  5: 3,
  6: "GND",
  7: 4,
  8: 14,
  9: "GND",
  10: 15,
  11: 17,
  12: 18,
  13: 27,
  14: "GND",
  15: 22,
  16: 23,
  17: "3V3",
  18: 24,
  19: 10,
  20: "GND",
  21: 9,
  22: 25,
  23: 11,
  24: 8,
  25: "GND",
  26: 7,
  27: 0,
  28: 1,
  29: 5,
  30: "GND",
  31: 6,
  32: 12,
  33: 13,
  34: "GND",
  35: 19,
  36: 16,
  37: 26,
  38: 20,
  39: "GND",
  40: 21,
} as const satisfies GpioPin;

type GpioMapping = {
  [key: string]: GpioPin[keyof GpioPin];
};

export const I2C_BUS_FOR_OLED_SCREEN = 1;

export const OLED_SCREEN = {
  GND: GPIO_PINS[9],
  VCC: GPIO_PINS[1],
  SCL: GPIO_PINS[5],
  SDA: GPIO_PINS[3],
} as const satisfies GpioMapping;

/** Encoder silkscreen: GND, S1, S2, KEY, 5V */
export const ROTARY_ENCODER = {
  GND: GPIO_PINS[14],
  S1: GPIO_PINS[22],
  S2: GPIO_PINS[18],
  KEY: GPIO_PINS[16],
  VCC: GPIO_PINS[17], // encoder "5V" → Pi 3.3V (pin 17), not Pi 5V
} as const satisfies GpioMapping;

/** PCM5102A I2S DAC — silkscreen: VIN, GND, LCK, DIN, BCK, SCK */
export const AUDIO_DAC = {
  SCK: GPIO_PINS[25], // → GND (pas de MCLK)
  BCK: GPIO_PINS[12], // GPIO18 = PCM_CLK
  DIN: GPIO_PINS[40], // GPIO21 = PCM_DOUT
  LRCK: GPIO_PINS[35], // GPIO19 = PCM_FS  (silkscreen: LCK)
  GND: GPIO_PINS[6], // GND
  VIN: GPIO_PINS[2], // 5V
} as const satisfies GpioMapping;
