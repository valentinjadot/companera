import { pickImpl } from "@/utils/platform";

const impl = await pickImpl(
  () => import("@/screen/screen.hardware"),
  () => import("@/screen/screen.mock"),
);

export const writeOnScreen = impl.writeOnScreen;
