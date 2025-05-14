import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { register, login, getMe, updateDetails, updatePassword } from '../../services/api';

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const response = await getMe();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateUserDetails = createAsyncThunk(
  'auth/updateDetails',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await updateDetails(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwords, { rejectWithValue }) => {
    try {
      const response = await updatePassword(passwords);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
