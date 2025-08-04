import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import visitsApi from '../../api/visitsApi';

// Async thunk for fetching visit dates
export const fetchVisitDates = createAsyncThunk(
  'visits/fetchVisitDates',
  async (_, { rejectWithValue }) => {
    try {
      const data = await visitsApi.fetchVisitDates();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for scheduling a visit
export const scheduleVisit = createAsyncThunk(
  'visits/scheduleVisit',
  async (visitData, { rejectWithValue }) => {
    try {
      const data = await visitsApi.scheduleVisit(visitData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const visitsSlice = createSlice({
  name: 'visits',
  initialState: {
    visitDates: [],
    loading: false,
    submitting: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: (state) => {
      state.loading = false;
      state.submitting = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch visit dates
      .addCase(fetchVisitDates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitDates.fulfilled, (state, action) => {
        state.loading = false;
        state.visitDates = action.payload;
      })
      .addCase(fetchVisitDates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Schedule visit
      .addCase(scheduleVisit.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(scheduleVisit.fulfilled, (state) => {
        state.submitting = false;
        state.success = true;
      })
      .addCase(scheduleVisit.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetState } = visitsSlice.actions;
export default visitsSlice.reducer; 