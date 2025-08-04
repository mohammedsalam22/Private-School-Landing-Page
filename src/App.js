// src/App.js
import React, { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import HomePage from "./pages/home/HomePage";
import PlacementTestPage from "./pages/placement-test/PlacementTestPage";
import VisitSchedulingPage from "./pages/visit-scheduling/VisitSchedulingPage";
import '../src/services/i18n';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/placement-test" element={<PlacementTestPage />} />
          <Route path="/schedule-visit" element={<VisitSchedulingPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
