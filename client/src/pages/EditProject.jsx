import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Typography, TextField, Button, Box, Paper, Divider,
  FormControl, InputLabel, Select, MenuItem, Grid, FormHelperText,
  FormControlLabel, Checkbox, FormGroup, Chip, IconButton, InputAdornment,
  CircularProgress, Alert, Snackbar, Card, CardContent, CardMedia, CardActions
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Event as EventIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get project details from Redux or API
  const { loading, error, project } = useSelector((state) => ({
    loading: state.projects?.loading || false,
    error: state.projects?.error || null,
    project: state.projects?.currentProject || null,
  }));

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal: 1000,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    images: [],
    rewards: [
      { id: 1, title: 'Early Bird', description: 'Early backer reward', amount: 25, deliveryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
    ],
    tags: [],
    story: '',
    risks: '',
    faqs: [{ question: '', answer: '' }]
  });

  const [currentImage, setCurrentImage] = useState('');
  const [newReward, setNewReward] = useState({ title: '', description: '', amount: 0, deliveryDate: new Date() });
  const [newTag, setNewTag] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load project data when component mounts
  useEffect(() => {
    // In a real app, you would fetch the project data here
    // dispatch(fetchProjectById(id));
    
    // For now, we'll use mock data
    setFormData({
      title: 'Sample Project',
      description: 'This is a sample project description',
      category: 'Technology',
      goal: 10000,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      images: [
        'https://via.placeholder.com/800x450?text=Project+Image+1',
        'https://via.placeholder.com/800x450?text=Project+Image+2'
      ],
      rewards: [
        { id: 1, title: 'Early Bird', description: 'Early backer reward', amount: 25, deliveryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
        { id: 2, title: 'Standard', description: 'Standard reward', amount: 50, deliveryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      ],
      tags: ['tech', 'innovation', 'gadgets'],
      story: 'This is the full story of our project...',
      risks: 'Potential risks and challenges...',
      faqs: [
        { question: 'When will the project be delivered?', answer: 'We estimate delivery within 3 months of campaign end.' },
        { question: 'What if you don\'t reach your goal?', answer: 'We\'re committed to delivering regardless of the final amount raised.' }
      ]
    });
  }, [id, dispatch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle reward changes
  const handleRewardChange = (index, field, value) => {
    const updatedRewards = [...formData.rewards];
    updatedRewards[index] = {
      ...updatedRewards[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      rewards: updatedRewards
    }));
  };

  // Add a new reward
  const addReward = () => {
    if (newReward.title && newReward.amount > 0) {
      setFormData(prev => ({
        ...prev,
        rewards: [
          ...prev.rewards,
          {
            id: Date.now(),
            ...newReward
          }
        ]
      }));
      setNewReward({ title: '', description: '', amount: 0, deliveryDate: new Date() });
    }
  };

  // Remove a reward
  const removeReward = (index) => {
    const updatedRewards = formData.rewards.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      rewards: updatedRewards
    }));
  };

  // Add a tag
  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.toLowerCase()]
      }));
      setNewTag('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle FAQ changes
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      faqs: updatedFaqs
    }));
  };

  // Add a new FAQ
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  // Remove a FAQ
  const removeFaq = (index) => {
    if (formData.faqs.length > 1) {
      const updatedFaqs = formData.faqs.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        faqs: updatedFaqs
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  // Remove an image
  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  // Set main image
  const setMainImage = (index) => {
    if (index === 0) return; // Already the main image
    
    const updatedImages = [...formData.images];
    const [movedImage] = updatedImages.splice(index, 1);
    updatedImages.unshift(movedImage);
    
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category || formData.images.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    // In a real app, you would dispatch an action to update the project
    console.log('Updating project:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setSnackbar({
        open: true,
        message: 'Project updated successfully!',
        severity: 'success'
      });
      
      // Redirect to project page after a short delay
      setTimeout(() => {
        navigate(`/projects/${id}`);
      }, 1500);
    }, 1000);
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Edit Project
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon sx={{ mr: 1 }} /> Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  name="title"
                  label="Project Title"
                  value={formData.title}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                />
                
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="description"
                  name="description"
                  label="Short Description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  helperText="A brief description of your project (max 200 characters)"
                  inputProps={{ maxLength: 200 }}
                />
                
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Art">Art</MenuItem>
                    <MenuItem value="Design">Design</MenuItem>
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Games">Games</MenuItem>
                    <MenuItem value="Music">Music</MenuItem>
                    <MenuItem value="Publishing">Publishing</MenuItem>
                  </Select>
                </FormControl>
                
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tags
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => removeTag(tag)}
                        size="small"
                      />
                    ))}
                  </Box>
                  <Box display="flex">
                    <TextField
                      size="small"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button onClick={addTag} sx={{ ml: 1 }}>Add</Button>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Funding Goal (USD)
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Campaign End Date
                  </Typography>
                  <DatePicker
                    value={formData.endDate}
                    onChange={(date) =>
                      setFormData(prev => ({
                        ...prev,
                        endDate: date
                      }))
                    }
                    minDate={new Date()}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Project Images
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="project-images"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="project-images">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Upload Images
                    </Button>
                  </label>
                  
                  <Grid container spacing={1}>
                    {formData.images.map((img, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box position="relative" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                          <img
                            src={img}
                            alt={`Project ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              border: index === 0 ? '2px solid #1976d2' : '1px solid #ddd',
                              borderRadius: '4px',
                              opacity: index === 0 ? 1 : 0.8
                            }}
                          />
                          <Box
                            position="absolute"
                            top={4}
                            right={4}
                            display="flex"
                            flexDirection="column"
                            gap={1}
                          >
                            <IconButton
                              size="small"
                              onClick={() => removeImage(index)}
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                                padding: '4px'
                              }}
                            >
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                            {index !== 0 && (
                              <IconButton
                                size="small"
                                onClick={() => setMainImage(index)}
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                                  padding: '4px'
                                }}
                              >
                                <StarIcon fontSize="small" color="primary" />
                              </IconButton>
                            )}
                          </Box>
                          {index === 0 && (
                            <Box
                              position="absolute"
                              bottom={0}
                              left={0}
                              right={0}
                              bgcolor="rgba(25, 118, 210, 0.8)"
                              color="white"
                              textAlign="center"
                              py={0.5}
                            >
                              <Typography variant="caption">Main Image</Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Rewards */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <MoneyIcon sx={{ mr: 1 }} /> Rewards
              </Typography>
              
              {formData.rewards.map((reward, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
                  <IconButton
                    size="small"
                    onClick={() => removeReward(index)}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: 'error.main'
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Pledge Amount"
                        type="number"
                        value={reward.amount}
                        onChange={(e) => handleRewardChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <DatePicker
                        label="Estimated Delivery"
                        value={reward.deliveryDate}
                        onChange={(date) => handleRewardChange(index, 'deliveryDate', date)}
                        minDate={formData.endDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Reward Title"
                        value={reward.title}
                        onChange={(e) => handleRewardChange(index, 'title', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Reward Description"
                        value={reward.description}
                        onChange={(e) => handleRewardChange(index, 'description', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              <Box mt={3} p={2} border={1} borderRadius={1} borderColor="divider">
                <Typography variant="subtitle1" gutterBottom>
                  Add New Reward
                </Typography>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="Pledge Amount"
                      type="number"
                      value={newReward.amount}
                      onChange={(e) => setNewReward({...newReward, amount: parseFloat(e.target.value) || 0})}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DatePicker
                      label="Estimated Delivery"
                      value={newReward.deliveryDate}
                      onChange={(date) => setNewReward({...newReward, deliveryDate: date})}
                      minDate={formData.endDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Reward Title"
                      value={newReward.title}
                      onChange={(e) => setNewReward({...newReward, title: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={addReward}
                      disabled={!newReward.title || newReward.amount <= 0}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Story */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Story
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                id="story"
                name="story"
                label="Tell your story"
                value={formData.story}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                helperText="Use this space to tell backers about your project and why it matters to you."
              />
              
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Risks & Challenges
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="risks"
                  name="risks"
                  label="What are the risks and challenges involved in your project?"
                  value={formData.risks}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  helperText="Being transparent about potential challenges helps build trust with backers."
                />
              </Box>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* FAQ */}
            <Box mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Frequently Asked Questions</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addFaq}
                >
                  Add FAQ
                </Button>
              </Box>
              
              {formData.faqs.map((faq, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
                  {formData.faqs.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => removeFaq(index)}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'error.main'
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                  
                  <TextField
                    fullWidth
                    label="Question"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Answer"
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                </Paper>
              ))}
            </Box>
            
            {/* Form Actions */}
            <Box mt={6} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 2 }}
                  onClick={() => {
                    // Save as draft functionality
                    console.log('Saving as draft:', formData);
                    setSnackbar({
                      open: true,
                      message: 'Draft saved successfully!',
                      severity: 'success'
                    });
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading}
                >
                  Update Project
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default EditProject;
