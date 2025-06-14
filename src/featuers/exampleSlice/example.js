import { createSlice } from "@reduxjs/toolkit";

// Define the exampleSlice
const exampleSlice = createSlice({
  name: "example",
  initialState: {
    message: "Hello from Redux!",
  },
  reducers: {
    updateMessage(state, action) {
      state.message = action.payload;
    },
  },
});

// Export the actions
export const { updateMessage } = exampleSlice.actions;

// Export the reducer to be used in the store
export default exampleSlice.reducer;
