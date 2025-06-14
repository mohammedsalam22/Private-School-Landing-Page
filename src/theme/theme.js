// theme.js
import { createTheme } from '@mui/material/styles';
import i18n from '../services/i18n';

const lightTheme = createTheme({
  direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
  palette: {
    mode: 'light', // Set to light mode
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const darkTheme = createTheme({
  direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
  palette: {
    mode: 'dark', // Set to dark mode
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Export the themes
export { lightTheme, darkTheme };