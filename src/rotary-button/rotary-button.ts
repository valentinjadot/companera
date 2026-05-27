import { pickImpl } from "@/utils/platform";

const impl = await pickImpl(
  () => import("@/rotary-button/rotary-button.hardware"),
  () => import("@/rotary-button/rotary-button.mock"),
);

export const onRotaryClick = impl.onRotaryClick;
