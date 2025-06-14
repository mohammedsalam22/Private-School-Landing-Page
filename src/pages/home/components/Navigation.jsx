// src/components/Navigation.js

import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Button } from "@mui/material";
import { Public as PublicIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles'; // Import useTheme

const Navigation = ({ toggleTheme, isDarkMode }) => {
  const { t, i18n } = useTranslation(); // Translation function
  const theme = useTheme(); // Get current theme

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value); // Change the language
  };

  useEffect(() => {
    document.body.dir = i18n.dir(); // Set document direction based on language
  }, [i18n.language]);

  return (
    <>
      <AppBar position="static" elevation={4}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {t('schoolName')} {/* Display school name */}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />} {/* Toggle theme icon */}
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2, color: 'white' }}>
              <PublicIcon />
              <Typography variant="body2">{t('country')}</Typography> {/* Display country name */}
            </Box>
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                outline: 'none' // Remove outline on focus
              }}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </Box>
        </Toolbar>
      </AppBar>

      <AppBar position="static" elevation={0} style={{ backgroundColor: theme.palette.background.default, color: 'white' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2, ml: 0 }}>
            <Button color="inherit" sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
              {t('home')}
            </Button>
            <Button color="inherit" sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
              {t('aboutUs')}
            </Button>
            <Button color="inherit" sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
              {t('admissions')}
            </Button>
            <Button color="inherit" sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
              {t('contact')}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navigation;