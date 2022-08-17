import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { projectApi } from './project';

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

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery,
  endpoints: (build) => ({
    getTask: build.query({
      query: (id) => `task/${id}`,
    }),
    getTasks: build.query({
      query: () => 'task/list',
    }),
    updateTask: build.mutation({
      query: (data) => {
        const { id, ...body } = data;
        return {
          url: `task/update/${id}`,
          method: 'PATCH',
          body,
        };
      },
      async onQueryStarted({ id, ...body }, { dispatch, queryFulfilled }) {
        console.log('id ', id, 'body ', body);
        dispatch(
          projectApi.util.updateQueryData(
            'getProject',
            '62fa1536b97b9653e44b8ef7',
            (draft) => {
              const task = draft.tasks.find((t) => t.id === id);
              console.log('task ', task);
              Object.assign(task, body);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {}
      },
    }),
    deleteTask: build.mutation({
      query: (data) => {
        const { id, ...body } = data;
        return {
          url: `task/delete/${id}`,
          method: 'DELETE',
          body,
        };
      },
    }),
    createTask: build.mutation({
      query: (data) => {
        return {
          url: `task/create`,
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskQuery,
  useGetTasksQuery,
} = taskApi;
