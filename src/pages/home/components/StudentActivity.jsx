import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../../featuers/activitiesSlice/activitiesSlice';
import activitiesApi from '../../../api/activitiesApi';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const imageVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const StudentActivities = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  const dispatch = useDispatch();
  
  const { activities, loading, error } = useSelector((state) => state.activities);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const getCategoryColor = (category) => {
    const colors = {
      STEM: theme.palette.primary.main,
      Technology: '#2196F3',
      Community: '#4CAF50',
      Arts: '#FF9800',
      Leadership: '#9C27B0'
    };
    return colors[category] || theme.palette.primary.main;
  };

  return (
    <Box sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2, 
              color: theme.palette.text.primary 
            }}
          >
            {t('studentActivitiesHeader') /* Add a key for translation */}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            {t('discoverStudentActivities')}
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Alert severity="error" sx={{ maxWidth: 600 }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Activities List */}
        {!loading && !error && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                    alignItems: 'center',
                    gap: 4,
                    mb: 4
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Image Section */}
                  <motion.div
                    variants={imageVariants}
                    transition={{ delay: (index * 0.1) + 0.2, duration: 0.6 }}
                    style={{ flex: '0 0 45%' }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: { xs: 250, md: 320 },
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: hoveredCard === index ? 6 : 3,
                        transition: 'all 0.3s ease',
                        transform: hoveredCard === index ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <img
                        src={activitiesApi.getImageUrl(activity.image)}
                        alt={activity.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                          transform: hoveredCard === index ? 'scale(1.05)' : 'scale(1)',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                        }}
                      >
                        <Chip
                          label="Activity"
                          sx={{
                            backgroundColor: getCategoryColor("STEM"),
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                          }}
                        />
                      </Box>
                    </Box>
                  </motion.div>

                  {/* Content Section */}
                  <Box sx={{ flex: 1 }}>
                    <Card
                      elevation={hoveredCard === index ? 8 : 2}
                      sx={{
                        p: 4,
                        height: { xs: 'auto' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.background.paper,
                        transition: 'all 0.3s ease',
                        transform: hoveredCard === index ? 'translateY(-5px)' : 'translateY(0)',
                        border: hoveredCard === index ? `2px solid ${theme.palette.primary.main}` : 'none',
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        {/* Title */}
                        <Typography
                          variant="h4"
                          component="h3"
                          sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            color: theme.palette.text.primary,
                            fontSize: { xs: '1.5rem', md: '2rem' },
                          }}
                        >
                          {activity.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.7,
                            mb: 3,
                            fontSize: '1.1rem',
                          }}
                        >
                          {activity.description}
                        </Typography>

                        {/* Details (if available) */}
                        {activity.details && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              lineHeight: 1.6,
                              mb: 3,
                              fontSize: '1rem',
                              fontStyle: 'italic',
                            }}
                          >
                            {activity.details}
                          </Typography>
                        )}

                        {/* Learn More Button */}
                        <Button
                          variant="contained"
                          sx={{
                            px: 3,
                            py: 1,
                            fontWeight: 'medium',
                            textTransform: 'none',
                            borderRadius: 2,
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {t('learnMore')}
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        )}

        {/* View All Activities Button */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'medium',
              textTransform: 'none',
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {t('viewAllActivities')} {/* Add key for translation */}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentActivities;