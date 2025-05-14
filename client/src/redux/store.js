import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import alertReducer from './slices/alertSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    alert: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
