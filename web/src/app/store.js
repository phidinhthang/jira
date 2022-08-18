import { configureStore } from '@reduxjs/toolkit';
import { taskApi } from './services/task';
import { projectApi } from './services/project';
import { userApi } from './services/user';
import { authApi } from './services/auth';
import { rtkNotAuthMiddleware } from './rtkNotAuthMiddleware';

export const createStore = (options) =>
  configureStore({
    reducer: {
      [taskApi.reducerPath]: taskApi.reducer,
      [projectApi.reducerPath]: projectApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        taskApi.middleware,
        projectApi.middleware,
        userApi.middleware,
        rtkNotAuthMiddleware
      ),
  });

export const store = createStore();
