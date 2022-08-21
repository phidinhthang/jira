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
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const { data: updatedProject } = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData('getProject', id, (draft) => {
            Object.assign(draft, updatedProject);
          })
        );
        dispatch(
          projectApi.util.updateQueryData('getProjects', {}, (draft) => {
            const oldProject = draft.find((project) => project.id === id);
            Object.assign(oldProject, updatedProject);
          })
        );
      },
    }),
    deleteProject: build.mutation({
      query: (projectId) => {
        return {
          url: `project/delete/${projectId}`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data: deletedProject } = await queryFulfilled;
          dispatch(
            projectApi.util.updateQueryData(
              'getProjects',
              undefined,
              (draft) => {
                draft.splice(
                  draft.findIndex(
                    (project) => project.id === deletedProject.id
                  ),
                  1
                );
              }
            )
          );
        } catch (err) {
          console.log('error when delete project ', err);
        }
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
      async onQueryStarted(data, { queryFulfilled, dispatch }) {
        try {
          const { data: newProject } = await queryFulfilled;
          dispatch(
            projectApi.util.updateQueryData(
              'getProjects',
              undefined,
              (draft) => {
                draft.push(newProject);
              }
            )
          );
        } catch (err) {
          console.log('error when create new project ', err);
        }
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
