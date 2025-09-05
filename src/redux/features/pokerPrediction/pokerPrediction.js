import { baseApi } from "../../baseApi/baseApi";

const pokerPredictionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createPokerPrediction: builder.mutation({
            query: (data) => ({
                url: "/poker-tournament/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PokerTournament"],
        }),
        getAllPokerTuranment: builder.query({
            query: () => ({
                url: "/poker-tournament/getall",
                method: "GET",
            }),
            providesTags: ["PokerTournament"],
        }),
        updatePokerTuranament: builder.mutation({
            query: ({ formData, id }) => ({
                url: `/poker-tournament/edit/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["PokerTournament"],
        }),
        deletePokerTournament: builder.mutation({
            query: (id) => ({
                url: `/poker-tournament/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PokerTournament"],
        }),
        singleFullPokerTournament: builder.query({
            query: (id) => ({
                url: `/poker-tournament/single/${id}`,
                method: "GET",
            }),
            providesTags: ["PokerTournament"],
        }),
        getFullPokerTournament: builder.query({
            query: ({ userId, predictionId }) => ({
                url: `/poker-tournament/full-poker-prediction?userId=${userId}&predictionId=${predictionId}`,
                method: "GET",
            }),
            providesTags: ["PokerTournament"],
        }),
        declearAsWinner: builder.mutation({
            query: ({ userId, predictionId }) => ({
                url: `/poker-tournament/declare-winning?userId=${userId}&predictionId=${predictionId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["PokerTournament"],
        }),
    }),
});

export const {
    useCreatePokerPredictionMutation,
    useGetAllPokerTuranmentQuery,
    useUpdatePokerTuranamentMutation,
    useDeletePokerTournamentMutation,
    useSingleFullPokerTournamentQuery,
    useDeclearAsWinnerMutation,
    useGetFullPokerTournamentQuery
} = pokerPredictionApi;