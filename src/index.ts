import { getRandomDecoratedChannel } from "@/channels";
import { play } from "@/player/player";
import {
  startLoadingAnimation,
  stopLoadingAnimation,
  writeOnScreen,
} from "@/screen/screen";
import { sleep } from "@/utils/helpers";
import { onRotaryClick } from "@/rotary-button/rotary-button";

async function main() {
  console.log("[companera] ready — Ctrl+C to stop");
  writeOnScreen("\n\n\nHola compañera");
  await sleep(2000);

  void loadAndPlayRandomChannel();
  onRotaryClick(loadAndPlayRandomChannel);
}

main();

export async function loadAndPlayRandomChannel() {
  startLoadingAnimation();

  try {
    const channel = await getRandomDecoratedChannel();
    const onStart = () => {
      stopLoadingAnimation();
      writeOnScreen(`${channel.title}\n\n${channel.city}\n${channel.country}`);
    };
    await play(channel.streamUrl, onStart);
  } catch {
    await loadAndPlayRandomChannel();
  }
}
