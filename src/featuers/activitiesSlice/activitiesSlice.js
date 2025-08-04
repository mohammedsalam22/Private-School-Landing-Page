import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import activitiesApi from '../../api/activitiesApi';

// Async thunk for fetching activities
export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const data = await activitiesApi.fetchActivities();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    activities: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = activitiesSlice.actions;
export default activitiesSlice.reducer; 