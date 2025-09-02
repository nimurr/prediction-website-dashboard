import { baseApi } from "../../baseApi/baseApi";

const pricePredictionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPricePredictions: builder.query({
            query: () => ({
                url: `/price-prediction/getall`,
                method: "GET",
            }),
            providesTags: ["PricePrediction"],
        }),
        createPricePrediction: builder.mutation({
            query: (data) => ({
                url: `/price-prediction/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PricePrediction"],
        }),
        updatePricePrediction: builder.mutation({
            query: ({ formData, id }) => ({
                url: `/price-prediction/edit/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["PricePrediction"],
        }),
        deletePricePrediction: builder.mutation({
            query: (id) => ({
                url: `/price-prediction/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PricePrediction"],
        }),
        getSinglePricePrediction: builder.query({
            query: (id) => ({
                url: `/price-prediction/single/${id}`,
                method: "GET",
            }),
            providesTags: ["PricePrediction"],
        }),
        getFullDetailsPricePrediction: builder.query({
            query: ({ userId, predictionId }) => ({
                url: `/price-prediction/full-predictions?userId=${userId}&predictionId=${predictionId}`,
                method: "GET",
            }),
            providesTags: ["PricePrediction"],
        }),
        declearWiner: builder.mutation({
            query: ({ predictionId, userId }) => ({
                url: `/price-prediction/declare-winning?predictionId=${predictionId}&userId=${userId}`,
                method: "PATCH"
            }),
            invalidatesTags: ["PricePrediction"],
        }),
    })
});

export const {
    useGetAllPricePredictionsQuery,
    useCreatePricePredictionMutation,
    useUpdatePricePredictionMutation,
    useDeletePricePredictionMutation,
    useGetSinglePricePredictionQuery,
    useGetFullDetailsPricePredictionQuery,
    useDeclearWinerMutation
} = pricePredictionApi;
