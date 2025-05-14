import { createSlice } from '@reduxjs/toolkit';

const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    open: false,
    message: '',
    severity: 'info', // 'error', 'warning', 'info', 'success'
  },
  reducers: {
    showAlert: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || 'info';
    },
    hideAlert: (state) => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;

export const showSuccessAlert = (message) =>
  showAlert({ message, severity: 'success' });

export const showErrorAlert = (message) =>
  showAlert({ message, severity: 'error' });

export const showWarningAlert = (message) =>
  showAlert({ message, severity: 'warning' });

export const showInfoAlert = (message) =>
  showAlert({ message, severity: 'info' });

export default alertSlice.reducer;
