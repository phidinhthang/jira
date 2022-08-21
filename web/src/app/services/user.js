import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, {}) => {
    const bearerToken = localStorage.getItem('bearerToken');
    if (bearerToken) {
      headers.set('authorization', `Bearer ${bearerToken}`);
    }
    return headers;
  },
});

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => '/user/list',
    }),
    getMe: build.query({
      query: () => '/user/me',
    }),
  }),
});

export const { useGetUsersQuery, useGetMeQuery } = userApi;
