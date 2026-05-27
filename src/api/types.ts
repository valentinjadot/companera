import type { components, paths } from "./specs/generated/schema.js";

// Response obj
export type PlacesResponse =
  paths["/ara/content/places"]["get"]["responses"][200]["content"]["application/json"];

export type PlaceResponse =
  paths["/ara/content/page/{placeId}"]["get"]["responses"][200]["content"]["application/json"];

export type ChannelRef = components["schemas"]["ChannelRef"];
export type Channel = components["schemas"]["Channel"];
export type Place = components["schemas"]["Place"];

// Specs are wrong, it returns an array of Channel objects, not ChannelRefs
export type PlaceChannelsResponse =
  paths["/ara/content/page/{placeId}/channels"]["get"]["responses"][200]["content"]["application/json"] & {
    data?: {
      content?: [{ items?: { page: Channel }[] }];
    };
  };

export type ChannelResponse =
  paths["/ara/content/channel/{channelId}"]["get"]["responses"][200]["content"]["application/json"];

export type SearchResponse =
  paths["/search"]["get"]["responses"][200]["content"]["application/json"];

export type StreamUrlResponse =
  paths["/ara/content/listen/{channelId}/channel.mp3"]["get"]["responses"][302]["content"]["text/html"];
