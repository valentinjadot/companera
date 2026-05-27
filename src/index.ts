import { getRandomDecoratedChannel } from "./channels.js";
import { writeOnScreen } from "./screen.js";
import { sleep } from "./utils.js";

async function main() {
  writeOnScreen("Hola compañera");
  await sleep(2000);

  writeOnScreen("Loading...");
  const channel = await getRandomDecoratedChannel();
  writeOnScreen(
    `${channel.channel.title} - ${channel.place.city} (${channel.place.country})`,
  );
}

main();
