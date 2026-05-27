import { getRandomDecoratedChannel } from "@/channels";
import { play } from "@/player";
import { writeOnScreen } from "@/screen/screen";
import { sleep } from "@/utils/helpers";
import { onRotaryClick } from "@/rotary-button/rotary-button";

async function main() {
  writeOnScreen("Hola compañera");
  await sleep(2000);

  loadAndPlayRandomChannel();
  onRotaryClick(loadAndPlayRandomChannel);
}

main();

export async function loadAndPlayRandomChannel() {
  writeOnScreen("Loading...");
  const channel = await getRandomDecoratedChannel();
  writeOnScreen(`${channel.title} (${channel.city}, ${channel.country})`);
  play(channel.streamUrl);
}
