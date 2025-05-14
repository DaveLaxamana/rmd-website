import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  createPledge,
} from '../../services/api';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getProjects(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProject = createAsyncThunk(
  'project/fetchProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProject(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProject = createAsyncThunk(
  'project/addProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProject = createAsyncThunk(
  'project/editProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await updateProject(id, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeProject = createAsyncThunk(
  'project/removeProject',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadImage = createAsyncThunk(
  'project/uploadImage',
  async ({ id, image }, { rejectWithValue }) => {
    try {
      const response = await uploadProjectImage(id, image);
      return { id, image: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const makePledge = createAsyncThunk(
  'project/makePledge',
  async ({ projectId, pledgeData }, { rejectWithValue }) => {
    try {
      const response = await createPledge(projectId, pledgeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    project: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetProjectState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch projects';
      })
      // Fetch Single Project
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload.data;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch project';
      })
      // Add Project
      .addCase(addProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.projects.unshift(action.payload.data);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create project';
      })
      // Update Project
      .addCase(editProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.project = action.payload.data;
        state.projects = state.projects.map((project) =>
          project._id === action.payload.data._id ? action.payload.data : project
        );
      })
      .addCase(editProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update project';
      })
      // Delete Project
      .addCase(removeProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
      })
      // Upload Image
      .addCase(uploadImage.fulfilled, (state, action) => {
        if (state.project) {
          state.project.images = [
            ...state.project.images,
            action.payload.image,
          ];
        }
      })
      // Make Pledge
      .addCase(makePledge.fulfilled, (state, action) => {
        if (state.project) {
          state.project.backers = [
            ...(state.project.backers || []),
            action.payload.data,
          ];
        }
      });
  },
});

export const { resetProjectState } = projectSlice.actions;
export default projectSlice.reducer;
