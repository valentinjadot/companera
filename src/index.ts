import { getRandomDecoratedChannel } from "@/channels";
import { play, stop, warmUp } from "@/player/player";
import {
  startLoadingAnimation,
  stopLoadingAnimation,
  writeOnScreen,
} from "@/screen/screen";
import { sleep } from "@/utils/helpers";
import { onRotaryClick } from "@/rotary-button/rotary-button";

const WELCOME_SCREEN_MS = 5000;

async function main() {
  console.log("[companera] ready — Ctrl+C to stop");
  writeOnScreen("\n\n\nHola compañera");
  await Promise.all([sleep(WELCOME_SCREEN_MS), warmUp()]);

  void loadAndPlayRandomChannel();
  onRotaryClick(loadAndPlayRandomChannel);
}

main();

export async function loadAndPlayRandomChannel() {
  startLoadingAnimation();
  await stop();

  try {
    const channel = await getRandomDecoratedChannel();
    const onStart = () => {
      stopLoadingAnimation();
      writeOnScreen(`${channel.title}\n\n${channel.city}\n${channel.country}`);
    };
    await play(channel.streamUrl, onStart);
  } catch (err) {
    stopLoadingAnimation();
    writeOnScreen("Falló :(\Haz click de nuevo...");
    console.error("[companera] playback failed, retrying...", err);
    try {
      await stop();
    } catch (err) {
      console.error("[companera] failed to stop player", err);
    }
  }
}
