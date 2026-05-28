import { onCleanup } from "@/utils/cleanup";
import { stop } from "@/player/playback";

export { play, stop } from "@/player/playback";

onCleanup(() => void stop());
