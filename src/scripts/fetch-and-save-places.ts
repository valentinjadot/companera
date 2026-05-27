import { fetchAndSavePlaces } from "@/places";

console.log("Fetching places...");
await fetchAndSavePlaces();
console.log("Wrote @/data/places.json");
