import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

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

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery,
  endpoints: (build) => ({
    getProject: build.query({
      query: (id) => `project/${id}`,
    }),
    getProjects: build.query({
      query: () => 'project/list',
    }),
    updateProject: build.mutation({
      query: (data) => {
        const { id, ...body } = data;
        return {
          url: `project/update/${id}`,
          method: 'PATCH',
          body,
        };
      },
    }),
    deleteProject: build.mutation({
      query: (data) => {
        const { id, ...body } = data;
        return {
          url: `project/delete/${id}`,
          method: 'DELETE',
          body,
        };
      },
    }),
    createProject: build.mutation({
      query: (data) => {
        return {
          url: `project/create`,
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectQuery,
  useGetProjectsQuery,
} = projectApi;
