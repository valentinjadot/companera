import { play as playAudio, stop as stopAudio } from "@/player/playback";

let playingUrl: string | null = null;

export function play(url: string): Promise<void> {
  stop();
  playingUrl = url;
  console.log("[PLAYER] Playing " + url);
  return playAudio(url);
}

export function stop() {
  if (playingUrl) {
    stopAudio();
    console.log("[PLAYER] Stopped");
    playingUrl = null;
  }
}
