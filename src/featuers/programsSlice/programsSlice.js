import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import programsApi from '../../api/programsApi';

// Async thunk for fetching programs
export const fetchPrograms = createAsyncThunk(
  'programs/fetchPrograms',
  async (_, { rejectWithValue }) => {
    try {
      const data = await programsApi.fetchPrograms();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const programsSlice = createSlice({
  name: 'programs',
  initialState: {
    programs: [],
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
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = programsSlice.actions;
export default programsSlice.reducer; 