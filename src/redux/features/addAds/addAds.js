import { baseApi } from "../../baseApi/baseApi";

const AddAds = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addNewAds: builder.mutation({
            query: (data) => ({
                url: `/privacy-policy/add-ads`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["AddAds"],
        }),
        // getAllReview: builder.query({
        //     query: () => ({
        //         url: `/casino-AddAds/all`,
        //         method: "GET",
        //     }),
        //     providesTags: ["AddAds"],
        // }),
    })
});

export const { useAddNewAdsMutation } = AddAds;
