// src/App.js
import React, { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage"; // create these components
//import About from './About'; // create these components
import '../src/services/i18n';
const App = () => {
  return (

        <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>

  );
};

export default App;
