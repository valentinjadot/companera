const ES_TO_CP437: Record<string, string> = {
  "\u00E1": "\xA0", // á
  "\u00E9": "\x82", // é
  "\u00ED": "\xA1", // í
  "\u00F3": "\xA2", // ó
  "\u00FA": "\xA3", // ú
  "\u00F1": "\xA4", // ñ
  "\u00FC": "\x81", // ü
  "\u00BF": "\xA8", // ¿
  "\u00A1": "\xAD", // ¡
};

const ES_CHARS = /[\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1\u00FC\u00BF\u00A1]/g;

export function toCp437(text: string): string {
  const normalized = text.replace(/\u00A0/g, " ");
  return normalized.replace(ES_CHARS, (c) => ES_TO_CP437[c] ?? c);
}
