import * as ApiTypes from "./api/types.js";

export type { ApiTypes };

export type DecoratedChannel = {
  channel: {
    title: string;
    streamUrl: string;
  };
  place: {
    city: string;
    country: string;
  };
};
