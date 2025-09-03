import { baseApi } from "../../baseApi/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: `/users/all-users`,
        method: "GET",
      }),
      providesTags: ["User-2"],
    }),
    getProfile: builder.query({
      query: () => ({
        url: `/users/self/in`,
        method: "GET",
      })
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/users/self/update`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["User-2"],
    }),
    getAllCollectors: builder.query({
      query: ({ from, to }) => ({
        url: `/get-collaborator-data?from=${from}&to=${to}`,
        method: "GET",
      }),
      providesTags: ["User-2"],
    }),
    getSingleUser: builder.query({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["User-2"],
    }),
    blockUser: builder.mutation({
      query: (id) => ({
        url: `/users/block/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User-2"],
    }),
    UnBlockUser: builder.mutation({
      query: (id) => ({
        url: `/unban-user-2/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["User-2"],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetProfileQuery, useGetAllCollectorsQuery, useGetSingleUserQuery, useBlockUserMutation, useUnBlockUserMutation, useUpdateProfileMutation } = userApi;
