import React, { useState, useEffect } from 'react';
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
  Step,
  StepLabel,
  Stepper,
  StepConnector,
  stepConnectorClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import placementApi from '../../api/placementApi';

// Google Forms style stepper
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
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
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: '📅',
    2: '👤',
    3: '👨',
    4: '👩',
    5: '✅',
  };

  return (
    <QontoStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : icons[String(props.icon)]}
    </QontoStepIconRoot>
  );
}

const PlacementTestPage = () => {
  const { t } = useTranslation();
  const steps = [t('selectDate'), t('studentInformation'), t('parent1Information'), t('parent2Information'), t('reviewSubmit')];
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [placementDates, setPlacementDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    placement_date: '',
    student_religion: '',
    student_card: {
      first_name: '',
      last_name: '',
      phone: '',
      nationality: '',
      gender: '',
      birth_date: '',
      birth_city: '',
      address: '',
      place_of_register: '',
      national_no: '',
    },
    parent1_job: '',
    parent1_card: {
      first_name: '',
      last_name: '',
      phone: '',
      nationality: '',
      gender: '',
      birth_date: '',
      birth_city: '',
      address: '',
      place_of_register: '',
      national_no: '',
    },
    parent2_job: '',
    parent2_card: {
      first_name: '',
      last_name: '',
      phone: '',
      nationality: '',
      gender: '',
      birth_date: '',
      birth_city: '',
      address: '',
      place_of_register: '',
      national_no: '',
    },
  });

  useEffect(() => {
    fetchPlacementDates();
  }, []);

  const fetchPlacementDates = async () => {
    try {
      setLoading(true);
      const dates = await placementApi.fetchPlacementDates();
      setPlacementDates(dates);
    } catch (err) {
      setError('Failed to load placement dates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await placementApi.submitPlacementTest(formData);
      setSubmitSuccess(true);
    } catch (err) {
      setError('Failed to submit placement test. Please try again.');
    } finally {
      setSubmitting(false);
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
          {t('selectPlacementDate')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mb: 4 }}>
          {t('chooseDateMessage')}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {placementDates.map((date) => (
          <Grid item xs={12} sm={6} md={4} key={date.id}>
            <Card
              sx={{
                cursor: 'pointer',
                border: formData.placement_date === date.id ? '2px solid #1a73e8' : '1px solid #dadce0',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#1a73e8',
                  boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
                },
              }}
              onClick={() => setFormData(prev => ({ ...prev, placement_date: date.id }))}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: '#202124' }}>
                  {new Date(date.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#5f6368', mb: 1 }}>
                  {new Date(date.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Typography variant="caption" sx={{ color: '#1a73e8', fontWeight: 500 }}>
                  {t('availableSlots')}: {date.available_slots || 'Unlimited'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  const renderStudentInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 400, mb: 2, color: '#202124' }}>
          {t('studentInfoTitle')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mb: 4 }}>
          {t('studentInfoMessage')}
        </Typography>
      </Box>
      
             <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
         {[
           { label: "First Name", field: "first_name" },
           { label: "Last Name", field: "last_name" },
           { label: "Phone Number", field: "phone" },
           { label: "Nationality", field: "nationality" },
           { label: "Birth City", field: "birth_city" },
           { label: "Address", field: "address" },
           { label: "Place of Register", field: "place_of_register" },
           { label: "National Number", field: "national_no" },
         ].map((item) => (
           <Grid item xs={12} sm={6} md={4} key={item.field}>
             <TextField
               fullWidth
               label={item.label}
               value={formData.student_card[item.field]}
               onChange={(e) => handleInputChange('student_card', item.field, e.target.value)}
               required
               sx={{
                 '& .MuiOutlinedInput-root': {
                   borderRadius: '8px',
                   '& fieldset': {
                     borderColor: '#dadce0',
                   },
                   '&:hover fieldset': {
                     borderColor: '#1a73e8',
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: '#1a73e8',
                   },
                 },
                 '& .MuiInputLabel-root': {
                   color: '#5f6368',
                   '&.Mui-focused': {
                     color: '#1a73e8',
                   },
                 },
               }}
             />
           </Grid>
         ))}
         
         <Grid item xs={12} sm={6} md={4}>
           <FormControl fullWidth required sx={{
             '& .MuiOutlinedInput-root': {
               borderRadius: '8px',
               '& fieldset': {
                 borderColor: '#dadce0',
               },
               '&:hover fieldset': {
                 borderColor: '#1a73e8',
               },
               '&.Mui-focused fieldset': {
                 borderColor: '#1a73e8',
               },
             },
             '& .MuiInputLabel-root': {
               color: '#5f6368',
               '&.Mui-focused': {
                 color: '#1a73e8',
               },
             },
           }}>
             <InputLabel>Gender</InputLabel>
             <Select
               value={formData.student_card.gender}
               label="Gender"
               onChange={(e) => handleInputChange('student_card', 'gender', e.target.value)}
             >
               <MenuItem value="male">Male</MenuItem>
               <MenuItem value="female">Female</MenuItem>
             </Select>
           </FormControl>
         </Grid>
         
         <Grid item xs={12} sm={6} md={4}>
           <TextField
             fullWidth
             label="Birth Date"
             type="date"
             value={formData.student_card.birth_date}
             onChange={(e) => handleInputChange('student_card', 'birth_date', e.target.value)}
             InputLabelProps={{ shrink: true }}
             required
             sx={{
               '& .MuiOutlinedInput-root': {
                 borderRadius: '8px',
                 '& fieldset': {
                   borderColor: '#dadce0',
                 },
                 '&:hover fieldset': {
                   borderColor: '#1a73e8',
                 },
                 '&.Mui-focused fieldset': {
                   borderColor: '#1a73e8',
                 },
               },
               '& .MuiInputLabel-root': {
                 color: '#5f6368',
                 '&.Mui-focused': {
                   color: '#1a73e8',
                 },
               },
             }}
           />
         </Grid>
         
         <Grid item xs={12} sm={6} md={4}>
           <FormControl fullWidth required sx={{
             '& .MuiOutlinedInput-root': {
               borderRadius: '8px',
               '& fieldset': {
                 borderColor: '#dadce0',
               },
               '&:hover fieldset': {
                 borderColor: '#1a73e8',
               },
               '&.Mui-focused fieldset': {
                 borderColor: '#1a73e8',
               },
             },
             '& .MuiInputLabel-root': {
               color: '#5f6368',
               '&.Mui-focused': {
                 color: '#1a73e8',
               },
             },
           }}>
             <InputLabel>Religion</InputLabel>
             <Select
               value={formData.student_religion}
               label="Religion"
               onChange={(e) => setFormData(prev => ({ ...prev, student_religion: e.target.value }))}
             >
               <MenuItem value="christianity">Christianity</MenuItem>
               <MenuItem value="islam">Islam</MenuItem>
               <MenuItem value="judaism">Judaism</MenuItem>
               <MenuItem value="other">Other</MenuItem>
             </Select>
           </FormControl>
         </Grid>
       </Grid>
    </motion.div>
  );

  const renderParentInfo = (parentNum) => {
    const parentKey = `parent${parentNum}`;
    const parentData = formData[`${parentKey}_card`];
    const parentJob = formData[`${parentKey}_job`];
    const parentTitle = parentNum === 1 ? 'Father' : 'Mother';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 400, mb: 2, color: '#202124' }}>
            {parentTitle} Information
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', mb: 4 }}>
            {t('parentInfoMessage')}
          </Typography>
        </Box>
        
                 <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
           {[
             { label: "Job/Profession", field: "job", isJob: true },
             { label: "First Name", field: "first_name" },
             { label: "Last Name", field: "last_name" },
             { label: "Phone Number", field: "phone" },
             { label: "Nationality", field: "nationality" },
             { label: "Birth City", field: "birth_city" },
             { label: "Address", field: "address", required: false },
             { label: "Place of Register", field: "place_of_register" },
             { label: "National Number", field: "national_no" },
           ].map((item) => (
             <Grid item xs={12} sm={6} md={4} key={item.field}>
               <TextField
                 fullWidth
                 label={item.label}
                 value={item.isJob ? parentJob : parentData[item.field]}
                 onChange={(e) => {
                   if (item.isJob) {
                     setFormData(prev => ({ ...prev, [`${parentKey}_job`]: e.target.value }));
                   } else {
                     handleInputChange(`${parentKey}_card`, item.field, e.target.value);
                   }
                 }}
                 required={item.required !== false}
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     borderRadius: '8px',
                     '& fieldset': {
                       borderColor: '#dadce0',
                     },
                     '&:hover fieldset': {
                       borderColor: '#1a73e8',
                     },
                     '&.Mui-focused fieldset': {
                       borderColor: '#1a73e8',
                     },
                   },
                   '& .MuiInputLabel-root': {
                     color: '#5f6368',
                     '&.Mui-focused': {
                       color: '#1a73e8',
                     },
                   },
                 }}
               />
             </Grid>
           ))}
           
           <Grid item xs={12} sm={6} md={4}>
             <FormControl fullWidth required sx={{
               '& .MuiOutlinedInput-root': {
                 borderRadius: '8px',
                 '& fieldset': {
                   borderColor: '#dadce0',
                 },
                 '&:hover fieldset': {
                   borderColor: '#1a73e8',
                 },
                 '&.Mui-focused fieldset': {
                   borderColor: '#1a73e8',
                 },
               },
               '& .MuiInputLabel-root': {
                 color: '#5f6368',
                 '&.Mui-focused': {
                   color: '#1a73e8',
                 },
               },
             }}>
               <InputLabel>Gender</InputLabel>
               <Select
                 value={parentData.gender}
                 label="Gender"
                 onChange={(e) => handleInputChange(`${parentKey}_card`, 'gender', e.target.value)}
               >
                 <MenuItem value="male">Male</MenuItem>
                 <MenuItem value="female">Female</MenuItem>
               </Select>
             </FormControl>
           </Grid>
           
           <Grid item xs={12} sm={6} md={4}>
             <TextField
               fullWidth
               label="Birth Date"
               type="date"
               value={parentData.birth_date}
               onChange={(e) => handleInputChange(`${parentKey}_card`, 'birth_date', e.target.value)}
               InputLabelProps={{ shrink: true }}
               required
               sx={{
                 '& .MuiOutlinedInput-root': {
                   borderRadius: '8px',
                   '& fieldset': {
                     borderColor: '#dadce0',
                   },
                   '&:hover fieldset': {
                     borderColor: '#1a73e8',
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: '#1a73e8',
                   },
                 },
                 '& .MuiInputLabel-root': {
                   color: '#5f6368',
                   '&.Mui-focused': {
                     color: '#1a73e8',
                   },
                 },
               }}
             />
           </Grid>
         </Grid>
      </motion.div>
    );
  };

  const renderReview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 400, mb: 2, color: '#202124' }}>
          {t('reviewTitle')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mb: 4 }}>
          {t('reviewMessage')}
        </Typography>
      </Box>
      
             <Paper sx={{ p: 4, mb: 3, borderRadius: '8px', border: '1px solid #dadce0' }}>
         <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#202124' }}>
           {t('selectedDate')}
         </Typography>
         <Typography variant="body1" sx={{ color: '#5f6368' }}>
           {placementDates.find(d => d.id === formData.placement_date)?.date 
             ? new Date(placementDates.find(d => d.id === formData.placement_date).date).toLocaleDateString()
             : t('noDateSelected')
           }
         </Typography>
       </Paper>

       <Paper sx={{ p: 4, mb: 3, borderRadius: '8px', border: '1px solid #dadce0' }}>
         <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#202124' }}>
           Student Information
         </Typography>
         <Grid container spacing={2}>
           <Grid item xs={12} sm={6}>
             <Typography variant="body2" sx={{ color: '#5f6368', mb: 0.5 }}>Name:</Typography>
             <Typography variant="body1" sx={{ color: '#202124' }}>{formData.student_card.first_name} {formData.student_card.last_name}</Typography>
           </Grid>
           <Grid item xs={12} sm={6}>
             <Typography variant="body2" sx={{ color: '#5f6368', mb: 0.5 }}>Religion:</Typography>
             <Typography variant="body1" sx={{ color: '#202124' }}>{formData.student_religion}</Typography>
           </Grid>
         </Grid>
       </Paper>

       <Paper sx={{ p: 4, mb: 3, borderRadius: '8px', border: '1px solid #dadce0' }}>
         <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#202124' }}>
           {t('parentInformation')}
         </Typography>
         <Grid container spacing={2}>
           <Grid item xs={12} sm={6}>
             <Typography variant="body2" sx={{ color: '#5f6368', mb: 0.5 }}>Father:</Typography>
             <Typography variant="body1" sx={{ color: '#202124' }}>{formData.parent1_card.first_name} {formData.parent1_card.last_name}</Typography>
           </Grid>
           <Grid item xs={12} sm={6}>
             <Typography variant="body2" sx={{ color: '#5f6368', mb: 0.5 }}>Mother:</Typography>
             <Typography variant="body1" sx={{ color: '#202124' }}>{formData.parent2_card.first_name} {formData.parent2_card.last_name}</Typography>
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
        return renderStudentInfo();
      case 2:
        return renderParentInfo(1);
      case 3:
        return renderParentInfo(2);
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '8px', border: '1px solid #dadce0' }}>
            <Typography variant="h4" sx={{ color: '#34a853', fontWeight: 400, mb: 2 }}>
              ✅ {t('applicationSubmitted')}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, color: '#202124', fontWeight: 400 }}>
              {t('thankYouMessage')}
            </Typography>
            <Typography variant="body1" sx={{ color: '#5f6368', mb: 4 }}>
              {t('contactMessage')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.location.href = '/'}
              sx={{ 
                px: 4, 
                py: 1.5, 
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1557b0',
                },
                borderRadius: '4px',
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              {t('returnToHome')}
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
          {t('placementTestTitle')}
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#1a73e8' }} />
          </Box>
        ) : (
          <Paper sx={{ p: 6, mb: 4, borderRadius: '8px', border: '1px solid #dadce0', backgroundColor: '#fff' }}>
            {renderStepContent(activeStep)}
          </Paper>
        )}

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
            {t('back')}
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                sx={{ 
                  px: 4,
                  backgroundColor: '#1a73e8',
                  '&:hover': {
                    backgroundColor: '#1557b0',
                  },
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : t('submitApplication')}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ 
                  px: 4,
                  backgroundColor: '#1a73e8',
                  '&:hover': {
                    backgroundColor: '#1557b0',
                  },
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                {t('next')}
              </Button>
            )}
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default PlacementTestPage; 