import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
  Avatar,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from '@mui/material';
import {
  Favorite,
  Share,
  Bookmark,
  Flag,
  Comment as CommentIcon,
  Person,
  AttachMoney,
  CalendarToday,
  LocationOn,
  Category,
} from '@mui/icons-material';
import { fetchProject, makePledge } from '../redux/slices/projectSlice';
import { showSuccessAlert, showErrorAlert } from '../redux/slices/alertSlice';

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { project, loading, error } = useSelector((state) => state.project);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [openPledgeDialog, setOpenPledgeDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    dispatch(fetchProject(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      dispatch(showErrorAlert(error));
    }
  }, [error, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePledgeClick = (reward = null) => {
    setSelectedReward(reward);
    setPledgeAmount(reward ? reward.amount.toString() : '');
    setOpenPledgeDialog(true);
  };

  const handlePledgeSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/projects/${id}` } });
      return;
    }

    try {
      await dispatch(
        makePledge({
          projectId: id,
          pledgeData: {
            amount: parseFloat(pledgeAmount),
            reward: selectedReward
              ? {
                  title: selectedReward.title,
                  description: selectedReward.description,
                  amount: selectedReward.amount,
                }
              : null,
          },
        })
      ).unwrap();

      dispatch(showSuccessAlert('Thank you for your pledge!'));
      setOpenPledgeDialog(false);
    } catch (error) {
      dispatch(showErrorAlert(error.message || 'Failed to process pledge'));
    }
  };

  const fundingProgress = project
    ? Math.min(Math.round((project.amountRaised / project.fundingGoal) * 100), 100)
    : 0;

  const daysLeft = project
    ? Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="textSecondary">
          Project not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {project.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mr: 2 }}>
                By {project.creator?.name}
              </Typography>
              <Chip
                label={project.category}
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                icon={<LocationOn fontSize="small" />}
                label={project.location}
                size="small"
                variant="outlined"
              />
            </Box>

            <Box sx={{ position: 'relative', mb: 4, borderRadius: 2, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="450"
                image={project.images?.[0] || '/placeholder-project.jpg'}
                alt={project.title}
                sx={{ width: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <IconButton
                  aria-label="add to favorites"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <Favorite />
                </IconButton>
                <IconButton
                  aria-label="share"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <Share />
                </IconButton>
                <IconButton
                  aria-label="bookmark"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <Bookmark />
                </IconButton>
                <IconButton
                  aria-label="report"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <Flag />
                </IconButton>
              </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      ${project.amountRaised?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      pledged of ${project.fundingGoal?.toLocaleString()} goal
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold">
                      {project.backers?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      backers
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold">
                      {daysLeft}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      days to go
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={fundingProgress}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" align="right">
                  {fundingProgress}% funded
                </Typography>
              </Box>
            </Paper>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
            >
              <Tab label="Campaign" />
              <Tab label="Rewards" />
              <Tab label="Updates" />
              <Tab label="Comments" />
              <Tab label="Community" />
            </Tabs>

            <Box sx={{ mb: 6 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                        About this project
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {project.description}
                      </Typography>
                      
                      {project.risks && (
                        <Box mt={4}>
                          <Typography variant="h6" gutterBottom>
                            Risks and challenges
                          </Typography>
                          <Typography variant="body1">
                            {project.risks}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  {tabValue === 1 && (
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Rewards
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        Back this project to help bring it to life.
                      </Typography>

                      {/* No reward option */}
                      <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Pledge without a reward
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Back this project because you believe in it and want to help make it happen.
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => handlePledgeClick()}
                          >
                            Pledge amount
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Rewards list */}
                      {project.rewards?.map((reward, index) => (
                        <Card
                          key={index}
                          variant="outlined"
                          sx={{ mb: 3, borderColor: 'primary.main' }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              mb={2}
                            >
                              <Typography variant="h6">
                                ${reward.amount.toLocaleString()} or more
                              </Typography>
                              {reward.quantity !== null && (
                                <Chip
                                  label={`${reward.quantity} left`}
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            <Typography variant="subtitle1" gutterBottom>
                              {reward.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {reward.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <Box component="span" display="flex" alignItems="center" mb={1}>
                                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                                Estimated delivery: {new Date(reward.deliveryDate).toLocaleDateString()}
                              </Box>
                            </Typography>
                            <Button
                              variant="contained"
                              onClick={() => handlePledgeClick(reward)}
                              disabled={reward.quantity === 0}
                            >
                              {reward.quantity === 0 ? 'Out of Stock' : 'Select Reward'}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}

                  {tabValue === 2 && (
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Project Updates
                      </Typography>
                      {project.updates?.length > 0 ? (
                        <List>
                          {project.updates.map((update, index) => (
                            <Paper key={index} sx={{ mb: 2, p: 2 }}>
                              <Typography variant="h6">{update.title}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(update.date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body1" sx={{ mt: 1 }}>
                                {update.content}
                              </Typography>
                            </Paper>
                          ))}
                        </List>
                      ) : (
                        <Typography color="text.secondary">
                          No updates yet. Check back later!
                        </Typography>
                      )}
                    </Box>
                  )}

                  {tabValue === 3 && (
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Comments
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Add a comment..."
                          variant="outlined"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={!isAuthenticated}
                          >
                            {isAuthenticated ? 'Post Comment' : 'Log in to comment'}
                          </Button>
                        </Box>
                      </Box>
                      <List>
                        {/* Sample comment - replace with actual comments */}
                        <Paper sx={{ mb: 2, p: 2 }}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                              <Person />
                            </Avatar>
                            <Typography variant="subtitle2">John Doe</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              2 days ago
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            This project looks amazing! Can't wait to see it come to life.
                          </Typography>
                        </Paper>
                      </List>
                    </Box>
                  )}

                  {tabValue === 4 && (
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Community
                      </Typography>
                      <Typography variant="body1" paragraph>
                        This is a community of our backers who are helping to bring this project to life.
                      </Typography>
                      <Grid container spacing={2}>
                        {project.backers?.map((backer, index) => (
                          <Grid item key={index} xs={6} sm={4} md={3}>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                src={backer.backer?.avatar}
                                sx={{ width: 40, height: 40, mr: 1 }}
                              >
                                {backer.backer?.name?.charAt(0) || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {backer.isAnonymous ? 'Anonymous' : backer.backer?.name || 'User'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ${backer.amount} pledged
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ position: 'sticky', top: 20 }}>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Back this project
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Ready to help bring this project to life? Enter your pledge amount below.
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Pledge amount"
                        variant="outlined"
                        value={pledgeAmount}
                        onChange={(e) => setPledgeAmount(e.target.value)}
                        InputProps={{
                          startAdornment: <AttachMoney sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                        sx={{ mb: 2 }}
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => handlePledgeClick()}
                        disabled={!pledgeAmount || parseFloat(pledgeAmount) <= 0}
                      >
                        Back This Project
                      </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Project By
                      </Typography>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          src={project.creator?.avatar}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        >
                          {project.creator?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {project.creator?.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Creator
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/users/${project.creator?._id}`)}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Category
                    </Typography>
                    <Chip
                      icon={<Category fontSize="small" />}
                      label={project.category}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Location
                    </Typography>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationOn color="action" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">{project.location}</Typography>
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Funding Goal
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      ${project.fundingGoal?.toLocaleString()}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Funding Progress
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={fundingProgress}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {fundingProgress}%
                      </Typography>
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Campaign Ends
                    </Typography>
                    <Typography variant="body2">
                      {new Date(project.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Pledge Dialog */}
          <Dialog open={openPledgeDialog} onClose={() => setOpenPledgeDialog(false)}>
            <DialogTitle>
              {selectedReward ? 'Confirm Your Pledge' : 'Make a Pledge'}
            </DialogTitle>
            <DialogContent>
              {selectedReward && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${selectedReward.amount} or more
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedReward.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedReward.description}
                  </Typography>
                </Box>
              )}
              
              <DialogContentText>
                {selectedReward
                  ? 'Enter your pledge amount (minimum $' + selectedReward.amount + ')'
                  : 'Enter your pledge amount'}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="pledge-amount"
                label="Pledge amount"
                type="number"
                fullWidth
                variant="outlined"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                InputProps={{
                  startAdornment: <AttachMoney sx={{ color: 'action.active', mr: 1 }} />,
                }}
                sx={{ mt: 2 }}
                error={selectedReward && parseFloat(pledgeAmount) < selectedReward.amount}
                helperText={
                  selectedReward &&
                  parseFloat(pledgeAmount) < selectedReward.amount
                    ? `Minimum pledge is $${selectedReward.amount}`
                    : ''
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPledgeDialog(false)}>Cancel</Button>
              <Button
                onClick={handlePledgeSubmit}
                variant="contained"
                color="primary"
                disabled={
                  !pledgeAmount ||
                  parseFloat(pledgeAmount) <= 0 ||
                  (selectedReward && parseFloat(pledgeAmount) < selectedReward.amount)
                }
              >
                {loading ? <CircularProgress size={24} /> : 'Continue'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      );
    };
    
    export default ProjectDetails;
