import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
  LinearProgress,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  BarChart as BarChartIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fetchUserProjects, deleteProject } from '../redux/slices/projectSlice';
import { logout } from '../redux/slices/authSlice';
import { showSuccessAlert, showErrorAlert } from '../redux/slices/alertSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { user } = useSelector((state) => state.auth);
  const { projects, loading } = useSelector((state) => state.project.userProjects || {});
  
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const open = Boolean(anchorEl);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchUserProjects(user._id));
    }
  }, [dispatch, user]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMenuClick = (event, project) => {
    setSelectedProject(project);
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEditProject = () => {
    if (selectedProject) {
      navigate(`/projects/${selectedProject._id}/edit`);
      handleMenuClose();
    }
  };
  
  const handleDeleteProject = async () => {
    if (selectedProject) {
      if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        try {
          await dispatch(deleteProject(selectedProject._id)).unwrap();
          dispatch(showSuccessAlert('Project deleted successfully'));
          dispatch(fetchUserProjects(user._id));
        } catch (error) {
          dispatch(showErrorAlert(error.message || 'Failed to delete project'));
        } finally {
          handleMenuClose();
        }
      }
    }
  };
  
  const handleViewProject = () => {
    if (selectedProject) {
      navigate(`/projects/${selectedProject._id}`);
      handleMenuClose();
    }
  };
  
  const handleCreateProject = () => {
    navigate('/projects/new');
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const filteredProjects = projects ? projects.filter(project => {
    if (tabValue === 0) return true; // All projects
    if (tabValue === 1) return project.status === 'draft';
    if (tabValue === 2) return project.status === 'funding';
    if (tabValue === 3) return project.status === 'successful';
    if (tabValue === 4) return project.status === 'failed';
    return true;
  }) : [];
  
  const stats = {
    totalBackers: projects ? projects.reduce((acc, project) => acc + (project.backers?.length || 0), 0) : 0,
    totalRaised: projects ? projects.reduce((acc, project) => acc + (project.amountRaised || 0), 0) : 0,
    activeProjects: projects ? projects.filter(project => project.status === 'funding').length : 0,
    messages: 0, // Placeholder for future implementation
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, mb: 3, position: 'sticky', top: 20 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{ width: 64, height: 64, mr: 2 }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6">{user?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateProject}
              sx={{ mb: 2 }}
            >
              New Project
            </Button>
            
            <Box mt={3}>
              <Button
                fullWidth
                startIcon={<BarChartIcon />}
                sx={{ justifyContent: 'flex-start', mb: 1 }}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                fullWidth
                startIcon={<EmailIcon />}
                sx={{ justifyContent: 'flex-start', mb: 1 }}
                onClick={() => navigate('/dashboard/messages')}
              >
                Messages
                <Badge badgeContent={stats.messages} color="error" sx={{ ml: 1 }} />
              </Button>
              <Button
                fullWidth
                startIcon={<NotificationsIcon />}
                sx={{ justifyContent: 'flex-start', mb: 1 }}
                onClick={() => navigate('/dashboard/notifications')}
              >
                Notifications
              </Button>
              <Button
                fullWidth
                startIcon={<SettingsIcon />}
                sx={{ justifyContent: 'flex-start', mb: 1 }}
                onClick={() => navigate('/dashboard/settings')}
              >
                Settings
              </Button>
              <Divider sx={{ my: 2 }} />
              <Button
                fullWidth
                startIcon={<ExitToAppIcon />}
                sx={{ justifyContent: 'flex-start' }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Paper>
          
          {/* Quick Stats */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Your Stats</Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">Total Raised</Typography>
              <Typography variant="h5">${stats.totalRaised.toLocaleString()}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">Total Backers</Typography>
              <Typography variant="h5">{stats.totalBackers}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Active Projects</Typography>
              <Typography variant="h5">{stats.activeProjects}</Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">My Projects</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateProject}
              size={isMobile ? 'small' : 'medium'}
            >
              New Project
            </Button>
          </Box>
          
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="All Projects" />
              <Tab label="Drafts" />
              <Tab label="Funding" />
              <Tab label="Successful" />
              <Tab label="Failed" />
            </Tabs>
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : filteredProjects.length === 0 ? (
              <Box textAlign="center" p={6}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No projects found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {tabValue === 0
                    ? "You haven't created any projects yet."
                    : tabValue === 1
                    ? "You don't have any draft projects."
                    : tabValue === 2
                    ? "You don't have any active funding projects."
                    : tabValue === 3
                    ? "You don't have any successful projects."
                    : "You don't have any failed projects."}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateProject}
                >
                  Create Your First Project
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ p: 3 }}>
                {filteredProjects.map((project) => (
                  <Grid item xs={12} sm={6} lg={4} key={project._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardActionArea onClick={() => navigate(`/projects/${project._id}`)}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={project.images?.[0] || '/placeholder-project.jpg'}
                          alt={project.title}
                        />
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Typography gutterBottom variant="h6" component="h2" noWrap>
                              {project.title}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick(e, project);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                          
                          <Box sx={{ mt: 1, mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                              <Typography variant="body2" color="text.secondary">
                                ${project.amountRaised?.toLocaleString()} raised
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {Math.round((project.amountRaised / project.fundingGoal) * 100)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(
                                Math.round((project.amountRaised / project.fundingGoal) * 100),
                                100
                              )}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                            <Box display="flex" justifyContent="space-between" mt={1}>
                              <Typography variant="caption" color="text.secondary">
                                ${project.fundingGoal?.toLocaleString()} goal
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {project.backers?.length || 0} backers
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Chip
                              label={project.status}
                              size="small"
                              color={
                                project.status === 'draft'
                                  ? 'default'
                                  : project.status === 'funding'
                                  ? 'primary'
                                  : project.status === 'successful'
                                  ? 'success'
                                  : 'error'
                              }
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(project.endDate), 'MMM d, yyyy')}
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                      <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<BarChartIcon />}
                          onClick={() => navigate(`/dashboard/projects/${project._id}/analytics`)}
                        >
                          View Analytics
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
          
          {/* Recent Activity */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No recent activity to display
              </Typography>
            </Box>
          </Paper>
          
          {/* Quick Actions */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Project Performance
                </Typography>
                <Box textAlign="center" py={4}>
                  <BarChartIcon color="action" sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary">
                    Track your project's performance with detailed analytics
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/dashboard/analytics')}
                  >
                    View Analytics
                  </Button>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Backer Management
                </Typography>
                <Box textAlign="center" py={4}>
                  <PeopleIcon color="action" sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary">
                    Manage your backers and communicate with supporters
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/dashboard/backers')}
                  >
                    Manage Backers
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Project Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleViewProject}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Project</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditProject}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Project</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteProject} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Project</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;
