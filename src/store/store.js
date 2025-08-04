import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "../featuers/exampleSlice/example"; // Adjusted the import path
import programsReducer from "../featuers/programsSlice/programsSlice"; // Import programs reducer
import activitiesReducer from "../featuers/activitiesSlice/activitiesSlice"; // Import activities reducer
import visitsReducer from "../featuers/visitsSlice/visitsSlice"; // Import visits reducer

// Configure the store
const store = configureStore({
  reducer: {
    example: exampleReducer, // Use the imported reducer
    programs: programsReducer, // Add programs reducer
    activities: activitiesReducer, // Add activities reducer
    visits: visitsReducer, // Add visits reducer
  },
});

export default store;
