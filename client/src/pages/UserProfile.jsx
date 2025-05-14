import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fetchUserProfile, updateUserProfile } from '../redux/slices/authSlice';
import { fetchUserProjects } from '../redux/slices/projectSlice';
import { showSuccessAlert, showErrorAlert } from '../redux/slices/alertSlice';

const UserProfile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { user, loading: userLoading } = useSelector((state) => state.auth.userProfile || {});
  const { projects, loading: projectsLoading } = useSelector((state) => state.project.userProjects || {});
  const [tabValue, setTabValue] = useState(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    social: {
      facebook: '',
      twitter: '',
      instagram: '',
    },
  });
  const isCurrentUser = currentUser?.username === username;

  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username));
      dispatch(fetchUserProjects(username));
    }
  }, [dispatch, username]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        social: {
          facebook: user.social?.facebook || '',
          twitter: user.social?.twitter || '',
          instagram: user.social?.instagram || '',
        },
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateUserProfile(editForm)).unwrap();
      dispatch(showSuccessAlert('Profile updated successfully'));
      setIsEditDialogOpen(false);
      dispatch(fetchUserProfile(username));
    } catch (error) {
      dispatch(showErrorAlert(error.message || 'Failed to update profile'));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('social.')) {
      const socialField = name.split('.')[1];
      setEditForm((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value,
        },
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (userLoading || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, position: 'relative' }}>
        {isCurrentUser && (
          <IconButton
            onClick={handleEditProfile}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          >
            <EditIcon />
          </IconButton>
        )}
        
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={4}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{
              width: 150,
              height: 150,
              fontSize: 60,
              mr: { xs: 0, md: 4 },
              mb: { xs: 2, md: 0 },
            }}
          >
            {user.name?.charAt(0) || 'U'}
          </Avatar>
          
          <Box textAlign={{ xs: 'center', md: 'left' }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {user.name}
            </Typography>
            
            {user.bio && (
              <Typography variant="body1" paragraph maxWidth="600px">
                {user.bio}
              </Typography>
            )}
            
            <Box display="flex" flexWrap="wrap" gap={2} justifyContent={{ xs: 'center', md: 'flex-start' }} mb={2}>
              {user.location && (
                <Box display="flex" alignItems="center">
                  <LocationOnIcon color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.location}
                  </Typography>
                </Box>
              )}
              
              <Box display="flex" alignItems="center">
                <CalendarTodayIcon color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" gap={2} mt={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              {user.website && (
                <IconButton
                  component="a"
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <LinkIcon />
                </IconButton>
              )}
              
              {user.social?.facebook && (
                <IconButton
                  component="a"
                  href={`https://facebook.com/${user.social.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <FacebookIcon />
                </IconButton>
              )}
              
              {user.social?.twitter && (
                <IconButton
                  component="a"
                  href={`https://twitter.com/${user.social.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <TwitterIcon />
                </IconButton>
              )}
              
              {user.social?.instagram && (
                <IconButton
                  component="a"
                  href={`https://instagram.com/${user.social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <InstagramIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="space-around" textAlign="center" mt={4} pt={2} borderTop="1px solid rgba(0,0,0,0.12)">
          <Box>
            <Typography variant="h6" component="div">
              {user.projects?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Projects
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" component="div">
              {user.backedProjects?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Backed
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" component="div">
              {user.followers?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Followers
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" component="div">
              {user.following?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Following
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Projects" />
          <Tab label="Backed Projects" />
          <Tab label="Saved Projects" />
          {isCurrentUser && <Tab label="Account Settings" />}
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {isCurrentUser ? 'My Projects' : 'Projects'}
          </Typography>
          
          {projectsLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : projects && projects.length > 0 ? (
            <Grid container spacing={3}>
              {projects
                .filter(project => project.status !== 'draft')
                .map((project) => (
                  <Grid item xs={12} sm={6} md={4} key={project._id}>
                    <Card>
                      <CardActionArea component={RouterLink} to={`/projects/${project._id}`}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={project.images?.[0] || '/placeholder-project.jpg'}
                          alt={project.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" noWrap>
                            {project.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {project.description}
                          </Typography>
                          <Box mt={2}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2">
                                ${project.amountRaised?.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {Math.round((project.amountRaised / project.fundingGoal) * 100)}%
                              </Typography>
                            </Box>
                            <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                              <Box
                                sx={{
                                  width: `${Math.min(
                                    Math.round((project.amountRaised / project.fundingGoal) * 100),
                                    100
                                  )}%`,
                                  height: 8,
                                  bgcolor: 'primary.main',
                                }}
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Box display="flex" justifyContent="space-between" width="100%">
                          <Box>
                            <IconButton size="small">
                              <FavoriteBorderIcon />
                            </IconButton>
                            <IconButton size="small">
                              <BookmarkBorderIcon />
                            </IconButton>
                            <IconButton size="small">
                              <ShareIcon />
                            </IconButton>
                          </Box>
                          {isCurrentUser && project.status === 'draft' && (
                            <Chip label="Draft" size="small" color="warning" />
                          )}
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No projects found
              </Typography>
              {isCurrentUser && (
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/projects/new"
                  startIcon={<AddIcon />}
                  sx={{ mt: 2 }}
                >
                  Create Your First Project
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}
      
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Backed Projects
          </Typography>
          {user.backedProjects && user.backedProjects.length > 0 ? (
            <Grid container spacing={3}>
              {user.backedProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                  <Card>
                    <CardActionArea component={RouterLink} to={`/projects/${project._id}`}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={project.images?.[0] || '/placeholder-project.jpg'}
                        alt={project.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" noWrap>
                          {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {project.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No backed projects yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Discover and back projects you love!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/projects"
                sx={{ mt: 2 }}
              >
                Explore Projects
              </Button>
            </Box>
          )}
        </Box>
      )}
      
      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Saved Projects
          </Typography>
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No saved projects
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Save projects you love to find them later
            </Typography>
          </Box>
        </Box>
      )}
      
      {tabValue === 3 && isCurrentUser && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Account Settings
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Email & Password
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {currentUser.email}
            </Typography>
            <Button variant="outlined" color="primary">
              Change Password
            </Button>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Delete Account
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Permanently delete your account and all associated data. This action cannot be undone.
            </Typography>
            <Button variant="outlined" color="error">
              Delete My Account
            </Button>
          </Paper>
        </Box>
      )}
      
      {/* Edit Profile Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                placeholder="Tell us about yourself..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={editForm.location}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Website"
                name="website"
                value={editForm.website}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                placeholder="https://example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Social Links
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Facebook"
                    name="social.facebook"
                    value={editForm.social.facebook}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    placeholder="username"
                    InputProps={{
                      startAdornment: <FacebookIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Twitter"
                    name="social.twitter"
                    value={editForm.social.twitter}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    placeholder="username"
                    InputProps={{
                      startAdornment: <TwitterIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Instagram"
                    name="social.instagram"
                    value={editForm.social.instagram}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    placeholder="username"
                    InputProps={{
                      startAdornment: <InstagramIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
