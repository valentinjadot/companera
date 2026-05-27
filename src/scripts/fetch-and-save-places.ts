import { fetchAndSavePlaces } from "@/places.js";

console.log("Fetching places...");
await fetchAndSavePlaces();
console.log("Wrote @/data/places.json");
