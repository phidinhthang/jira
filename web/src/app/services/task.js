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
      query: (projectId) => `task/${projectId}/list`,
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
      async onQueryStarted(
        { id, projectId, ...body },
        { dispatch, queryFulfilled }
      ) {
        try {
          dispatch(
            taskApi.util.updateQueryData('getTasks', projectId, (draft) => {
              const oldTask = draft.find((t) => t.id === id);
              Object.assign(oldTask, body);
            })
          );
          const { data: updatedTask } = await queryFulfilled;
          dispatch(
            taskApi.util.updateQueryData('getTasks', projectId, (draft) => {
              const oldTask = draft.find((t) => t.id === id);
              Object.assign(oldTask, updatedTask);
            })
          );
          dispatch(
            taskApi.util.updateQueryData('getTask', id, (draft) => {
              Object.assign(draft, updatedTask);
            })
          );
        } catch (err) {
          console.log('error when update task ', err);
        }
      },
    }),
    deleteTask: build.mutation({
      query: (id) => {
        return {
          url: `task/delete/${id}`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: deletedTask } = await queryFulfilled;
          console.log('deleted task ', deletedTask);
          dispatch(
            taskApi.util.updateQueryData(
              'getTasks',
              deletedTask.project,
              (draft) => {
                draft.splice(
                  draft.findIndex((task) => task.id === deletedTask.id),
                  1
                );
              }
            )
          );
        } catch (err) {
          console.log('error when delete task ', err);
        }
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newTask } = await queryFulfilled;
          console.log('new task ', newTask);
          dispatch(
            taskApi.util.updateQueryData(
              'getTasks',
              newTask.project,
              (draft) => {
                draft.push(newTask);
              }
            )
          );
        } catch (err) {
          console.log('error when create new task ', err);
        }
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
