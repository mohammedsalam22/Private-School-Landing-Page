import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import { CssBaseline } from "@mui/material";

// Create a root DOM node
const root = ReactDOM.createRoot(document.getElementById("root")); // change this line

// Render the application
root.render(
  <Provider store={store}>
    <CssBaseline />
    <App />
  </Provider>
);
