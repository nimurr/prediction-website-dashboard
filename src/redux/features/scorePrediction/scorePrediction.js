import { baseApi } from "../../baseApi/baseApi";

const PredictionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPredictions: builder.query({
            query: () => ({
                url: `/score-prediction/getAll`,
                method: "GET",
            }),
            providesTags: ["PredictionApi"],
        }),
        createScorePrediction: builder.mutation({
            query: (newPrediction) => ({
                url: `/score-prediction/create`,
                method: "POST",
                body: newPrediction,
            }),
            invalidatesTags: ["PredictionApi"],
        }),
        updateScorePrediction: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/score-prediction/edit/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["PredictionApi"],
        }),
        deleteScorePrediction: builder.mutation({
            query: (id) => ({
                url: `/score-prediction/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PredictionApi"],
        }),
        getSingleScorePrediction: builder.query({
            query: (id) => ({
                url: `/score-prediction/single/${id}`,
                method: "GET",
            }),
            providesTags: ["PredictionApi"],
        }),
        getFullDetails: builder.query({
            query: ({ userId, predictionId }) => ({
                url: `/score-prediction/full-predictions?predictionId=${predictionId}&userId=${userId}`,
                method: "GET",
            }),
            providesTags: ["PredictionApi"],
        }),
        updateDeclareWinner: builder.mutation({
            query: ({ userId, predictionId }) => ({
                url: `/score-prediction/declare-winning?predictionId=${predictionId}&userId=${userId}`,
                method: "PATCH"
            }),
            invalidatesTags: ["PredictionApi"],
        }),
    })
});

export const { useGetAllPredictionsQuery, useCreateScorePredictionMutation, useUpdateScorePredictionMutation, useDeleteScorePredictionMutation, useGetSingleScorePredictionQuery, useGetFullDetailsQuery, useUpdateDeclareWinnerMutation } = PredictionApi;
