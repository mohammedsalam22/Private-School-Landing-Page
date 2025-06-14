// src/components/ProgramsSection.js

import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { mockProgramsData } from '../../../mocks/mockPrograms'; // Import the mock data

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const ProgramsSection = () => {
  const { t } = useTranslation();
  const [expandedCard, setExpandedCard] = useState(null);
  const theme = useTheme();

  const programsData = mockProgramsData;

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <Box sx={{ py: 10, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            {t('ourPrograms')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {t('discoverPrograms')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
              gap: 3,
              maxWidth: 1200,
              flex: 1
            }}
          >
            {programsData.map((program, index) => (
              <motion.div
                key={program.titleKey}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 6,
                    },
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={program.image}
                    alt={t(program.titleKey)}
                    sx={{
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {t(program.titleKey)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {expandedCard === index ? t(program.descriptionKey) : `${t(program.descriptionKey).substring(0, 80)}...`}
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ mt: 2, p: 0, textTransform: 'none', color: theme.palette.primary.main }}
                    >
                      {expandedCard === index ? t('showLess') : t('learnMore')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProgramsSection;