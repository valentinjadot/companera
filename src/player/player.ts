import { pickImpl } from "@/utils/platform";

const impl = await pickImpl(
  () => import("@/player/player.hardware"),
  () => import("@/player/player.mock"),
);

export const play = impl.play;
export const stop = impl.stop;
