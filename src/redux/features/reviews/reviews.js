import { baseApi } from "../../baseApi/baseApi";

const Reviews = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createNewSectionReview: builder.mutation({
            query: (data) => ({
                url: `/casino-reviews/sub/add-new-section`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Reviews"],
        }),
        createReviewAll: builder.mutation({
            query: (data) => ({
                url: `/casino-reviews/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Reviews"],
        }),
        handleChangeImage: builder.mutation({
            query: (data) => ({
                url: `/casino-reviews/image/upload`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Reviews"],
        }),
        getAllReview: builder.query({
            query: () => ({
                url: `/casino-reviews/all`,
                method: "GET",
            }),
            providesTags: ["Reviews"],
        }),
        deleteReview: builder.mutation({
            query: ({ id }) => ({
                url: `/casino-reviews/all/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Reviews"],
        }),
    })
});

export const { useCreateNewSectionReviewMutation, useCreateReviewAllMutation, useHandleChangeImageMutation, useGetAllReviewQuery, useDeleteReviewMutation } = Reviews;
