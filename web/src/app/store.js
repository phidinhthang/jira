import { configureStore } from '@reduxjs/toolkit';
import { taskApi } from './services/task';
import { projectApi } from './services/project';
import { userApi } from './services/user';

export const createStore = (options) =>
  configureStore({
    reducer: {
      [taskApi.reducerPath]: taskApi.reducer,
      [projectApi.reducerPath]: projectApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        taskApi.middleware,
        projectApi.middleware,
        userApi.middleware
      ),
  });

export const store = createStore();
