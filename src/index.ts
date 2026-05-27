import { getRandomDecoratedChannel } from "@/channels";
import { play } from "@/player/player";
import { writeOnScreen } from "@/screen/screen";
import { sleep } from "@/utils/helpers";
import { onRotaryClick } from "@/rotary-button/rotary-button";

async function main() {
  console.log("[companera] ready — Ctrl+C to stop");
  writeOnScreen("Hola compañera");
  await sleep(2000);

  void loadAndPlayRandomChannel();
  onRotaryClick(loadAndPlayRandomChannel);
}

main();

export async function loadAndPlayRandomChannel() {
  writeOnScreen("Loading...");

  try {
    const channel = await getRandomDecoratedChannel();
    writeOnScreen(`${channel.title} (${channel.city}, ${channel.country})`);
    await play(channel.streamUrl);
  } catch {
    await loadAndPlayRandomChannel();
  }
}
