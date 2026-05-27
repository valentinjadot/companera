declare module "oled-font-pack" {
  import type Oled from "oled-i2c-bus";

  /**
   * Represents a font object compatible with oled-i2c-bus.
   */
  type Font = Oled.Font;

  /**
   * The list of all built-in font names available in the oled-font-pack.
   */
  type FontName =
    | "oled_3x5"
    | "tiny_4x6"
    | "oled_5x7"
    | "small_6x8"
    | "sinclair_8x8"
    | "sinclair_inverted_8x8"
    | "tiny_8x8"
    | "cp437_8x8"
    | "myke2_8x9"
    | "small_8x12"
    | "tron_8x12"
    | "retro_8x16"
    | "medium_numbers_12x16"
    | "big_numbers_14x24"
    | "arial_bold_16x16"
    | "arial_italic_16x16"
    | "arial_normal_16x16"
    | "big_16x16"
    | "franklin_gothic_normal_16x16"
    | "hallfetica_normal_16x16"
    | "nadianne_16x16"
    | "sinclair_medium_16x16"
    | "sinclair_medium_inverted_16x16"
    | "swiss_721_outline_16x16"
    | "various_symbols_16x16"
    | "dot_matrix_medium_16x22"
    | "dot_matrix_medium_zero_slash_16x22"
    | "dot_matrix_medium_numbers_only_16x22"
    | "arial_round_16x24"
    | "ocr_a_extended_medium_16x24"
    | "sixteen_segment_16x24"
    | "grotesk_16x32"
    | "grotesk_bold_16x32"
    | "retro_16x32"
    | "various_symbols_16x32"
    | "various_symbols_v2_16x32"
    | "dot_matrix_large_numbers_only_24x29"
    | "inconsola_24x32"
    | "ubuntu_24x32"
    | "ubuntu_bold_24x32"
    | "dingbats1_extra_large_32x24"
    | "various_symbols_32x32";

  /**
   * The FontPack object has properties for each available font.
   * Access a font by property (e.g. FontPack.oled_5x7) or by string key (FontPack["oled_5x7"]).
   * Fonts are demand-loaded on first access.
   * The '_available' property lists all available font names.
   * The '_loaded' property is an object of loaded fonts.
   */
  type FontPackType = Record<FontName, Font> & {
    /** List of available font names. */
    _available: FontName[];
    /** List of currently loaded fonts. */
    _loaded: Partial<Record<FontName, Font>>;
  };

  const FontPack: FontPackType;

  export type { Font, FontName, FontPackType };
  export default FontPack;
}
