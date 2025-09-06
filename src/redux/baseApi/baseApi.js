import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://72.60.47.236:8000/api/v1",
    baseUrl: "https://api.contesthunters.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "PredictionApi", "PricePrediction", "Reviews", "PokerTournament", 'User-2', "Setting", 'Privacy-Policy', "Profile"],
  endpoints: () => ({}),
});
