// src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { lightTheme, darkTheme } from '../../theme/theme';
import Navigation from '../home/components/Navigation';
import HeroSection from '../home/components/HeroSection';
import ProgramsSection from '../home/components/ProgramsSection';
import StudentActivities from '../home/components/StudentActivity';
import Footer from '../home/components/Footer';

const HomePage = () => {
  const [themeMode, setThemeMode] = useState("light");
  const isDarkMode = themeMode === "dark";

  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== 'en' && i18n.language !== 'ar') {
      i18n.changeLanguage('en');
    }
  }, []);

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n.language]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Navigation toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <HeroSection />
      <ProgramsSection />
      <StudentActivities />
      <Footer />
    </ThemeProvider>
  );
};

export default HomePage;