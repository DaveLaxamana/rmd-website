import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Container, Typography, Box, TextField, Button, Paper, Stepper, Step, StepLabel, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, Divider, IconButton, InputAdornment, Chip, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CloudUpload as CloudUploadIcon, DateRange as DateRangeIcon, AttachMoney as AttachMoneyIcon, Category as CategoryIcon, LocationOn as LocationOnIcon, Title as TitleIcon, Description as DescriptionIcon, Image as ImageIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createProject } from '../redux/slices/projectSlice';
import { showSuccessAlert, showErrorAlert } from '../redux/slices/alertSlice';

// Form validation schema
const validationSchema = [
  // Step 1: Basics
  Yup.object().shape({
    title: Yup.string().min(10, 'Title must be at least 10 characters').required('Title is required'),
    category: Yup.string().required('Category is required'),
    location: Yup.string().required('Location is required'),
    fundingGoal: Yup.number().min(100, 'Minimum funding goal is $100').required('Required'),
  }),
  // Step 2: Story
  Yup.object().shape({
    description: Yup.string().min(100, 'Description must be at least 100 characters').required('Required'),
    risks: Yup.string().min(50, 'Risks and challenges must be at least 50 characters').required('Required'),
  }),
  // Step 3: Rewards
  Yup.object().shape({
    rewards: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Required'),
        description: Yup.string().required('Required'),
        amount: Yup.number().min(1, 'Amount must be at least $1').required('Required'),
        deliveryDate: Yup.date().min(new Date(), 'Delivery date must be in the future').required('Required'),
        quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Required'),
      })
    ).min(1, 'At least one reward is required'),
  }),
  // Step 4: Media
  Yup.object().shape({
    images: Yup.array().min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
  }),
  // Step 5: Review & Launch
  Yup.object().shape({
    terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions').required('Required'),
  }),
];

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.project);
  const [activeStep, setActiveStep] = useState(0);
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });
  const [previewImages, setPreviewImages] = useState([]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    if (activeStep < validationSchema.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
      window.scrollTo(0, 0);
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === 'rewards') {
          formData.append(key, JSON.stringify(values[key]));
        } else if (key === 'images') {
          values.images.forEach((image) => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, values[key]);
        }
      });
      formData.append('endDate', endDate.toISOString());

      const resultAction = await dispatch(createProject(formData));
      const project = resultAction.payload;
      
      if (project) {
        dispatch(showSuccessAlert('Project created successfully!'));
        navigate(`/projects/${project._id}`);
      }
    } catch (error) {
      dispatch(showErrorAlert(error.message || 'Failed to create project'));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length + previewImages.length > 5) {
      dispatch(showErrorAlert('You can upload a maximum of 5 images'));
      return;
    }
    
    const newPreviewImages = [];
    const newImages = [];
    
    files.forEach((file) => {
      newPreviewImages.push(URL.createObjectURL(file));
      newImages.push(file);
    });
    
    setPreviewImages([...previewImages, ...newPreviewImages]);
    setFieldValue('images', [...(values?.images || []), ...newImages]);
  };

  // Handle image removal
  const handleRemoveImage = (index, setFieldValue) => {
    const newPreviewImages = [...previewImages];
    const newImages = [...values.images];
    
    URL.revokeObjectURL(newPreviewImages[index]);
    newPreviewImages.splice(index, 1);
    newImages.splice(index, 1);
    
    setPreviewImages(newPreviewImages);
    setFieldValue('images', newImages);
  };

  // Steps labels
  const steps = [
    'Project Basics',
    'Tell Your Story',
    'Add Rewards',
    'Add Media',
    'Review & Launch',
  ];

  // Available categories
  const categories = [
    'Technology', 'Art', 'Design', 'Film', 'Games', 'Music', 'Publishing', 'Food', 'Fashion', 'Theater', 'Photography'
  ];

  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      dispatch(showErrorAlert(error));
    }
  }, [error, dispatch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a Project
        </Typography>
        
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Formik
          initialValues={{
            title: '',
            category: '',
            location: '',
            fundingGoal: '',
            description: '',
            risks: '',
            rewards: [{
              title: '',
              description: '',
              amount: '',
              deliveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
              quantity: '',
            }],
            images: [],
            videoUrl: '',
            terms: false,
          }}
          validationSchema={validationSchema[activeStep]}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              {activeStep === 0 && (
                <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                  <Typography variant="h5" gutterBottom>Project Basics</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="title"
                        label="Project Title"
                        fullWidth
                        error={touched.title && Boolean(errors.title)}
                        helperText={touched.title && errors.title}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TitleIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
                        <InputLabel>Category</InputLabel>
                        <Field
                          as={Select}
                          name="category"
                          label="Category"
                          startAdornment={
                            <InputAdornment position="start">
                              <CategoryIcon color="action" />
                            </InputAdornment>
                          }
                        >
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                          ))}
                        </Field>
                        <FormHelperText>{touched.category && errors.category}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="location"
                        label="Location"
                        fullWidth
                        error={touched.location && Boolean(errors.location)}
                        helperText={touched.location && errors.location}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="fundingGoal"
                        label="Funding Goal ($)"
                        type="number"
                        fullWidth
                        error={touched.fundingGoal && Boolean(errors.fundingGoal)}
                        helperText={touched.fundingGoal && errors.fundingGoal}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoneyIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label="Campaign End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        minDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                        maxDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            helperText="Campaigns can run for up to 60 days"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {activeStep === 1 && (
                <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                  <Typography variant="h5" gutterBottom>Tell Your Story</Typography>
                  <Field
                    as={TextField}
                    name="description"
                    label="Project Description"
                    multiline
                    rows={8}
                    fullWidth
                    margin="normal"
                    error={touched.description && Boolean(errors.description)}
                    helperText={
                      touched.description
                        ? errors.description
                        : 'Tell potential backers about your project. What is it? Why is it unique?'
                    }
                  />
                  <Field
                    as={TextField}
                    name="risks"
                    label="Risks and Challenges"
                    multiline
                    rows={6}
                    fullWidth
                    margin="normal"
                    error={touched.risks && Boolean(errors.risks)}
                    helperText={
                      touched.risks
                        ? errors.risks
                        : 'What challenges might you face and how will you overcome them?'
                    }
                    sx={{ mt: 4 }}
                  />
                </Paper>
              )}

              {activeStep === 2 && (
                <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                  <Typography variant="h5" gutterBottom>Add Rewards</Typography>
                  <FieldArray
                    name="rewards"
                    render={(arrayHelpers) => (
                      <Box>
                        {values.rewards.map((reward, index) => (
                          <Paper key={index} variant="outlined" sx={{ p: 3, mb: 3, position: 'relative' }}>
                            {values.rewards.length > 1 && (
                              <IconButton
                                onClick={() => arrayHelpers.remove(index)}
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  color: 'error.main',
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                            <Typography variant="h6" gutterBottom>Reward {index + 1}</Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Field
                                  as={TextField}
                                  name={`rewards.${index}.title`}
                                  label="Reward Title"
                                  fullWidth
                                  error={
                                    touched.rewards?.[index]?.title &&
                                    Boolean(errors.rewards?.[index]?.title)
                                  }
                                  helperText={
                                    touched.rewards?.[index]?.title &&
                                    errors.rewards?.[index]?.title
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Field
                                  as={TextField}
                                  name={`rewards.${index}.amount`}
                                  label="Pledge Amount ($)"
                                  type="number"
                                  fullWidth
                                  error={
                                    touched.rewards?.[index]?.amount &&
                                    Boolean(errors.rewards?.[index]?.amount)
                                  }
                                  helperText={
                                    touched.rewards?.[index]?.amount &&
                                    errors.rewards?.[index]?.amount
                                  }
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AttachMoneyIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Field
                                  as={TextField}
                                  name={`rewards.${index}.description`}
                                  label="Reward Description"
                                  multiline
                                  rows={3}
                                  fullWidth
                                  error={
                                    touched.rewards?.[index]?.description &&
                                    Boolean(errors.rewards?.[index]?.description)
                                  }
                                  helperText={
                                    touched.rewards?.[index]?.description &&
                                    errors.rewards?.[index]?.description
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <DatePicker
                                  label="Estimated Delivery"
                                  value={reward.deliveryDate}
                                  onChange={(date) =>
                                    setFieldValue(`rewards.${index}.deliveryDate`, date)
                                  }
                                  minDate={new Date()}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      error={
                                        touched.rewards?.[index]?.deliveryDate &&
                                        Boolean(errors.rewards?.[index]?.deliveryDate)
                                      }
                                      helperText={
                                        touched.rewards?.[index]?.deliveryDate &&
                                        errors.rewards?.[index]?.deliveryDate
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Field
                                  as={TextField}
                                  name={`rewards.${index}.quantity`}
                                  label="Quantity Available"
                                  type="number"
                                  fullWidth
                                  error={
                                    touched.rewards?.[index]?.quantity &&
                                    Boolean(errors.rewards?.[index]?.quantity)
                                  }
                                  helperText={
                                    touched.rewards?.[index]?.quantity &&
                                    errors.rewards?.[index]?.quantity
                                  }
                                />
                              </Grid>
                            </Grid>
                          </Paper>
                        ))}
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() =>
                            arrayHelpers.push({
                              title: '',
                              description: '',
                              amount: '',
                              deliveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                              quantity: '',
                            })
                          }
                          sx={{ mt: 1 }}
                        >
                          Add Another Reward
                        </Button>
                        {typeof errors.rewards === 'string' && (
                          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {errors.rewards}
                          </Typography>
                        )}
                      </Box>
                    )}
                  />
                </Paper>
              )}

              {activeStep === 3 && (
                <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                  <Typography variant="h5" gutterBottom>Add Media</Typography>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Project Images (1-5)</Typography>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="project-images-upload"
                      multiple
                      type="file"
                      onChange={(e) => handleImageUpload(e, setFieldValue)}
                    />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                      {previewImages.map((preview, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                            width: 150,
                            height: 150,
                            borderRadius: 1,
                            overflow: 'hidden',
                            '&:hover .delete-overlay': { opacity: 1 },
                          }}
                        >
                          <Box
                            component="img"
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <Box
                            className="delete-overlay"
                            onClick={() => handleRemoveImage(index, setFieldValue)}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              cursor: 'pointer',
                            }}
                          >
                            <DeleteIcon sx={{ color: 'white' }} />
                          </Box>
                          {index === 0 && (
                            <Chip
                              label="Cover"
                              size="small"
                              color="primary"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                              }}
                            />
                          )}
                        </Box>
                      ))}
                      {previewImages.length < 5 && (
                        <label htmlFor="project-images-upload">
                          <Box
                            sx={{
                              width: 150,
                              height: 150,
                              border: '2px dashed',
                              borderColor: 'divider',
                              borderRadius: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              cursor: 'pointer',
                              '&:hover': {
                                borderColor: 'primary.main',
                                backgroundColor: 'action.hover',
                              },
                            }}
                          >
                            <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="caption" color="text.secondary" align="center">
                              Upload Image
                            </Typography>
                          </Box>
                        </label>
                      )}
                    </Box>
                    {touched.images && errors.images && (
                      <Typography color="error" variant="body2">
                        {errors.images}
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 4 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom>Project Video (Optional)</Typography>
                    <Field
                      as={TextField}
                      name="videoUrl"
                      label="Video URL"
                      placeholder="https://www.youtube.com/watch?v=..."
                      fullWidth
                      helperText="Add a YouTube or Vimeo URL"
                    />
                  </Box>
                </Paper>
              )}

              {activeStep === 4 && (
                <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                  <Typography variant="h5" gutterBottom>Review & Launch</Typography>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Project Overview</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Project Title</Typography>
                        <Typography variant="body1" paragraph>{values.title}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                        <Typography variant="body1" paragraph>{values.category}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                        <Typography variant="body1" paragraph>{values.location}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Funding Goal</Typography>
                        <Typography variant="body1" paragraph>${values.fundingGoal?.toLocaleString()}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">Campaign End Date</Typography>
                        <Typography variant="body1" paragraph>{endDate.toLocaleDateString()}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Box>
                    <Typography variant="h6" gutterBottom>Terms and Conditions</Typography>
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2" paragraph>
                        <strong>All-or-nothing funding.</strong> Projects must reach their funding goal before the deadline.
                      </Typography>
                      <Typography variant="body2">
                        <strong>Fees.</strong> 5% platform fee plus payment processing fees (3-5%).
                      </Typography>
                    </Box>
                    <Field
                      name="terms"
                      type="checkbox"
                      as={FormControlLabel}
                      control={
                        <Checkbox
                          checked={values.terms}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          I understand my obligations and agree to the terms
                        </Typography>
                      }
                    />
                    {touched.terms && errors.terms && (
                      <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {errors.terms}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  disabled={activeStep === 0 || isSubmitting || loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  endIcon={
                    (isSubmitting || loading) ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : null
                  }
                >
                  {activeStep === validationSchema.length - 1
                    ? 'Launch Project'
                    : 'Continue'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </LocalizationProvider>
  );
};

export default CreateProject;
