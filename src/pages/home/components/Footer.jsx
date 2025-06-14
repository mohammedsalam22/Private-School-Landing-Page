// src/components/Footer.js

import React from 'react';
import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.getContrastText(theme.palette.primary.main), py: 6 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
            gap: 4,
            mb: 4
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              {t('schoolName')}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              {t('footerDescription')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              {t('quickLinks')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[t('aboutUs'), t('programs'), t('admissions'), t('contact'), t('news')].map((link, index) => (
                <Button
                  key={index}
                  color="inherit"
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    opacity: 0.8,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  {link}
                </Button>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              {t('followUs')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', pt: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            {t('allRightsReserved')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;