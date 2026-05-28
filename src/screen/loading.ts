const LOADING_CHARS_PER_LINE = 16;
const LOADING_LINES = 8;
const LOADING_FILL_CHAR = "~";
const LOADING_WAVE_GAP_CHAR = " ";
const LOADING_WAVE_FREQUENCY = 0.4;
const LOADING_WAVE_AMPLITUDE = 0.75;
const LOADING_FRAME_INTERVAL_MS = 20;
const LOADING_WAVE_ROW_CENTER = (LOADING_LINES - 1) / 2;
const LOADING_WAVE_ROW_SPAN = LOADING_WAVE_ROW_CENTER * LOADING_WAVE_AMPLITUDE;

const LOADING_BASE_TEXT = Array.from({ length: LOADING_LINES }, () =>
  LOADING_FILL_CHAR.repeat(LOADING_CHARS_PER_LINE),
);

let interval: ReturnType<typeof setInterval> | null = null;

export function renderLoadingFrame(frame: number): string {
  const lines = LOADING_BASE_TEXT.map((line) => line.split(""));

  for (let x = 0; x < LOADING_CHARS_PER_LINE; x++) {
    const phase = (x + frame) * LOADING_WAVE_FREQUENCY;
    const y = Math.round(
      LOADING_WAVE_ROW_CENTER + Math.sin(phase) * LOADING_WAVE_ROW_SPAN,
    );
    lines[y]![x] = LOADING_WAVE_GAP_CHAR;
  }

  return lines.map((chars) => chars.join("")).join("\n");
}

export function startLoadingAnimation(onFrame: (text: string) => void) {
  stopLoadingAnimation();
  let frame = 0;
  const paint = () => onFrame(renderLoadingFrame(frame++));
  paint();
  interval = setInterval(paint, LOADING_FRAME_INTERVAL_MS);
}

export function stopLoadingAnimation() {
  if (!interval) return;
  clearInterval(interval);
  interval = null;
}
