import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "../featuers/exampleSlice/example"; // Adjusted the import path

// Configure the store
const store = configureStore({
  reducer: {
    example: exampleReducer, // Use the imported reducer
  },
});

export default store;
