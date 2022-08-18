import { isRejectedWithValue } from '@reduxjs/toolkit';
import { history } from './history';

/**
 * Log a warning and show a toast!
 */
export const rtkNotAuthMiddleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action.payload.status === 401) {
      history.replace('/login');
    }
  }

  return next(action);
};
