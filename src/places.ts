import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { api } from "./api/client.js";
import type { ApiTypes } from "./types.js";

const PLACES_CACHE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/places.json",
);

export async function fetchAndSavePlaces() {
  const places = await api.places();
  await writeFile(PLACES_CACHE_PATH, JSON.stringify(places, null, 2));
  return places;
}

export async function allPlacesFromCache(): Promise<ApiTypes.Place[]> {
  const raw = await readFile(PLACES_CACHE_PATH, "utf8");
  const placesResponse = JSON.parse(raw) as ApiTypes.PlacesResponse;
  const places = placesResponse.data?.list;
  if (!places) {
    throw new Error(
      "No places found in cache. Run `pnpm fetch-places` to fetch them.",
    );
  }
  return places;
}
