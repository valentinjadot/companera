import { api, API_BASE } from "./api/client.js";
import type { ApiTypes, DecoratedChannel } from "@/types.js";
import { allPlacesFromCache } from "./places.js";
import { pickRandomItem } from "./utils.js";

export async function getRandomDecoratedChannel(): Promise<DecoratedChannel> {
  const places = await allPlacesFromCache();
  const randomPlace = pickRandomItem(places);
  if (!randomPlace?.id) {
    throw new Error("No random place found");
  }

  const channels = await getChannelsFromPlace(randomPlace);

  if (channels.length === 0) {
    throw new Error("No channels found");
  }

  const randomChannel = pickRandomItem(channels);

  if (!randomChannel) {
    throw new Error("No random channel found");
  }

  const channelId = getChannelIdFromChannelRef(randomChannel);
  const streamUrl = getStreamUrl(channelId);

  if (!randomChannel.title) {
    throw new Error("Channel has no title");
  }

  if (!randomPlace.title) {
    throw new Error("Place has no title");
  }

  if (!randomPlace.country) {
    throw new Error("Place has no country");
  }

  return {
    channel: {
      title: randomChannel.title,
      streamUrl,
    },
    place: {
      city: randomPlace.title,
      country: randomPlace.country,
    },
  };
}

async function getChannelsFromPlace(place: ApiTypes.Place) {
  if (!place.id) {
    throw new Error("Place has no id");
  }

  const { data } = await api.placeChannels(place.id);
  const channels = data?.content?.[0]?.items?.map((item) => item.page) ?? [];

  return channels;
}

export function getChannelIdFromChannelRef(channel: ApiTypes.Channel) {
  if (!channel.url) {
    throw new Error("Channel has no url");
  }

  const channelId = channel.url.split("/").pop();
  if (!channelId) {
    throw new Error("Could not extract channel id from url");
  }

  return channelId;
}

export function getStreamUrl(channelId: string) {
  return `${API_BASE}/ara/content/listen/${channelId}/channel.mp3`;
}
