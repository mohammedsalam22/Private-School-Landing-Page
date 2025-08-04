import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button } from "@mui/material";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Animated text component
const AnimatedText = ({ text }) => (
  <span>
    {text.split("  ").map((letter, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, duration: 0.4 }}
        style={{ display: 'inline-block' }}
      >
        {letter === " " ? "\u00A0" : letter}
      </motion.span>
    ))}
  </span>
);

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const texts = [
    t('welcomeText'),
    t('inspiringLeaders'),
    t('nurturingInnovators'),
    t('excellenceEducation'),
    t('brightFutures')
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [texts, t]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: "url(https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?cs=srgb&dl=pexels-ivan-samal-3184295.jpg&fm=jpg)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={texts[currentTextIndex]}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.6 }}
              style={{ position: 'absolute', width: '100%' }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
                  mb: 2
                }}
              >
                <AnimatedText text={texts[currentTextIndex]} />
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 'light',
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }
          }}
        >
          {t('shapingMinds')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            onClick={() => navigate('/placement-test')}
          >
            {t('bookTest')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
            onClick={() => navigate('/schedule-visit')}
          >
            {t('scheduleVisit')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;