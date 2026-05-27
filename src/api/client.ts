import type {
  ChannelResponse,
  PlaceChannelsResponse,
  PlaceResponse,
  PlacesResponse,
  SearchResponse,
} from "@/api/types";

export const API_BASE = "https://radio.garden/api";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

export const api = {
  places: () => request<PlacesResponse>("/ara/content/places"),
  place: (placeId: string) =>
    request<PlaceResponse>(`/ara/content/page/${placeId}`),
  placeChannels: (placeId: string) =>
    request<PlaceChannelsResponse>(`/ara/content/page/${placeId}/channels`),
  channel: (id: string) =>
    request<ChannelResponse>(`/ara/content/channel/${id}`),
  search: (q: string) =>
    request<SearchResponse>(`/search?q=${encodeURIComponent(q)}`),
};
