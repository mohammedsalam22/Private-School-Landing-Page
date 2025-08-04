import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Divider,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  fetchVisitDates, 
  scheduleVisit, 
  clearError, 
  clearSuccess, 
  resetState 
} from '../../featuers/visitsSlice/visitsSlice';

// Google Forms style stepper
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#1a73e8',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#1a73e8',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: '#1a73e8',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#34a853',
  }),
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: '📅',
    2: '👤',
    3: '✅',
  };

  return (
    <QontoStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : icons[String(props.icon)]}
    </QontoStepIconRoot>
  );
}

const VisitSchedulingPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const { visitDates, loading, submitting, error, success } = useSelector(
    (state) => state.visits
  );

  const steps = ['Select Date', 'Personal Information', 'Review & Submit'];
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    visit_date: '',
    name: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    dispatch(fetchVisitDates());
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateField = (field, value) => {
    let error = '';
    
    if (field === 'name') {
      if (value.length < 8) {
        error = t('nameValidationError');
      }
    } else if (field === 'phone') {
      if (!value.startsWith('09')) {
        error = t('phoneFormatError');
      } else if (value.length !== 10) {
        error = t('phoneLengthError');
      } else if (!/^\d{10}$/.test(value)) {
        error = t('phoneDigitsError');
      }
    }
    
    return error;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = async () => {
    // Validate all fields before submitting
    const nameError = validateField('name', formData.name);
    const phoneError = validateField('phone', formData.phone);
    
    setErrors({
      name: nameError,
      phone: phoneError,
    });
    
    if (nameError || phoneError) {
      return;
    }
    
    try {
      await dispatch(scheduleVisit(formData)).unwrap();
      // Success will be handled by the success state
    } catch (err) {
      // Error is already handled by the slice
    }
  };

  const renderDateSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 400, mb: 2, color: '#202124' }}>
          {t('selectVisitDate')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mb: 4 }}>
          {t('chooseVisitDateMessage')}
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#1a73e8' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {visitDates.map((date) => (
            <Grid item xs={12} sm={6} md={4} key={date.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: formData.visit_date === date.id ? '2px solid #1a73e8' : '1px solid #dadce0',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#1a73e8',
                    boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => handleInputChange('visit_date', date.id)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500, color: '#202124' }}>
                      {new Date(date.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                                         {formData.visit_date === date.id && (
                       <Chip 
                         label={t('selected')} 
                         size="small" 
                         sx={{ 
                           ml: 2, 
                           backgroundColor: '#1a73e8', 
                           color: 'white',
                           fontWeight: 500
                         }} 
                       />
                     )}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#5f6368', mb: 1 }}>
                    {new Date(date.date).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </Typography>
                                     <Typography variant="caption" sx={{ color: '#34a853', fontWeight: 500 }}>
                     {t('availableForBooking')}
                   </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </motion.div>
  );

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 400, mb: 2, color: '#202124' }}>
          {t('personalInformation')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mb: 4 }}>
          {t('personalInfoMessage')}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
                     <TextField
             fullWidth
             label={t('fullName')}
             value={formData.name}
             onChange={(e) => handleInputChange('name', e.target.value)}
             onBlur={(e) => handleBlur('name', e.target.value)}
             required
             error={!!errors.name}
             helperText={errors.name}
             placeholder={t('fullName') + ' (minimum 8 characters)'}
             sx={{
               '& .MuiOutlinedInput-root': {
                 borderRadius: '8px',
                 '& fieldset': {
                   borderColor: errors.name ? '#d32f2f' : '#dadce0',
                 },
                 '&:hover fieldset': {
                   borderColor: errors.name ? '#d32f2f' : '#1a73e8',
                 },
                 '&.Mui-focused fieldset': {
                   borderColor: errors.name ? '#d32f2f' : '#1a73e8',
                 },
               },
               '& .MuiInputLabel-root': {
                 color: errors.name ? '#d32f2f' : '#5f6368',
                 '&.Mui-focused': {
                   color: errors.name ? '#d32f2f' : '#1a73e8',
                 },
               },
               '& .MuiFormHelperText-root': {
                 color: '#d32f2f',
                 fontSize: '0.75rem',
               },
             }}
           />
        </Grid>
        <Grid item xs={12} sm={6}>
                     <TextField
             fullWidth
             label={t('phoneNumber')}
             value={formData.phone}
             onChange={(e) => handleInputChange('phone', e.target.value)}
             onBlur={(e) => handleBlur('phone', e.target.value)}
             required
             error={!!errors.phone}
             helperText={errors.phone}
             placeholder="09XXXXXXXX"
             inputProps={{
               maxLength: 10,
             }}
             sx={{
               '& .MuiOutlinedInput-root': {
                 borderRadius: '8px',
                 '& fieldset': {
                   borderColor: errors.phone ? '#d32f2f' : '#dadce0',
                 },
                 '&:hover fieldset': {
                   borderColor: errors.phone ? '#d32f2f' : '#1a73e8',
                 },
                 '&.Mui-focused fieldset': {
                   borderColor: errors.phone ? '#d32f2f' : '#1a73e8',
                 },
               },
               '& .MuiInputLabel-root': {
                 color: errors.phone ? '#d32f2f' : '#5f6368',
                 '&.Mui-focused': {
                   color: errors.phone ? '#d32f2f' : '#1a73e8',
                 },
               },
               '& .MuiFormHelperText-root': {
                 color: '#d32f2f',
                 fontSize: '0.75rem',
               },
             }}
           />
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderReview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 400, mb: 2, color: '#202124' }}>
          {t('reviewVisitDetails')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mb: 4 }}>
          {t('reviewVisitMessage')}
        </Typography>
      </Box>
      
      <Paper sx={{ p: 4, mb: 3, borderRadius: '12px', border: '1px solid #dadce0' }}>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 3, color: '#202124' }}>
          {t('selectedDateTime')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body1" sx={{ color: '#202124', fontWeight: 500 }}>
            {visitDates.find(d => d.id === formData.visit_date)?.date 
              ? new Date(visitDates.find(d => d.id === formData.visit_date).date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'No date selected'
            }
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#5f6368' }}>
          {visitDates.find(d => d.id === formData.visit_date)?.date 
            ? new Date(visitDates.find(d => d.id === formData.visit_date).date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })
            : ''
          }
        </Typography>
      </Paper>

      <Paper sx={{ p: 4, mb: 3, borderRadius: '12px', border: '1px solid #dadce0' }}>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 3, color: '#202124' }}>
          {t('contactInformation')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: '#5f6368', mb: 0.5 }}>Name:</Typography>
            <Typography variant="body1" sx={{ color: '#202124', fontWeight: 500 }}>
              {formData.name || 'Not provided'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: '#5f6368', mb: 0.5 }}>Phone:</Typography>
            <Typography variant="body1" sx={{ color: '#202124', fontWeight: 500 }}>
              {formData.phone || 'Not provided'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderDateSelection();
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderReview();
      default:
        return null;
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '12px', border: '1px solid #dadce0' }}>
            <Box sx={{ mb: 4 }}>
                          <Typography variant="h4" sx={{ color: '#34a853', fontWeight: 400, mb: 2 }}>
              ✅ {t('visitScheduledSuccessfully')}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, color: '#202124', fontWeight: 400 }}>
              {t('thankYouForScheduling')}
            </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="body1" sx={{ color: '#5f6368', mb: 2 }}>
                {t('visitConfirmationMessage')}
              </Typography>
              <Typography variant="body1" sx={{ color: '#5f6368', mb: 2 }}>
                {t('visitInstructions')}
              </Typography>
              <Typography variant="body1" sx={{ color: '#5f6368' }}>
                {t('rescheduleInstructions')}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{ 
                px: 4, 
                py: 1.5, 
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1557b0',
                },
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Return to Home
            </Button>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" sx={{ textAlign: 'center', mb: 4, fontWeight: 400, color: '#202124' }}>
          Schedule a School Visit
        </Typography>
        
        <Stepper 
          activeStep={activeStep} 
          sx={{ mb: 6 }} 
          connector={<QontoConnector />}
          alternativeLabel
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>
                <Typography sx={{ color: '#5f6368', fontSize: '14px' }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 6, mb: 4, borderRadius: '12px', border: '1px solid #dadce0', backgroundColor: '#fff' }}>
          {renderStepContent(activeStep)}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ 
              mr: 1,
              color: '#5f6368',
              borderColor: '#dadce0',
              '&:hover': {
                borderColor: '#1a73e8',
                color: '#1a73e8',
              },
              textTransform: 'none',
              fontWeight: 500,
            }}
            variant="outlined"
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                                 disabled={submitting || !formData.visit_date || !formData.name || !formData.phone || errors.name || errors.phone}
                sx={{ 
                  px: 4,
                  backgroundColor: '#1a73e8',
                  '&:hover': {
                    backgroundColor: '#1557b0',
                  },
                  '&:disabled': {
                    backgroundColor: '#dadce0',
                    color: '#5f6368',
                  },
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Schedule Visit'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                                 disabled={
                   (activeStep === 0 && !formData.visit_date) ||
                   (activeStep === 1 && (!formData.name || !formData.phone || errors.name || errors.phone))
                 }
                sx={{ 
                  px: 4,
                  backgroundColor: '#1a73e8',
                  '&:hover': {
                    backgroundColor: '#1557b0',
                  },
                  '&:disabled': {
                    backgroundColor: '#dadce0',
                    color: '#5f6368',
                  },
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default VisitSchedulingPage; 