import {
  startLoadingAnimation as startLoading,
  stopLoadingAnimation as stopLoading,
} from "@/screen/loading";

export function writeOnScreen(text: string) {
  stopLoading();
  console.log("[SCREEN] " + text);
}

export function startLoadingAnimation() {
  startLoading((text) => console.log("[SCREEN]\n" + text));
}

export function stopLoadingAnimation() {
  stopLoading();
}
