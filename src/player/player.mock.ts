import { play as playAudio, stop as stopAudio } from "@/player/playback";
import { onCleanup } from "@/utils/cleanup";

export function play(url: string, onStart?: () => void) {
  console.log("[PLAYER] Playing " + url);
  return playAudio(url, onStart);
}

export function stop() {
  console.log("[PLAYER] Stopped");
  return stopAudio();
}

onCleanup(() => void stop());
