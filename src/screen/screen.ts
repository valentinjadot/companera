import { pickImpl } from "@/utils/platform";

const impl = await pickImpl(
  () => import("@/screen/screen.hardware"),
  () => import("@/screen/screen.mock"),
);

export const writeOnScreen = impl.writeOnScreen;
export const startLoadingAnimation = impl.startLoadingAnimation;
export const stopLoadingAnimation = impl.stopLoadingAnimation;
