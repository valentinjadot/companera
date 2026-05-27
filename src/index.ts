import { getRandomDecoratedChannel } from "./channels.js";
import { play } from "./player.js";
import { writeOnScreen } from "./screen.js";
import { sleep } from "./utils.js";
import { onRotaryClick } from "./rotary-button.js";

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
