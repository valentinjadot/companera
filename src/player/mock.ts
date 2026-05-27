import * as shared from "@/player/shared";

let playingUrl: string | null = null;

export function play(url: string) {
  stop();
  playingUrl = url;
  console.log("[PLAYER] Playing " + url);
  shared.play(url);
}

export function stop() {
  if (playingUrl) {
    shared.stop();
    console.log("[PLAYER] Stopped");
    playingUrl = null;
  }
}
